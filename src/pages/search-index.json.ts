import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import photoAlbumsData from '../data/photoAlbums.json';

interface SearchItem {
  id: string;
  title: string;
  url: string;
  category: string;
  description: string;
  keywords?: string;
  date?: string;
}

export const GET: APIRoute = async () => {
  const items: SearchItem[] = [];

  // 1. Static Pages & Key Sections
  const staticPages: SearchItem[] = [
    {
      id: 'page-home',
      title: 'Startseite SG Gersfeld 1813 e.V.',
      url: '/',
      category: 'Verein',
      description: 'Willkommen bei der Schützengesellschaft Gersfeld 1813 e.V. – Tradition und moderner Schießsport im Herzen der Rhön.',
      keywords: 'Schützenverein, Gersfeld, Rhön, Schießsport, Schießstand, Startseite, Home'
    },
    {
      id: 'page-verein',
      title: 'Über den Verein (Tradition & Geschichte)',
      url: '/verein/',
      category: 'Verein',
      description: 'Tradition seit 1813 und moderner Schießsport: Geschichte, Vereinsleben und Werte der SG Gersfeld.',
      keywords: 'Tradition, Geschichte, Verein, 1813, Werte, Gemeinschaft, Schützenhaus'
    },
    {
      id: 'page-schiesszeiten',
      title: 'Schießzeiten & Öffnungszeiten',
      url: '/verein/schiesszeiten/',
      category: 'Verein',
      description: 'Reguläre Trainingszeiten und Schießstandnutzung für Kurz- und Langwaffen (10m, 25m, 50m, 100m).',
      keywords: 'Öffnungszeiten, Trainingszeiten, Schießzeiten, Standzeiten, Mittwoch, Freitag, Sonntag, Schießstand'
    },
    {
      id: 'page-kosten',
      title: 'Kosten & Mitgliedsbeiträge',
      url: '/verein/kosten/',
      category: 'Verein',
      description: 'Transparente Übersicht über Mitgliedsbeiträge, Standgebühren, Standsanierungsumlage und Munitionspreise.',
      keywords: 'Beitrag, Mitgliedsbeitrag, Jahresbeitrag, Kosten, Gebühren, Standgebühr, Munition, Preise, Aufnahmegebühr'
    },
    {
      id: 'page-vorstand',
      title: 'Vorstand & Ansprechpartner',
      url: '/verein/vorstand/',
      category: 'Verein',
      description: 'Der geschäftsführende Vorstand, Gesamtvorstand und Fachspartenleiter der SG Gersfeld.',
      keywords: 'Vorstand, Vorsitzender, Schützenmeister, Schatzmeister, Schriftführer, Sportleiter, Ansprechpartner'
    },
    {
      id: 'page-mitglied-werden',
      title: 'Mitglied werden & Aufnahmeantrag',
      url: '/verein/mitglied-werden/',
      category: 'Verein',
      description: 'Informationen zur Mitgliedschaft, Schnuppertraining und Aufnahmeantrag (PDF) der SG Gersfeld.',
      keywords: 'Mitgliedschaft, Aufnahmeantrag, Beitritt, Mitglied werden, Antrag, Formular, PDF, Schnuppertraining'
    },
    {
      id: 'page-satzung',
      title: 'Vereinssatzung & Ordnungen',
      url: '/verein/satzung/',
      category: 'Verein',
      description: 'Vollständiger Wortlaut der Vereinssatzung der SG Gersfeld 1813 e.V., Beitragsordnung und Geschäftsordnung.',
      keywords: 'Satzung, Vereinsordnung, Rechtliches, Geschäftsordnung, Beitragsordnung, Paragraphen, Amtsgericht Fulda'
    },
    {
      id: 'page-abteilungen',
      title: 'Alle Schießsport-Abteilungen',
      url: '/abteilungen/',
      category: 'Sport',
      description: 'Übersicht aller Disziplinen und Sparten: DSB, BDS, IPSC, Westernschießen, Vorderlader und Bogensport.',
      keywords: 'Abteilungen, Sparten, Disziplinen, Schießsport, Übersicht'
    },
    {
      id: 'page-dsb',
      title: 'DSB Schießsport (Hessischer Schützenverband)',
      url: '/abteilungen/dsb/',
      category: 'Sport',
      description: 'Traditioneller Präzisionssport nach DSB-Reglement: Luftgewehr, Luftpistole, Kleinkaliber (KK) und Sportpistole.',
      keywords: 'DSB, Hessischer Schützenverband, Luftgewehr, Luftpistole, Kleinkaliber, 10m, 50m, Präzision, Rundenwettkampf'
    },
    {
      id: 'page-bds',
      title: 'BDS Schießsport (Bund Deutscher Sportschützen)',
      url: '/abteilungen/bds/',
      category: 'Sport',
      description: 'Großkaliber-Sport, Mehrdistanz, Speed-Schießen, Fallscheibe, Zielfernrohrgewehr und BDS-Disziplinen.',
      keywords: 'BDS, Bund Deutscher Sportschützen, Großkaliber, 9mm, .45 ACP, Speed, Mehrdistanz, Fallscheibe, 25m, 100m'
    },
    {
      id: 'page-ipsc',
      title: 'IPSC Dynamic Shooting',
      url: '/abteilungen/ipsc/',
      category: 'Sport',
      description: 'Dynamischer Schießsport auf Weltklasseniveau: Diligentia, Vis, Celeritas (Präzision, Kraft, Schnelligkeit) und Matches.',
      keywords: 'IPSC, Dynamic Shooting, dynamisches Schießen, Match, Parcours, Holster, Handgun, PCC, Shotgun'
    },
    {
      id: 'page-western',
      title: 'Westernschießen & Vorderlader (Silver City)',
      url: '/abteilungen/western/',
      category: 'Sport',
      description: 'Cowboy Action Shooting, Unterhebelrepetierer, Single Action Revolver, Vorderlader und unsere Westernstadt Silver City.',
      keywords: 'Western, Cowboy Action, CAS, Unterhebel, Revolver, Vorderlader, Schwarzpulver, Silver City, Saloon'
    },
    {
      id: 'page-bogen',
      title: 'Bogensport (Recurve & Compound)',
      url: '/abteilungen/bogen/',
      category: 'Sport',
      description: 'Traditioneller und moderner Bogensport für alle Altersklassen auf unserem Vereinsgelände.',
      keywords: 'Bogen, Bogensport, Pfeil und Bogen, Recurve, Compound, Langbogen, 3D, Freigelände'
    },
    {
      id: 'page-schiessstaende',
      title: 'Schießstandanlagen (10m, 25m, 50m, 100m)',
      url: '/fotos/schiessstaende/',
      category: 'Schießstände',
      description: 'Moderne Schießbahnen: 10m Druckluft, 25m Duell/Mehrdistanz, 50m Kleinkaliber und 100m Großkaliber-Langwaffenstand.',
      keywords: 'Schießstand, 100m Stand, 25m Stand, 50m Stand, 10m Stand, Seilzug, Schießbahnen, Duellanlage'
    },
    {
      id: 'page-termine',
      title: 'Termine & Kalender',
      url: '/termine/',
      category: 'Termine',
      description: 'Alle Schießtermine, Wettkämpfe, Vereinsmeisterschaften (VM/BM/LM), Arbeitseinsätze und Feste.',
      keywords: 'Termine, Kalender, Vereinskalender, Wettkampf, Meisterschaften, VM, BM, LM, Events'
    },
    {
      id: 'page-arbeitseinsaetze',
      title: 'Arbeitseinsätze & Standpflege',
      url: '/termine/',
      category: 'Termine',
      description: 'Termine für Arbeitseinsätze, Pflege und Instandhaltung der Schießstände im Vereinskalender.',
      keywords: 'Arbeitseinsatz, Arbeitsdienst, Pflege, Standbau, Instandhaltung, Helfer, Termine'
    },
    {
      id: 'page-ergebnisse',
      title: 'Ergebnisse & Siegerlisten',
      url: '/ergebnisse/',
      category: 'Ergebnisse',
      description: 'Offizielle Ergebnislisten und Downloads: GK-Pokalrunde, IPSC Matches, Vereinsmeisterschaften und Königsschießen.',
      keywords: 'Ergebnisse, Siegerliste, Urkunden, Pokalrunde, GK, IPSC, Königsschießen, Meisterschaft, Downloads, PDF'
    },
    {
      id: 'page-fotos',
      title: 'Fotoalben & Galerie',
      url: '/fotos/',
      category: 'Fotos',
      description: 'Fotogalerien von Wettkämpfen, Vereinsfesten, Westernwochenenden, Gebäuden und Schießständen.',
      keywords: 'Fotos, Bilder, Galerie, Fotoalbum, Westernfest, Königsproklamation, Impressionen'
    },
    {
      id: 'page-kontakt',
      title: 'Kontakt, Anfahrt & Rechnungsadresse',
      url: '/kontakt/',
      category: 'Kontakt',
      description: 'Anschrift Rommerser Str. 32, Ansprechpartner, info@sg-gersfeld.de, rechnung@sg-gersfeld.de und Google Maps Anfahrt.',
      keywords: 'Kontakt, Anfahrt, Adresse, E-Mail, Telefon, Schützenhaus, Rechnung, Rechnungsadresse, Google Maps, Wegbeschreibung'
    },
    {
      id: 'page-faq',
      title: 'Häufige Fragen (FAQ)',
      url: '/faq/',
      category: 'Service',
      description: 'Antworten zu Schnuppertraining, Altersgrenzen, Kosten, Pflichtstunden, WBK, Sachkunde und Rechnungen.',
      keywords: 'FAQ, Fragen, Antworten, Hilfe, Sachkunde, WBK, Waffenbesitzkarte, Schnuppern, Gastschützen, Pflichtstunden'
    },
    {
      id: 'page-easyverein',
      title: 'Mitgliederportal (easyVerein & Dienstplan)',
      url: '/easyverein/',
      category: 'Mitglieder',
      description: 'Digitaler Zugang zu easyVerein, Mitgliederdaten, Arbeitsstunden und Standaufsichts-Dienstplan.',
      keywords: 'easyVerein, Dienstplan, Standaufsicht, Mitgliederbereich, Login, Portal'
    },
    {
      id: 'page-impressum',
      title: 'Impressum & Rechtsangaben',
      url: '/impressum/',
      category: 'Rechtliches',
      description: 'Gesetzliche Pflichtangaben, Vertretungsberechtigte nach § 26 BGB und Vereinsregister VR 160 Fulda.',
      keywords: 'Impressum, Betreiber, Vertretung, Amtsgericht Fulda, VR 160, Haftungsausschluss'
    },
    {
      id: 'page-datenschutz',
      title: 'Datenschutzerklärung',
      url: '/datenschutz/',
      category: 'Rechtliches',
      description: 'Datenschutzbestimmungen nach DSGVO bei der Nutzung unserer Website und Vereinsdienste.',
      keywords: 'Datenschutz, DSGVO, Cookies, Privatsphäre, Datenverarbeitung'
    },
    {
      id: 'page-videoueberwachung',
      title: 'Informationen zur Videoüberwachung',
      url: '/videoueberwachung/',
      category: 'Rechtliches',
      description: 'Hinweise zur Videoüberwachung des Vereinsgeländes nach Art. 13 DSGVO zum Schutz vor Einbruch und Vandalismus.',
      keywords: 'Videoüberwachung, Kameras, Sicherheit, DSGVO, Vereinsgelände'
    }
  ];

  items.push(...staticPages);

  // 2. All 174 News Posts (Use clean URL slug without year folder)
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  for (const post of posts) {
    const cleanSlug = post.slug.replace(/^.*\//, '');
    const plainBody = (post.body || '')
      .replace(/!\[.*?\]\(.*?\)/g, '')
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
      .replace(/#{1,6}\s+/g, '')
      .replace(/(\*\*|__)(.*?)\1/g, '$2')
      .replace(/(\*|_)(.*?)\1/g, '$2')
      .replace(/\s+/g, ' ')
      .trim();

    const snippet = plainBody.length > 200 ? plainBody.slice(0, 200) + '...' : plainBody;
    const cat = (post.data.categories && post.data.categories[0]) || 'Vereinsleben & Vorstand';

    items.push({
      id: `post-${cleanSlug}`,
      title: post.data.title,
      url: `/posts/${cleanSlug}/`,
      category: cat,
      description: snippet || 'Bericht und Vereinsnachricht der Schützengesellschaft Gersfeld 1813 e.V.',
      keywords: `${post.data.title} ${cat} ${(post.data.tags || []).join(' ')} ${plainBody.slice(0, 500)}`,
      date: post.data.date.toISOString().split('T')[0]
    });
  }

  // 3. Photo Albums
  for (const group of ['events', 'gebaeude', 'schiessstaende'] as const) {
    const albums = (photoAlbumsData as any)[group] || [];
    for (const a of albums) {
      items.push({
        id: `album-${a.id}`,
        title: `Fotoalbum: ${a.title}`,
        url: `/fotos/${group}/#${a.id}`,
        category: 'Fotos',
        description: `${a.description || a.title} (${a.photos?.length || 0} Fotos in voller Auflösung).`,
        keywords: `Fotoalbum Bilder Galerie ${a.title} ${a.description || ''} ${group}`
      });
    }
  }

  return new Response(JSON.stringify(items), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    }
  });
};
