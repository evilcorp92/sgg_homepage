---
title: "Home"
date: 2020-03-16T07:30:47
draft: false
type: page
---

[Einladung Sommerfest2026](https://sg-gersfeld.de/wp-content/uploads/2026/08/Einladung-Sommerfest2026.pdf)[Herunterladen](https://sg-gersfeld.de/wp-content/uploads/2026/08/Einladung-Sommerfest2026.pdf)

Herzlich willkommen auf unserer Homepage!

Wir sind ein moderner Schützenverein mit langer Tradition und bieten ein umfangreiches Sportprogramm an, welches keine schießsportlichen Wünsche offenlässt. Bei uns können fast alle Disziplinen sowohl des „Deutschen Schützenbundes“ als auch des „Bundes deutscher Sportschützen“ sowie „IPSC“ geschossen werden. Aber auch das traditionelle Schützenbrauchtum, wie das Königsschießen, kommen bei uns nicht zu kurz.

Unsere Schießstände sind auf dem neuesten technischen Stand. Sowohl der 25 Meter als auch der 50 Meter Stand sind mehrdistanzfähig. Beide Stände sind für das sportliche Klein- und Großkaliberschießen zugelassen und wir verfügen über mehrere Fallscheibenanlagen für Klein- und Großkaliber sowie Schrot.

Um alle sportlichen Interessen unserer Mitglieder abzudecken, ist der Verein in drei „Abteilungen“ gegliedert.

    
    

        

DSB

        

**

        

### DSB

        

Präzision und Konzentration im klassischen Sportschießen. Luftgewehr (10m), Kleinkaliber (50m) und traditionelle Disziplinen nach der Sportordnung des Deutschen Schützenbundes.

        [Abteilung ansehen](https://sg-gersfeld.de/dsb/)
    

    
    
    

        

BDS

        

**

        

### BDS

        

Dynamik und Vielfalt im Großkaliber-Schießsport. Speed-Schießen, Fallscheibe und Mehrdistanz-Disziplinen nach den sportlichen Regeln des Bundes Deutscher Sportschützen.

        [Abteilung ansehen](https://sg-gersfeld.de/bds/)
    

    
    
    

        

IPSC

        

**

        

### IPSC

        

Die Königsklasse des dynamischen Parcours-Schießens. Diligentia, Vis, Celeritas (Präzision, Kraft, Schnelligkeit). Schießen in der Bewegung unter Zeitdruck auf wechselnde Ziele.

        [Abteilung ansehen](https://sg-gersfeld.de/ipsc/)
    

/* 
   Modernes, lesbares CSS-Grid für die Abteilungen-Karten der Schützengesellschaft Gersfeld.
   Mit optimierten, größeren Schriftgrößen für hervorragende Lesbarkeit auf allen Displays.
*/
.sgg-abteilungen-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 28px;
    margin: 40px 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

/* Basis-Card-Styling */
.sgg-card {
    background: #ffffff;
    border-radius: 16px;
    padding: 38px 26px 30px 26px;
    text-align: center;
    box-shadow: 0 4px 20px rgba(0,0,0,0.06);
    border: 1px solid #eef2f6;
    position: relative;
    transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    overflow: hidden;
}

/* Hover-Effekt: Karte hebt sich sanft an */
.sgg-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 30px rgba(0,0,0,0.12);
}

/* Eck-Badges für die Disziplinen-Verbände */
.sgg-card-badge {
    position: absolute;
    top: 16px;
    right: 16px;
    font-size: 0.85rem; /* Größer für bessere Erkennbarkeit */
    font-weight: 800;
    padding: 4px 14px;
    border-radius: 20px;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
}
.sgg-card-badge.dsb { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
.sgg-card-badge.bds { background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; }
.sgg-card-badge.ipsc { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }

/* Icon-Kreise */
.sgg-card-icon {
    width: 68px; /* Leicht vergrößert */
    height: 68px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;
    font-size: 2rem; /* Größere Icons */
    background: #f8fafc;
    transition: transform 0.3s ease;
}
.sgg-card:hover .sgg-card-icon {
    transform: scale(1.1);
}
.dsb-card .sgg-card-icon { color: #16a34a; background: #f0fdf4; }
.bds-card .sgg-card-icon { color: #2563eb; background: #eff6ff; }
.ipsc-card .sgg-card-icon { color: #dc2626; background: #fef2f2; }

/* Texte & Titel */
.sgg-card h3 {
    font-size: 1.5rem; /* Größere Überschrift */
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 14px 0;
}
.sgg-card p {
    font-size: 1.05rem; /* Größerer Fließtext für perfekte Lesbarkeit */
    color: #4a5568; /* Leicht dunkler für besseren Kontrast */
    line-height: 1.65;
    margin-bottom: 28px;
    flex-grow: 1;
    text-align: center;
}

/* Call-to-Action Buttons */
.sgg-card-btn {
    display: inline-block;
    padding: 12px 26px;
    border-radius: 30px;
    font-size: 0.95rem; /* Größerer Button-Text */
    font-weight: 700;
    text-decoration: none !important;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    transition: background 0.2s, transform 0.2s;
    width: 85%;
    text-align: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}
.sgg-card-btn:active {
    transform: scale(0.97);
}

.dsb-card .sgg-card-btn { background: #16a34a; color: white !important; }
.dsb-card .sgg-card-btn:hover { background: #15803d; }

.bds-card .sgg-card-btn { background: #2563eb; color: white !important; }
.bds-card .sgg-card-btn:hover { background: #1d4ed8; }

.ipsc-card .sgg-card-btn { background: #dc2626; color: white !important; }
.ipsc-card .sgg-card-btn:hover { background: #b91c1c; }

Für Schießsportinteressierte und Neumitglieder stehen Vereins-Waffen zur Verfügung. Den sicheren Umgang mit diesen Waffen erklären und beaufsichtigen unsere erfahrenen Schießleiter. Ihr könnt uns auch bei einem Besuch unserer jährlichen Westernfeste mit Live Band und Böllerschießen kennenlernen.

Wir freuen uns auf euren Besuch!

https://youtu.be/gRcAN3tkrT4