import { Outlet, Link, useRouter } from '@tanstack/react-router';
import { LayoutDashboard, BookOpen, BarChart2, Menu, X } from 'lucide-react';
import { useState } from 'react';

const navLinks = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/study-plan', label: 'Study Plan', icon: BookOpen },
  { to: '/skill-gap', label: 'Skill Gap', icon: BarChart2 },
];

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const currentPath = router.state.location.pathname;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center group">
              <img
                src="/assets/image-1.png"
                alt="Skyllx logo"
                className="h-10 w-auto object-contain"
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(({ to, label, icon: Icon }) => {
                const isActive = currentPath === to;
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-neon/10 text-neon border border-neon/30 shadow-neon-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-surface-2'
                    }`}
                  >
                    <Icon size={16} />
                    {label}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-surface">
            <nav className="px-4 py-3 flex flex-col gap-1">
              {navLinks.map(({ to, label, icon: Icon }) => {
                const isActive = currentPath === to;
                return (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-neon/10 text-neon border border-neon/30'
                        : 'text-muted-foreground hover:text-foreground hover:bg-surface-2'
                    }`}
                  >
                    <Icon size={16} />
                    {label}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-surface py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-2 text-sm">
          <span className="text-muted-foreground">
            © 2026&nbsp;&nbsp;&nbsp;Skyllx&nbsp;&nbsp;JobReady AI. All rights reserved.
          </span>
          <span className="flex items-center gap-1 text-muted-foreground">
            Built with{' '}
            <span className="text-neon">♥</span>{' '}
            using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || 'jobready-ai')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neon hover:underline font-medium"
            >
              caffeine.ai
            </a>
          </span>
        </div>
      </footer>

      {/* Skyllx branding — fixed bottom-right */}
      <div className="fixed bottom-4 right-4 z-50 pointer-events-none select-none">
        <span className="font-display font-bold text-sm tracking-widest uppercase text-neon opacity-70">
          skyllx
        </span>
      </div>
    </div>
  );
}
