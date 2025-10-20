'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Loader2, PlusCircle, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export default function CreateProjectPage() {
  const { user } = useAuth();
  const router = useRouter();

  // Form states
  const [form, setForm] = useState({
    name: '',
    aiPrompt: '',
    description: '',
    techStack: '',
  });

  // Join project
  const [joinId, setJoinId] = useState('');
  const [joinMessage, setJoinMessage] = useState('');
  const [joinLoading, setJoinLoading] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Create Project
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/create-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user?.uid,
          name: form.name,
          description: form.description,
          aiPrompt: form.aiPrompt,
          techStack: form.techStack.split(',').map((s) => s.trim()),
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage('✅ Project created successfully!');
        setTimeout(() => router.push('/dashboard'), 1200);
      } else {
        setMessage('❌ Failed to create project.');
      }
    } catch (err) {
      setMessage('⚠️ Error creating project.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Join Project
  const handleJoinProject = async (e) => {
    e.preventDefault();
    setJoinLoading(true);
    setJoinMessage('');

    try {
      const projectRef = doc(db, 'projects', joinId);
      const projectSnap = await getDoc(projectRef);

      if (!projectSnap.exists()) {
        setJoinMessage('❌ Project not found. Check the ID again.');
        setJoinLoading(false);
        return;
      }

      const projectData = projectSnap.data();

      // Check if already a member
      if (projectData.members && projectData.members[user.uid]) {
        setJoinMessage('⚠️ You’re already part of this project.');
        setJoinLoading(false);
        return;
      }

      // Add user as a member
      await updateDoc(projectRef, {
        [`members.${user.uid}`]: 'member',
      });

      setJoinMessage('✅ Successfully joined the project!');
      setJoinId('');

      // redirect to that project after 1 sec
      setTimeout(() => router.push(`/dashboard/projects/${joinId}`), 1000);
    } catch (err) {
      console.error('Error joining project:', err);
      setJoinMessage('⚠️ Error joining project.');
    } finally {
      setJoinLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-blue-50 to-blue-100 text-blue-900">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-extrabold mb-6 text-center text-blue-700">
          🚀 Create or Join a Project
        </h1>
        <p className="text-center text-blue-800 mb-10">
          Start something new or join an existing project with its ID.
        </p>

        {/* CREATE PROJECT SECTION */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-md border border-blue-200 p-8 space-y-6 mb-10"
        >
          <h2 className="text-2xl font-bold flex items-center gap-2 text-blue-700 mb-2">
            <PlusCircle className="w-6 h-6 text-blue-600" /> Create a New Project
          </h2>

          <div>
            <label className="block text-sm font-medium mb-2">Project Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg border-blue-300 focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="e.g., AI Resume Builder"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">AI Prompt</label>
            <textarea
              name="aiPrompt"
              value={form.aiPrompt}
              onChange={handleChange}
              required
              rows={4}
              className="w-full p-3 border rounded-lg border-blue-300 focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="Describe what your project should do..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Short Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={2}
              required
              className="w-full p-3 border rounded-lg border-blue-300 focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="A brief overview for your dashboard card."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tech Stack (comma separated)</label>
            <input
              type="text"
              name="techStack"
              value={form.techStack}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg border-blue-300 focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="Next.js, Tailwind, Firebase, OpenAI"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" /> Creating...
              </>
            ) : (
              'Create Project'
            )}
          </button>

          {message && (
            <p className="text-center mt-4 font-medium text-blue-800">{message}</p>
          )}
        </form>

        {/* JOIN PROJECT SECTION */}
        <form
          onSubmit={handleJoinProject}
          className="bg-white rounded-2xl shadow-md border border-green-200 p-8 space-y-6"
        >
          <h2 className="text-2xl font-bold flex items-center gap-2 text-green-700 mb-2">
            <Users className="w-6 h-6 text-green-600" /> Join an Existing Project
          </h2>

          <div>
            <label className="block text-sm font-medium mb-2">Enter Project ID</label>
            <input
              type="text"
              value={joinId}
              onChange={(e) => setJoinId(e.target.value)}
              required
              className="w-full p-3 border rounded-lg border-green-300 focus:ring-2 focus:ring-green-400 outline-none"
              placeholder="Paste the Project ID here"
            />
          </div>

          <button
            type="submit"
            disabled={joinLoading}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 flex items-center justify-center"
          >
            {joinLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" /> Joining...
              </>
            ) : (
              'Join Project'
            )}
          </button>

          {joinMessage && (
            <p className="text-center mt-4 font-medium text-green-800">{joinMessage}</p>
          )}
        </form>
      </div>
    </div>
  );
}
