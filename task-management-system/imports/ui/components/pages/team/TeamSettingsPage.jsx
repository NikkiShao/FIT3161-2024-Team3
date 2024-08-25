/**
 * File Description: Team's settings page
 * Updated Date: 5/8/2024
 * Contributors: Audrey, Nikki
 * Version: 2.0
 */
import React, {Fragment, useState} from 'react';
import {useSubscribe, useTracker} from 'meteor/react-meteor-data'
import {useNavigate, useParams} from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import {ChevronLeftIcon, MinusCircleIcon, PlusCircleIcon, XCircleIcon} from "@heroicons/react/24/outline";
import classNames from "classnames";
import {Modal} from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';

import TeamCollection from '../../../../api/collections/team.js'
import UserCollection from "../../../../api/collections/user";

import WhiteBackground from "../../general/whiteBackground/WhiteBackground.jsx";
import BaseUrlPath from "../../../enums/BaseUrlPath";
import PageLayout from "../../../enums/PageLayout";
import Button from "../../general/buttons/Button";
import Input from "../../general/inputs/Input.jsx";
import {generateInvitationToken, getUserInfo} from "../../util";
import '../../general/modal/modal.css'

/**
 * Settings page for a team
 */
export const TeamSettingsPage = () => {
    const navigate = useNavigate();
    const {teamId} = useParams();

    // variables
    const [teamName, setTeamName] = useState('');
    const [teamLeader, setTeamLeader] = useState('');
    const [teamMembers, setTeamMembers] = useState([]);
    const [teamInvitations, setTeamInvitations] = useState([]);

    const [newInvitation, setNewInvitation] = useState(''); // new invitation email input
    const [newLeader, setNewLeader] = useState(''); // this is only for leader leaving team

    // own user data
    const userInfo = getUserInfo();
    const [isLeader, setIsLeader] = useState(false);

    // load team data
    const isLoadingTeams = useSubscribe('team_by_id', teamId);
    const teamData = useTracker(() => {

        const team = TeamCollection.findOne({_id: teamId});
        if (team && !teamName && !teamLeader && teamMembers.length === 0) {
            setTeamName(team.teamName);
            setTeamLeader(team.teamLeader);
            setTeamMembers(team.teamMembers);
            setTeamInvitations(team.teamInvitations)
        }
        return team;
    });

    // load team member data
    const isLoadingUsers = useSubscribe('all_users');
    const usersData = useTracker(() => {
        return UserCollection.find().fetch();
    });

    const isLoading = isLoadingTeams() || isLoadingUsers();

    // leave team modal variables
    const [open, setOpen] = useState(false);
    const onOpenModal = () => setOpen(true);
    const onCloseModal = () => setOpen(false);
    const closeIcon = <XCircleIcon color={"var(--navy)"} strokeWidth={2} viewBox="0 0 24 24" width={35} height={35}/>

    // errors and messages
    const [errors, setErrors] = useState({
        teamName: "",
        email: ""
    });
    const [updateSuccess, setUpdateSuccess] = useState(null)
    const [leaveDeleteMessage, setLeaveDeleteMessage] = useState('')

    // handler for submitting changes to save
    const saveChanges = (event) => {
        event ? event.preventDefault() : null;

        setUpdateSuccess(null)
        setLeaveDeleteMessage('')

        if (!isLeader) {
            // if user is not leader, cannot update (extra check)
            setUpdateSuccess(false);
            return;
        }

        const newErrors = {};
        let isError = false;

        if (teamName === '') {
            newErrors.teamName = "Please fill in your team name";
            isError = true;
        } else if (teamMembers.length < 1) {
            newErrors.teamMembers = "Please fill in your team member";
            isError = true;
        }

        setErrors(newErrors);

        if (!isError) {
            new Promise((resolve, reject) => {
                Meteor.call('update_team', teamId, teamData.teamInvitations,
                    {
                        teamName: teamName,
                        teamLeader: teamLeader,
                        teamMembers: teamMembers,
                        teamInvitations: teamInvitations,

                    }, (error, result) => {
                        if (error) {
                            reject(error)
                        } else {
                            resolve(result)
                            // set success message
                            setUpdateSuccess(true)

                            // clear inputs
                            setTeamName('');
                            setTeamLeader('');
                            setTeamMembers([]);
                            setTeamInvitations([])
                            setNewInvitation('');
                            setErrors({});
                            setNewLeader('');

                            // reload page
                            window.location.reload();
                        }
                    });
            }).catch(() => {
                setUpdateSuccess(false)
            });
        }
    };

    // handler for adding new member invitation
    const handleAddInvitation = (event) => {
        event.preventDefault();
        const newError = {};
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

        if (teamMembers.map((member) => member.toLowerCase()).includes(newInvitation.toLowerCase())) {
            newError.email = "Member is already in the team";

        } else if (teamInvitations.map((invitation) => invitation.email.toLowerCase()).includes(newInvitation.toLowerCase())) {
            newError.email = "Email has already been invited. If you would like to resend invitation, please remove the existing invitation first";

        } else if (!emailRegex.test(newInvitation)) {
            newError.email = "Please input a valid email address";

        } else {
            setTeamInvitations([...teamInvitations, {"email": newInvitation, "token": generateInvitationToken()}]);
            setNewInvitation('');
            setErrors({});
        }
        setErrors(newError);
    };

    // handler for removing existing member
    const handleRemoveMember = (removeEmail) => {
        setTeamMembers(teamMembers.filter(member => member !== removeEmail));
    };

    // handler for removing existing member invitation
    const handleRemoveInvitation = (removeEmail) => {
        setTeamInvitations(teamInvitations.filter(invite => invite.email !== removeEmail));
    };

    // handler for leaving team
    const leaveTeam = (needReassignLeader) => {
        const membersWithoutUser = teamData.teamMembers.filter(m => m !== userInfo.email);

        new Promise((resolve, reject) => {
            Meteor.call('update_team', teamId, teamData.teamInvitations,
                {
                    "teamName": teamData.teamName,
                    "teamLeader": needReassignLeader ? newLeader : teamLeader,
                    "teamMembers": membersWithoutUser,
                    "teamInvitations": teamData.teamInvitations,

                }, (error, result) => {
                    if (error) {
                        reject(error)
                    } else {
                        resolve(result)
                        // clear inputs
                        setTeamName('');
                        setTeamLeader('');
                        setTeamMembers([]);
                        setTeamInvitations([])
                        setNewInvitation('');
                        setNewLeader('');
                        setErrors({});

                        onCloseModal();
                        navigate('/teams');
                    }
                })
        }).catch(() => {
            setLeaveDeleteMessage("Leave team failed, please try again")
        });
    };

    // handler for deleting team
    const deleteTeam = () => {
        new Promise((resolve, reject) => {
            Meteor.call('delete_team', teamId, (error, result) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(result)
                    navigate('/teams');
                }
            });
        }).catch(() => {
            setLeaveDeleteMessage("Delete team failed, please try again")
        });
    }

    const helpText = "This is the team settings page for team leaders to modify team details and team members to view team details. " +
        "You may also permanently leave the team.";

    if (isLoading) {
        return (
            <WhiteBackground pageLayout={PageLayout.LARGE_CENTER}>
                <Spinner animation="border" variant="secondary" role="status"/>
            </WhiteBackground>
        )
    } else {
        // check user is in the team
        if (!teamData || !teamData.teamMembers.includes(userInfo.email)) {
            // user is not in team, or team does not exist, move them back to their teams list
            navigate('/' + BaseUrlPath.TEAMS)
        }

        if (teamData.teamLeader === userInfo.email && !isLeader) {
            setIsLeader(true);
        }

        const teamMembersData = usersData.filter(user => teamMembers.includes(user.emails[0].address));
        const leaderName = teamMembersData.length ? teamMembersData.filter(m => m.emails[0].address === teamData.teamLeader)[0].profile.name : "";

        return (
            <>
                <WhiteBackground pageHelpText={helpText} pageLayout={PageLayout.LARGE_CENTER}>

                    <div className="header-space-between">
                        <Button className={"flex flex-row gap-2 btn-back"}
                                onClick={() => {
                                    navigate(`/teams/${teamId}`);
                                }}>
                            <ChevronLeftIcon strokeWidth={2} viewBox="0 0 23 23" width={20} height={20}/>
                            Back
                        </Button>

                        <h1 className={"text-center"}>Team Settings</h1>
                        <div style={{width: "120px"}}/>
                    </div>

                    <form className={"settings-form"} onSubmit={saveChanges}>

                        {/* team name display / input */}
                        <div className="settings-form-input">
                            <label className={"main-text text-grey"}>Team Name:</label>
                            {isLeader ?
                                <div className={"input-error-div"}>
                                    <Input value={teamName} onChange={(e) => setTeamName(e.target.value)}/>
                                    {errors.teamName &&
                                        <span className="text-red small-text">{errors.teamName}</span>}
                                </div> :
                                <div className='ts__member-item'>{teamData.teamName}</div>
                            }
                        </div>

                        {/* team leader display / selection */}
                        <div className="settings-form-input">
                            <label className={"main-text text-grey"}>Team Leader:</label>
                            {isLeader ?
                                <select className={"input-base"}
                                        value={teamLeader}
                                        onChange={(e) => setTeamLeader(e.target.value)}>
                                    {
                                        teamMembersData.map(user =>
                                            <option key={user._id} value={user.emails[0].address}>
                                                {user.profile.name} (@{user.emails[0].address})
                                            </option>
                                        )
                                    }
                                </select> :
                                <div className='ts__member-item'>{leaderName} ({teamData.teamLeader})</div>
                            }
                        </div>

                        {/* list of team members */}
                        <div className="settings-form-input" style={{alignItems: "start"}}>
                            <label className={"main-text text-grey"}>Team Members:</label>
                            <div className="ts__member-item-list">
                                {teamMembersData.length <= 1 ?
                                    <div className='ts__member-item text-grey'>There are no other members</div> :
                                    teamMembersData
                                        .filter(member => member.emails[0].address !== teamData.teamLeader)
                                        .map((member, index) => (
                                            <Fragment key={member.username}>
                                                {index === 0 ? null : <div/>}

                                                <div className='ts__member-item'>
                                                    {member.profile.name} ({member.emails[0].address})
                                                    {
                                                        // display buttons to remove team members if isLeader
                                                        isLeader ?
                                                            <button className="icon-btn"
                                                                    onClick={() => handleRemoveMember(member.emails[0].address)}>
                                                                <MinusCircleIcon color={"var(--navy)"} strokeWidth={2}
                                                                                 viewBox="0 0 24 24" width={30}
                                                                                 height={30}/>
                                                            </button> : null
                                                    }
                                                </div>
                                            </Fragment>
                                        ))
                                }
                            </div>
                        </div>

                        {/* list of invitation */}
                        <div className="settings-form-input" style={{alignItems: "start"}}>
                            <label className={"main-text text-grey"}>Invitations:</label>
                            <div className="ts__member-item-list">

                                {teamInvitations.length <= 0 ?
                                    <div className='ts__member-item text-grey'>No pending invitations</div> :
                                    teamInvitations
                                        .map((invitation, index) => (
                                            <Fragment key={invitation.email}>
                                                {index === 0 ? null : <div/>}

                                                <div className='ts__member-item'>
                                                    {invitation.email}
                                                    {
                                                        // display buttons to remove team members if isLeader
                                                        isLeader ?
                                                            <button className="icon-btn"
                                                                    onClick={() => handleRemoveInvitation(invitation.email)}>
                                                                <MinusCircleIcon color={"var(--navy)"} strokeWidth={2}
                                                                                 viewBox="0 0 24 24" width={30}
                                                                                 height={30}/>
                                                            </button> : null
                                                    }
                                                </div>
                                            </Fragment>
                                        ))
                                }
                            </div>
                        </div>

                        {/* input field for adding new invitation */}
                        {isLeader ?
                            <div className="settings-form-input" style={{alignItems: "start"}}>
                                <div/>
                                <div className='ts__member-item'>
                                    <div className={"input-error-div"}>
                                        <Input type="email" placeholder={"Input new member email"}
                                               value={newInvitation}
                                               onChange={(e) => setNewInvitation(e.target.value)}/>
                                        {errors.email && <span className="text-red small-text">{errors.email}</span>}
                                    </div>
                                    <button className="icon-btn" onClick={handleAddInvitation}>
                                        <PlusCircleIcon color={"var(--navy)"} strokeWidth={2} viewBox="0 0 24 24"
                                                        width={30}
                                                        height={30}/>
                                    </button>
                                </div>
                            </div> : null
                        }

                        {/* submit button if leader */}
                        {isLeader ?
                            <Button className="btn-brown btn-submit" type={"submit"} onClick={(e) => saveChanges(e)}>
                                Save Changes
                            </Button> : null
                        }

                        {updateSuccess === null ? null :
                            updateSuccess ?
                                <span className="text-green small-text non-clickable">Board has been updated!</span> :
                                <span
                                    className="text-red small-text non-clickable">Update failed, please try again.</span>
                        }
                    </form>

                    <span className={"text-red underline clickable"} style={{width: "100%", textAlign: "end"}}
                          onClick={onOpenModal}>Leave Team</span>
                </WhiteBackground>

                {/* leave team modal */}
                {
                    // if there is only 1 user left (the leader)
                    teamData.teamMembers.length === 1 ?
                        <Modal
                            closeIcon={closeIcon}
                            classNames={{modal: classNames('modal-base', '')}}
                            open={open}
                            onClose={onCloseModal}
                            center>
                            <div className={"modal-div-center"}>
                                <h1 className={"text-center"}>Delete Team</h1>
                                <span className={"main-text"}>You are the last member in the team, leaving the team will delete the team.</span>
                                <span className={"main-text"}>Are you sure?</span>
                                <div className={"button-group-row btn-submit"}>
                                    <Button className={"btn-red"} onClick={deleteTeam}>Confirm</Button>
                                    <Button className={"btn-grey"} onClick={onCloseModal}>Cancel</Button>
                                </div>
                                {leaveDeleteMessage &&
                                    <span className="text-red small-text non-clickable">{leaveDeleteMessage}</span>}
                            </div>
                        </Modal>
                        :

                        // not the last user
                        <Modal
                            closeIcon={closeIcon}
                            classNames={{
                                modal: classNames('modal-base', ''),
                            }}
                            open={open}
                            onClose={onCloseModal}
                            center
                        >
                            <div className='modal-div-center'>
                                {isLeader ?
                                    // if you are the leader, and there are other members
                                    <>
                                        <h1 className={"text-center"}>Reassign Team Leader</h1>
                                        <div className={"main-text"}>You are currently the leader of the team.</div>
                                        <div className={"main-text"}>You must assign the team leader before you can
                                            leave
                                            the team.
                                        </div>
                                        <br/>

                                        <div className="settings-form-input">
                                            <label className={"main-text text-grey"}>New Team Lead:</label>
                                            <select className={"input-base"} value={newLeader}
                                                    onChange={(e) => setNewLeader(e.target.value)}>
                                                {teamMembersData.filter(user => user.emails[0].address !== userInfo.email).map(user => (
                                                    <option key={user.username} value={user.emails[0].address}>
                                                        {user.profile.name} ({user.emails[0].address})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className={"button-group-row btn-submit"}>
                                            <Button className={"btn-red"} onClick={() => leaveTeam(true)}>Save & Leave
                                                Team</Button>
                                            <Button className={"btn-grey"} onClick={onCloseModal}>Cancel</Button>
                                        </div>
                                    </>

                                    : // if you are a normal team member
                                    <>
                                        <h1 className={"text-center"}>Leave Team</h1>
                                        <div className={"main-text"}>You will permanently leave the team.</div>
                                        <div className={"main-text"}>Are you sure?</div>

                                        <div className={"button-group-row btn-submit"}>
                                            <Button className={"btn-red"} onClick={() => leaveTeam(false)}>Leave Team</Button>
                                            <Button className={"btn-grey"} onClick={onCloseModal}>Cancel</Button>
                                        </div>
                                    </>
                                }
                                {leaveDeleteMessage &&
                                    <span className="text-red small-text non-clickable">{leaveDeleteMessage}</span>}
                            </div>
                        </Modal>
                }
            </>
        );
    }
};

export default TeamSettingsPage;