# Schützengesellschaft Gersfeld 1813 e.V. – Website

Die offizielle, moderne und barrierefreie Webpräsenz der **Schützengesellschaft Gersfeld 1813 e.V.**, gebaut mit [Astro 4](https://astro.build) (Static Site Generation), [Tailwind CSS](https://tailwindcss.com) und [Lucide Icons](https://lucide.dev).

---

## 📑 Inhaltsverzeichnis

1. [Architektur & Funktionsweise](#-architektur--funktionsweise)
2. [Schnellstart (Lokale Entwicklung)](#-schnellstart-lokale-entwicklung)
3. [News-Beiträge veröffentlichen (Schritt für Schritt)](#-news-beiträge-veröffentlichen-schritt-für-schritt)
4. [Inhalte pflegen](#-inhalte-pflegen)
   - [Vorstand & Funktionsträger](#1-vorstand--funktionsträger)
   - [Kosten, Mitgliedsbeiträge & Munitionspreise](#2-kosten-mitgliedsbeiträge--munitionspreise)
   - [Termine & Google Kalender](#3-termine--google-kalender)
   - [Dienstplan & Standaufsichten](#4-dienstplan--standaufsichten)
   - [Fotoalben & Galerien](#5-fotoalben--galerien)
   - [Satzungen, FAQ & statische Seiten](#6-satzungen-faq--statische-seiten)
5. [Deployment & Veröffentlichung](#-deployment--veröffentlichung)
6. [Sicherheit & Umgebungsvariablen](#-sicherheit--umgebungsvariablen)

---

## 🏗️ Architektur & Funktionsweise

Die Website basiert auf dem modernen Static-Site-Generator **Astro**:
- **Maximale Ladezeiten & Sicherheit**: Die Seiten werden im Voraus zu statischem HTML, CSS und modernem JavaScript vorkompiliert. Es existiert keine Datenbank auf dem Webserver, die gehackt werden könnte.
- **Inhalte via Markdown (`src/content/posts/`)**: Alle Berichte und Chroniken liegen als strukturierte Markdown-Dateien mit Frontmatter vor.
- **Dynamische Daten-APIs (Hybrid)**:
  - **Termine (`/termine/`)**: Greift in Echtzeit auf den Google Kalender des Vereins zu (über den serverseitigen Proxy `public/api/calendar.php`).
  - **Dienstplan (`/verein/schiesszeiten/`)**: Bindet den Live-Dienstplan für Standaufsichten über die JSON-Schnittstelle von `dp.sg-gersfeld.de` ein.
- **Inkrementelles FTP-Deployment**: Nach jedem Build lädt ein intelligentes Deployment-Skript (`scripts/deploy-ftp.js`) nur die tatsächlich geänderten Dateien per Prüfsummen-Vergleich auf den All-Inkl Webserver hoch.

---

## 🚀 Schnellstart (Lokale Entwicklung)

### Voraussetzungen
- Node.js (Version 20 oder neuer)
- npm

### 1. Abhängigkeiten installieren
```bash
npm install
```

### 2. Lokalen Entwicklungsserver starten
```bash
npm run dev
```
Die Website ist nun unter [http://localhost:4321](http://localhost:4321) erreichbar. Änderungen an Code, CSS oder Markdown-Dateien werden per Hot-Module-Replacement sofort im Browser aktualisiert.

### 3. Produktions-Build erstellen
```bash
npm run build
```
Kompiliert alle 240+ Einzelseiten, optimiert Skripte und generiert den vollständigen statischen Output im Ordner `dist/`.

---

## 📝 News-Beiträge veröffentlichen (Schritt für Schritt)

Alle Berichte befinden sich im Ordner `src/content/posts/`, sortiert nach Kalenderjahr:

```text
src/content/posts/
├── 2026/
├── 2025/
├── 2024/
└── ...
```

### Schritt 1: Neue Beitragsdatei anlegen
Erstelle eine neue `.md`-Datei im passenden Jahresordner mit einem sprechenden Dateinamen (Slug), z. B.:  
`src/content/posts/2026/erfolgreicher-arbeitseinsatz-im-herbst.md`

### Schritt 2: Frontmatter-Kopf ausfüllen
Jeder Beitrag beginnt mit Metadaten zwischen zwei `---`-Zeilen:

```markdown
---
title: "Verein sagt Danke! – Arbeitseinsatz im Herbst"
date: 2026-11-08T12:00:00
draft: false
categories: ['Vereinsleben & Vorstand', 'Schießstände & Termine']
---
```

#### Gültige Kategorien
Bitte nur aus folgenden 4 Standard-Kategorien wählen (mehrere Kategorien pro Beitrag sind möglich):
- `'Sport & Wettkämpfe'`
- `'Western & Feste'`
- `'Vereinsleben & Vorstand'`
- `'Schießstände & Termine'`

### Schritt 3: Bilder optimieren und ablegen
Um schnelle Ladezeiten und optimale PageSpeed-Werte zu sichern:
1. **Format**: Bilder vorab nach **WebP** konvertieren (max. 1400–1600 px Breite, Qualität ca. 80–85 %):
   ```bash
   convert original-foto.jpg -resize "1600x1600>" -quality 82 public/wp-content/uploads/2026/11/arbeitseinsatz-herbst.webp
   ```
2. **Speicherort**: In `public/wp-content/uploads/YYYY/MM/` ablegen.
3. **Im Beitrag einbinden**:
   ```markdown
   ![Alt-Text beschreibt das Bild](/wp-content/uploads/2026/11/arbeitseinsatz-herbst.webp)
   ```
   *Hinweis: Das erste im Fließtext gefundene Bild wird automatisch als Titelbild/Vorschaubild auf der Startseite und im Beitrags-Header verwendet. Gibt es kein Bild im Text, greift automatisch das Standardmotiv des Schützenhauses.*

### Schritt 4: Fließtext formatieren
Für ein sauberes und lesefreundliches Layout empfehlen sich:
- **Zwischenüberschriften**: `### Was wurde getan?`
- **Wichtige Namen und Termine fett hervorheben**: `**Samstag, dem 7. November**`
- **Aufzählungen für Helfer und Aufgaben**:
  ```markdown
  * Reinigung der Geschossfänge
  * Einrichten der neuen Werkstatt
  ```
- **Hervorgehobene Leitsätze oder Zitate**:
  ```markdown
  > **Gemeinsam anpacken – so funktioniert Vereinsleben!**
  ```

### Schritt 5: Prüfen und Veröffentlichen
1. Lokal prüfen: `npm run build`
2. Git committen und pushen:
   ```bash
   git add src/content/posts/2026/arbeitseinsatz-herbst.md public/wp-content/uploads/2026/11/
   git commit -m "Publish post: Arbeitseinsatz Herbst 2026"
   git push
   ```
3. Per FTP live stellen:
   - **Automatisch**: GitHub Actions deployt bei Push auf `main` selbstständig.
   - **Manuell**: `node scripts/deploy-ftp.js`

---

## 🛠️ Inhalte pflegen

### 1. Vorstand & Funktionsträger
- 📄 **Datei**: `src/data/vorstand.ts`
- Hier sind alle Vorstandsmitglieder und Funktionsträger als TypeScript-Listen gepflegt:
  - `HAUPTVORSTAND` (1./2. Vorsitzender, Kassierer, Schriftführer, Jugendleiter etc.)
  - `SCHIESSWARTE`
  - `KASSENPRUEFER`
  - `KOENIGSFAMILIE` (Schützenkönig, Ritter, Damen, Jugend)
  - `BDS_VORSTAND`, `BDS_ROS` & `BDS_KASSENPRUEFER`

### 2. Kosten, Mitgliedsbeiträge & Munitionspreise
- 📄 **Datei**: `src/pages/verein/kosten.astro`
- Ganz oben im Frontmatter der Datei befinden sich zwei zentrale Arrays:
  - `YEARLY_DYNAMIC_FEES`: Mitgliedsbeiträge nach Altersklassen und Beitragsjahren.
  - `AMMO_PRICES`: Offizielle Munitionspreise für Training und Schießbetrieb.

### 3. Termine & Google Kalender
- 📄 **Integration**: Vollautomatisch über den Google Kalender des Vereins.
- Neue Termine, Meisterschaften oder Arbeitseinsätze werden einfach im offiziellen Google Kalender eingetragen.
- Die Terminseite (`/termine/`) synchronisiert Änderungen in Echtzeit über `public/api/calendar.php` – **kein Rebuild erforderlich!**

### 4. Dienstplan & Standaufsichten
- 📄 **Integration**: `src/lib/dienstplanApi.ts`
- Standaufsichten und Dienstpläne werden live vom internen Dienstplan-System (`https://dp.sg-gersfeld.de/api.php`) geladen.

### 5. Fotoalben & Galerien
- 📄 **Datei**: `src/data/photoAlbums.json`
- Alben sind in drei Bereiche unterteilt:
  - `events`: Feste & Turniere (z. B. Westernfest, Helferfest, Cup)
  - `gebaeude`: Schützenhaus, Saloon, Cantina
  - `schiessstaende`: 25m-, 50m- und 100m-Bahnen
- Neues Album anlegen: Eintrag in `photoAlbums.json` ergänzen und Bilder im WebP-Format referenzieren.

### 6. Satzungen, FAQ & statische Seiten
- **Hauptsatzung**: `src/pages/verein/satzung.astro`
- **BDS-Satzung**: `src/pages/satzung-bds-schuetzen-sg-gersfeld.astro`
- **Häufige Fragen (FAQ)**: `src/pages/faq.astro` (im Array `FAQ_SECTIONS`)
- **Videoüberwachung**: `src/pages/videoueberwachung.astro`
- **Impressum & Datenschutz**: `src/pages/impressum.astro` / `src/pages/datenschutz.astro`

---

## 🌐 Deployment & Veröffentlichung

### Option A: Automatischer Deploy via GitHub Actions (Empfohlen)
Bei jedem Push auf den Branch `main` baut GitHub die Website und lädt alle Änderungen automatisch per FTP hoch (`.github/workflows/deploy.yml`).

Dazu müssen in den Repository-Einstellungen (**Settings** → **Secrets and variables** → **Actions**) folgende Secrets hinterlegt sein:
- `FTP_SERVER`: Adresse des All-Inkl Servers (z. B. `w020c7bf.kasserver.com`)
- `FTP_USERNAME`: FTP-Benutzername (z. B. `f018a826`)
- `FTP_PASSWORD`: Das FTP-Passwort

### Option B: Manuelles Deployment vom Terminal
1. Erstelle eine `.env`-Datei im Projektstamm (siehe `.env.example`):
   ```env
   FTP_SERVER=w020c7bf.kasserver.com
   FTP_PORT=21
   FTP_USERNAME=dein-kas-benutzername
   FTP_PASSWORD=dein-kas-ftp-passwort
   ```
2. Bauen und hochladen:
   ```bash
   npm run build && node scripts/deploy-ftp.js
   ```
Das Skript berechnet MD5-Hashes aller Build-Dateien und lädt nur die geänderten Dateien hoch (dauert i. d. R. nur wenige Sekunden).

---

## 🔒 Sicherheit & Umgebungsvariablen

- **Keine Passwörter im Git-Repository**: Zugangsdaten (wie FTP-Passwörter) dürfen niemals in versionierten Dateien wie Skripten oder Markdown stehen.
- **`.env`-Datei verwenden**: Lokale Zugangsdaten gehören ausschließlich in die Datei `.env`. Diese ist standardmäßig in der `.gitignore` eingetragen und wird nicht zu GitHub gepusht.
- **Git-Historie prüfen**: Vor dem eventuellen Öffentlich-Stellen (Public) eines Repositories muss sichergestellt sein, dass in keinem früheren Commit geheime Zugangsdaten im Versionsverlauf enthalten sind.
