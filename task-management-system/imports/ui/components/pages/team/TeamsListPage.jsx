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
import TeamCollection from '../../../../api/collections/team.js'
// import sideButton from "../../general/buttons/side"

export const TeamsListPage = (...tableProps) => {

    // todo: setup users after
    const temp_username = "test"

    // set up a subscriber
    const isLoadingTeams = useSubscribe('all_user_teams', temp_username);


    const teamsData = useTracker(() => {
        return TeamCollection.find({ teamMembers: {$in: [temp_username ]} }).fetch();
    })

    if (isLoadingTeams()) {
        // display a loading icon

    } else {
        // accessing the data in teamsData
        Meteor.call('add_team', "name", "leader", "members", "boards");



        console.log(teamsData);


        return (
            <WhiteBackground pageLayout={PageLayout.LARGE_CENTER}>
    
                <h1>Teams</h1> 
                <div className="center-spaced">
                    <Button className={"btn-grey"}><PlusIcon strokeWidth={4} viewBox="0 0 23 23" width={20} height={20} style={{paddingRight: "5px"}}/> Add</Button>
                </div>
    
                <table className={"table table-striped table-bordered"} {...tableProps}>
                <thead>
                <tr>
                    <th>Team Name</th>
                    <th>Team Lead</th>
                    <th># Members</th>
                    <th># Boards</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>

    
                </tbody>
            </table>
    
            </WhiteBackground>
        );




    }








    // const [teams, setTeams] = useState([]);

    // useEffect(()=>{
    //     Meteor.call('get_all', (err,res)=>{
    //         if (err) {
    //             console.log("Error fetching teams!");
    //         } else {
    //             setTeams(res);
    //         }
    //     });
    // }, []);


};

export default TeamsListPage;