'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow px-6 py-12 flex flex-col items-center justify-center text-center">
        <div className="max-w-3xl w-full">
          <h1 className="text-5xl font-extrabold text-blue-900 mb-6 leading-tight">
            Welcome to <span className="text-blue-600">DevJourney</span>
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            Track your coding journey, save projects, generate resumes with AI, and grow as a developer.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/login"
              className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700 shadow-md transition text-center"
            >
              Get Started
            </Link>
          </div>
        </div>
        
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
