/**
 * File Description: Team's settings page
 * Updated Date: 5/8/2024
 * Contributors: Audrey
 * Version: 1.1
 */
import React from 'react';
import { useState, Fragment} from 'react';
import { useSubscribe, useTracker } from 'meteor/react-meteor-data'
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";

import classNames from "classnames";
import {Modal} from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import '../../general/modal/modal.css'

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

    const isLoadingUsers = useSubscribe('all_users');
    const usersData = useTracker(() => {
        return UserCollection.find().fetch();
    });
    const teamMembersData = usersData.filter(user => teamMembers.includes(user.emails[0].address));

    const userInfo = getUserInfo();
    const [open, setOpen] = useState(false);
    const isUserTheLeader = userInfo.email === teamLeader;
    const leaderOptions = teamMembersData.filter(user => user.emails[0].address !== userInfo.email);
    const [newLeader, setNewLeader] = useState('');
    const onOpenModal = () => {
        setOpen(true);
        // const leaderOptions = teamMembersData.filter(user => user.emails[0].address !== userInfo.email);
        setNewLeader(leaderOptions[0].emails[0].address);
    };
    const onCloseModal = () => setOpen(false);
    const closeIcon = <XCircleIcon color={"var(--navy)"} strokeWidth={2} viewBox="0 0 24 24" width={35} height={35}/>

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
                setNewLeader('');
            }
        }
    );
    } else {
        setError('Team name and members are required');
    }
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

    const leaveTeam = (boolean) => {
        const newTeamMembers = teamMembers.filter(m => m !== userInfo.email);
        Meteor.call('update_team', teamId, 
        {
            teamName: teamName,
            teamLeader: boolean ? newLeader : teamLeader,
            teamMembers: newTeamMembers
        }, (error) => {
            if (error) {
                setError(error.reason);
            } else {
                setTeamName('');
                setTeamLeader('');
                setTeamMembers([]);
                setNewMember('');
                setNewLeader('');
                setError('');
                navigate('/teams');
            }
        });
        onCloseModal();
    };

    if (isLoadingTeams() || isLoadingUsers()) {
        return (
            <WhiteBackground pageLayout={PageLayout.LARGE_CENTER}>
                <Spinner animation="border" variant="secondary" role="status"/>
            </WhiteBackground>
        )
    } else {
        return (
            <>
            <WhiteBackground pageLayout={PageLayout.LARGE_CENTER}>
                <div className="team-settings-base">
                <div className='back-button'>
                <Button onClick={() => navigate(`/teams/${teamId}`)} className={"flex flex-row gap-2 btn-back"}>
                <ChevronLeftIcon strokeWidth={2} viewBox="0 0 23 23" width={20} height={20}/>
                    Back
                </Button></div>

                    <h1>Team Settings</h1>
                    <form onSubmit={saveChanges}>

                    <div className="ts-input-group">
                    <label>{"Team Name:"}</label>
                    <Input value={teamName} onChange={(e) => setTeamName(e.target.value)}/></div>

                    <div className="ts-input-group" >
                    <label>{"Team Leader:"}</label>
                        <select value={teamLeader} onChange={(e) => setTeamLeader(e.target.value)}>
                        {teamMembersData.map(user => (
                        <option key={user._id} value={user.emails[0].address}>
                        {user.profile.name} (@{user.username})</option>))}
                        </select>
                    </div>

                    <div className="ts-input-group">
                    <label>{"Team Members:"}</label>
                    <ul><div className='member-item'>{teamLeader} </div>
                    {teamMembers.filter(member => member!==teamLeader).map(member => (
                        <Fragment key={member}><div className='member-item'> 
                            {member}
                            <button className="inserted-button" onClick={() => handleRemoveMember(member)}>
                                <MinusCircleIcon color={"var(--navy)"} strokeWidth={2} viewBox="0 0 24 24" width={25} height={25} />
                            </button>
                            </div>
                        </Fragment>
                    ))}      

                    </ul>
                    </div> 
                               
                    <div className='ts-input-group'>
                        {/* <label></label> */}
                    <Input style={{marginLeft: '140px', marginRight:"10px", marginBottom:"10px"}} type="email" placeholder={"insert new member email"} value={newMember} onChange={(e) => setNewMember(e.target.value)}/>
                    <button className="add-member-button" onClick={handleAddMember}><PlusCircleIcon color={"var(--navy)"} strokeWidth={2} viewBox="0 0 24 24" width={25} height={25} /></button>
                    </div>                    

                    {error &&
                    <div className='error-display'>
                        <p style={{ color: 'red' }}>{error}</p>
                    </div>
                    }

                    <div style={{marginTop:"50px"}} className='button-group'>
                    <Button type="submit" className="btn-brown">Save Changes</Button>
                    </div>
                    </form>
                </div>

                <Button className={"btn-brown"} onClick={onOpenModal}>Leave Team</Button>
            </WhiteBackground>
            




            <Modal
                closeIcon={closeIcon}
                classNames={{
                    modal: classNames('ts-modal-base', ''),
                }}
                open={open}
                onClose={onCloseModal}
                center
                >
                    {isUserTheLeader ? (
                    <div className='modal-div-center'>
                        <h1> Reassign Team Leader </h1>
                        <div style={{marginLeft:"10%", marginRight:"10%"}}>
                            <p>You are currently the leader of the team.</p>
                            <p>You must assign someone else to be the new leader before you can leave the team.</p></div>
                            <label></label>
                            <div className="input-group">
                                <label className={"main-text text-grey"}>New Team Lead:</label>
                                <div className='ts-input-group'>
                                <select value={newLeader} onChange={(e) => setNewLeader(e.target.value)}>
                                    {teamMembersData.filter(user => user.emails[0].address !== userInfo.email).map(user => (
                                        <option key={user._id} value={user.emails[0].address}>
                                        {user.profile.name} (@{user.username})
                                    </option>
                                    ))}
                                </select></div>
                            </div>
                            <div style={{marginTop:"15px", marginBottom: "15px"}} className='button-group'>
                            <Button className={"btn-brown"} onClick={() => leaveTeam(true)}>Save & Leave Team</Button>
                            </div>
                    </div>) : 
                    <div className='modal-div-center'>
                        <div><h1> Leave Team </h1>
                        <p>You are leaving the team.</p><p> Are you sure?</p></div>
                        <label></label>
                        <div className='button-group'>
                        <Button className={"btn-brown"} onClick={() => leaveTeam(false)}>Leave Team</Button>
                        </div>
                    </div>
                    }
            </Modal>
            </>
        );
    }
};

export default TeamSettingsPage;