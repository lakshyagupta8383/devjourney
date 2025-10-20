"use client";

import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../lib/firebase";

export default function AddProjectModal() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");

  const handleAdd = async () => {
    if (!title) return;
    const user = auth.currentUser;
    if (!user) return alert("Login first!");

    await addDoc(collection(db, "users", user.uid, "projects"), {
      title,
      description: "",
      status: "idea",
      tags: [],
      skills: [],
      createdBy: user.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    setTitle("");
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded-xl shadow"
      >
        + Add Project
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl w-96">
            <h2 className="font-bold mb-3">New Project</h2>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border w-full p-2 rounded mb-4"
              placeholder="Project title"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setOpen(false)}>Cancel</button>
              <button
                onClick={handleAdd}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
