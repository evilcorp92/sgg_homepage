import fs from 'node:fs';
import path from 'node:path';

export interface CalendarEvent {
  id: string;
  summary: string;
  description: string;
  location: string;
  startDate: Date;
  endDate?: Date;
  isAllDay: boolean;
  category: 'Allgemein' | 'Vorstandssitzung' | 'Vereinsmeisterschaft' | 'Arbeitseinsatz' | 'Training / RWK' | 'Sonstiges';
}

function parseICSDate(str: string): Date | null {
  if (!str) return null;
  const clean = str.replace(/[^0-9TZ]/g, '');
  if (clean.length === 8) {
    const y = parseInt(clean.substring(0, 4), 10);
    const m = parseInt(clean.substring(4, 6), 10) - 1;
    const d = parseInt(clean.substring(6, 8), 10);
    return new Date(y, m, d);
  }
  if (clean.length >= 15) {
    const y = parseInt(clean.substring(0, 4), 10);
    const m = parseInt(clean.substring(4, 6), 10) - 1;
    const d = parseInt(clean.substring(6, 8), 10);
    const h = parseInt(clean.substring(9, 11), 10);
    const min = parseInt(clean.substring(11, 13), 10);
    const s = parseInt(clean.substring(13, 15), 10);
    if (clean.endsWith('Z')) {
      return new Date(Date.UTC(y, m, d, h, min, s));
    }
    return new Date(y, m, d, h, min, s);
  }
  return null;
}

function getLastSaturday(year: number, month: number, hours = 9, minutes = 0): Date {
  const lastDay = new Date(year, month + 1, 0);
  const dayOfWeek = lastDay.getDay(); // 0 = Sun, 6 = Sat
  const diff = (dayOfWeek >= 6) ? dayOfWeek - 6 : dayOfWeek + 1;
  const satDate = lastDay.getDate() - diff;
  return new Date(year, month, satDate, hours, minutes);
}

export function parseICS(icsText: string): CalendarEvent[] {
  const unfolded = icsText.replace(/\r?\n[ \t]/g, '');
  const lines = unfolded.split(/\r?\n/);
  const events: CalendarEvent[] = [];
  let current: any = null;

  for (const line of lines) {
    if (line.startsWith('BEGIN:VEVENT')) {
      current = { description: '', location: '', exdates: [] };
    } else if (line.startsWith('END:VEVENT')) {
      if (current && current.summary && current.startDate) {
        const s = current.summary.trim();
        const sLower = s.toLowerCase();
        
        let category: CalendarEvent['category'] = 'Sonstiges';
        if (sLower.includes('vorstandssitzung')) {
          category = 'Vorstandssitzung';
        } else if (/\bvm\b|vereinsmeisterschaft/i.test(s)) {
          category = 'Vereinsmeisterschaft';
        } else if (sLower.includes('arbeitseinsatz')) {
          category = 'Arbeitseinsatz';
        } else if (
          !sLower.includes('training') &&
          !sLower.includes('vorstandssitzung') &&
          !/\bvm\b|vereinsmeisterschaft/i.test(s) &&
          !sLower.includes('rwk') &&
          !sLower.includes('arbeitseinsatz')
        ) {
          category = 'Allgemein';
        } else {
          category = 'Training / RWK';
        }

        // Add base event
        events.push({
          id: current.uid || Math.random().toString(36).substring(2),
          summary: s,
          description: current.description ? current.description.trim() : '',
          location: current.location ? current.location.trim() : '',
          startDate: current.startDate,
          endDate: current.endDate,
          isAllDay: current.isAllDay ?? false,
          category
        });

        // Expand monthly recurring rules (e.g. regelmäßiger Arbeitseinsatz every last Saturday)
        if (current.rrule && current.rrule.includes('FREQ=MONTHLY') && current.rrule.includes('BYDAY=-1SA')) {
          const now = new Date();
          const startYear = current.startDate.getFullYear();
          const startMonth = current.startDate.getMonth();
          const hours = current.startDate.getHours();
          const minutes = current.startDate.getMinutes();

          // Generate next 14 months
          for (let offset = 0; offset < 14; offset++) {
            const targetDate = new Date(now.getFullYear(), now.getMonth() + offset, 1);
            const y = targetDate.getFullYear();
            const m = targetDate.getMonth();
            
            // Check if before start
            if (y < startYear || (y === startYear && m < startMonth)) continue;

            const satDate = getLastSaturday(y, m, hours, minutes);
            const dateStr = `${y}${String(m + 1).padStart(2, '0')}${String(satDate.getDate()).padStart(2, '0')}`;

            // Check if in EXDATE
            const isExcluded = (current.exdates || []).some((ex: string) => ex.includes(dateStr));
            if (!isExcluded) {
              events.push({
                id: `${current.uid || 'arbeitseinsatz'}-${dateStr}`,
                summary: s,
                description: current.description ? current.description.trim() : '',
                location: current.location ? current.location.trim() : '',
                startDate: satDate,
                endDate: new Date(satDate.getTime() + 6 * 60 * 60 * 1000), // ~6 hours
                isAllDay: false,
                category
              });
            }
          }
        }
      }
      current = null;
    } else if (current) {
      const colonIdx = line.indexOf(':');
      if (colonIdx === -1) continue;
      const keyPart = line.slice(0, colonIdx);
      const val = line.slice(colonIdx + 1);
      const [key] = keyPart.split(';');
      const unescapedVal = val
        .replace(/\\n/gi, '\n')
        .replace(/\\,/g, ',')
        .replace(/\\;/g, ';')
        .replace(/\\\\/g, '\\');

      if (key === 'UID') current.uid = val;
      else if (key === 'SUMMARY') current.summary = unescapedVal;
      else if (key === 'DESCRIPTION') current.description = unescapedVal;
      else if (key === 'LOCATION') current.location = unescapedVal;
      else if (key === 'RRULE') current.rrule = val;
      else if (key === 'EXDATE') {
        if (!current.exdates) current.exdates = [];
        current.exdates.push(val);
      } else if (key === 'DTSTART') {
        current.startDate = parseICSDate(val);
        current.isAllDay = val.length === 8;
      } else if (key === 'DTEND') {
        current.endDate = parseICSDate(val);
      }
    }
  }

  return events;
}

export async function getCalendarEvents(): Promise<CalendarEvent[]> {
  const ICS_URL = "https://calendar.google.com/calendar/ical/9edol05k9ov7vnr7o9idllguk0%40group.calendar.google.com/public/basic.ics";
  let icsText = '';

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(ICS_URL, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      icsText = await res.text();
    }
  } catch (e) {
    // network fallback
  }

  if (!icsText) {
    try {
      const localPath = path.resolve(process.cwd(), 'src/data/basic.ics');
      if (fs.existsSync(localPath)) {
        icsText = fs.readFileSync(localPath, 'utf8');
      }
    } catch (e) {
      console.error("Could not read local basic.ics fallback:", e);
    }
  }

  if (!icsText) {
    return [];
  }

  return parseICS(icsText);
}
