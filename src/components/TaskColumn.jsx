'use client';
import { Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';

export default function TaskColumn({
  title,
  color,
  droppableId,
  tasks,
  isLeader,
  members,
  projectId,
  onAddTask,
  usersMap, // ✅ added
}) {
  const colorMap = {
    blue: 'border-blue-200 bg-blue-50',
    yellow: 'border-yellow-200 bg-yellow-50',
    green: 'border-green-200 bg-green-50',
  };

  return (
    <div className={`p-4 rounded-2xl shadow-md border ${colorMap[color]} flex flex-col`}>
      <div className="flex items-center justify-between mb-4">
        <h2
          className={`text-lg font-semibold ${
            color === 'blue' ? 'text-blue-700' : color === 'yellow' ? 'text-yellow-700' : 'text-green-700'
          }`}
        >
          {title}
        </h2>

        {isLeader && onAddTask && (
          <button
            onClick={() => onAddTask(droppableId)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            + Add
          </button>
        )}
      </div>

      <Droppable droppableId={droppableId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 space-y-3 min-h-[150px] rounded-xl transition ${
              snapshot.isDraggingOver ? 'bg-blue-100' : ''
            }`}
          >
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                isLeader={isLeader}
                members={members}
                projectId={projectId}
                showAssign={droppableId === 'pending'}
                usersMap={usersMap} // ✅ pass users map
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
