/**
 * File Description: Board's details page
 * Updated Date: 25/08/2024
 * Contributors: Samuel
 * Version: 1.4
 */

import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {useSubscribe, useTracker} from 'meteor/react-meteor-data';
import {BoardCollection} from '/imports/api/collections/board';
import {TaskCollection} from '/imports/api/collections/task';
import {TeamCollection} from '/imports/api/collections/team';
import TaskCard from '/imports/ui/components/general/cards/TaskCard';
import './ViewBoard.css';
import Button from "/imports/ui/components/general/buttons/Button";
import BaseUrlPath from "/imports/ui/enums/BaseUrlPath";
import {getUserInfo} from "/imports/ui/components/util";
import TaskModal from "../../general/modal/TaskModal";
import UserCollection from "../../../../api/collections/user";
import {addIcon, backLeftArrow, logsIcon, settingsIcon} from "../../icons";

const ViewBoardPage = () => {
    const {teamId, boardId} = useParams();
    const navigate = useNavigate();

    // Fetching user information
    const userInfo = getUserInfo();

    // Handlers for opening and closing team creation modal
    const [selectedTaskId, setSelectedTaskId] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    const onOpenModal = (event, taskId) => {
        event ? event.preventDefault() : null;
        if (taskId) {
            setSelectedTaskId(taskId);
        } else {
            setSelectedTaskId(null);
        }
        setModalOpen(true);
    };

    const onCloseModal = () => {
        setSelectedTaskId(null);
        setModalOpen(false);
    };

    // Fetching the team data
    const isLoadingTeam = useSubscribe('specific_team', teamId);
    const teamData = useTracker(() => {
        return TeamCollection.findOne({_id: teamId});
    });

    // Fetching the board details, including boardStatuses
    const isLoadingBoard = useSubscribe('specific_board', boardId);
    const boardData = useTracker(() => {
        return BoardCollection.findOne({_id: boardId});
    });

    // Fetching the tasks for the board
    const isLoadingTasks = useSubscribe('all_board_tasks', boardId);
    const tasksData = useTracker(() => {
        // Sort tasks by taskPinnedDate (pinned tasks first)
        return TaskCollection.find({boardId: boardId}, {sort: {taskPinnedDate: -1}}).fetch();
    });

    const isLoadingUsers = useSubscribe('all_users');
    const teamMembersData = useTracker(() => {
        return UserCollection.find({"emails.address": {$in: teamData ? teamData.teamMembers : []}}).fetch();
    });

    const isLoading = isLoadingTeam() || isLoadingBoard() || isLoadingTasks() || isLoadingUsers();

    // Function to filter tasks by status
    const filterTasksByStatus = (statusName) => {
        return tasksData.filter(task => task.statusName === statusName);
    };

    const handleBackClick = () => {
        navigate(`/teams/${teamId}`);
    };

    const handleManageBoardClick = () => {
        navigate('settings');
    };

    // useEffect to handle hash in URL and open the modal
    useEffect(() => {
        if (!isLoading && window.location.hash) {
            const taskIdFromHash = window.location.hash.substring(1);
            if (taskIdFromHash && taskIdFromHash !== selectedTaskId) {
                onOpenModal(null, taskIdFromHash);
                window.location.hash = '#';
            }
        }
    }, [isLoading, selectedTaskId]);

    // Check if data has loaded
    if (!isLoading) {

        // check user is in the team
        if (!teamData || !teamData.teamMembers.includes(userInfo.email)) {
            // user is not in team, or team does not exist, move them back to their teams list
            navigate('/' + BaseUrlPath.TEAMS);
        } else if (!boardData || teamId !== boardData.teamId) {
            // board does not exist OR not belong to that team, but team does
            navigate('/' + BaseUrlPath.TEAMS + '/' + teamId);
        }

        return (
            <>
                <TaskModal isOpen={modalOpen}
                           onClose={onCloseModal}
                           boardId={boardId}
                           taskId={selectedTaskId}
                           tagsData={boardData.boardTags}
                           statusesData={boardData.boardStatuses}
                           membersData={teamMembersData}
                />
                <div className="viewboard-container">
                    <Button className="btn-back flex flex-row gap-2 position-absolute" onClick={handleBackClick}>
                        {backLeftArrow}
                        Team
                    </Button>
                    <div className="viewboard-top-right-buttons">
                        <Button className="btn-light-grey view-button" onClick={handleManageBoardClick}>{settingsIcon} Manage Board</Button>
                        <Button className="btn-light-grey view-button" onClick={() => navigate(`/teams/${teamId}/logs/${boardId}`)}>{logsIcon} View Logs</Button>
                    </div>
                    <h1>Board: {boardData.boardName}</h1>
                    <div className="viewboard-board" style={{display: 'flex', overflowX: 'auto'}}>
                        {boardData.boardStatuses && boardData.boardStatuses.length > 0 ? (
                            boardData.boardStatuses.sort((a, b) => a.statusOrder - b.statusOrder).map((status) => (
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
                                            boardTags={boardData.boardTags}
                                            onClick={(e) => onOpenModal(e, task._id)}
                                        />
                                    ))}
                                </div>
                            ))
                        ) : (
                            <div>No statuses available</div>  // Fallback if boardStatuses array is empty
                        )}
                    </div>
                    <div className="button-group-col btn-submit">
                        <Button className="btn-grey" onClick={onOpenModal}>
                            {addIcon} Add Task
                        </Button>
                    </div>
                </div>
            </>
        );
    }

    return <div>Loading...</div>;
};

export default ViewBoardPage;
