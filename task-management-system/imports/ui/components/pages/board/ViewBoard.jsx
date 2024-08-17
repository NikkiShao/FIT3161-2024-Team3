/**
 * File Description: Board's details page
 * Updated Date: 17/08/2024
 * Contributors: Samuel
 * Version: 1.2
 */

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { BoardCollection } from '/imports/api/collections/board';
import { TaskCollection } from '/imports/api/collections/task';
import { TeamCollection } from '/imports/api/collections/team';
import TaskCard from '/imports/ui/components/general/cards/TaskCard';
import './ViewBoard.css';
import { ChevronLeftIcon } from "@heroicons/react/24/outline";

const ViewBoardPage = () => {
    const { teamId, boardId } = useParams();
    const navigate = useNavigate();

    // Fetching user information
    const userInfo = useTracker(() => Meteor.user());

    // Fetching the team data
    const { teamData, isLoading } = useTracker(() => {
        const subscription = Meteor.subscribe('team_by_id', teamId);
        return {
            teamData: TeamCollection.findOne({ _id: teamId }),
            isLoading: !subscription.ready(),
        };
    }, [teamId]);

    // Fetching the board details, including boardStatuses
    const { boardName, boardStatuses } = useTracker(() => {
        const subscription = Meteor.subscribe('all_boards');
        if (!subscription.ready()) {
            return { boardName: 'Loading...', boardStatuses: [] };
        }
        const board = BoardCollection.findOne({ _id: boardId });
        return {
            boardName: board ? board.boardName : 'Board not found',
            boardStatuses: board ? board.boardStatuses : []
        };
    }, [boardId]);

    // Fetching the tasks for the board
    const tasks = useTracker(() => {
        const subscription = Meteor.subscribe('tasks_for_board', boardId);
        if (!subscription.ready()) {
            return [];
        }
        return TaskCollection.find({ boardId }).fetch();
    }, [boardId]);

    // Function to filter tasks by status
    const filterTasksByStatus = (statusName) => {
        return tasks.filter(task => task.statusName === statusName);
    };

    const handleBackClick = () => {
        navigate(`/teams/${teamId}`);
    };

    const handleManageBoardClick = () => {
        navigate('settings');
    };

    // Check if data has loaded
    if (!isLoading) {
        // Check if the user is in the team
        if (teamData && teamData.teamMembers.includes(userInfo?.emails?.[0]?.address)) {

            return (
                <div className="viewboard-container">
                    <button className="btn-back team-back-button" onClick={handleBackClick}>
                        <ChevronLeftIcon strokeWidth={2} viewBox="0 0 23 23" width={20} height={20} />
                        Team
                    </button>
                    <div className="viewboard-top-right-buttons">
                        <button className="btn-light-grey" onClick={handleManageBoardClick}>Manage Board </button>
                        <button className="btn-light-grey">View Logs</button>
                    </div>
                    <div className="viewboard-title"> Board: {boardName}</div>
                    <div className="viewboard-board" style={{ display: 'flex', overflowX: 'auto' }}>
                        {boardStatuses && boardStatuses.length > 0 ? (
                            boardStatuses.sort((a, b) => a.statusOrder - b.statusOrder).map((status) => (
                                <div className="viewboard-column" key={status.statusName}>
                                    <div className="viewboard-column-title">{status.statusName}</div>
                                    {filterTasksByStatus(status.statusName).map(task => (
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
                            ))
                        ) : (
                            <div>No statuses available</div>  // Fallback if boardStatuses array is empty
                        )}
                    </div>
                    <button className="viewboard-add-task-button">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="viewboard-add-icon">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Add Task
                    </button>
                </div>
            );
        } else {
            return <div>You do not have access to this board.</div>;
        }
    }

    return <div>Loading...</div>;
};

export default ViewBoardPage;
