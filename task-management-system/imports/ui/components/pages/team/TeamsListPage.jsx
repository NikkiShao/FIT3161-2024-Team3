/**
 * File Description: Teams list page
 * Updated Date: 24/7/2024
 * Contributors: Audrey, Nikki
 * Version: 1.4
 */

import React, {useState} from 'react';
import {useSubscribe, useTracker} from 'meteor/react-meteor-data'
import {PlusIcon} from "@heroicons/react/24/outline";
import {useNavigate} from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";

import TeamCollection from '../../../../api/collections/team.js'
import BoardCollection from '../../../../api/collections/board.js'
import UserCollection from "../../../../api/collections/user";

import WhiteBackground from "../../general/whiteBackground/WhiteBackground.jsx";
import PageLayout from "../../../enums/PageLayout";
import Button from "../../general/buttons/Button";
import {getUserInfo} from "../../util";
import TeamCreationModal from "../../general/modal/TeamCreationModal";
import "./team.css"
import board from "../../../../api/collections/board.js";

export const TeamsListPage = () => {

    const navigate = useNavigate();
    const userInfo = getUserInfo();

    // Handlers for opening and closing team creation modal
    const [modalOpen, setModalOpen] = useState(false);
    const onOpenModal = () => setModalOpen(true);
    const onCloseModal = () => setModalOpen(false);

    // fetch team's data
    const isLoadingTeams = useSubscribe('all_user_teams', userInfo.email);
    const teamsData = useTracker(() => {
        return TeamCollection.find({teamMembers: userInfo.email}).fetch();
    });

    // fetch board's data
    let teamIds = teamsData.map((team) => team._id)
    let teamLeadEmails = teamsData.map((team) => team.teamLeader)

    const isLoadingBoards = useSubscribe('all_teams_boards', teamIds);
    const boardData = useTracker(() => {
        return BoardCollection.find({teamId: {$in: teamIds}}).fetch();
    });

    // get boards based on a team's id
    const getBoard = (boardId) => {
        return boardData.filter(board => board.teamId === boardId).length;
    }

    // get team lead name
    const isLoadingTeamLeads = useSubscribe('all_users');
    const teamLeadData = useTracker(() => {
        return UserCollection.find({"emails.address": {$in: teamLeadEmails}}).fetch();
    });

    const isLoading = isLoadingTeams() || isLoadingBoards() || isLoadingTeamLeads();

    if (isLoading) {
        // display a loading icon when the page is loading
        return (
            <WhiteBackground pageLayout={PageLayout.LARGE_CENTER}>
                <Spinner animation="border" variant="secondary" role="status"/>
            </WhiteBackground>
        )
    } else {
        // aggregate team lead data
        for (let i = 0; i < teamsData.length; i++) {
            for (let j = 0; j < teamLeadData.length; j++) {

                // check if this team lead belongs to this team
                if (teamsData[i].teamLeader === teamLeadData[j].emails[0].address) {
                    // found match
                    teamsData[i].leaderName = teamLeadData[j].profile.name;
                    teamsData[i].leaderUsername = teamLeadData[j].username;
                    break;
                }
            }
        }

        const plusIcon = <PlusIcon strokeWidth={3} viewBox="0 0 21 21" width={22} height={22}
                                   style={{paddingRight: "5px"}}/>;

        // sort by team name (if you don't sort, it changes every time)
        const sortedTeamsData = teamsData.sort((a, b) => a.teamName.localeCompare(b.teamName));

        const helpText = "This page displays a list of all of your teams that you belong to. You can press the " +
            "+Add button to create a new team or wait for your team leader to invite you to one."
        return (
            <WhiteBackground pageHelpText={helpText} pageLayout={PageLayout.LARGE_CENTER}>

                <TeamCreationModal
                    open={modalOpen}
                    closeHandler={onCloseModal}
                />

                <div className="header-space-centered">
                    <Button className={"btn-grey"}
                            style={{minWidth: "75px", width: "120px", visibility: "hidden"}}>{plusIcon} Add</Button>
                    <h1 className={"text-center default__heading1"}>Teams List</h1>
                    <Button className={"btn-grey"} style={{minWidth: "75px", width: "120px"}}
                            onClick={onOpenModal}>{plusIcon} Add</Button>
                </div>

                {
                    sortedTeamsData.length ?
                        <table className={"table table-striped table-bordered table-hover non-clickable"}>
                            <thead>
                            <tr key={'header'} className="text-center">
                                <th>Team Name</th>
                                <th>Team Lead</th>
                                <th># Members</th>
                                <th># Boards</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody className="text-center">
                            {sortedTeamsData.map((team) => (
                                <tr key={team._id}>
                                    <td>{team.teamName}</td>
                                    <td>
                                        <span className={"main-text"}>{team.leaderName}</span>
                                        <br/>
                                        <span className={"small-text text-grey"}>(@{team.leaderUsername})</span>
                                    </td>
                                    <td><span className={"main-text"}>{team.teamMembers.length}</span></td>
                                    <td><span className={"main-text"}>{getBoard(team._id)}</span></td>
                                    <td>
                                        <Button className={"btn-brown"}
                                                style={{minWidth: "117px", display: "inline-flex"}}
                                                onClick={() => navigate(team._id)}>
                                            View Detail</Button>
                                    </td>
                                </tr>
                            ))}

                            </tbody>
                        </table>
                        : <span className={"main-text non-clickable"}>
                            You are not in any teams yet, create a team or get your team leader to invite you to their team!
                        </span>
                }
            </WhiteBackground>
        );
    }
};

export default TeamsListPage;