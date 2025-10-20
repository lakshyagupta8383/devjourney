"use client";

import Link from 'next/link';
import { useState, useContext } from 'react';
import { Menu, X } from 'lucide-react';
import { AuthContext } from '@/context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useContext(AuthContext);
  console.log(user);
  
  // Redirect target: if logged in, go to actual route; if not, go to /login
  const route = (path) => (user ? path : "/login");

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link href="/" className="text-2xl font-bold text-indigo-600 tracking-tight">
          DevJourney
        </Link>

    

        <div className="md:hidden">
          <button
            className="text-gray-700 focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 space-y-2 font-medium bg-white border-t border-gray-100">
          <Link href={route("/dashboard")} className="block text-gray-700 hover:text-indigo-600 transition-colors duration-200">Dashboard</Link>
          <Link href={route("/projects")} className="block text-gray-700 hover:text-indigo-600 transition-colors duration-200">Projects</Link>
          <Link href={route("/resume")} className="block text-gray-700 hover:text-indigo-600 transition-colors duration-200">Resume</Link>
          <Link href={route("/profile")} className="block text-gray-700 hover:text-indigo-600 transition-colors duration-200">Profile</Link>
        </div>
      )}
    </nav>
  );
}
