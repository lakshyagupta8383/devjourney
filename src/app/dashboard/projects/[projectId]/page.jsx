"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  collection,
  onSnapshot,
  updateDoc,
  query,
  where,
  arrayUnion,
  arrayRemove,
  addDoc,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import {
  Loader2,
  Bookmark,
  BookmarkCheck,
  Users,
  UserPlus,
  Info,
} from "lucide-react";
import { DragDropContext } from "@hello-pangea/dnd";
import TaskColumn from "@/components/TaskColumn";

export default function ProjectDetailsPage() {
  const { projectId } = useParams();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [usersMap, setUsersMap] = useState({}); // ✅ stores UID → name/email
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!user || !projectId) return;

    const projectRef = doc(db, "projects", projectId);
    const tasksRef = collection(projectRef, "tasks");

    const unsubProject = onSnapshot(projectRef, (snap) => {
      if (snap.exists()) {
        setProject({ id: snap.id, ...snap.data() });
      }
    });

    const unsubTasks = onSnapshot(tasksRef, (snapshot) => {
      const liveTasks = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setTasks(liveTasks);
      setLoading(false);
    });

    return () => {
      unsubProject();
      unsubTasks();
    };
  }, [user, projectId]);

  // ✅ Fetch usernames from Firestore
// ✅ Fetch usernames for *only members* of this project
useEffect(() => {
  const fetchProjectUsers = async () => {
    if (!project?.members) return;

    try {
      const memberUids = Object.keys(project.members);
      if (memberUids.length === 0) return;

      const q = query(collection(db, "users"), where("uid", "in", memberUids));
      const snap = await getDocs(q);

      const map = {};
      snap.docs.forEach((doc) => {
        const data = doc.data();
        map[data.uid] = data.name || data.email || "Unknown User";
      });

      setUsersMap(map);
    } catch (err) {
      console.error("Error fetching member names:", err);
    }
  };

  fetchProjectUsers();
}, [project]);


  // ✅ Bookmark toggle
  const toggleBookmark = async () => {
    if (!user) return;
    try {
      const userRef = doc(db, "users", user.uid);
      if (isSaved) {
        await updateDoc(userRef, { bookmarkedProjects: arrayRemove(projectId) });
        setIsSaved(false);
      } else {
        await updateDoc(userRef, { bookmarkedProjects: arrayUnion(projectId) });
        setIsSaved(true);
      }
    } catch (err) {
      console.error("Error updating bookmarks:", err);
    }
  };

  // ✅ Add team member
  const handleAddMember = async () => {
    if (!newMemberEmail.trim() || !project) return;
    setAdding(true);
    setError("");
    setSuccess("");

    try {
      const q = query(collection(db, "users"), where("email", "==", newMemberEmail));
      const snap = await getDocs(q);

      if (snap.empty) {
        setError("No user found with that email.");
        setAdding(false);
        return;
      }

      const newMember = snap.docs[0].data();
      const memberUid = newMember.uid;

      if (project.members && project.members[memberUid]) {
        setError("User already in the team.");
        setAdding(false);
        return;
      }

      const projectRef = doc(db, "projects", projectId);
      const updatedMembers = {
        ...project.members,
        [memberUid]: "member",
      };

      await updateDoc(projectRef, { members: updatedMembers });
      setProject((prev) => ({ ...prev, members: updatedMembers }));
      setNewMemberEmail("");
      setSuccess("Member added successfully!");
    } catch (err) {
      console.error("Error adding member:", err);
      setError("Something went wrong while adding member.");
    } finally {
      setAdding(false);
    }
  };

  // ✅ Add new task
  const handleAddTask = async (status) => {
    const title = prompt("📝 Enter task title:");
    if (!title) return;
    const description = prompt("💬 Enter task description:") || "";

    try {
      const projectRef = doc(db, "projects", projectId);
      const tasksRef = collection(projectRef, "tasks");
      await addDoc(tasksRef, {
        title,
        description,
        status,
        assignedTo: "",
        createdAt: serverTimestamp(),
      });
      alert("✅ Task added successfully!");
    } catch (err) {
      console.error("Error adding task:", err);
      alert("❌ Failed to add task.");
    }
  };

  // ✅ Drag and Drop
  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;

    try {
      const taskRef = doc(db, "projects", projectId, "tasks", draggableId);
      await updateDoc(taskRef, { status: destination.droppableId });
      console.log(`✅ Task moved to ${destination.droppableId}`);
    } catch (err) {
      console.error("Error updating task status:", err);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin w-6 h-6 text-blue-600" />
      </div>
    );

  if (!project)
    return (
      <div className="flex justify-center items-center min-h-screen text-blue-800">
        Project not found.
      </div>
    );

  const isLeader = project?.members?.[user?.uid] === "leader";
  const pendingTasks = tasks.filter((t) => t.status === "pending");
  const inProgressTasks = tasks.filter((t) => t.status === "inprogress");
  const completedTasks = tasks.filter((t) => t.status === "completed");

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 text-blue-900 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-blue-700 mb-2">
              {project.name}
            </h1>
            <p className="text-blue-800 mb-2">{project.description}</p>
            <p className="text-sm text-blue-600">
              Tech Stack: {project.techStack?.join(", ") || "—"}
            </p>
          </div>

          <button
            onClick={toggleBookmark}
            className="p-2 rounded-lg hover:bg-blue-100 transition-colors"
          >
            {isSaved ? (
              <BookmarkCheck className="w-6 h-6 text-blue-600" />
            ) : (
              <Bookmark className="w-6 h-6 text-blue-600" />
            )}
          </button>
        </div>

        {/* Instruction Banner */}
        <div className="flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg shadow-sm mb-6">
          <Info className="w-5 h-5" />
          <p className="text-sm font-medium">
            You can drag and drop tasks between columns to update their status in real time.
          </p>
        </div>

        {/* Task Board */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <TaskColumn
              title="🕓 Pending"
              color="blue"
              droppableId="pending"
              tasks={pendingTasks}
              isLeader={isLeader}
              members={project.members}
              projectId={project.id}
              onAddTask={handleAddTask}
            />
            <TaskColumn
              title="⚙️ In Progress"
              color="yellow"
              droppableId="inprogress"
              tasks={inProgressTasks}
              isLeader={isLeader}
              members={project.members}
              projectId={project.id}
              onAddTask={handleAddTask}
            />
            <TaskColumn
              title="✅ Completed"
              color="green"
              droppableId="completed"
              tasks={completedTasks}
              isLeader={isLeader}
              members={project.members}
              projectId={project.id}
              onAddTask={handleAddTask}
            />
          </div>
        </DragDropContext>

        {/* Team Section */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-blue-200">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-blue-700 mb-4">
            <Users className="w-6 h-6 text-blue-600" /> Team Members
          </h2>

          {project.members ? (
            <ul className="space-y-2 mb-6">
              {Object.entries(project.members).map(([uid, role]) => (
                <li
                  key={uid}
                  className="flex justify-between bg-blue-50 px-4 py-2 rounded-lg text-blue-800"
                >
                  <span>{usersMap[uid] || "Unknown User"}</span>
                  <span className="text-sm text-blue-700 font-medium">
                    {role}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-blue-600">No team members yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
