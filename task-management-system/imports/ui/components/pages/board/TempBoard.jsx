/**
 * File Description: temp page
 * Contributors: Nikki
 * Version: 1.0
 */

import React, {useState} from 'react';
import {useParams} from "react-router-dom";
import {useSubscribe, useTracker} from "meteor/react-meteor-data";

import TaskCollection from "../../../../api/collections/task";
import UserCollection from "../../../../api/collections/user";
import TeamCollection from "../../../../api/collections/team";
import BoardCollection from "../../../../api/collections/board";

import WhiteBackground from "../../general/whiteBackground/WhiteBackground";
import PageLayout from "../../../enums/PageLayout";
import Card from "../../general/cards/Card";
import Button from "/imports/ui/components/general/buttons/Button.jsx";
import TaskModal from "../../general/modal/TaskModal";
import Spinner from "react-bootstrap/Spinner";


/**
 * Non-existent page component
 */
export const TempBoard = () => {

    // get url parameter
    const {boardId} = useParams();
    const {teamId} = useParams();

    // Handlers for opening and closing team creation modal
    const [selectedTaskId, setSelectedTaskId] = useState(null);

    const [modalOpen, setModalOpen] = useState(false);
    const onOpenModal = (event, taskId) => {
        event.preventDefault();

        if (taskId) {
            setSelectedTaskId(taskId)
        } else {
            setSelectedTaskId(null)
        }
        setModalOpen(true)
    };

    const onCloseModal = () => {
        setSelectedTaskId(null)
        setModalOpen(false)
    };

    const isLoadingBoard = useSubscribe('specific_board', boardId);
    const isLoadingTasks = useSubscribe('all_board_tasks', boardId);
    const isLoadingUsers = useSubscribe('all_users');
    const isLoadingTeam = useSubscribe('specific_team', teamId);

    const isLoading = isLoadingBoard() || isLoadingTasks() || isLoadingUsers() || isLoadingTeam();

    // get data from db
    let boardData = useTracker(() => {
        return BoardCollection.find({_id: boardId}).fetch()[0];
    });

    let tasksData = useTracker(() => {
        return TaskCollection.find({boardId: boardId}).fetch();
    });

    let teamData = useTracker(() => {
        return TeamCollection.find({_id: teamId}).fetch()[0];
    });

    const teamMembersData = useTracker(() => {
        return UserCollection.find({"emails.address": {$in: teamData? teamData.teamMembers : []}}).fetch();
    });

    if (!isLoading) {

        return (
            <WhiteBackground pageLayout={PageLayout.LARGE_CENTER}>
                <h1>Board TEMP</h1>

                {
                    tasksData?
                        tasksData.map(
                            (task) =>
                                <Card onClick={(e) => {onOpenModal(e, task._id)}}>
                                    <div>name: {task.taskName}</div>
                                    <div>tags: {task.tagNames}</div>
                                    <div>status: {task.statusName}</div>
                                    <div>desc: {task.taskDesc}</div>
                                </Card>
                        ) : null
                }

                <Button className="btn-brown" onClick={onOpenModal}>+ Add Task</Button>
                <TaskModal isOpen={modalOpen}
                           onClose={onCloseModal}
                           boardId={boardId}
                           taskId={selectedTaskId}
                           tagsData={boardData.tags}
                           statusesData={boardData.statuses}
                           membersData={teamMembersData}
                />
            </WhiteBackground>
        )

    } else {
        return (
            <WhiteBackground pageLayout={PageLayout.LARGE_CENTER}>
                <Spinner animation="border" variant="secondary" role="status"/>
            </WhiteBackground>
        )
    }
}

export default TempBoard;