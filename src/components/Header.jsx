import React, { useState, useEffect } from 'react';
import { 
  Users, Newspaper, Target, Image, Calendar, Mail, Trophy, Laptop, Menu, X, ChevronDown, ExternalLink, Search 
} from 'lucide-react';
import SearchModal from './SearchModal.jsx';

const MENU_ITEMS = [
  {
    name: 'Verein',
    icon: <Users className="w-4 h-4" />,
    url: '/verein/',
    children: [
      { name: 'Über uns (Geschichte & Tradition)', url: '/verein/' },
      { name: 'Schießzeiten', url: '/verein/schiesszeiten/' },
      { name: 'Mitglied werden & Kosten', url: '/verein/mitglied-werden/' },
      { name: 'Vorstand & Ansprechpartner', url: '/verein/vorstand/' },
      { name: 'Satzung & Ordnungen', url: '/verein/satzung/' },
      { name: 'Dienstplan (Standaufsichten)', url: 'https://dp.sg-gersfeld.de/' },
      { name: 'easyVerein Portal', url: '/easyverein/' },
    ]
  },
  {
    name: 'Sport',
    icon: <Target className="w-4 h-4" />,
    url: '/abteilungen/',
    children: [
      { name: 'Alle Abteilungen (Übersicht)', url: '/abteilungen/' },
      { name: 'DSB (Präzision & KK)', url: '/abteilungen/dsb/' },
      { name: 'BDS (Großkaliber & Speed)', url: '/abteilungen/bds/' },
      { name: 'IPSC (Dynamic Shooting)', url: '/abteilungen/ipsc/' },
      { name: 'Western & Vorderlader', url: '/abteilungen/western/' },
      { name: 'Bogensport', url: '/abteilungen/bogen/' },
      { name: 'Ergebnisse & Listen', url: '/ergebnisse/' },
    ]
  },
  {
    name: 'Termine',
    icon: <Calendar className="w-4 h-4" />,
    url: '/termine/',
    children: [
      { name: 'Vereinskalender (Alle Termine)', url: '/termine/' },
      { name: 'Arbeitseinsätze', url: '/termine/arbeitseinsaetze/' },
      { name: 'Dienstplan', url: 'https://dp.sg-gersfeld.de/' },
    ]
  },
  {
    name: 'News',
    icon: <Newspaper className="w-4 h-4" />,
    url: '/posts/'
  },
  {
    name: 'Fotos',
    icon: <Image className="w-4 h-4" />,
    url: '/fotos/',
    children: [
      { name: 'Alle Fotoalben', url: '/fotos/' },
      { name: 'Events & Feste', url: '/fotos/events/' },
      { name: 'Gebäude & Westernstadt', url: '/fotos/gebaeude/' },
      { name: 'Schießstände', url: '/fotos/schiessstaende/' },
    ]
  },
  {
    name: 'Kontakt',
    icon: <Mail className="w-4 h-4" />,
    url: '/kontakt/'
  }
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [closeTimeout, setCloseTimeout] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);

  // Global shortcut (Cmd+K / Ctrl+K / /)
  useEffect(() => {
    const handleGlobalKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      } else if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, []);

  const handleMouseEnter = (index) => {
    if (closeTimeout) clearTimeout(closeTimeout);
    setActiveDropdown(index);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
    setCloseTimeout(timeout);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-brand-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
        
        {/* Brand Logo - Fixed whitespace & shrink */}
        <a href="/" className="flex items-center gap-2 group transition-transform duration-200 hover:scale-[1.01] shrink-0">
          <span className="font-extrabold text-base sm:text-lg lg:text-xl text-brand-dark tracking-tight whitespace-nowrap">
            SG Gersfeld 1813 e.V.
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1">
          {MENU_ITEMS.map((item, index) => {
            const hasChildren = !!item.children;
            const isExternal = item.url?.startsWith('http');
            return (
              <div 
                key={index} 
                className="relative py-2"
                onMouseEnter={() => hasChildren && handleMouseEnter(index)}
                onMouseLeave={() => hasChildren && handleMouseLeave()}
              >
                <a 
                  href={item.url} 
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-2 rounded-lg text-xs xl:text-sm font-semibold text-brand-steel hover:text-brand-dark hover:bg-brand-steel/5 transition-all duration-200 ${hasChildren ? 'pr-1.5 xl:pr-2' : ''}`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                  {hasChildren && <ChevronDown className="w-3.5 h-3.5 opacity-60" />}
                </a>

                {/* Dropdown Menu */}
                {hasChildren && activeDropdown === index && (
                  <div 
                    className="absolute top-full left-0 pt-2 w-64 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={() => handleMouseLeave()}
                  >
                    <div className="bg-white rounded-brand border border-brand-border shadow-xl py-2 flex flex-col">
                      {item.children.map((child, cIdx) => {
                        const isChildExternal = child.url.startsWith('http');
                        return (
                          <a 
                            key={cIdx} 
                            href={child.url}
                            target={isChildExternal ? "_blank" : undefined}
                            rel={isChildExternal ? "noopener noreferrer" : undefined}
                            className="px-4 py-2.5 text-xs xl:text-sm font-medium text-brand-steel hover:text-brand-dark hover:bg-brand-bg transition-colors duration-150 flex items-center justify-between"
                          >
                            <span>{child.name}</span>
                            {isChildExternal && <ExternalLink className="w-3.5 h-3.5 opacity-50" />}
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Search Trigger Button (Desktop) */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-1.5 xl:gap-2 px-2.5 xl:px-3 py-1.5 ml-1 xl:ml-2 rounded-lg text-xs font-semibold text-brand-steel bg-slate-100 hover:bg-slate-200/80 hover:text-brand-dark transition-all border border-slate-200/60 shadow-2xs cursor-pointer shrink-0"
            aria-label="Homepage durchsuchen (Strg+K)"
            title="Suche öffnen (Strg+K)"
          >
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden xl:inline">Suchen...</span>
            <kbd className="hidden xl:inline-block px-1.5 py-0.5 text-[10px] font-bold text-slate-400 bg-white rounded border border-slate-300">
              ⌘K
            </kbd>
          </button>
        </nav>

        {/* Mobile Header Buttons */}
        <div className="flex items-center gap-1 lg:hidden">
          <button 
            className="p-2 rounded-lg text-brand-steel hover:text-brand-dark hover:bg-brand-bg transition-colors"
            onClick={() => setSearchOpen(true)}
            aria-label="Suche öffnen"
          >
            <Search className="w-5 h-5" />
          </button>

          <button 
            className="p-2 rounded-lg text-brand-steel hover:text-brand-dark hover:bg-brand-bg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-brand-border bg-white px-6 py-4 flex flex-col gap-2 max-h-[calc(100vh-4rem)] overflow-y-auto z-50 shadow-inner">
          {/* Mobile Search Button in Menu */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setSearchOpen(true);
            }}
            className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm mb-2 text-left"
          >
            <span className="flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-500" />
              <span>Inhalte suchen...</span>
            </span>
            <span className="text-xs text-slate-400">Tippen</span>
          </button>

          {MENU_ITEMS.map((item, index) => {
            const hasChildren = !!item.children;
            const isOpen = activeDropdown === index;
            const isExternal = item.url?.startsWith('http');
            return (
              <div key={index} className="flex flex-col">
                <div className="flex items-center justify-between">
                  <a 
                    href={item.url} 
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    className="flex items-center gap-2 py-2.5 text-base font-bold text-brand-dark"
                    onClick={() => !hasChildren && setMobileMenuOpen(false)}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                    {isExternal && <ExternalLink className="w-4 h-4 opacity-50" />}
                  </a>
                  {hasChildren && (
                    <button 
                      className="p-2 text-brand-steel hover:text-brand-dark"
                      onClick={() => setActiveDropdown(isOpen ? null : index)}
                    >
                      <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                  )}
                </div>

                {/* Mobile Dropdown Sub-menu */}
                {hasChildren && isOpen && (
                  <div className="flex flex-col pl-6 border-l-2 border-brand-border/60 gap-1.5 py-1">
                    {item.children.map((child, cIdx) => {
                      const isChildExternal = child.url.startsWith('http');
                      return (
                        <a 
                          key={cIdx} 
                          href={child.url} 
                          target={isChildExternal ? "_blank" : undefined}
                          rel={isChildExternal ? "noopener noreferrer" : undefined}
                          className="py-1.5 text-sm font-semibold text-brand-steel hover:text-brand-dark flex items-center justify-between pr-4"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <span>{child.name}</span>
                          {isChildExternal && <ExternalLink className="w-3.5 h-3.5 opacity-50" />}
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Global Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
