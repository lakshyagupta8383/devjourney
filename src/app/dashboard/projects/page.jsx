"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, getDocs } from "firebase/firestore";
import Link from "next/link";
import { Loader2, Folder, LogOut } from "lucide-react";

export default function ProjectsPage() {
  const { user, logout } = useAuth(); // ✅ include logout from AuthContext
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) return;
      try {
        const q = query(collection(db, "projects"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((p) => p.members && Object.keys(p.members).includes(user.uid));
        setProjects(data);
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [user]);

  // ✅ Logout handler
  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/"; // redirect to homepage or login
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin w-6 h-6 text-blue-600" />
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 text-blue-900 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header with Logout */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-blue-700 flex items-center gap-2">
            <Folder className="w-6 h-6 text-blue-600" /> My Projects
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>

        {projects.length === 0 ? (
          <p className="text-blue-800">
            No projects yet. Start one from your dashboard!
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/dashboard/projects/${project.id}`}
                className="p-5 bg-white border border-blue-200 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-transform"
              >
                <h2 className="text-xl font-semibold text-blue-700 mb-2">
                  {project.name}
                </h2>
                <p className="text-blue-800 text-sm mb-2 line-clamp-2">
                  {project.description}
                </p>
                <p className="text-xs text-blue-600">
                  Role:{" "}
                  {project.members[user.uid] === "leader" ? "Leader" : "Member"}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
