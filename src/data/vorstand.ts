export interface BoardMember {
  funktion: string;
  vorname: string;
  nachname: string;
  email?: string;
  kommissarisch?: boolean;
  geschaeftsfuehrend?: boolean;
}

export interface Schiesswart {
  vorname: string;
  nachname: string;
  kommissarisch?: boolean;
  naechsteWahl: string;
}

export interface Kassenpruefer {
  funktion: string;
  vorname: string;
  nachname: string;
}

export interface Koenig {
  titel: string;
  vorname: string;
  nachname: string;
}

export interface BdsBoardMember {
  funktion: string;
  vorname: string;
  nachname: string;
  email?: string;
}

export interface RangeOfficer {
  vorname: string;
  nachname: string;
}

export const HAUPTVORSTAND: BoardMember[] = [
  { funktion: '1. Vorsitzender', vorname: 'André', nachname: 'Erdmann', email: 'a.erdmann@sg-gersfeld.de', kommissarisch: true, geschaeftsfuehrend: true },
  { funktion: '2. Vorsitzender', vorname: 'Maria', nachname: 'Schwarz', email: 'm.schwarz@sg-gersfeld.de', kommissarisch: true, geschaeftsfuehrend: true },
  { funktion: '1. Kassierer', vorname: 'Dominik', nachname: 'Schmidt', email: 'd.schmidt@sg-gersfeld.de', kommissarisch: false, geschaeftsfuehrend: true },
  { funktion: '2. Kassierer', vorname: 'Michael', nachname: 'Dellschow', email: 'm.dellschow@sg-gersfeld.de', kommissarisch: true, geschaeftsfuehrend: false },
  { funktion: '3. Kassierer', vorname: 'Kerstin', nachname: 'Schmidt', email: 'k.schmidt@sg-gersfeld.de', kommissarisch: true, geschaeftsfuehrend: false },
  { funktion: 'Schriftführer', vorname: 'Maria', nachname: 'Schwarz', email: 'm.schwarz@sg-gersfeld.de', kommissarisch: false, geschaeftsfuehrend: true },
  { funktion: 'Stellv. Schriftführer', vorname: 'Thomas', nachname: 'Winkler', email: 't.winkler@sg-gersfeld.de', kommissarisch: true, geschaeftsfuehrend: false },
  { funktion: 'Oberschießwart', vorname: 'Frank', nachname: 'Schmidt', email: 'f.schmidt@sg-gersfeld.de', kommissarisch: true, geschaeftsfuehrend: true },
  { funktion: 'Waffen- und Gerätewart', vorname: 'Marc-Daniel', nachname: 'Gensler', email: 'm.gensler@sg-gersfeld.de', kommissarisch: false, geschaeftsfuehrend: false },
  { funktion: 'Geräte- und Waffenwart', vorname: 'Etienne', nachname: 'Adolf', kommissarisch: true, geschaeftsfuehrend: false },
  { funktion: 'Haus- und Platzwart', vorname: 'Markus', nachname: 'Müller', email: 'markus.mueller@sg-gersfeld.de', kommissarisch: false, geschaeftsfuehrend: false },
  { funktion: 'Pressewart', vorname: 'Holger', nachname: 'Schwarz', email: 'h.schwarz@sg-gersfeld.de', kommissarisch: true, geschaeftsfuehrend: false },
  { funktion: 'IT-Beauftragter', vorname: 'Sebastian', nachname: 'Burck', email: 's.burck@sg-gersfeld.de', kommissarisch: false, geschaeftsfuehrend: false },
  { funktion: 'Abteilungsleiter BDS', vorname: 'Dominik', nachname: 'Schmidt', email: 'd.schmidt@sg-gersfeld.de', kommissarisch: false, geschaeftsfuehrend: false },
  { funktion: 'Abteilungsleiter Western', vorname: 'Thomas', nachname: 'Benndorff', kommissarisch: false, geschaeftsfuehrend: false },
];

