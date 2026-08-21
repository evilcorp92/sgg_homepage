import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, X, Newspaper, Target, Users, Calendar, Trophy, Image, 
  HelpCircle, ArrowRight, CornerDownLeft, FileText, Sparkles, Building
} from 'lucide-react';

const CATEGORY_ICONS = {
  'Verein': <Users className="w-4 h-4 text-emerald-600 shrink-0" />,
  'Sport': <Target className="w-4 h-4 text-blue-600 shrink-0" />,
  'Sport & Wettkämpfe': <Trophy className="w-4 h-4 text-amber-600 shrink-0" />,
  'Vereinsleben & Vorstand': <Newspaper className="w-4 h-4 text-brand-dark shrink-0" />,
  'Schießstände & Termine': <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />,
  'Western & Feste': <Sparkles className="w-4 h-4 text-orange-600 shrink-0" />,
  'Schießstände': <Building className="w-4 h-4 text-slate-600 shrink-0" />,
  'Termine': <Calendar className="w-4 h-4 text-amber-600 shrink-0" />,
  'Ergebnisse': <Trophy className="w-4 h-4 text-yellow-600 shrink-0" />,
  'Fotos': <Image className="w-4 h-4 text-purple-600 shrink-0" />,
  'Kontakt': <Users className="w-4 h-4 text-brand-steel shrink-0" />,
  'Service': <HelpCircle className="w-4 h-4 text-cyan-600 shrink-0" />,
  'Mitglieder': <Users className="w-4 h-4 text-indigo-600 shrink-0" />,
  'Rechtliches': <FileText className="w-4 h-4 text-slate-500 shrink-0" />
};

function getCategoryIcon(cat) {
  return CATEGORY_ICONS[cat] || <FileText className="w-4 h-4 text-slate-400 shrink-0" />;
}

const POPULAR_SEARCHES = [
  'Schießzeiten', 'Vorstand', 'Kosten', 'BDS', 'IPSC', 
  'Western', 'Mitglied werden', 'Satzung', 'Termine', 'Rechnung'
];

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Fetch search index on first open
  useEffect(() => {
    if (isOpen && items.length === 0) {
      setLoading(true);
      fetch('/search-index.json')
        .then(res => res.json())
        .then(data => {
          setItems(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Failed to load search index:', err);
          setLoading(false);
        });
    }
  }, [isOpen]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Filter & score items based on query
  const results = useMemo(() => {
    if (!query.trim() || items.length === 0) return [];
    
    const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);

    const scored = [];
    for (const item of items) {
      const titleLower = item.title.toLowerCase();
      const descLower = item.description.toLowerCase();
      const keywLower = (item.keywords || '').toLowerCase();
      const catLower = item.category.toLowerCase();

      let matchAll = true;
      let score = 0;

      for (const term of terms) {
        let termMatches = false;

        if (titleLower.includes(term)) {
          termMatches = true;
          score += titleLower.startsWith(term) ? 100 : 60;
        }
        if (catLower.includes(term)) {
          termMatches = true;
          score += 40;
        }
        if (keywLower.includes(term)) {
          termMatches = true;
          score += 25;
        }
        if (descLower.includes(term)) {
          termMatches = true;
          score += 15;
        }

        if (!termMatches) {
          matchAll = false;
          break;
        }
      }

      if (matchAll) {
        scored.push({ ...item, score });
      }
    }

    // Sort by highest score first, then newest date
    return scored.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.date && a.date) return b.date.localeCompare(a.date);
      return 0;
    }).slice(0, 30); // Max 30 results for fast rendering
  }, [query, items]);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1 < results.length ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 >= 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        window.location.href = results[selectedIndex].url;
      }
    }
  };

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.querySelector(`[data-index="${selectedIndex}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150"
        onKeyDown={handleKeyDown}
      >
        {/* Search Header Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 bg-slate-50/50 gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Seite, Disziplin, News, Termin oder Thema suchen..."
            className="flex-1 bg-transparent text-base sm:text-lg font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          {query ? (
            <button 
              onClick={() => { setQuery(''); inputRef.current?.focus(); }}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-200/60 transition-colors"
              aria-label="Suchtext löschen"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-bold text-slate-400 bg-slate-200/60 rounded border border-slate-300">
              ESC
            </kbd>
          )}
          <button 
            onClick={onClose}
            className="sm:hidden p-1 text-slate-400 hover:text-slate-600"
            aria-label="Schließen"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results / Default View */}
        <div ref={listRef} className="flex-1 overflow-y-auto p-3 divide-y divide-slate-100">
          {loading && (
            <div className="py-12 text-center text-slate-400 text-sm flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-slate-300 border-t-brand-dark rounded-full animate-spin"></span>
              Suchindex wird geladen...
            </div>
          )}

          {!loading && query.trim() && results.length === 0 && (
            <div className="py-12 text-center space-y-2">
              <p className="text-slate-700 font-bold">Keine Treffer für „{query}“ gefunden</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Versuche es mit einem kürzeren Suchbegriff wie z. B. <span className="font-semibold text-slate-600">BDS, IPSC, Beitrag, Schießzeiten</span> oder <span className="font-semibold text-slate-600">König</span>.
              </p>
            </div>
          )}

          {!loading && !query.trim() && (
            <div className="py-6 px-3 space-y-4">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Häufig gesucht
              </div>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((term, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setQuery(term);
                      inputRef.current?.focus();
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 rounded-lg transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!loading && results.map((item, index) => {
            const isSelected = index === selectedIndex;
            return (
              <a
                key={item.id}
                href={item.url}
                data-index={index}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`group flex items-start justify-between gap-3 p-3 rounded-xl transition-colors ${
                  isSelected ? 'bg-slate-100/90 text-brand-dark' : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="mt-0.5 p-2 rounded-lg bg-white shadow-xs border border-slate-200/60 group-hover:border-slate-300">
                    {getCategoryIcon(item.category)}
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-sm sm:text-base text-slate-900 leading-tight">
                        {item.title}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200/60 text-slate-600">
                        {item.category}
                      </span>
                      {item.date && (
                        <span className="text-[11px] text-slate-400 font-medium">
                          {new Date(item.date).toLocaleDateString('de-DE')}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                <ArrowRight className={`w-4 h-4 text-slate-400 shrink-0 mt-2 transition-transform ${isSelected ? 'translate-x-1 text-slate-700' : 'opacity-0 group-hover:opacity-100'}`} />
              </a>
            );
          })}
        </div>

        {/* Footer Shortcut Bar */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-600 shadow-2xs">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-600 shadow-2xs">↓</kbd> Navigieren
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-600 shadow-2xs">↵</kbd> Öffnen
            </span>
          </div>
          <span>{results.length > 0 ? `${results.length} Treffer` : 'SG Gersfeld 1813 e.V.'}</span>
        </div>
      </div>
    </div>
  );
}
