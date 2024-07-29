/**
 * File Description: Teams list page
 * Updated Date: 24/7/2024
 * Contributors: Audrey, Nikki
 * Version: 1.0
 */

import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import {Meteor} from 'meteor/meteor';
import {useSubscribe, useTracker} from 'meteor/react-meteor-data'
import WhiteBackground from "../../general/whiteBackground/WhiteBackground.jsx";
import PageLayout from "../../../enums/PageLayout";
import Button from "../../general/buttons/Button";
import {PlusIcon} from "@heroicons/react/24/outline";
import {ArrowPathIcon} from "@heroicons/react/24/outline";
import "../../../../ui/components/general/texts/text.css"
import TeamCollection from '../../../../api/collections/team.js'
import BoardCollection from '../../../../api/collections/board.js'

export const TeamsListPage = (...tableProps) => {

    //------------placeholder for the current logged in user---------------
    const temp_username = "x"

    // set up a subscriber
    const isLoadingTeams = useSubscribe('all_user_teams', temp_username);
    useSubscribe('all_user_boards');

    //fetch team's data
    const teamsData = useTracker(() => {
        return TeamCollection.find({ teamMembers: {$in: [temp_username ]} }).fetch();
    });

    //fetch board's data
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
        return <div className="center-container"> <ArrowPathIcon strokeWidth={4} width={50} height={50} style={{paddingRight: "5px"}}/>  Loading...</div>
    } else {
        return (
            <WhiteBackground pageLayout={PageLayout.LARGE_CENTER}>
                <div className="side-container">
                <h1 className='right-padding'>Teams</h1> 
                    <Button className={"btn-grey"}><PlusIcon strokeWidth={4} viewBox="0 0 23 23" width={20} height={20} style={{paddingRight: "5px"}}/> Add</Button>
                </div>
    
                <table className={"table table-striped table-bordered"} {...tableProps}>
                <thead>
                <tr className="center-text">
                    <th>Team Name</th>
                    <th>Team Lead</th>
                    <th># Members</th>
                    <th># Boards</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                    {teamsData.map((team)=>(            
                        <tr className="center-text">
                        <td>{team.teamName}</td>
                        <td>{team.teamLeader}</td>
                        <td>{team.teamMembers.length}</td>
                        <td>{getBoard(team._id)}</td>
                        <td><div className="center-spaced"><Button className={"btn-brown"}>View Detail</Button></div></td>
                        </tr>
                    ))}
    
                </tbody>
            </table>
    
            </WhiteBackground>
        );
    }
};

export default TeamsListPage;