export const SCHIESSWARTE: Schiesswart[] = [
  { vorname: 'Andy', nachname: 'Berg', naechsteWahl: '2027' },
  { vorname: 'Egon', nachname: 'Berg', naechsteWahl: '2027' },
  { vorname: 'Ronny', nachname: 'Berg', naechsteWahl: '2027' },
  { vorname: 'Björn', nachname: 'Böhlke', kommissarisch: true, naechsteWahl: '2026 (1 Jahr)' },
  { vorname: 'Wolfgang', nachname: 'Gärtner', naechsteWahl: '2026' },
  { vorname: 'Timo', nachname: 'Heumüller', kommissarisch: true, naechsteWahl: '2026 (1 Jahr)' },
  { vorname: 'Michael', nachname: 'Hillenbrand', naechsteWahl: '2027' },
  { vorname: 'Michael', nachname: 'Jahn', naechsteWahl: '2024' },
  { vorname: 'Benjamin', nachname: 'Knüttel', naechsteWahl: '2026' },
  { vorname: 'Herbert', nachname: 'Müller', naechsteWahl: '2026' },
  { vorname: 'Matthias', nachname: 'Müller', naechsteWahl: '2026' },
  { vorname: 'Bodo', nachname: 'Müller', naechsteWahl: '2027' },
  { vorname: 'Martin', nachname: 'Reus', kommissarisch: true, naechsteWahl: '2026 (1 Jahr)' },
  { vorname: 'Mathias', nachname: 'Scheel', naechsteWahl: '2027' },
  { vorname: 'Dominik', nachname: 'Schmidt', naechsteWahl: '2026' },
  { vorname: 'Michael', nachname: 'Ultsch', kommissarisch: true, naechsteWahl: '2026 (2 Jahre)' },
  { vorname: 'Thomas', nachname: 'Winkler', naechsteWahl: '2026' },
];

export const KASSENPRUEFER: Kassenpruefer[] = [
  { funktion: 'Kassenprüfer', vorname: 'Timo', nachname: 'Heumüller' },
  { funktion: 'Ersatzkassenprüfer', vorname: 'Björn', nachname: 'Böhlke' },
];

export const KOENIGSFAMILIE: Koenig[] = [
  { titel: 'König', vorname: 'Christoph', nachname: 'Grösch' },
  { titel: '1. Ritter', vorname: 'Benjamin', nachname: 'Knüttel' },
  { titel: '2. Ritter', vorname: 'Viktor', nachname: 'Kisilenko' },
  { titel: 'Jugendkönig', vorname: 'Rudi', nachname: 'Graf' },
];

export const BDS_VORSTAND: BdsBoardMember[] = [
  { funktion: 'Vorsitzender', vorname: 'Dominik', nachname: 'Schmidt', email: 'd.schmidt@sg-gersfeld.de' },
  { funktion: 'Sportleiter', vorname: 'Frank', nachname: 'Schmidt', email: 'f.schmidt@sg-gersfeld.de' },
  { funktion: 'Schriftführer', vorname: 'Michael', nachname: 'Ultsch', email: 'm.ultsch@sg-gersfeld.de' },
  { funktion: 'Kassierer', vorname: 'Kerstin', nachname: 'Schmidt', email: 'k.schmidt@sg-gersfeld.de' },
];

export const BDS_ROS: RangeOfficer[] = [
  { vorname: 'Björn', nachname: 'Böhlke' },
  { vorname: 'Peter', nachname: 'Hoffmann' },
  { vorname: 'Markus', nachname: 'Müller' },
  { vorname: 'Matthias', nachname: 'Müller' },
  { vorname: 'Carsten', nachname: 'Richter' },
  { vorname: 'Dominik', nachname: 'Schmidt' },
  { vorname: 'Frank', nachname: 'Schmidt' },
  { vorname: 'Thomas', nachname: 'Winkler' },
];
