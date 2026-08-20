import React, { useState } from 'react';
import { 
  Users, Newspaper, Target, Image, Calendar, Mail, Trophy, Laptop, Menu, X, ChevronDown, ExternalLink 
} from 'lucide-react';

const MENU_ITEMS = [
  {
    name: 'Verein',
    icon: <Users className="w-4 h-4" />,
    url: '/verein/',
    children: [
      { name: 'Schießzeiten', url: '/verein/schiesszeiten/' },
      { name: 'Mitglied werden', url: '/verein/mitglied-werden/' },
      { name: 'Kosten', url: '/verein/kosten/' },
      { name: 'Satzung', url: '/verein/satzung/' },
      { name: 'Vorstand', url: '/verein/vorstand/' },
    ]
  },
  {
    name: 'News',
    icon: <Newspaper className="w-4 h-4" />,
    url: '/posts/'
  },
  {
    name: 'Abteilungen',
    icon: <Target className="w-4 h-4" />,
    url: '/abteilungen/',
    children: [
      { name: 'DSB', url: '/abteilungen/dsb/' },
      { name: 'BDS', url: '/abteilungen/bds/' },
      { name: 'IPSC', url: '/abteilungen/ipsc/' },
      { name: 'Western', url: '/abteilungen/western/' },
      { name: 'Bogen', url: '/abteilungen/bogen/' },
    ]
  },
  {
    name: 'Fotos',
    icon: <Image className="w-4 h-4" />,
    url: '/fotos/',
    children: [
      { name: 'Alle Alben', url: '/fotos/' },
      { name: 'Gebäude', url: '/fotos/gebaeude/' },
      { name: 'Schießstände', url: '/fotos/schiessstaende/' },
      { name: 'Events', url: '/fotos/events/' },
    ]
  },
  {
    name: 'Termine',
    icon: <Calendar className="w-4 h-4" />,
    url: '/termine/'
  },
  {
    name: 'Kontakt',
    icon: <Mail className="w-4 h-4" />,
    url: '/kontakt/'
  },
  {
    name: 'Ergebnisse',
    icon: <Trophy className="w-4 h-4" />,
    url: '/ergebnisse/',
    children: [
      { name: 'Alle Ergebnisse (Übersicht)', url: '/ergebnisse/' },
      { name: 'GK Pokalrunde', url: '/ergebnisse/#gkp' },
      { name: 'IPSC Matches & VM', url: '/ergebnisse/#ipsc' },
      { name: 'Königsschießen', url: '/ergebnisse/#koenig' },
    ]
  },
  {
    name: 'Mitglieder',
    icon: <Laptop className="w-4 h-4" />,
    url: '/easyverein/',
    children: [
      { name: 'Dienstplan', url: 'https://dp.sg-gersfeld.de/' },
      { name: 'easyVerein', url: '/easyverein/' },
    ]
  }
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [closeTimeout, setCloseTimeout] = useState(null);

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
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-brand-border/50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <a href="/" className="flex items-center gap-2 group transition-transform duration-200 hover:scale-[1.01]">
          <span className="font-extrabold text-lg sm:text-xl text-brand-dark tracking-tight">
            SG Gersfeld 1813 e.V.
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
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
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-brand-steel hover:text-brand-dark hover:bg-brand-steel/5 transition-all duration-200 ${hasChildren ? 'pr-2' : ''}`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                  {hasChildren && <ChevronDown className="w-3.5 h-3.5 opacity-60" />}
                </a>

                {/* Dropdown Menu with Seamless Invisible Hover Bridge */}
                {hasChildren && activeDropdown === index && (
                  <div 
                    className="absolute top-full left-0 pt-2 w-56 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
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
                            className="px-4 py-2.5 text-sm font-medium text-brand-steel hover:text-brand-dark hover:bg-brand-bg transition-colors duration-150 flex items-center justify-between"
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
        </nav>

        {/* Mobile Toggle Button */}
        <button 
          className="lg:hidden p-2 rounded-lg text-brand-steel hover:text-brand-dark hover:bg-brand-bg transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-brand-border bg-white px-6 py-4 flex flex-col gap-2 max-h-[calc(100vh-4rem)] overflow-y-auto z-50 shadow-inner">
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
    </header>
  );
}