import React, { useState, useEffect } from 'react';
import { Calendar, Clock, ShieldCheck, UserCheck, ArrowRight, ExternalLink } from 'lucide-react';
import { getLiveDienstplan } from '../lib/dienstplanApi';

export default function NextDepartmentTraining({ department, departmentTitle }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLiveDienstplan().then(data => {
      if (data && data.upcoming) {
        // Filter upcoming sessions matching this department key or name
        const match = data.upcoming.find(item => {
          if (department === 'ipsc') return item.disciplineKey === 'ipsc';
          if (department === 'bds') return item.disciplineKey === 'bds';
          if (department === 'dsb') return item.disciplineKey === 'dsb';
          if (department === 'western') return item.disciplineKey === 'western';
          if (department === 'bogen') return item.disciplineKey === 'bogen';
          return false;
        });
        setSession(match || null);
      }
      setLoading(false);
    });
  }, [department]);

  if (loading) {
    return (
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 animate-pulse">
        <div className="h-4 bg-slate-200 rounded w-1/3 mb-2"></div>
        <div className="h-6 bg-slate-200 rounded w-2/3"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="bg-white rounded-2xl border border-brand-border/70 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs font-black uppercase tracking-wider text-brand-muted flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-brand-steel" /> Nächstes {departmentTitle || 'Training'}
          </div>
          <p className="text-sm font-semibold text-brand-dark">
            Die nächsten Termine werden demnächst im Dienstplan eingeteilt.
          </p>
        </div>
        <a 
          href="/verein/schiesszeiten/" 
          className="inline-flex items-center gap-1 text-xs font-bold text-brand-steel hover:text-brand-dark transition-colors shrink-0"
        >
          Alle Schießzeiten <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white via-slate-50/60 to-brand-card rounded-2xl border border-brand-border/80 p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-bg text-brand-steel border border-brand-border/60">
          <Calendar className="w-3 h-3" /> Nächstes offizielles {departmentTitle}-Training
        </div>

        <div className="flex flex-wrap items-baseline gap-3">
          <h4 className="text-lg sm:text-xl font-black text-brand-dark tracking-tight">
            {session.wochentag}, {session.datumFormatted}
          </h4>
          <span className="inline-flex items-center gap-1 text-sm font-bold text-slate-700 bg-white px-2.5 py-0.5 rounded-md border border-slate-200">
            <Clock className="w-3.5 h-3.5 text-brand-steel" /> {session.zeit}
          </span>
        </div>

        {session.aufsichten && session.aufsichten.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 pt-1">
            <span className="font-semibold text-slate-400">Standaufsicht:</span>
            {session.aufsichten.map((staff, idx) => (
              <span key={idx} className="font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200/80">
                {staff.name}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
        <a 
          href="https://dp.sg-gersfeld.de/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white hover:bg-slate-100 text-brand-steel hover:text-brand-dark text-xs font-bold border border-slate-200 shadow-2xs transition-colors"
        >
          Dienstplan <ExternalLink className="w-3.5 h-3.5 opacity-60" />
        </a>
        <a 
          href="/verein/schiesszeiten/" 
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-brand-dark hover:bg-brand-steel text-white text-xs font-bold shadow-xs transition-colors"
        >
          Schießzeiten <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>

    </div>
  );
}
