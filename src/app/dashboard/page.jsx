'use client';

import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  BookMarked,
  FileText,
  User,
  LogOut,
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 text-blue-900">
        
        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <main className="flex-grow px-6 py-12">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl font-extrabold mb-4">
              Welcome back,{' '}
              <span className="text-blue-600">{user?.displayName || 'Developer'}</span> 👋
            </h1>
            <p className="text-blue-800 mb-10 text-lg">
              Here’s your personalized developer dashboard.
            </p>

            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
              {/* Saved Projects */}
              <div className="p-6 bg-white border border-blue-200 rounded-2xl shadow-md hover:shadow-lg transition-transform hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-3">
                  <BookMarked className="text-blue-600 w-6 h-6" />
                  <h2 className="text-xl font-semibold">Saved Projects</h2>
                </div>
                <p className="text-blue-800">
                  Access your saved projects, edit them, or remove outdated ones.
                </p>
              </div>

              {/* Resume Builder */}
              <div className="p-6 bg-white border border-green-200 rounded-2xl shadow-md hover:shadow-lg transition-transform hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-3">
                  <FileText className="text-green-600 w-6 h-6" />
                  <h2 className="text-xl font-semibold">Resume Builder</h2>
                </div>
                <p className="text-blue-800">
                  Build and export your AI-powered resume with ease.
                </p>
              </div>

              {/* Profile Settings */}
              <div className="p-6 bg-white border border-yellow-200 rounded-2xl shadow-md hover:shadow-lg transition-transform hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-3">
                  <User className="text-yellow-500 w-6 h-6" />
                  <h2 className="text-xl font-semibold">Profile Settings</h2>
                </div>
                <p className="text-blue-800">
                  Manage your personal info, email, and password settings.
                </p>
              </div>

              {/* Logout */}
              <div className="p-6 bg-white border border-red-200 rounded-2xl shadow-md hover:shadow-lg transition-transform hover:-translate-y-1 cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <LogOut className="text-red-600 w-6 h-6" />
                  <h2 className="text-xl font-semibold">Logout</h2>
                </div>
                <p className="text-blue-800">
                  Sign out of your DevJourney account securely.
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
