"use client";

import { useDraggable } from "@dnd-kit/core";
import { useRouter } from "next/navigation";
import { db, auth } from "../lib/firebase";
import { doc, deleteDoc } from "firebase/firestore";

export default function ProjectCard({ project }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: project.id });
  const router = useRouter();

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    cursor: isDragging ? "grabbing" : "grab",
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    const user = auth.currentUser;
    if (!user) return;

    await deleteDoc(doc(db, "users", user.uid, "projects", project.id));
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="bg-white shadow-md rounded-xl p-3 mb-3 border relative"
    >
      <div
        className="cursor-pointer"
        onClick={() => !isDragging && router.push(`/projects/${project.id}`)}
      >
        <h3 className="font-semibold">{project.title}</h3>
        <p className="text-sm text-gray-500">{project.description}</p>
      </div>

      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold"
      >
        ×
      </button>
    </div>
  );
}
