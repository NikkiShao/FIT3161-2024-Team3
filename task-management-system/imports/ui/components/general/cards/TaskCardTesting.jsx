import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import TaskCard from './TaskCard';
import { TaskCollection } from '/imports/api/collections/task.js';

const TaskCardTesting = () => {
  const { tasks, isLoading } = useTracker(() => {
    const tasksHandle = Meteor.subscribe('tasks');
    const isLoading = !tasksHandle.ready();
    const tasks = TaskCollection.find().fetch();
    return { tasks, isLoading };
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Task Card Test</h1>
      {tasks.map(task => (
        <TaskCard
          key={task._id._str}
          taskId={task._id._str}
          taskName={task.taskName}
          taskDeadline={task.taskDeadlineDate}
          taskStatus={task.status}
          isPinned={task.taskIsPinned}
          tags={task.tagNames.map(tag => ({ tagName: tag, tagColour: '#ff0000' }))}
          boardId={task.boardId}
          onDashboard={true}
        />
      ))}
    </div>
  );
};

export default TaskCardTesting;
