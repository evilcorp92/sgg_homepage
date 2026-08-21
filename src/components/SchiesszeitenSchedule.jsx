import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, ShieldCheck, UserCheck, ExternalLink, AlertCircle, 
  Sparkles, CheckCircle2, ChevronRight 
} from 'lucide-react';
import { getLiveDienstplan } from '../lib/dienstplanApi';

const DISCIPLINE_COLORS = {
  ipsc: {
    badge: 'bg-red-50 text-red-700 border-red-200',
    title: 'IPSC Dynamic Shooting'
  },
  bds: {
    badge: 'bg-blue-50 text-blue-700 border-blue-200',
    title: 'BDS Schießsport'
  },
  dsb: {
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    title: 'DSB Schießsport'
  },
  western: {
    badge: 'bg-amber-50 text-amber-800 border-amber-200',
    title: 'Western & Vorderlader'
  },
  bogen: {
    badge: 'bg-purple-50 text-purple-700 border-purple-200',
    title: 'Bogensport'
  },
  allgemein: {
    badge: 'bg-slate-50 text-slate-700 border-slate-200',
    title: 'Schießbetrieb'
  }
};

export default function SchiesszeitenSchedule() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLiveDienstplan().then(res => {
      setData(res);
      setLoading(false);
    });
  }, []);

  const upcoming = data?.upcoming || [];

  return (
    <div className="space-y-6">
      
      {/* 1. Live Status Top Bar */}
      <div className="bg-gradient-to-r from-slate-900 to-brand-dark text-white rounded-2xl p-5 sm:p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {loading ? (
            <span className="w-3 h-3 rounded-full bg-slate-500 animate-pulse"></span>
          ) : data?.todayOpen ? (
            <span className="relative flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
            </span>
          ) : (
            <span className="w-3 h-3 rounded-full bg-slate-400"></span>
          )}

          <div>
            <div className="text-xs font-extrabold uppercase tracking-widest text-brand-muted">
              Live-Status
            </div>
            <div className="text-base sm:text-lg font-bold">
              {loading ? (
                'Status wird geprüft...'
              ) : data?.todayOpen ? (
                <span className="text-emerald-400">
                  Heute Schießbetrieb ({data.todaySession?.zeit}) – {data.todaySession?.bezeichnung}
                </span>
              ) : (
                <span className="text-slate-300">
                  Heute kein regulärer Schießbetrieb
                </span>
              )}
            </div>
          </div>
        </div>

        <a 
          href="https://dp.sg-gersfeld.de/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors backdrop-blur-xs shrink-0 border border-white/10"
        >
          Zum Dienstplan-Portal <ExternalLink className="w-3.5 h-3.5 opacity-70" />
        </a>
      </div>

      {/* 2. 7-Tage-Vorschau / Kommende besetzte Schießzeiten */}
      <div className="bg-white rounded-brand-lg border border-brand-border/70 p-6 sm:p-8 shadow-sm space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-brand-border/40 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-brand-dark flex items-center gap-2">
              <Calendar className="w-6 h-6 text-brand-steel" /> Kommende Schießzeiten
            </h2>
            <p className="text-xs sm:text-sm text-brand-muted font-medium">
              Die nächsten anstehenden Trainingszeiten mit eingeteiltem Schießwart & Standaufsichten.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full self-start sm:self-auto">
            Live aus Dienstplan
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
            {[1, 2, 3].map(n => (
              <div key={n} className="h-44 bg-slate-100 rounded-xl border border-slate-200"></div>
            ))}
          </div>
        ) : upcoming.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcoming.map((item, idx) => {
              const disc = DISCIPLINE_COLORS[item.disciplineKey || 'allgemein'];
              return (
                <div 
                  key={item.id || idx}
                  className={`rounded-xl border p-4 sm:p-5 flex flex-col justify-between space-y-3 transition-all hover:shadow-md ${
                    item.isToday 
                      ? 'bg-emerald-50/40 border-emerald-300 ring-1 ring-emerald-200' 
                      : 'bg-slate-50/50 hover:bg-white border-slate-200'
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-black text-slate-900 uppercase tracking-wide">
                      {item.wochentag}, {item.datumFormatted}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${disc.badge}`}>
                      {item.bezeichnung}
                    </span>
                  </div>

                  {/* Time */}
                  <div className="flex items-center gap-2 text-brand-dark">
                    <Clock className="w-4 h-4 text-brand-steel shrink-0" />
                    <span className="font-extrabold text-base sm:text-lg">
                      {item.zeit}
                    </span>
                  </div>

                  {/* Staff Roster */}
                  {item.aufsichten && item.aufsichten.length > 0 && (
                    <div className="bg-white/80 rounded-lg p-2.5 border border-slate-200/60 text-xs space-y-1">
                      {item.aufsichten.map((staff, sIdx) => (
                        <div key={sIdx} className="flex items-center justify-between text-slate-600 text-[11px]">
                          <span className="font-medium text-slate-400">{staff.funktion}:</span>
                          <span className="font-bold text-slate-800 truncate ml-2">{staff.name}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Today Badge */}
                  {item.isToday && (
                    <div className="text-[10px] font-black text-emerald-700 flex items-center gap-1 pt-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Findet heute statt
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 bg-slate-50 rounded-xl border border-slate-200 p-6 space-y-2">
            <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-sm font-bold text-slate-700">Keine Schießzeiten mit Aufsicht eingetragen</p>
            <p className="text-xs text-slate-500">
              Bitte prüfen Sie den Dienstplan oder wenden Sie sich an die Schießwarte.
            </p>
          </div>
        )}

      </div>

    </div>
  );
}
