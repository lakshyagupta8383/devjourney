'use client';
import { DragDropContext } from '@hello-pangea/dnd';
import TaskColumn from './TaskColumn';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function TaskBoard({ projectId, tasks, setTasks }) {
  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;

    // If dropped in the same column → reorder (optional)
    if (source.droppableId === destination.droppableId) return;

    const updatedTasks = tasks.map((task) =>
      task.id === result.draggableId
        ? { ...task, status: destination.droppableId }
        : task
    );
    setTasks(updatedTasks);

    // Update Firestore
    const taskRef = doc(db, 'projects', projectId, 'tasks', result.draggableId);
    await updateDoc(taskRef, { status: destination.droppableId });
  };

  const pending = tasks.filter((t) => t.status === 'pending');
  const inprogress = tasks.filter((t) => t.status === 'inprogress');
  const completed = tasks.filter((t) => t.status === 'completed');

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TaskColumn
          title="🕓 Pending"
          color="blue"
          droppableId="pending"
          tasks={pending}
        />
        <TaskColumn
          title="⚙️ In Progress"
          color="yellow"
          droppableId="inprogress"
          tasks={inprogress}
        />
        <TaskColumn
          title="✅ Completed"
          color="green"
          droppableId="completed"
          tasks={completed}
        />
      </div>
    </DragDropContext>
  );
}
