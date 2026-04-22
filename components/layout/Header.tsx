'use client';

import { useState } from 'react';
import { Menu, X, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Banks', href: '/banks' },
  { label: 'Products', href: '/products' },
  { label: 'AI Assistant', href: '/assistant' },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700
                            flex items-center justify-center shadow-lg shadow-emerald-600/20
                            group-hover:shadow-xl group-hover:shadow-emerald-600/30 transition-shadow">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-stone-900 leading-none">BankCompare</span>
              <span className="text-xs text-emerald-700 font-medium">SL</span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  link.href === '/'
                    ? "text-emerald-700 bg-emerald-50"
                    : "text-stone-600 hover:text-emerald-700 hover:bg-stone-100"
                )}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="/compare"
              className="px-5 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-lg
                         hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20"
            >
              Start Comparing
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg text-stone-600 hover:bg-stone-100"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-stone-200">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    link.href === '/'
                      ? "text-emerald-700 bg-emerald-50"
                      : "text-stone-600 hover:text-emerald-700 hover:bg-stone-100"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <a
                href="/compare"
                className="mt-2 px-4 py-3 bg-emerald-600 text-white text-sm font-medium rounded-lg
                           text-center hover:bg-emerald-700 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Start Comparing
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
