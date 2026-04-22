import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BankCompare SL | Find the Best Bank Accounts in Sri Lanka',
  description: 'Compare 24 licensed Sri Lankan banks, interest rates, and features. AI-powered recommendations for residents and expats.',
  keywords: 'Sri Lanka, bank comparison, fixed deposit, savings account, interest rates, expat banking',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-stone-50 font-body">
        {children}
      </body>
    </html>
  );
}
