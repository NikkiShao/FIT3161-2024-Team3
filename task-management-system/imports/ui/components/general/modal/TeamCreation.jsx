/**
 * File Description: Team creation page
 * Updated Date: 20/07/2024
 * Contributors: Mark
 * Version: 2.0
 */

import React, { Fragment, useState } from 'react';
import classNames from "classnames";
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import '../../general/modal/modal.css';
import { XCircleIcon, TrashIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import Input from "../inputs/Input";
import Button from "../buttons/Button";
import { Meteor } from 'meteor/meteor';  // Import Meteor for method calls

import "../../general/modal/modal";

export const TeamCreation = () => {

    // State variables for team creation form
    const [teamName, setTeamName] = useState('');
    const [members, setMembers] = useState(['creeper@qq.com']);
    const [email, setEmail] = useState('');
    const [open, setOpen] = useState(false);
    const [error, setError] = useState('');

    // Handlers for opening and closing the modal
    const onOpenModal = () => setOpen(true);
    const onCloseModal = () => setOpen(false);

    // Regex for validating email addresses
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;;

    // Icons for UI elements
    const closeIcon = <XCircleIcon color={"var(--navy)"} strokeWidth={2} viewBox="0 0 24 24" width={35} height={35} />;
    const trashIcon = <TrashIcon color={"var(--navy)"} strokeWidth={2} viewBox="0 0 24 24" width={20} height={20} />;
    const plusIcon = <PlusCircleIcon color={"var(--navy)"} strokeWidth={2} viewBox="0 0 24 24" width={20} height={20} />;

    // Handler for adding a new team member
    const handleAddMember = () => {
        if (emailRegex.test(email) && !members.includes(email)) {
            setMembers([...members, email]);
            setEmail('');
            setError('');
        } else {
            setError('Invalid or duplicate email address');
        }
    };

    // Handler for removing a team member
    const handleRemoveMember = (emailToRemove) => {
        setMembers(members.filter(member => member !== emailToRemove));
    };

    // Handler for creating a new team
    const handleCreateTeam = () => {
        if (teamName && members.length > 0) {
            // Call the Meteor method to add a new team
            Meteor.call('add_team', teamName, members, members[0], (error) => {
                if (error) {
                    setError(error.reason);
                } else {
                    setTeamName('');
                    setMembers([]);
                    setOpen(false);
                    setError('');
                }
            });
        } else {
            setError('Team name and members are required');
        }
    };

    return (
        <>
            {/* Button to open the team creation modal */}
            <Button className={"btn-brown"} onClick={onOpenModal}>Create Team</Button>

            {/* Modal for team creation */}
            <Modal
                closeIcon={closeIcon}
                classNames={{
                    modal: classNames('modal-base', ''),
                }}
                open={open}
                onClose={onCloseModal}
                center>
                <h1>Create New Team</h1>

                {/* Input field for team name */}
                <div className='inputGroup'>
                    <label>Team Name:</label>
                    <Input
                        type="text"
                        placeholder="Enter your team name"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                    />
                    <div></div>
                </div>

                {/* Display and remove team members */}

                {/* Display team leader info, which is the 1st member */}
                {/* // todo: not working right now */}
                <div className='inputGroup'>
                    <label>Invite Members:</label>
                    {
                        members
                            .filter((_, index) => index === 0)
                            .map((member, index) => (
                            <Fragment key={index}>
                                <div className="memberItem">
                                    {member}
                                </div>
                                <div></div>
                            </Fragment>
                        ))
                    }
                </div>

                {/* Display team members email address */}

                <div className='inputGroup'>
                    {
                        members
                            .filter((_, index) => index > 0) 
                            .map((member, index) => (
                                <Fragment key={index + 1}> {/* +1 to ensure unique key */}
                                    <div></div>
                                    <div className="memberItem">
                                        {member}
                                        <button className="insertedButton" onClick={() => handleRemoveMember(member)}>
                                            {trashIcon}
                                        </button>
                                    </div>
                                    <div></div>
                                </Fragment>
                            ))
                    }
                </div>



                {/* Input field to add new members */}
                <div className='inputGroup'>
                    <div></div>
                    <Input
                        type="email"
                        placeholder="Enter Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button className="insertedButton" onClick={handleAddMember}>
                        {plusIcon}
                    </button>
                </div>

                {/* Error display*/}
                {error &&
                    <div className='error-display'>
                        <p style={{ color: 'red' }}>{error}</p>
                    </div>
                }

                {/* Button to create the team */}
                <div className='buttonGroup'>
                    <Button
                        className="buttomButton"
                        onClick={handleCreateTeam}>
                        Create Team
                    </Button>
                </div>

            </Modal>
        </>
    );
};

export default TeamCreation;
