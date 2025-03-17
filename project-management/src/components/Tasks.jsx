import React, { useState } from "react";

const Tasks = ({ tasks, onToggleComplete, onDeleteTask, onAddTask }) => {
  const [newTask, setNewTask] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      onAddTask(newTask);
      setNewTask("");
    }
  };
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-stone-600 mb-4">Tasks</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task"
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2">
          Add Task
        </button>
      </form>
      <ul>
        {tasks && tasks.length > 0 ? (
          tasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center justify-between mb-2"
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => onToggleComplete(task.id)}
                  className="mr-2"
                />
                <span
                  className={`text-stone-600 ${
                    task.completed ? "line-through" : ""
                  }`}
                >
                  {task.title}
                </span>
              </div>
              <button
                className="text-stone-600 hover:text-red-600"
                onClick={() => onDeleteTask(task.id)}
              >
                Delete
              </button>
            </li>
          ))
        ) : (
          <p className="text-stone-400">No tasks available</p>
        )}
      </ul>
    </div>
  );
};

export default Tasks;
