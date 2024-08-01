import React from 'react';
import TaskCard from './TaskCard';

const TaskCardTesting = () => {
  const dummyTask = {
    taskId: '1',
    taskName: 'Sample Task',
    taskDeadline: new Date().toISOString(),
    taskStatus: 'To Do',
    isPinned: false,
    tags: [
      { tagName: 'urgent', tagColour: '#ff0000' },
      { tagName: 'backend', tagColour: '#00ff00' },
    ],
    boardId: 'defaultBoardId',
    onDashboard: true,
  };

  return (
    <div>
      <h1>Task Card Test</h1>
      <TaskCard {...dummyTask} />
    </div>
  );
};

export default TaskCardTesting;
