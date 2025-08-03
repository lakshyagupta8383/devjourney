'use client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithPopup, GoogleAuthProvider, GithubAuthProvider, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { FaGoogle, FaGithub } from 'react-icons/fa';
export default function LoginPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleProviderLogin = async (provider) => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Provider Auth Error:', error);
      setErrorMsg('Authentication failed. Please try again.');
    }
  };

  const handleEmailLogin = async (e) => {
  e.preventDefault();
  setErrorMsg('');
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error('Email Auth Error:', error);
    switch (error.code) {
      case 'auth/user-not-found':
        setErrorMsg('No user found with this email.');
        break;
      case 'auth/wrong-password':
        setErrorMsg('Wrong password.');
        break;
      case 'auth/invalid-email':
        setErrorMsg('Invalid email format.');
        break;
      case 'auth/invalid-credential':
        setErrorMsg('Invalid credentials or unregistered user.');
        break;
      default:
        setErrorMsg('Something went wrong. Please try again.');
    }
  }
};
  const googleProvider = new GoogleAuthProvider();
  const githubProvider = new GithubAuthProvider();

  return (
  <div className="h-screen flex flex-col">
    {/* Main Content */}
    <div className="flex-grow flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full space-y-6">
        <h2 className="text-2xl font-bold text-center text-blue-700">Sign in to DevJourney</h2>

        {errorMsg && (
          <p className="text-sm text-red-600 text-center">{errorMsg}</p>
        )}

        {/* Email/Password Login */}
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded-md py-2 font-semibold hover:bg-blue-700 transition"
          >
            Sign In
          </button>
        </form>

        {/* Divider */}
        <div className="text-center text-sm text-gray-500">or</div>

        {/* Social Logins */}
        <div className="space-y-3">
          <button
            onClick={() => handleProviderLogin(googleProvider)}
            className="w-full border border-gray-300 bg-white text-gray-700 rounded-md py-2 flex items-center justify-center gap-2 hover:bg-gray-50 transition"
          >
            <FaGoogle className="text-red-500 text-lg" />
            Sign in with Google
          </button>

          <button
            onClick={() => handleProviderLogin(githubProvider)}
            className="w-full bg-gray-900 text-white rounded-md py-2 flex items-center justify-center gap-2 hover:bg-gray-800 transition"
          >
            <FaGithub className="text-lg" />
            Sign in with GitHub
          </button>
        </div>

        <p className="text-center text-sm text-gray-500">
          Don&apos;t have an account?{' '}
          <a href="/signup" className="text-blue-600 hover:underline font-medium">
            Sign up
          </a>
        </p>
      </div>
    </div>

    {/* Footer sticks to the bottom */}
    <Footer />
  </div>
);

}
