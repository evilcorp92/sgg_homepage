import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, ShieldCheck, UserCheck, ArrowRight, ArrowUpRight, 
  Sparkles, Target, AlertCircle 
} from 'lucide-react';
import { getLiveDienstplan } from '../lib/dienstplanApi';

const DISCIPLINE_COLORS = {
  ipsc: {
    badge: 'bg-red-50 text-red-700 border-red-200',
    dot: 'bg-red-500',
    title: 'IPSC Dynamic Shooting'
  },
  bds: {
    badge: 'bg-blue-50 text-blue-700 border-blue-200',
    dot: 'bg-blue-500',
    title: 'BDS Schießsport'
  },
  dsb: {
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
    title: 'DSB Schießsport'
  },
  western: {
    badge: 'bg-amber-50 text-amber-800 border-amber-200',
    dot: 'bg-amber-500',
    title: 'Western & Vorderlader'
  },
  bogen: {
    badge: 'bg-purple-50 text-purple-700 border-purple-200',
    dot: 'bg-purple-500',
    title: 'Bogensport'
  },
  allgemein: {
    badge: 'bg-slate-50 text-slate-700 border-slate-200',
    dot: 'bg-slate-500',
    title: 'Schießbetrieb'
  }
};

export default function LiveStatusHero() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLiveDienstplan().then(res => {
      setData(res);
      setLoading(false);
    });
  }, []);

  // Active session to display: today's session if open, else the next upcoming session
  const activeSession = data?.todayOpen ? data.todaySession : (data?.nextSession || null);
  const discConfig = DISCIPLINE_COLORS[activeSession?.disciplineKey || 'allgemein'];

  return (
    <div className="bg-white rounded-brand-lg border border-brand-border/80 shadow-xl p-6 sm:p-8 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-8">
      
      {/* Left Column: Headline & Explanations */}
      <div className="space-y-4 max-w-md">
        
        {/* Status Indicator */}
        {loading ? (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-slate-400"></span> Dienstplan wird geladen...
          </div>
        ) : data?.todayOpen ? (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-300/80 shadow-xs animate-in fade-in">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 -ml-4.5"></span>
            🟢 Heute Schießbetrieb geöffnet
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-slate-400"></span>
            Heute kein Schießbetrieb
          </div>
        )}

        <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-dark tracking-tight">
          {data?.todayOpen ? 'Heutige Schießzeit' : 'Nächste Schießzeit'}
        </h2>
        
        <p className="text-sm text-brand-steel leading-relaxed">
          {data?.todayOpen 
            ? 'Heute findet regulärer Schießbetrieb mit eingeteilter Standaufsicht statt.'
            : 'Standaufsichten und Schießzeiten werden in Echtzeit mit unserem Dienstplan synchronisiert.'}
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-bold">
          <a 
            href="https://dp.sg-gersfeld.de/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-bg text-brand-steel hover:text-brand-dark hover:bg-brand-steel/10 transition-colors"
          >
            Dienstplan öffnen <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
          <a 
            href="/verein/schiesszeiten/" 
            className="inline-flex items-center gap-1 text-brand-steel hover:text-brand-dark transition-colors"
          >
            Alle Schießzeiten & Woche <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Right Column: Live Session Card */}
      <div className="w-full lg:w-[400px] shrink-0">
        {loading ? (
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4 animate-pulse">
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            <div className="h-6 bg-slate-200 rounded w-3/4"></div>
            <div className="h-16 bg-slate-200 rounded"></div>
          </div>
        ) : activeSession ? (
          <div className="bg-gradient-to-b from-white to-slate-50/80 rounded-2xl border border-slate-200/90 shadow-md p-5 sm:p-6 space-y-4 relative overflow-hidden">
            
            {/* Header: Date & Badge */}
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brand-steel" />
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {activeSession.wochentag}, {activeSession.datumFormatted}
                </span>
              </div>
              <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${discConfig.badge}`}>
                {activeSession.bezeichnung}
              </span>
            </div>

            {/* Time */}
            <div className="flex items-center gap-2.5">
              <Clock className="w-5 h-5 text-brand-steel shrink-0" />
              <span className="text-xl sm:text-2xl font-black text-brand-dark tracking-tight">
                {activeSession.zeit}
              </span>
            </div>

            {/* Staff / Aufsichten */}
            {activeSession.aufsichten && activeSession.aufsichten.length > 0 && (
              <div className="bg-white rounded-xl p-3.5 border border-slate-200/70 shadow-2xs space-y-2">
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Eingeteilte Standaufsicht
                </div>
                <div className="space-y-1.5">
                  {activeSession.aufsichten.map((staff, sIdx) => (
                    <div key={sIdx} className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">{staff.funktion}:</span>
                      <span className="font-bold text-slate-900 flex items-center gap-1">
                        <UserCheck className="w-3 h-3 text-brand-steel/70" />
                        {staff.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer Notice */}
            <div className="text-[11px] text-slate-400 text-center pt-1 font-medium">
              Live aus dem Dienstplan • Schießbetrieb nur mit Aufsicht
            </div>

          </div>
        ) : (
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 text-center space-y-2">
            <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-sm font-bold text-slate-700">Derzeit keine eingeteilten Schießzeiten</p>
            <p className="text-xs text-slate-500">Bitte den Dienstplan für kurzfristige Termine prüfen.</p>
          </div>
        )}
      </div>

    </div>
  );
}
