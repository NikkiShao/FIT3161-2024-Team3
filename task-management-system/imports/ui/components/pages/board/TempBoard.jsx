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
import ContributionCollection from "../../../../api/collections/contribution";
import StatusCollection from "../../../../api/collections/status";
import TagCollection from "../../../../api/collections/tag";


/**
 * Non-existent page component
 */
export const TempBoard = () => {
    // get url parameter
    const {boardId} = useParams();
    const {teamId} = useParams();

    // Handlers for opening and closing team creation modal
    const [modalOpen, setModalOpen] = useState(false);
    const onOpenModal = () => setModalOpen(true);
    const onCloseModal = () => setModalOpen(false);


    const isLoadingTasks = useSubscribe('all_board_tasks', boardId);
    const isLoadingContributions = useSubscribe('all_board_contributions', boardId);
    const isLoadingBoardStatuses = useSubscribe('all_board_statuses', boardId);
    const isLoadingBoardTags = useSubscribe('all_board_tags', boardId);

    const isLoading = isLoadingTasks() || isLoadingContributions() || isLoadingBoardStatuses() || isLoadingBoardTags();

    // get data from db
    let tasksData = useTracker(() => {
        return TaskCollection.find({boardId: boardId}).fetch();
    });
    let contributionsData = useTracker(() => {
        return ContributionCollection.find({boardId: boardId}).fetch();
    });
    let statusesData = useTracker(() => {
        return StatusCollection.find({boardId: boardId}).fetch();
    });
    let tagsData = useTracker(() => {
        return TagCollection.find({boardId: boardId}).fetch();
    });

    if (!isLoading) {

        console.log("task data", tasksData);
        console.log("contributionsData", contributionsData);
        console.log("statusesData", statusesData);
        console.log("tagsData", tagsData);

        return (
            <WhiteBackground pageLayout={PageLayout.LARGE_CENTER}>
                <h1>Board TEMP</h1>

                <Button className="btn-brown" onClick={onOpenModal}>+ Add Task</Button>
                <TaskModal isOpen={modalOpen}
                           onClose={onCloseModal}
                           boardId={boardId}
                           taskData={null}
                           tagsData={tagsData}
                           statusesData={statusesData}
                />
            </WhiteBackground>
        )

    }
}

export default TempBoard;