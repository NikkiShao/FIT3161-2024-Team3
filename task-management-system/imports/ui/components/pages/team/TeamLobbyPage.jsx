/**
 * File Description: Team lobby page
 * Updated Date: 02/08/2024
 * Contributors: Nikki
 * Version: 1.0
 */

import React, {useState} from 'react';
import {Cog8ToothIcon, PlusIcon} from "@heroicons/react/24/outline"
import {useNavigate, useParams} from "react-router-dom";
import {useSubscribe, useTracker} from "meteor/react-meteor-data";
import Spinner from "react-bootstrap/Spinner";

import TeamCollection from "../../../../api/collections/team";
import BoardCollection from "../../../../api/collections/board";
import PollCollection from "../../../../api/collections/poll";

import WhiteBackground from "../../general/whiteBackground/WhiteBackground";
import PageLayout from "../../../enums/PageLayout";
import Button from "../../general/buttons/Button";
import Card from "../../general/cards/Card";
import {getUserInfo} from "../../util";
import BaseUrlPath from "../../../enums/BaseUrlPath";
import './team.css'

/**
 * Non-existent page component
 */
export const TeamLobbyPage = () => {
    const navigate = useNavigate()
    const userInfo = getUserInfo();

    // variables for poll filters
    const availableFilters = ['all', 'open', 'closed']
    const [selectedPollFilter, setSelectedPollFilter] = useState('all')

    // grab the team ID from the URL
    const {teamId} = useParams();

    // convert to a Mongo DB ID type, check if team ID is valid
    let validTeamId = true;
    let mongoIdFormat;
    try {
        mongoIdFormat = new Mongo.ObjectID(teamId);
    } catch {
        // this ID is not valid format
        validTeamId = false;
    }

    if (validTeamId) {
        // if team id is valid

        const isLoadingTeam = useSubscribe('specific_team', teamId);
        const isLoadingBoards = useSubscribe('all_team_boards', teamId);
        const isLoadingPolls = useSubscribe('all_team_polls', teamId);

        const isLoading = isLoadingTeam() || isLoadingBoards() || isLoadingPolls();

        // get data from db
        let teamData = useTracker(() => {
            return TeamCollection.find({_id: mongoIdFormat}).fetch()[0];
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

                const displayedBoardCards = boardsData.map((board) => (
                        // todo: replace with BoardCards after
                        <Card key={board._id}>
                            <span>{board.boardName}</span>
                            <span>Nickname: {board.boardCode}</span>
                            <span>{new Date(board.boardDeadline).toLocaleString()}</span>
                            <span>{board.boardDesc}</span>
                        </Card>
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
                const filteredPolls = pollsData.filter((poll) => {
                    const now = new Date();
                    const pollCloseDate = new Date(poll.pollDeadlineDate)

                    // if poll matches any of the condition
                    let allFilterCondition = selectedPollFilter === 'all';
                    let openFilterCondition = selectedPollFilter === 'open' && pollCloseDate > now;
                    let closedFilterCondition = selectedPollFilter === 'closed' && pollCloseDate <= now;

                    return allFilterCondition || openFilterCondition || closedFilterCondition;
                });

                const displayedPollCards = filteredPolls.map((poll) => (
                        // todo: replace with PollCards after
                        <Card key={poll._id}>
                            <span>{poll.pollTitle}</span>
                            <span>{new Date(poll.pollCreationDate).toLocaleString()}</span>
                            <span>{new Date(poll.pollDeadlineDate).toLocaleString()}</span>
                        </Card>
                    )
                )

                return (
                    <div>
                        <WhiteBackground pageLayout={PageLayout.LARGE_CENTER}>

                            <div className="teams__header-div">
                                <div style={{width: "200px", visibility: "hidden"}}></div>
                                <h1>{teamData.teamName}</h1>
                                <Button className={"btn-light-grey"}>{CogIcon} Team Settings</Button>
                            </div>

                            <hr className={"teams__hr"}/>

                            <div className="teams__top-div">
                                <div style={{width: "120px", visibility: "hidden"}}></div>
                                <h2 className={"text-center default__heading2"}>Teams</h2>
                                <Button className={"btn-grey"}
                                        style={{minWidth: "75px", width: "120px"}}>{plusIcon} Add</Button>
                            </div>


                            <div className={"teams__cards-div"}>
                                {displayedBoardCards.length ? displayedBoardCards :
                                    <span className={"main-text"}>There are no boards yet!</span>}
                            </div>

                            <hr className={"teams__hr"}/>

                            <div className="teams__top-div">
                                <div style={{width: "120px", visibility: "hidden"}}></div>
                                <h2 className={"text-center default__heading2"}>Polls</h2>
                                <Button className={"btn-grey"}
                                        style={{minWidth: "75px", width: "120px"}}>{plusIcon} Add</Button>
                            </div>

                            <div className="teams__filter-button-div">
                                <span className={"main-text"}>Filters: </span>
                                {filterButtons}
                            </div>

                            <div className={"teams__cards-div"}>
                                {displayedPollCards.length ? displayedPollCards :
                                    <span className={"main-text"}>There are no polls yet!</span>}
                            </div>
                        </WhiteBackground>
                    </div>
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
}

export default TeamLobbyPage;