/**
 * Utility to fetch and cache live Dienstplan data from dp.sg-gersfeld.de/api.php
 */

export interface StaffMember {
  funktion: string;
  name: string;
}

export interface SchiesszeitSession {
  id: number;
  datum: string;
  datumFormatted: string;
  wochentag: string;
  wochentagShort: string;
  beginn: string;
  ende: string;
  zeit: string;
  bezeichnung: string;
  disciplineKey: 'dsb' | 'bds' | 'ipsc' | 'western' | 'bogen' | 'allgemein';
  aufsichten: StaffMember[];
  isToday: boolean;
}

export interface DienstplanResponse {
  status: 'success' | 'error';
  serverTime: string;
  today: string;
  todayOpen: boolean;
  todaySession: SchiesszeitSession | null;
  nextSession: SchiesszeitSession | null;
  upcoming: SchiesszeitSession[];
}

let memoryCache: { data: DienstplanResponse; timestamp: number } | null = null;
const CACHE_TTL_MS = 60 * 1000; // 1 minute cache

export async function getLiveDienstplan(): Promise<DienstplanResponse | null> {
  const now = Date.now();
  if (memoryCache && (now - memoryCache.timestamp < CACHE_TTL_MS)) {
    return memoryCache.data;
  }

  try {
    const res = await fetch('https://dp.sg-gersfeld.de/api.php', {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(4000)
    });

    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`);
    }

    const data: DienstplanResponse = await res.json();
    if (data && data.status === 'success') {
      memoryCache = { data, timestamp: now };
      return data;
    }
    return null;
  } catch (err) {
    // Graceful fallback for local development or before api.php is deployed
    console.warn('Could not fetch dp.sg-gersfeld.de/api.php, using fallback preview:', err);
    return null;
  }
}
