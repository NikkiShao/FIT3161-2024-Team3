/**
 * File Description: Team's settings page
 * Updated Date: 5/8/2024
 * Contributors: Audrey
 * Version: 1.0
 */
import React from 'react';
import { useState, Fragment} from 'react';
import { useSubscribe, useTracker } from 'meteor/react-meteor-data'
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import Modal from 'react-bootstrap/Modal';

import TeamCollection from '../../../../api/collections/team.js'
import UserCollection from "../../../../api/collections/user";

import WhiteBackground from "../../general/whiteBackground/WhiteBackground.jsx";
import PageLayout from "../../../enums/PageLayout";
import Button from "../../general/buttons/Button";
import Input from "../../general/inputs/Input.jsx";
import "./teamsettings.css";
import {getUserInfo} from "../../util";
import { XCircleIcon, MinusCircleIcon, ChevronLeftIcon, PlusCircleIcon } from "@heroicons/react/24/outline";

export const TeamSettingsPage = () => {
    const navigate = useNavigate();
    const userInfo = getUserInfo();
    const { teamId } = useParams();

    const [newMember, setNewMember] = useState('');
    const [teamName, setTeamName] = useState('');
    const [teamLeader, setTeamLeader] = useState('');
    const [teamMembers, setTeamMembers] = useState([]);

    const [error, setError] = useState('');
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

    const isLoadingTeams = useSubscribe('specific_team', teamId);
    
    const teamsData = useTracker(() => {
        const idObject = new Mongo.ObjectID(teamId);
        const team =  TeamCollection.findOne({ _id: idObject});
        if(team && teamName == ''){
            setTeamName(team.teamName);
            setTeamLeader(team.teamLeader);
            setTeamMembers(team.teamMembers);
        }
    });

    console.log(teamName);

    const isLoadingUsers = useSubscribe('all_users');
    const usersData = useTracker(() => {
        return UserCollection.find().fetch();
    });
    const teamMembersData = usersData.filter(user => teamMembers.includes(user.emails[0].address));

    const saveChanges = () => {
        if(teamName && teamMembers.length > 0){
        Meteor.call('update_team', teamId, 
        {
            teamName: teamName,
            teamLeader: teamLeader,
            teamMembers: teamMembers
        }, (error) => {
            if (error) {
                setError(error.reason);
            } else {
                setTeamName('');
                setTeamLeader('');
                setTeamMembers([]);
                setNewMember('');
                setError('');
            }
        }
    );
    } else {
        setError('Team name and members are required');
    }
    };

    const leaveTeam = () => {
        console.log('Leave team...');
    };

    const handleAddMember = () => {
        if (emailRegex.test(newMember) && !teamMembers.includes(newMember)) {
            setTeamMembers([...teamMembers, newMember]);
            setNewMember('');
            setError('');
        } else {
            setError('Invalid or duplicate email address');
        }
    };

    const handleRemoveMember = (member) => {
        setTeamMembers(teamMembers.filter(m => m !== member));
    };

    if (isLoadingTeams() || isLoadingUsers()) {
        return (
            <WhiteBackground pageLayout={PageLayout.LARGE_CENTER}>
                <Spinner animation="border" variant="secondary" role="status"/>
            </WhiteBackground>
        )
    } else {
        return (
            <WhiteBackground pageLayout={PageLayout.LARGE_CENTER}>
                <div className="modal-base">
                <div className='back-button'>
                <Button onClick={() => navigate(`/teams/${teamId}`)} className={"flex flex-row gap-2 btn-back"}>
                <ChevronLeftIcon strokeWidth={2} viewBox="0 0 23 23" width={20} height={20}/>
                    Back
                </Button></div>

                    <h1>Team Settings</h1>
                    <form onSubmit={saveChanges}>

                    <div className="inputGroup">
                    <label className="main-text">{"Team Name:"}</label>
                    <Input value={teamName} onChange={(e) => setTeamName(e.target.value)}/></div>

                    <div className="inputGroup" >
                    <label className="main-text">{"Team Leader:"}</label>
                        <select>
                        <Input value={teamLeader} onChange={(e) => setTeamLeader(e.target.value)}/>
                        {teamMembersData.map(user => (
                        <option key={user._id} value={user.emails[0].address}>
                        {user.profile.name} (@{user.username})</option>))}
                        </select>
                    </div>

                    <div className="inputGroup">
                    <label className="main-text">{"Team Members:"}</label>
                    <ul>{teamMembers.map(member => (
                        <Fragment key={member}><div className='memberItem'> 
                            {member}
                            <button className="insertedButton" onClick={() => handleRemoveMember(member)}>
                                <MinusCircleIcon color={"var(--navy)"} strokeWidth={2} viewBox="0 0 24 24" width={25} height={25} />
                            </button>
                            </div>
                        </Fragment>
                    ))}      

                    </ul>
                    </div> 
                               
                    <div className='inputGroup'>
                        <label></label>
                    <Input type="email" placeholder={"insert new member email"} value={newMember} onChange={(e) => setNewMember(e.target.value)}/>
                    <button onClick={handleAddMember}><PlusCircleIcon color={"var(--navy)"} strokeWidth={2} viewBox="0 0 24 24" width={20} height={20} /></button>
                    </div>                    

                    {error &&
                    <div className='error-display'>
                        <p style={{ color: 'red' }}>{error}</p>
                    </div>
                    }

                    <div className='buttonGroup'>
                    <Button type="submit" className="btn-brown">Save Changes</Button>
                    </div>
                    </form>
                </div>
            </WhiteBackground>
        );
    }
};

export default TeamSettingsPage;