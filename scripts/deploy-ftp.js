import * as ftp from "basic-ftp";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CACHE_FILE = path.resolve(__dirname, "../.deploy-manifest.json");

function getFileHash(filePath) {
  const content = fs.readFileSync(filePath);
  return crypto.createHash("md5").update(content).digest("hex");
}

async function deploy() {
  const distPath = path.resolve(__dirname, "../dist");
  if (!fs.existsSync(distPath)) {
    console.error("dist/ folder does not exist. Run build first.");
    process.exit(1);
  }

  // Load previous deploy manifest
  let manifest = {};
  if (fs.existsSync(CACHE_FILE)) {
    try {
      manifest = JSON.parse(fs.readFileSync(CACHE_FILE, "utf8"));
    } catch (e) {
      manifest = {};
    }
  }

  // Find all files and check which ones changed
  const allFiles = [];
  function scan(dir, rel = "") {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      const r = rel ? `${rel}/${e.name}` : e.name;
      if (e.isDirectory()) {
        scan(full, r);
      } else {
        allFiles.push({ fullPath: full, relPath: r, size: fs.statSync(full).size });
      }
    }
  }
  scan(distPath);

  const changedFiles = [];
  const newManifest = {};

  for (const f of allFiles) {
    const hash = getFileHash(f.fullPath);
    newManifest[f.relPath] = hash;
    if (manifest[f.relPath] !== hash) {
      changedFiles.push(f);
    }
  }

  if (changedFiles.length === 0) {
    console.log("No changes detected. Everything is already up to date on server!");
    return;
  }

  console.log(`Found ${changedFiles.length} changed / new files to upload (out of ${allFiles.length} total files).`);

  const client = new ftp.Client();
  client.ftp.timeout = 60000;
  client.ftp.verbose = false;

  const ftpConfig = {
    host: "w020c7bf.kasserver.com",
    port: 21,
    user: "f018a826",
    password: "***REMOVED***",
    secure: false
  };

  try {
    console.log("Connecting to FTP server...");
    await client.access(ftpConfig);
    console.log("Connected!");

    let uploaded = 0;
    let totalBytes = 0;

    for (const file of changedFiles) {
      const remoteDir = path.dirname(file.relPath);
      const fileName = path.basename(file.relPath);

      if (remoteDir && remoteDir !== ".") {
        await client.ensureDir("/" + remoteDir);
      } else {
        await client.cd("/");
      }

      await client.uploadFrom(file.fullPath, fileName);
      uploaded++;
      totalBytes += file.size;
      manifest[file.relPath] = newManifest[file.relPath];

      console.log(`[${uploaded}/${changedFiles.length}] Uploaded: ${file.relPath} (${(file.size / 1024).toFixed(1)} KB)`);
    }

    // Save updated manifest
    fs.writeFileSync(CACHE_FILE, JSON.stringify(manifest, null, 2));
    console.log(`\n=== Deployment completed! Uploaded ${uploaded} files (${(totalBytes / 1024 / 1024).toFixed(2)} MB). ===`);

  } catch (err) {
    console.error("FTP deployment error:", err);
    // Save progress manifest so we don't re-upload what succeeded
    fs.writeFileSync(CACHE_FILE, JSON.stringify(manifest, null, 2));
    process.exit(1);
  } finally {
    client.close();
  }
}

deploy();
