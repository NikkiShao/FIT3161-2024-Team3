/**
 * File Description: Examples page
 * Updated Date: 20/07/2024
 * Contributors: Nikki
 * Version: 1.0
 */

import React from 'react';
import {useSubscribe, useTracker} from "meteor/react-meteor-data";
import Spinner from "react-bootstrap/Spinner";

import WhiteBackground from "../../general/whiteBackground/WhiteBackground.jsx";
import PageLayout from "../../../enums/PageLayout";
import ButtonExamples from "./ButtonExamples";
import CardExamples from "./CardExamples";
import ModalExamples from "./ModalExamples";
import InputExamples from "./InputExamples";
import TableExample from "./TableExample";
import BoardCollection from "../../../../api/collections/board";
import PollCollection from "../../../../api/collections/poll";
import TaskCollection from "../../../../api/collections/task";
import TeamCollection from "../../../../api/collections/team";
import UserCollection from "../../../../api/collections/user";
import HoverTip from "../../general/hoverTip/HoverTip";
import HoverTipExamples from "./HoverTipExamples";

/**
 * Examples page component
 */
export const ExamplesPage = () => {

    //     loads all data here (for testing purposes)
    const isLoadingBoards = useSubscribe('all_boards')
    let boardsData = useTracker(() => {
        return BoardCollection.find().fetch();
    });
    console.log("boardsData", boardsData);

    const isLoadingPolls = useSubscribe('all_polls')
    let pollsData = useTracker(() => {
        return PollCollection.find().fetch();
    });
    console.log("pollsData", pollsData);

    const isLoadingTasks = useSubscribe('all_tasks')
    let tasksData = useTracker(() => {
        return TaskCollection.find().fetch();
    });
    console.log("tasksData", tasksData);

    const isLoadingTeams = useSubscribe('all_teams')
    let teamsData = useTracker(() => {
        return TeamCollection.find().fetch();
    });
    console.log("teamsData", teamsData);

    const isLoadingUsers = useSubscribe('all_users')
    let usersData = useTracker(() => {
        return UserCollection.find().fetch();
    });
    console.log("usersData", usersData);

    const isLoading = isLoadingBoards() || isLoadingPolls() || isLoadingUsers() || isLoadingTeams() || isLoadingTasks();
    console.log(isLoading)


    return (
        <WhiteBackground pageLayout={PageLayout.LARGE_CENTER}>

            <h1>Examples Page</h1>

            <h2> Hover Tip example </h2>
            hover over me:
            <HoverTipExamples />


            <h2>Text Examples</h2>

            <h1> Heading 1 </h1>
            <h2> Heading 2 </h2>
            <span className={"main-text"}>Main text</span>
            <span className={"large-text"}>Large text</span>
            <span className={"small-text"}>Small text</span>
            <span className={"menu-text"}>Menu text</span>
            <span className={"username-text"}>Username text</span>
            <span className={"urgent-text"}>Urgent text</span>

            <h2>Table Example</h2>
            <TableExample/>

            <h2>Card Examples</h2>
            <CardExamples/>

            <h2>Input Examples</h2>
            <InputExamples/>

            <h2>Button Examples</h2>
            <ButtonExamples/>

            <h2>Modal (popup) Example</h2>
            <ModalExamples/>
            <h2>Loading Spinner</h2>
            <Spinner animation="border" variant="secondary" role="status"/>

        </WhiteBackground>
    );
};

export default ExamplesPage;