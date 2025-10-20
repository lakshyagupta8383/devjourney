'use client';

import { useEffect, useState } from "react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import ProjectColumn from "./ProjectColumn";
import AddProjectModal from "./AddProjectModal";
import ProtectedWrapper from "./ProtectedWrapper";

export default function ProjectBoard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user) {
        setProjects([]);
        setLoading(false);
        return;
      }

      const projectsRef = collection(db, "users", user.uid, "projects");
      const unsubFirestore = onSnapshot(projectsRef, (snapshot) => {
        setProjects(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      });

      return () => unsubFirestore();
    });

    return () => unsubscribeAuth();
  }, []);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = async ({ active, over }) => {
    if (!over) return;
    const user = auth.currentUser;
    if (!user) return;

    const projectRef = doc(db, "users", user.uid, "projects", active.id);
    await updateDoc(projectRef, { status: over.id, updatedAt: new Date() });
  };

  const grouped = projects.reduce(
    (acc, project) => {
      acc[project.status]?.push(project);
      return acc;
    },
    { idea: [], "in-progress": [], completed: [] }
  );

  return (
    <ProtectedWrapper>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Projects Board</h1>
          <AddProjectModal />
        </div>

        {loading ? (
          <div className="grid grid-cols-3 gap-4">
            {["Idea", "In Progress", "Completed"].map((col, i) => (
              <div key={i} className="bg-gray-100 rounded-2xl p-4 animate-pulse h-[400px]">
                <h2 className="font-bold mb-2">{col}</h2>
              </div>
            ))}
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ProjectColumn status="idea" projects={grouped.idea} />
              <ProjectColumn status="in-progress" projects={grouped["in-progress"]} />
              <ProjectColumn status="completed" projects={grouped.completed} />
            </div>
          </DndContext>
        )}
      </div>
    </ProtectedWrapper>
  );
}
