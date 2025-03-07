/**
 * File Description: Dashboard page
 * File version: 1.3
 * Contributors: Samuel, Nikki
 */

import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscribe, useTracker } from 'meteor/react-meteor-data';
import Spinner from "react-bootstrap/Spinner";
import { TaskCollection } from '/imports/api/collections/task';
import { BoardCollection } from '/imports/api/collections/board';
import { TeamCollection } from '/imports/api/collections/team';
import TaskCard from "/imports/ui/components/general/cards/TaskCard";
import HoverTip from "../../general/hoverTip/HoverTip";
import './dashboard.css';
import { helpQuestionIcon } from "../../icons";

const PinnedTasks = ({ userInfo }) => {
    const [pinToggle, setPinToggle] = useState(false);
    const navigate = useNavigate();

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

    // for help hover
    const helpText = "This section shows the tasks you have pinned on any of your boards.";

    const isLoading = isLoadingTeams() || isLoadingBoards() || isLoadingTasks();

    if (!isLoading) {
        return (
            <div className="background-base dashboard-item dashboard-pinned-column">
                <HoverTip icon={helpQuestionIcon}
                          toolTipText={helpText}
                          divClassName={"page-help-tip"}
                          textClassname
                />

                <h2 className="dashboard-column-title">Pinned</h2>
                {pinnedTasks.length > 0 ?
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
                            onPinChange={handlePinChange}
                            onClick={() => {
                                const teamId = boardToTeamMap[task.boardId];
                                navigate(`/teams/${teamId}/boards/${task.boardId}#${task._id}`);
                            }}
                        />
                    )) :
                    <span className={"main-text text-grey non-clickable"}>
                        You don't have any pinned tasks.
                    </span>
                }
            </div>
        );
    } else {
        return (
            <div className="background-base dashboard-pinned-column">
            <Spinner animation="border" variant="secondary" role="status"/>
            </div>
        )
    }
};

export default PinnedTasks;
