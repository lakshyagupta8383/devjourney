"use client";
import './globals.css';
import { Poppins, Fira_Code } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '600'], variable: '--font-poppins' });
const firaCode = Fira_Code({ subsets: ['latin'], variable: '--font-fira' });

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${poppins.variable} ${firaCode.variable}`}>
      <body className="font-sans bg-white text-slate-900">
        <AuthProvider>
          <main className="min-h-screen px-4">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
