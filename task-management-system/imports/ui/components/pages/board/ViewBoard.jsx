import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { BoardCollection } from '/imports/api/collections/board';
import { TaskCollection } from '/imports/api/collections/task';
import TaskCard from '/imports/ui/components/general/cards/TaskCard';
import './ViewBoard.css';
import { ChevronLeftIcon } from "@heroicons/react/24/outline";

const ViewBoardPage = () => {
    const { teamId, boardId } = useParams();
    const navigate = useNavigate();

    // Fetching the board name
    const { boardName } = useTracker(() => {
        const subscription = Meteor.subscribe('all_boards');
        if (!subscription.ready()) {
            return { boardName: 'Loading...' };
        }
        const board = BoardCollection.findOne({ _id: boardId });
        return { boardName: board ? board.boardName : 'Board not found' };
    }, [boardId]);

    // Fetching the tasks for the board
    const tasks = useTracker(() => {
        const subscription = Meteor.subscribe('tasks_for_board', boardId);
        if (!subscription.ready()) {
            return [];
        }
        return TaskCollection.find({ boardId }).fetch();
    }, [boardId]);

    // Categorising tasks based on their status
    const toDoTasks = tasks.filter(task => task.statusName === 'To Do');
    const doingTasks = tasks.filter(task => task.statusName === 'Doing');
    const doneTasks = tasks.filter(task => task.statusName === 'Done');

    const handleBackClick = () => {
        navigate(`/teams/${teamId}`);
    };

    return (
        <div className="viewboard-container">
            <button className="btn-back team-back-button" onClick={handleBackClick}>
                <ChevronLeftIcon strokeWidth={2} viewBox="0 0 23 23" width={20} height={20} />
                Team
            </button>
            <div className="viewboard-top-right-buttons">
                <button className="btn-light-grey">Manage Board</button>
                <button className="btn-light-grey">View Logs</button>
            </div>
            <div className="viewboard-title">{boardName}</div>
            <div className="viewboard-board">
                <div className="viewboard-column">
                    <div className="viewboard-column-title">To Do</div>
                    {toDoTasks.map(task => (
                        <TaskCard
                            key={task._id}
                            taskId={task._id}
                            taskName={task.taskName}
                            taskDeadlineDate={task.taskDeadlineDate}
                            statusName={task.statusName}
                            taskIsPinned={task.taskIsPinned}
                            tagNames={task.tagNames}
                            boardId={boardId}
                        />
                    ))}
                </div>
                <div className="viewboard-column">
                    <div className="viewboard-column-title">Doing</div>
                    {doingTasks.map(task => (
                        <TaskCard
                            key={task._id}
                            taskId={task._id}
                            taskName={task.taskName}
                            taskDeadlineDate={task.taskDeadlineDate}
                            statusName={task.statusName}
                            taskIsPinned={task.taskIsPinned}
                            tagNames={task.tagNames}
                            boardId={boardId}
                        />
                    ))}
                </div>
                <div className="viewboard-column">
                    <div className="viewboard-column-title">Done</div>
                    {doneTasks.map(task => (
                        <TaskCard
                            key={task._id}
                            taskId={task._id}
                            taskName={task.taskName}
                            taskDeadlineDate={task.taskDeadlineDate}
                            statusName={task.statusName}
                            taskIsPinned={task.taskIsPinned}
                            tagNames={task.tagNames}
                            boardId={boardId}
                        />
                    ))}
                </div>
            </div>
            <button className="viewboard-add-task-button">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="viewboard-add-icon">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add Task
            </button>
        </div>
    );
};

export default ViewBoardPage;
