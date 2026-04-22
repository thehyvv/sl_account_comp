'use client';

import { Building2, Shield, AlertCircle, Mail, Twitter, Linkedin } from 'lucide-react';

const footerLinks = {
  product: [
    { label: 'Bank Directory', href: '/banks' },
    { label: 'Compare Rates', href: '/rates' },
    { label: 'AI Assistant', href: '/assistant' },
    { label: 'Methodology', href: '/methodology' },
  ],
  resources: [
    { label: 'Best FD Rates', href: '/best-fixed-deposit-rates' },
    { label: 'Expat Accounts', href: '/expat-bank-accounts' },
    { label: 'CBSL Guidelines', href: 'https://www.cbsl.gov.lk' },
    { label: 'Fitch Ratings', href: 'https://www.fitchratings.com' },
    { label: 'FAQ', href: '/faq' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300">
      {/* Main Footer */}
      <div className="container-custom py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-white">BankCompare SL</span>
            </div>
            <p className="text-stone-400 mb-6 max-w-sm">
              Independent comparison of Sri Lankan banks and financial products.
              Making banking decisions easier for residents and expats.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center
                           hover:bg-emerald-600 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center
                           hover:bg-emerald-600 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="mailto:hello@bankcompare.lk"
                className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center
                           hover:bg-emerald-600 transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-stone-400 hover:text-emerald-400 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-stone-400 hover:text-emerald-400 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-stone-400 hover:text-emerald-400 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="border-t border-stone-800">
        <div className="container-custom py-8">
          <div className="flex items-start gap-3 mb-6 p-4 bg-stone-800/50 rounded-xl">
            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="text-sm text-stone-400">
              <p className="mb-2">
                <strong className="text-stone-300">Important Disclaimer:</strong> This is an informational service only.
                We do not provide financial advice. All interest rates, fees, and product information are sourced from
                publicly available data and bank websites. Please verify all details directly with the respective banks
                before making any financial decisions.
              </p>
              <p>
                BankCompare SL is not affiliated with any bank or financial institution. We are an independent
                comparison platform. CBSL registration and regulatory compliance information should be verified
                independently.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-stone-500">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>© 2024 BankCompare SL. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-6">
              <span>Data updated daily</span>
              <span>Made for Sri Lanka 🇱🇰</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
