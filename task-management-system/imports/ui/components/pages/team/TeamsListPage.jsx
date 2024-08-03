/**
 * File Description: Teams list page
 * Updated Date: 24/7/2024
 * Contributors: Audrey, Nikki
 * Version: 1.1
 */

import React from 'react';
import {useSubscribe, useTracker} from 'meteor/react-meteor-data'
import {PlusIcon} from "@heroicons/react/24/outline";
import Spinner from "react-bootstrap/Spinner";

import TeamCollection from '../../../../api/collections/team.js'
import BoardCollection from '../../../../api/collections/board.js'

import WhiteBackground from "../../general/whiteBackground/WhiteBackground.jsx";
import PageLayout from "../../../enums/PageLayout";
import Button from "../../general/buttons/Button";
import {getUserInfo} from "../../util";
import "./team.css"

export const TeamsListPage = (...tableProps) => {

    const userInfo = getUserInfo();

    // set up a subscriber
    const isLoadingTeams = useSubscribe('all_user_teams', userInfo.username);
    useSubscribe('all_user_boards');

    //fetch team's data
    const teamsData = useTracker(() => {
        return TeamCollection.find({
            teamMembers: {
                $in: [userInfo.username ]
            }
        }).fetch();
    });

    // fetch board's data
    const boardData = useTracker(() => {
        return BoardCollection.find().fetch();
    });

    //get boards based on a team's id
    const getBoard = (id) =>{
        const theId = id._str;
        return boardData.filter(board=>board.teamId === theId).length;
    }

    if (isLoadingTeams()) {
        // display a loading icon when the page is loading
        return (
            <WhiteBackground pageLayout={PageLayout.LARGE_CENTER}>
                <Spinner animation="border" variant="secondary" role="status"/>
            </WhiteBackground>
        )
    } else {
        const plusIcon = <PlusIcon strokeWidth={3} viewBox="0 0 21 21" width={22} height={22} style={{paddingRight: "5px"}}/>;

        return (
            <WhiteBackground pageLayout={PageLayout.LARGE_CENTER}>
                <div id="teams__top-div">
                    <Button className={"btn-grey"} style={{minWidth:"75px", width:"120px", visibility: "hidden"}}>{plusIcon} Add</Button>
                    <h1 className={"text-center default__heading1"}>Teams</h1>
                    <Button className={"btn-grey"} style={{minWidth:"75px", width:"120px"}}>{plusIcon} Add</Button>
                </div>
                <table className={"table table-striped table-bordered"} {...tableProps}>
                <thead>
                <tr className="text-center">
                    <th>Team Name</th>
                    <th>Team Lead</th>
                    <th># Members</th>
                    <th># Boards</th>
                    <th></th>
                </tr>
                </thead>
                <tbody className="text-center">
                    {teamsData.map((team)=>(            
                        <tr>
                        <td>{team.teamName}</td>
                        <td>{team.teamLeader}</td>
                        <td>{team.teamMembers.length}</td>
                        <td>{getBoard(team._id)}</td>
                        <td>
                            <Button className={"btn-brown"} style={{minWidth:"117px", display:"inline-flex"}}>View Detail</Button>
                        </td>
                        </tr>
                    ))}
    
                </tbody>
            </table>
            </WhiteBackground>
        );
    }
};

export default TeamsListPage;