'use client';
import { Draggable } from '@hello-pangea/dnd';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function TaskCard({ task, index, isLeader, members, projectId, showAssign, usersMap }) {
  const [assigning, setAssigning] = useState(false);
  const [selected, setSelected] = useState(task?.assignedTo || '');

  useEffect(() => {
    setSelected(task?.assignedTo || '');
  }, [task?.assignedTo, task?.id]);

  const handleAssign = async (uid) => {
    setAssigning(true);
    setSelected(uid || '');
    try {
      const taskRef = doc(db, 'projects', projectId, 'tasks', task.id);
      await updateDoc(taskRef, { assignedTo: uid || '' });
    } catch (err) {
      console.error('Error assigning task:', err);
      alert('❌ Failed to assign task.');
      setSelected(task?.assignedTo || '');
    } finally {
      setAssigning(false);
    }
  };

  const assignedName =
    selected && usersMap?.[selected]
      ? usersMap[selected]
      : selected
      ? selected
      : '';

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`p-3 rounded-xl border bg-white shadow-sm hover:shadow-md transition ${
            snapshot.isDragging ? 'opacity-80' : ''
          }`}
        >
          <h3 className="font-semibold text-blue-700">{task.title}</h3>
          <p className="text-sm text-blue-800">{task.description}</p>

          <p className="text-xs mt-2 text-blue-600">
            {assignedName ? (
              <>
                Assigned to:{' '}
                <span className="font-semibold">
                  {assignedName}
                </span>
              </>
            ) : (
              <span className="italic text-gray-500">Unassigned</span>
            )}
          </p>

          {isLeader && showAssign && (
            <div className="mt-3">
              <select
                value={selected}
                onChange={(e) => handleAssign(e.target.value)}
                disabled={assigning}
                className="w-full text-sm border border-blue-300 rounded-lg px-2 py-1 focus:ring focus:ring-blue-200"
              >
                <option value="">Unassign / Assign to...</option>
                {members &&
                  Object.entries(members).map(([uid, role]) => (
                    <option key={uid} value={uid}>
                      {usersMap?.[uid] || uid} {role ? `(${role})` : ''}
                    </option>
                  ))}
              </select>

              {assigning && (
                <div className="flex justify-center mt-2">
                  <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
}
