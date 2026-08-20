import * as ftp from "basic-ftp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOCAL_UPLOADS = path.resolve(__dirname, "../public/wp-content/uploads");

const ftpConfig = {
  host: process.env.FTP_SERVER || "w020c7bf.kasserver.com",
  port: parseInt(process.env.FTP_PORT || "21"),
  user: process.env.FTP_USERNAME || "f018a826",
  password: process.env.FTP_PASSWORD || "***REMOVED***",
  secure: false
};

async function getConnectedClient() {
  const client = new ftp.Client();
  client.ftp.timeout = 60000;
  client.ftp.verbose = false;
  await client.access(ftpConfig);
  return client;
}

async function uploadWithRetry(clientRef, fullPath, remoteDir, fileName, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await clientRef.client.ensureDir(remoteDir);
      await clientRef.client.uploadFrom(fullPath, fileName);
      return;
    } catch (err) {
      console.warn(`[Upload Retry ${attempt}/${maxRetries}] ${fileName}: ${err.message}`);
      try { clientRef.client.close(); } catch (e) {}
      await new Promise(r => setTimeout(r, 1500 * attempt));
      clientRef.client = await getConnectedClient();
    }
  }
  throw new Error(`Failed to upload ${fileName} after ${maxRetries} attempts`);
}

async function runSync() {
  console.log("=== STARTING ROBUST FTP UPLOADS SYNCHRONIZATION ===");
  console.log("Local source:", LOCAL_UPLOADS);

  if (!fs.existsSync(LOCAL_UPLOADS)) {
    console.error("Local uploads directory does not exist!");
    process.exit(1);
  }

  // 1. Index all clean local files
  const localFiles = new Map(); // relPath -> { fullPath, size }
  function scanLocal(dir, rel = "") {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      const r = rel ? `${rel}/${e.name}` : e.name;
      if (e.isDirectory()) {
        scanLocal(full, r);
      } else {
        localFiles.set(r, { fullPath: full, size: fs.statSync(full).size });
      }
    }
  }
  scanLocal(LOCAL_UPLOADS);
  console.log(`Local clean files to synchronize: ${localFiles.size}`);

  const clientRef = { client: await getConnectedClient() };
  console.log("Connected to FTP server!");

  try {
    // 2. Scan remote files up to max depth 2 (no infinite loops)
    console.log("\nScanning remote files (max depth 2)...");
    const remoteFiles = new Map(); // relPath -> size

    async function scanRemoteDir(dirPath, rel = "", depth = 0) {
      if (depth > 2) return;
      let list = [];
      try {
        list = await clientRef.client.list(dirPath);
      } catch (e) {
        return;
      }

      for (const item of list) {
        if (item.name === "." || item.name === "..") continue;
        const r = rel ? `${rel}/${item.name}` : item.name;
        const fullRemote = dirPath + "/" + item.name;

        if (item.isDirectory) {
          // If it is a known obsolete folder, remove directly
          if (r === "cache" || r === "events" || r === "ftp" || r === "wpo" || item.name === "wp-content") {
            console.log(`[DELETING OBSOLETE REMOTE DIR] ${fullRemote}`);
            try {
              await clientRef.client.removeDir(fullRemote);
            } catch (err) {
              console.warn("Could not removeDir:", fullRemote, err.message);
            }
          } else {
            await scanRemoteDir(fullRemote, r, depth + 1);
          }
        } else {
          remoteFiles.set(r, item.size);
        }
      }
    }

    await scanRemoteDir("/wp-content/uploads");
    console.log(`Indexed ${remoteFiles.size} existing remote files.`);

    // 3. Delete remote files that do not exist locally
    console.log("\nRemoving obsolete / junk files from remote server...");
    let deletedCount = 0;
    for (const [rel, size] of remoteFiles.entries()) {
      if (!localFiles.has(rel)) {
        const remotePath = "/wp-content/uploads/" + rel;
        try {
          await clientRef.client.remove(remotePath);
          deletedCount++;
          if (deletedCount % 50 === 0) {
            console.log(`Deleted ${deletedCount} obsolete files...`);
          }
        } catch (e) {
          // Ignore
        }
      }
    }
    console.log(`Total obsolete files deleted from server: ${deletedCount}`);

    // 4. Upload missing or changed files
    const toUpload = [];
    for (const [rel, info] of localFiles.entries()) {
      const remoteSize = remoteFiles.get(rel);
      if (remoteSize === undefined || remoteSize !== info.size) {
        toUpload.push({ rel, ...info });
      }
    }

    console.log(`\nFiles to upload: ${toUpload.length} (already matching on server: ${localFiles.size - toUpload.length})`);

    let uploaded = 0;
    let totalBytes = 0;

    for (const file of toUpload) {
      const remoteDir = "/wp-content/uploads/" + path.dirname(file.rel);
      const fileName = path.basename(file.rel);

      await uploadWithRetry(clientRef, file.fullPath, remoteDir, fileName);
      uploaded++;
      totalBytes += file.size;

      if (uploaded % 20 === 0 || uploaded === toUpload.length) {
        console.log(`[${uploaded}/${toUpload.length}] Uploaded: ${file.rel} (${(file.size / 1024).toFixed(1)} KB)`);
      }
    }

    console.log(`\n======================================================`);
    console.log(`🎉 FTP SYNCHRONIZATION COMPLETED!`);
    console.log(`- Obsolete server files removed: ${deletedCount}`);
    console.log(`- Matching server files preserved (skipped): ${localFiles.size - toUpload.length}`);
    console.log(`- New / modified files uploaded: ${uploaded} (${(totalBytes / 1024 / 1024).toFixed(2)} MB)`);
    console.log(`- Total clean active files on server: ${localFiles.size}`);
    console.log(`======================================================`);

  } catch (err) {
    console.error("Fatal Sync error:", err);
    process.exit(1);
  } finally {
    try { clientRef.client.close(); } catch (e) {}
  }
}

runSync();
