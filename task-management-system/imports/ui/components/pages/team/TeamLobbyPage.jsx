/**
 * File Description: Team lobby page
 * Updated Date: 06/09/2024
 * Contributors: Nikki, Mark
 * Version: 3.0
 */

import React, {useState} from 'react';
import {ChevronLeftIcon, Cog8ToothIcon, PlusIcon} from "@heroicons/react/24/outline"
import {useNavigate, useParams} from "react-router-dom";
import {useSubscribe, useTracker} from "meteor/react-meteor-data";
import Spinner from "react-bootstrap/Spinner";

import TeamCollection from "../../../../api/collections/team";
import BoardCollection from "../../../../api/collections/board";
import PollCollection from "../../../../api/collections/poll";

import WhiteBackground from "../../general/whiteBackground/WhiteBackground";
import PageLayout from "../../../enums/PageLayout";
import Button from "../../general/buttons/Button";
// import Card from "../../general/cards/Card";
import {getUserInfo} from "../../util";
import BaseUrlPath from "../../../enums/BaseUrlPath";
import './team.css'
import BoardCreationModal from "../../general/modal/BoardCreationModal";
import BoardCard from "../../general/cards/BoardCard";
import PollCreationModal from "../../general/modal/PollCreationModal";
import PollCard from "../../general/cards/PollCard.jsx";


