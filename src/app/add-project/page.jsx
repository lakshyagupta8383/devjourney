"use client";

import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../../lib/firebase"; // include auth
import { useRouter } from "next/navigation";

export default function AddProjectPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "idea",
    tags: "",
    repoUrl: "",
    priority: "medium",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return alert("You must be logged in to add a project!");

    try {
      // Save under the user's projects collection
      const docRef = await addDoc(collection(db, "users", user.uid, "projects"), {
        ...form,
        tags: form.tags.split(",").map((t) => t.trim()),
        fromGitHub: false,
        createdBy: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      console.log("Project added with ID:", docRef.id);
      router.push("/projects"); // redirect to main board
    } catch (err) {
      console.error("Error adding project:", err);
      alert("Error adding project!");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Add New Project</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Project Title"
          required
          className="border rounded px-3 py-2"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Project Description"
          rows={4}
          className="border rounded px-3 py-2"
        />
        <input
          type="text"
          name="tags"
          value={form.tags}
          onChange={handleChange}
          placeholder="Tags (comma separated)"
          className="border rounded px-3 py-2"
        />
        <input
          type="text"
          name="repoUrl"
          value={form.repoUrl}
          onChange={handleChange}
          placeholder="GitHub Repository URL (optional)"
          className="border rounded px-3 py-2"
        />
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="border rounded px-3 py-2"
        >
          <option value="idea">💡 Idea</option>
          <option value="in-progress">⚙️ In Progress</option>
          <option value="completed">✅ Completed</option>
        </select>
        <select
          name="priority"
          value={form.priority}
          onChange={handleChange}
          className="border rounded px-3 py-2"
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white rounded px-4 py-2">
          Add Project
        </button>
      </form>
    </div>
  );
}
