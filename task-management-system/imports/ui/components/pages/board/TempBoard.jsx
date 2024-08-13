/**
 * File Description: temp page
 * Contributors: Nikki
 * Version: 1.0
 */

import React, {useState} from 'react';
import WhiteBackground from "../../general/whiteBackground/WhiteBackground";
import PageLayout from "../../../enums/PageLayout";
import TaskModal from "../../general/modal/TaskModal";
import Button from "/imports/ui/components/general/buttons/Button.jsx";
import {useParams} from "react-router-dom";
import {useSubscribe, useTracker} from "meteor/react-meteor-data";
import TaskCollection from "../../../../api/collections/task";
import StatusCollection from "../../../../api/collections/status";
import TagCollection from "../../../../api/collections/tag";
import Card from "../../general/cards/Card";
import UserCollection from "../../../../api/collections/user";
import TeamCollection from "../../../../api/collections/team";


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

        console.log("AAAAAAAAA")
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

    console.log(modalOpen)

    const isLoadingTasks = useSubscribe('all_board_tasks', boardId);
    const isLoadingUsers = useSubscribe('all_users');
    const isLoadingTeam = useSubscribe('specific_team', teamId);

    const isLoadingBoardStatuses = useSubscribe('all_board_statuses', boardId);
    const isLoadingBoardTags = useSubscribe('all_board_tags', boardId);

    const isLoading = isLoadingTasks() || isLoadingBoardStatuses() || isLoadingBoardTags() || isLoadingUsers() || isLoadingTeam();

    // get data from db
    let tasksData = useTracker(() => {
        return TaskCollection.find({boardId: boardId}).fetch();
    });

    let teamData = useTracker(() => {
        return TeamCollection.find({_id: teamId}).fetch()[0];
    });

    const teamMembersData = useTracker(() => {
        return UserCollection.find({"emails.address": {$in: teamData? teamData.teamMembers : []}}).fetch();
    });

    let statusesData = useTracker(() => {
        return StatusCollection.find({boardId: boardId}).fetch();
    });
    let tagsData = useTracker(() => {
        return TagCollection.find({boardId: boardId}).fetch();
    });

    if (!isLoading) {

        // console.log("task data", tasksData);
        // console.log("statusesData", statusesData);
        // console.log("tagsData", tagsData);
        // console.log(teamMembersData)
        // console.log(teamData)

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
                           tagsData={tagsData}
                           statusesData={statusesData}
                           membersData={teamMembersData}
                />
            </WhiteBackground>
        )

    }
}

export default TempBoard;