export const TeamLobbyPage = () => {
    const navigate = useNavigate()

    // Grab user info from server
    const userInfo = getUserInfo();

    // grab the team ID from the URL
    const {teamId} = useParams();  

    // Handlers for opening and closing creation modals
    const [boardModalOpen, setBoardModalOpen] = useState(false);
    const onOpenBoardModal = () => setBoardModalOpen(true);
    const onCloseBoardModal = () => setBoardModalOpen(false);

    const [pollModalOpen, setPollModalOpen] = useState(false);
    const onOpenPollModal = () => setPollModalOpen(true);
    const onClosePollModal = () => setPollModalOpen(false);

    // variables for poll filters
    const availableFilters = ['all', 'open', 'closed'];
    const [selectedPollFilter, setSelectedPollFilter] = useState('all');

    // subscribe to data
    const isLoadingTeam = useSubscribe('specific_team', teamId);
    const isLoadingBoards = useSubscribe('all_team_boards', teamId);
    const isLoadingPolls = useSubscribe('all_team_polls', teamId);

    const isLoading = isLoadingTeam() || isLoadingBoards() || isLoadingPolls();

    // get data from db
    let teamData = useTracker(() => {
        return TeamCollection.find({_id: teamId}).fetch()[0];
    });

    let boardsData = useTracker(() => {
        return BoardCollection.find({teamId: teamId}).fetch();
    });

    let pollsData = useTracker(() => {
        return PollCollection.find({teamId: teamId}).fetch();
    });

    // check if data has loaded
    if (!isLoading) {

        // check user is in the team
        if (teamData && teamData.teamMembers.includes(userInfo.email)) {

            // variables for icons
            const CogIcon = <Cog8ToothIcon strokeWidth={2} viewBox="0 0 24 24" width={30} height={30}
                                           style={{paddingRight: "5px"}}/>
            const plusIcon = <PlusIcon strokeWidth={2} viewBox="0 0 24 24" width={25} height={25}
                                       style={{paddingRight: "5px"}}/>;

            // sort by board code, then map to JSX object
            const displayedBoardCards = boardsData
                .sort((a, b) => a.boardCode.localeCompare(b.boardCode))
                .map((board) => (
                    <BoardCard
                        key={board._id}
                        boardId={board._id}
                        boardName={board.boardName}
                        boardNickname={board.boardCode}
                        boardDesc={board.boardDescription}
                        boardDeadline={board.boardDeadline}
                        teamId={teamId}/>
                )
            )

            const filterButtons = (
                availableFilters.map((filter, index) => {
                    const nonactiveClass = "btn-light-grey btn-square teams__filter-button"
                    const activeClass = "btn-light-grey btn-square teams__filter-button-active"
                    const className = selectedPollFilter === filter ? activeClass : nonactiveClass;

                    return (
                        <Button
                            key={filter}
                            className={className}
                            onClick={() => setSelectedPollFilter(filter)}>

                            {filter}
                        </Button>
                    );
                })
            )

            

            // filter polls based on if it is opened
            const filteredPolls = pollsData
                .filter((poll) => {
                    const now = new Date();
                    const pollCloseDate = new Date(poll.pollDeadlineDate)

                    // if poll matches any of the condition
                    let allFilterCondition = selectedPollFilter === 'all';
                    let openFilterCondition = selectedPollFilter === 'open' && pollCloseDate > now;
                    let closedFilterCondition = selectedPollFilter === 'closed' && pollCloseDate <= now;

                    return allFilterCondition || openFilterCondition || closedFilterCondition;
                })


            const displayedPollCards = filteredPolls.map((poll) => (
                    <PollCard
                        key={poll._id}
                        pollId={poll._id}
                        title={poll.pollTitle}
                        startTime={poll.pollCreationDate}
                        closeTime={poll.pollDeadlineDate}
                        options={poll.pollOptions}
                        teamName={teamData.teamName}
                    />
                )
            )
            const helpText = "This page displays a list of all the task boards and polls for this team. You can " +
                "create a new board or a new poll by clicking the respective +Add buttons."
            return (
                <WhiteBackground pageHelpText={helpText} pageLayout={PageLayout.LARGE_CENTER}>

                    {/*modals (can go anywhere) */}
                    <BoardCreationModal teamId={teamId} open={boardModalOpen} closeHandler={onCloseBoardModal}/>
                    <PollCreationModal teamId={teamId} open={pollModalOpen} closeHandler={onClosePollModal} />

                    <div className="header-space-between">
                        <div style={{width: "200px"}}>
                            <Button className={"flex flex-row gap-2 btn-back"}
                                    onClick={() => {
                                        navigate('/' + BaseUrlPath.TEAMS)
                                    }}>
                                <ChevronLeftIcon strokeWidth={2} viewBox="0 0 23 23" width={20} height={20}/>
                                Back
                            </Button>
                        </div>
                        <h1 className={"text-center"}>Team: {teamData.teamName}</h1>
                        <Button className={"btn-light-grey"} onClick={() => navigate('settings')}>{CogIcon}Team Settings</Button>
                    </div>

                    <hr className={"teams__hr"}/>

                    <div className="header-space-centered">
                        <div style={{width: "120px", visibility: "hidden"}}></div>
                        <h2 className={"text-center default__heading2"}>Boards</h2>
                        <Button className={"btn-grey"}
                                onClick={onOpenBoardModal}
                                style={{minWidth: "75px", width: "120px"}}>{plusIcon} Add</Button>
                    </div>

                    <div className={"teams__cards-div"}>
                        {displayedBoardCards.length ? displayedBoardCards :
                            <span className={"main-text non-clickable"}
                                  style={{marginTop: "20px", marginBottom: "20px"}}>
                                    There are no boards yet!</span>}
                    </div>

                    <Button className={"board-log-button btn-light-grey"}
                            onClick={() => navigate("logs")}>Board History Logs</Button>

                    <hr className={"teams__hr"}/>

                    <div className="header-space-centered">
                        <div style={{width: "120px", visibility: "hidden"}}></div>
                        <h2 className={"text-center default__heading2"}>Polls</h2>
                        <Button className={"btn-grey"}
                                onClick={onOpenPollModal}
                                style={{minWidth: "75px", width: "120px"}}>{plusIcon} Add</Button>
                    </div>

                    {
                        pollsData.length ?
                            <div className="teams__filter-button-div">
                                <span className={"main-text non-clickable"}>Filters: </span>
                                {filterButtons}
                            </div> : null
                    }

                    <div className={"teams__cards-div"}>
                        {displayedPollCards.length ? displayedPollCards :
                            <span className={"main-text non-clickable"}
                                  style={{marginTop: "20px"}}>There are no polls in here!</span>}
                    </div>
                </WhiteBackground>
            )
        } else {
            //     user is not in team, or team does not exist, move them back to their teams list
            navigate('/' + BaseUrlPath.TEAMS)
        }
    } else {
        // is still loading
        return (
            <WhiteBackground pageLayout={PageLayout.LARGE_CENTER}>
                <Spinner animation="border" variant="secondary" role="status"/>
            </WhiteBackground>
        )
    }
}

export default TeamLobbyPage;