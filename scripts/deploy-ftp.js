import * as ftp from "basic-ftp";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CACHE_FILE = path.resolve(__dirname, "../.deploy-manifest.json");
const REMOTE_MANIFEST_PATH = "/.deploy-manifest.json";

function getFileHash(filePath) {
  const content = fs.readFileSync(filePath);
  return crypto.createHash("md5").update(content).digest("hex");
}

async function uploadWithRetry(client, fullPath, fileName, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await client.uploadFrom(fullPath, fileName);
      return;
    } catch (err) {
      if (attempt === maxRetries) throw err;
      console.warn(`[Retry ${attempt}/${maxRetries}] Retrying upload of ${fileName} after error:`, err.message);
      await new Promise(r => setTimeout(r, 1000 * attempt));
    }
  }
}

// Load .env file if present
const envFile = path.resolve(__dirname, "../.env");
if (fs.existsSync(envFile)) {
  const envContent = fs.readFileSync(envFile, "utf8");
  for (const line of envContent.split("\n")) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || "";
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
      if (!process.env[key]) process.env[key] = value.trim();
    }
  }
}

async function deploy() {
  const distPath = path.resolve(__dirname, "../dist");
  if (!fs.existsSync(distPath)) {
    console.error("dist/ folder does not exist. Run build first.");
    process.exit(1);
  }

  const client = new ftp.Client();
  client.ftp.timeout = 60000;
  client.ftp.verbose = false;

  const ftpConfig = {
    host: process.env.FTP_SERVER,
    port: parseInt(process.env.FTP_PORT || "21"),
    user: process.env.FTP_USERNAME,
    password: process.env.FTP_PASSWORD,
    secure: false
  };

  if (!ftpConfig.host || !ftpConfig.user || !ftpConfig.password) {
    console.error("FTP configuration error: FTP_SERVER, FTP_USERNAME, and FTP_PASSWORD must be defined (via .env file or environment variables).");
    process.exit(1);
  }

  try {
    console.log(`Connecting to FTP server ${ftpConfig.host}...`);
    await client.access(ftpConfig);
    console.log("Connected successfully!");

    // 1. Try to load manifest (locally or download from remote server)
    let manifest = {};
    if (fs.existsSync(CACHE_FILE)) {
      try {
        manifest = JSON.parse(fs.readFileSync(CACHE_FILE, "utf8"));
      } catch (e) {
        manifest = {};
      }
    } else {
      // Download remote manifest from FTP server if available (e.g. in GitHub Actions runner)
      try {
        await client.downloadTo(CACHE_FILE, REMOTE_MANIFEST_PATH);
        if (fs.existsSync(CACHE_FILE)) {
          manifest = JSON.parse(fs.readFileSync(CACHE_FILE, "utf8"));
          console.log(`Loaded remote manifest (${Object.keys(manifest).length} cached files).`);
        }
      } catch (e) {
        console.log("No previous deployment manifest found. Performing full initial deployment.");
        manifest = {};
      }
    }

    // 2. Find all generated files and check which ones changed
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

      await uploadWithRetry(client, file.fullPath, fileName);
      uploaded++;
      totalBytes += file.size;
      manifest[file.relPath] = newManifest[file.relPath];

      console.log(`[${uploaded}/${changedFiles.length}] Uploaded: ${file.relPath} (${(file.size / 1024).toFixed(1)} KB)`);
    }

    // 3. Save updated manifest locally and upload it to the FTP server
    fs.writeFileSync(CACHE_FILE, JSON.stringify(manifest, null, 2));
    try {
      await client.cd("/");
      await client.uploadFrom(CACHE_FILE, ".deploy-manifest.json");
      console.log("Uploaded updated deployment manifest to server.");
    } catch (err) {
      console.warn("Could not save remote manifest:", err.message);
    }

    console.log(`\n=== Deployment completed! Uploaded ${uploaded} files (${(totalBytes / 1024 / 1024).toFixed(2)} MB). ===`);

  } catch (err) {
    console.error("FTP deployment error:", err);
    if (fs.existsSync(CACHE_FILE)) {
      try {
        fs.writeFileSync(CACHE_FILE, JSON.stringify(manifest, null, 2));
      } catch (e) {}
    }
    process.exit(1);
  } finally {
    client.close();
  }
}

deploy();
