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

    const isLoadingTeams = useSubscribe('team_by_id', teamId);
    const teamsData = useTracker(() => {
        const team =  TeamCollection.findOne({ _id: teamId});
        if(team && teamName == '' && teamLeader == '' && teamMembers == ''){
            setTeamName(team.teamName);
            setTeamLeader(team.teamLeader);
            setTeamMembers(team.teamMembers);
        }
        return team;
    });

    const isLoadingUsers = useSubscribe('all_users');
    const usersData = useTracker(() => {
        return UserCollection.find().fetch();
    });
    const teamMembersData = usersData.filter(user => teamMembers.includes(user.emails[0].address));
    const amountOfUsers = teamMembersData.filter(user => user.emails[0].address !== teamLeader.email);

    const userInfo = getUserInfo();
    const [open, setOpen] = useState(false);
    const isUserTheLeader = userInfo.email === teamLeader;
    const leaderOptions = teamMembersData.filter(user => user.emails[0].address !== userInfo.email);
    const [newLeader, setNewLeader] = useState('');
    const onOpenModal = () => {
        setOpen(true);
        if(amountOfUsers>1){
        setNewLeader(leaderOptions[0].emails[0].address);}
        else{
            setNewLeader(teamLeader);
        }
    };
    const onCloseModal = () => setOpen(false);
    const closeIcon = <XCircleIcon color={"var(--navy)"} strokeWidth={2} viewBox="0 0 24 24" width={35} height={35}/>

    const [errors, setErrors] = useState({
        teamName: "",
        email: ""
    });

    const saveChanges = (event) => {
        event ? event.preventDefault() : null;
        const newErrors = {};
        console.log(teamName);
        let isError = false;
        if(teamName ===''){
            console.log("hereee");
            newErrors.teamName = "Please fill in your team name";
            isError = true;
        }
        else if(teamMembers.length < 1){
            newErrors.teamMembers = "Please fill in your team member";
            isError = true;
        }

        setErrors(newErrors);

        if(!isError){
            console.log("here");
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
            });
        }
    };

    const handleAddMember = (event) => {
        event.preventDefault();
        const newError = {};
        if(teamMembers.includes(newMember)){
            newError.email = "Email has already been added";
        } else if (!emailRegex.test(newMember)) {
            newError.email = "Please input a valid email address";
        }
        else {
            setTeamMembers([...teamMembers, newMember]);
            setNewMember('');
            setError('');
        }
        setErrors(newError);
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
    const deleteTeam = () => {
        Meteor.call('update_team', teamId, {
            teamName: teamName,
            teamLeader: teamLeader,
            teamMembers: teamMembers
        })
        Meteor.call('delete_team', teamId);
        navigate('/teams');
    }

    const helpText = "This is the team settings page to change team name, leader, and members. Only team leader is allowed to made changes. Press Save Changes to apply all changes to the team. Press Leave Team to permanently leave the team";
    if (isLoadingTeams() || isLoadingUsers()) {
        return (
            <WhiteBackground pageLayout={PageLayout.LARGE_CENTER}>
                <Spinner animation="border" variant="secondary" role="status"/>
            </WhiteBackground>
        )
    } else {
        return (
            <>
            <WhiteBackground pageHelpText={helpText} pageLayout={PageLayout.LARGE_CENTER}>
                <div className="team-settings-base">

                <div className='back-button'>
                <Button onClick={() => navigate(`/teams/${teamId}`)} className={"flex flex-row gap-2 btn-back"}>
                <ChevronLeftIcon strokeWidth={2} viewBox="0 0 23 23" width={20} height={20}/>
                    Back
                </Button></div>

                    <h1 className={"text-center"}>Team Settings</h1>
                    <form className={"ts-form-class"} onSubmit={saveChanges}>

                    <div className="ts-input-group">
                    <label>{"Team Name:"}</label>
                    {teamsData.teamLeader === userInfo.email?
                        (<div className={"input-error-div"}>
                    <Input value={teamName} onChange={(e) => setTeamName(e.target.value)}/>
                    {errors.teamName && <span className="text-red small-text">{errors.teamName}</span>}
                    </div>):(<div className='member-item'>{teamsData.teamName}</div>)}
                    </div>

                    <div className="ts-input-group" >
                    <label>{"Team Leader:"}</label>
                    {teamsData.teamLeader === userInfo.email?
                        (<select className={"input-base"} value={teamLeader} onChange={(e) => setTeamLeader(e.target.value)}>
                        {teamMembersData.map(user => (
                        <option key={user._id} value={user.emails[0].address}>
                        {user.profile.name} (@{user.username})</option>))}
                        </select>):(<div className='member-item'>{teamsData.teamLeader}</div>)}
                    </div>

                    <div className="ts-input-group">
                    <label>{"Team Members:"}</label>
                    <ul><div className='member-item'>{teamsData.teamLeader} </div>
                    {teamMembers.filter(member => member!==teamsData.teamLeader).map(member => (
                        <Fragment key={member}><div className='member-item'> 
                            {member}
                            {teamsData.teamLeader === userInfo.email? (
                            <button className="inserted-button" onClick={() => handleRemoveMember(member)}>
                                <MinusCircleIcon color={"var(--navy)"} strokeWidth={2} viewBox="0 0 24 24" width={30} height={30} />
                            </button>): <></>}
                            </div>
                        </Fragment>
                    ))}   
                    {teamsData.teamLeader === userInfo.email?
                        (<div className='add-member-input'>
                    <div className={"input-error-div"}>
                        <Input type="email" placeholder={"insert new member email"} value={newMember} onChange={(e) => setNewMember(e.target.value)}/>
                        {errors.email && <span className="text-red small-text">{errors.email}</span>}
                    </div>
                    <button className="inserted-button" onClick={handleAddMember}><PlusCircleIcon color={"var(--navy)"} strokeWidth={2} viewBox="0 0 24 24" width={30} height={30} /></button>
                   </div>):(<></>)}

                    </ul>
                    </div> 

                    {error &&
                    <div className='error-display'>
                        <p style={{ color: 'red' }}>{error}</p>
                    </div>
                    }
                    {userInfo.email === teamsData.teamLeader ?
                    <div className='button-group'>
                    <Button type="submit" className="btn-brown">Save Changes</Button>
                    </div> : <></>}

                    </form>
                </div>

                <span href='#' className="text-red underline clickable" style={{width:"100%", textAlign: "end"}} onClick={onOpenModal}>Leave Team</span>
            </WhiteBackground>
            
            {teamsData.teamMembers.length === 1 || amountOfUsers.length === 1 ? (        
                <Modal
                closeIcon={closeIcon}
                classNames={{modal: classNames('modal-base', '')}}
                open={open}
                onClose={onCloseModal}
                center>
                    <div className={"modal-div-center"}>
                    <h1 className={"text-center"}>Delete Team</h1>
                    <p>You are about to delete "{teamName}".</p><p>Are you sure?</p>
                    <Button className={"btn-red"} onClick={deleteTeam}>Confirm</Button></div>
                </Modal>): 

            (<Modal
                closeIcon={closeIcon}
                classNames={{
                    modal: classNames('ts-modal-base', ''),
                }}
                open={open}
                onClose={onCloseModal}
                center
                >
                    {userInfo.email === teamsData.teamLeader ? (
                    <div className='modal-div-center'>
                        <h1> Reassign Team Leader </h1>
                        <div style={{marginLeft:"10%", marginRight:"10%"}}>
                            <p>You are currently the leader of the team.</p>
                            <p>You must assign someone else to be the new leader before you can leave the team.</p></div>
                            <label></label>
                            <div className="input-group">
                                <label style={{marginBottom:"10px"}} className={"main-text text-grey"}>New Team Lead:</label>
                                <div className='ts-input-group'>
                                <select className={"input-base"} value={newLeader} onChange={(e) => setNewLeader(e.target.value)}>
                                    {teamMembersData.filter(user => user.emails[0].address !== userInfo.email).map(user => (
                                        <option key={user._id} value={user.emails[0].address}>
                                        {user.profile.name} (@{user.username})
                                    </option>
                                    ))}
                                </select></div>
                            </div>
                            <div style={{marginTop:"15px", marginBottom: "15px"}} className='button-group'>
                            <Button className={"btn-red"} onClick={() => leaveTeam(true)}>Save & Leave Team</Button>
                            </div>
                    </div>) : 
                    <div className='modal-div-center'>
                        <div><h1> Leave Team </h1>
                        <p>You are leaving the team.</p><p>Are you sure?</p></div>
                        <label></label>
                        <div className='button-group'>
                        <Button className={"btn-red"} onClick={() => leaveTeam(false)}>Leave Team</Button>
                        </div>
                    </div>
                    }
            </Modal>)}
            </>
        );
    }
};

export default TeamSettingsPage;