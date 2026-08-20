# Schützengesellschaft Gersfeld 1813 e.V. – Website

Die moderne, schnelle und barrierefreie Website der **Schützengesellschaft Gersfeld 1813 e.V.**, gebaut mit [Astro](https://astro.build) und [Tailwind CSS](https://tailwindcss.com).

---

## 🚀 Schnellstart (Lokale Entwicklung)

### 1. Abhängigkeiten installieren
```bash
npm install
```

### 2. Entwicklungsserver starten
```bash
npm run dev
```
Die Website ist anschließend unter `http://localhost:4321` im Browser erreichbar. Änderungen am Code oder an Texten werden per Hot-Reloading sofort im Browser aktualisiert.

### 3. Website für Produktion bauen
```bash
npm run build
```
Generiert die fertigen HTML-, CSS- und JS-Dateien im Ordner `dist/`.

---

## 📝 Inhalte verwalten & pflegen

### 1. News-Beiträge verfassen
Alle Beiträge befinden sich als Markdown-Dateien unter `src/content/posts/` – übersichtlich sortiert nach Kalenderjahren:

```text
src/content/posts/
├── 2026/
├── 2025/
├── ...
```

Um einen neuen Beitrag zu erstellen, lege eine neue `.md`-Datei im jeweiligen Jahresordner an (z. B. `src/content/posts/2026/mein-neuer-beitrag.md`):

```markdown
---
title: "Erfolgreicher Arbeitseinsatz im Frühjahr"
date: 2026-05-15T10:00:00
categories: ['Vereinsnachrichten']
---

Hier steht der Fließtext deines Berichts.

Ein Bild einbinden:
![Arbeitseinsatz am Schützenhaus](/images/schuetzenhaus-gersfeld.jpg)
```

---

### 2. Termine & Google Kalender (100% Vollautomatisch)
- **Live-Kalender & Gefilterte Listen (`/termine/`)**:
  - Neue Termine trägst du wie gewohnt in den offiziellen **Google Kalender** der SG Gersfeld ein.
  - **Kein Rebuild nötig**: Die Website synchronisiert Termine und Kategorien (*Allgemein, Vorstandssitzungen, Vereinsmeisterschaften, Arbeitseinsätze*) über den API-Endpunkt `/api/calendar.php` automatisch in Echtzeit!

---

### 3. Dienstplan (100% Vollautomatisch)
- Der **Dienstplan** für Standaufsichten wird direkt per Live-Widget von `https://dp.sg-gersfeld.de/` geladen. Änderungen dort sind sofort auf der Homepage sichtbar.

---

### 4. Fotoalben & Bildergalerien (`/fotos/`)
Die Alben werden über die Konfigurationsdatei `src/data/photoAlbums.json` verwaltet:
- **Events & Feste** (`events`): z. B. Westernfeste, Silver City Cups, Vereinsfeiern.
- **Gebäude** (`gebaeude`): Saloon, Cantina, Schützenhaus, Zeltwiese etc.
- **Schießstände** (`schiessstaende`): 25m Kurzwaffenstand, 50m Langwaffenstand.

Neues Album anlegen: Einfach Bilder hochladen und den Eintrag in `src/data/photoAlbums.json` ergänzen:
```json
{
  "id": "westernfest-2026",
  "title": "Westernfest Juni 2026",
  "subtitle": "Country & Western in Silver City",
  "date": "Juni 2026",
  "description": "Impressionen vom großen Westernfest...",
  "cover": "/wp-content/uploads/events/2026/cover.jpg",
  "images": [
    "/wp-content/uploads/events/2026/foto1.jpg",
    "/wp-content/uploads/events/2026/foto2.jpg"
  ]
}
```

---

### 5. Vereinsdaten, Vorstand & Kosten ändern
- **Vorstand & Schießwarte**: `src/pages/verein/vorstand.astro`
- **Kosten & Beiträge**: `src/pages/verein/kosten.astro`
- **Schießzeiten & Disziplinen**: `src/pages/verein/schiesszeiten.astro`
- **Satzungen**: `src/pages/verein/satzung.astro` und `src/pages/satzung-bds-schuetzen-sg-gersfeld.astro`
- **FAQ (Häufige Fragen)**: `src/pages/faq.astro`

---

## 🌐 Deployment (Veröffentlichung auf dem Webserver)

### Option A: Automatischer Deploy via GitHub Actions (Empfohlen)
Sobald das Repository auf GitHub liegt, baut GitHub bei jedem `git push` auf den `main`-Branch die Website automatisch und überträgt nur die geänderten Dateien per FTP auf den Webserver.

#### Einrichtung der GitHub Secrets:
1. Gehe in deinem GitHub-Repository auf **Settings** → **Secrets and variables** → **Actions**.
2. Klicke auf **New repository secret** und erstelle folgende 3 Secrets:
   - `FTP_SERVER`: `w020c7bf.kasserver.com`
   - `FTP_USERNAME`: `f018a826`
   - `FTP_PASSWORD`: *(dein FTP-Passwort)*
3. Fertig! Zukünftige Änderungen werden nach jedem Push automatisch innerhalb von ca. 30 Sekunden deployed.

---

### Option B: Manueller Deploy über die Konsole
Du kannst die Website auch jederzeit lokal bauen und per inkrementellem Skript hochladen:
```bash
npm run build && node scripts/deploy-ftp.js
```
Das Skript berechnet automatisch MD5-Hashes und lädt nur die Dateien hoch, die sich seit dem letzten Deployment geändert haben (dauert meist nur 1–2 Sekunden).

---

## 📁 Umgang mit großen Bilddateien & GitHub

- **Warum sind alte Uploads in `.gitignore`?**
  Die Uploads und Alben der bisherigen Website umfassen ca. 2,3 GB. Da diese Bilder bereits auf dem Webserver unter `/wp-content/uploads/` liegen, sind sie im Git-Repository ausgeschlossen.
- **Vorteil**: Das Git-Repository bleibt mit **unter 15 MB** extrem schlank, klont blitzschnell und überschreitet niemals GitHub-Speicherlimits.
- **Neue Bilder in Zukunft**:
  - Einzelne Web-Grafiken / Logos: In `public/images/` ablegen (wird in Git versioniert).
  - Große Foto-Sammlungen: Einfach per FTP in `/wp-content/uploads/...` hochladen.

---

## 🛠️ Verwendete Technologien
- **Framework**: [Astro 4](https://astro.build)
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com)
- **Icons**: [Lucide React](https://lucide.dev)
- **Kalender-Integration**: Live iCal Google Calendar Parser & Proxy
- **Hosting / Server**: All-Inkl (Apache / PHP)
