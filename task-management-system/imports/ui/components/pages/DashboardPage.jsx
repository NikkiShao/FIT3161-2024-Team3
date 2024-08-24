import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscribe, useTracker } from 'meteor/react-meteor-data';
import TaskCard from "../../components/general/cards/TaskCard";
import { TaskCollection } from '/imports/api/collections/task';
import { BoardCollection } from '/imports/api/collections/board';
import { TeamCollection } from '/imports/api/collections/team';
import './DashboardPage.css';
import { getUserInfo } from "/imports/ui/components/util";

export const DashboardPage = () => {
    const userInfo = getUserInfo();
    const [pinToggle, setPinToggle] = useState(false);
    const navigate = useNavigate();

    // Manages the pin changes ensuring it doesn't revert to its previous state
    const handlePinChange = useCallback(() => {
        setPinToggle(prevState => !prevState);
    }, []);

    // Fetching the user's teams
    const isLoadingTeams = useSubscribe('all_user_teams');
    const teamsData = useTracker(() => {
        return TeamCollection.find({ teamMembers: userInfo.email }).fetch();
    }, [userInfo.email]);

    // Memoise the team IDs to avoid unnecessary re-renders
    const teamIds = useMemo(() => teamsData.map(team => team._id), [teamsData]);

    // Fetch the boards from the subscribed publication
    const isLoadingBoards = useSubscribe('all_teams_boards', teamIds);
    const boards = useTracker(() => {
        return BoardCollection.find({ teamId: { $in: teamIds } }).fetch();
    }, [teamIds]);

    // Create a mapping from boardId to teamId
    const boardToTeamMap = useMemo(() => {
        return boards.reduce((acc, board) => {
            acc[board._id] = board.teamId;
            return acc;
        }, {});
    }, [boards]);

    // Memoise board IDs and tags to avoid unnecessary re-renders
    const boardIds = useMemo(() => boards.map(board => board._id), [boards]);
    const boardTags = useMemo(() => {
        return boards.reduce((acc, board) => {
            acc[board._id] = board.boardTags || [];
            return acc;
        }, {});
    }, [boards]);

    // Fetch all pinned tasks from the boards the user is part of
    const isLoadingTasks = useSubscribe('pinned_tasks');
    const pinnedTasks = useTracker(() => {
        return TaskCollection.find({
            boardId: { $in: boardIds },
            taskIsPinned: true
        }, {
            sort: { taskPinnedDate: -1 }
        }).fetch();
    }, [boardIds, pinToggle]);

    const isLoading = isLoadingTeams() || isLoadingBoards() || isLoadingTasks();

    if (!isLoading) {
        return (
            <div className="dashboard-pinned-container">
                <div className="dashboard-pinned-column">
                    <h2 className="dashboard-column-title">Pinned</h2>
                    {pinnedTasks.length > 0 &&
                        pinnedTasks.map((task) => (
                            <TaskCard
                                key={task._id}
                                taskId={task._id}
                                taskName={task.taskName}
                                taskDeadlineDate={task.taskDeadlineDate}
                                statusName={task.statusName}
                                taskIsPinned={task.taskIsPinned}
                                tagNames={task.tagNames}
                                boardId={task.boardId}
                                boardTags={boardTags[task.boardId]}
                                onDashboard={true}
                                onPinChange={handlePinChange}
                                onClick={() => {
                                    const teamId = boardToTeamMap[task.boardId];
                                    navigate(`/teams/${teamId}/boards/${task.boardId}#${task._id}`);
                                }}
                            />
                        ))
                    }
                </div>
            </div>
        );
    }

    return <div>Loading...</div>;
};

export default DashboardPage;
