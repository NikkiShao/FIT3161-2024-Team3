/**
 * File Description: Team creation modal component
 * Updated Date: 05/08/2024
 * Contributors: Mark, Nikki
 * Version: 2.0
 */

import React, {Fragment, useState} from 'react';
import classNames from "classnames";
import {Modal} from 'react-responsive-modal';
import {MinusCircleIcon, PlusCircleIcon, XCircleIcon} from "@heroicons/react/24/outline";
import Button from "../buttons/Button";
import Input from "../inputs/Input";
import {getUserInfo} from "../../util";
import '../../general/modal/modal.css';

/**
 * The popup for adding a new team on the teams list page
 */
export const TeamCreationModal = ({open, closeHandler}) => {
    // get user data here
    const userData = getUserInfo();
    const teamLead = userData.email;

    // State variables for team creation form
    const [teamNameInput, setTeamNameInput] = useState('');
    const [emailInput, setEmailInput] = useState('');
    const [members, setMembers] = useState([]);

    // State variable for error messages
    const [errors, setErrors] = useState({
        teamName: "",
        email: ""
    });


    // Regex for validating email addresses
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

    // Icons for UI elements
    const closeIcon = <XCircleIcon color={"var(--navy)"} strokeWidth={2} viewBox="0 0 24 24" width={35} height={35}/>;
    const trashIcon = <MinusCircleIcon color={"var(--dark-grey)"} strokeWidth={2} viewBox="0 0 24 24" width={30}
                                       height={30}/>;
    const plusIcon = <PlusCircleIcon color={"var(--dark-grey)"} strokeWidth={2} viewBox="0 0 24 24" width={30}
                                     height={30}/>;

    // Handler for adding a new team member
    const handleAddMember = (event) => {
        event ? event.preventDefault() : null;
        const newError = {}

        // test email validity
        if (members.includes(emailInput)) {
            newError.email = "Email has already been added";

        } else if (emailInput.toLowerCase() === teamLead.toLowerCase()) {
            newError.email = "You are already in the team";

        } else if (!emailRegex.test(emailInput)) {
            newError.email = "Please input a valid email address";

        } else {
            setMembers([...members, emailInput]);
            setEmailInput('')
        }
        setErrors(newError)
    };

    // Handler for removing a team member
    const handleRemoveMember = (event, emailToRemove) => {
        event.preventDefault();
        setMembers(members.filter(member => member !== emailToRemove));
    };

    // Handler for creating a new team
    const handleCreateTeam = (event) => {
        event.preventDefault();

        const newErrors = {}
        let isError = false;

        // do some error stuff here
        if (!teamNameInput) {
            newErrors.teamName = "Please fill in your team name";
            isError = true;
        } else if (teamNameInput.length > 20) {
            newErrors.teamName = "Team name can not exceed 20 characters";
            isError = true
        }

        setErrors(newErrors)

        if (!isError) {
            // Call the Meteor method to add a new team
            new Promise((resolve, reject) => {

                Meteor.call('add_team', teamNameInput, members, teamLead,
                    (error, result) => {
                        if (error) {
                            reject(`Error: ${error.message}`);

                        } else {
                            resolve(result);
                            closeHandler();
                        }
                    });
            }).catch(() => {
                const newError = {}
                newError.email = "Creation failed: please try again";
                setErrors(newError)
            })

        }

    }
    return (
        <Modal
            closeIcon={closeIcon}
            classNames={{modal: classNames('modal-base', '')}}
            open={open}
            onClose={closeHandler}
            center
        >

            {/*external most div*/}
            <div className={"modal-div-center"}>

                <h1 className={"text-center"}>Create New Team</h1>

                {/* Input field for team name */}
                <div className='input-group'>
                    <label className={"main-text text-grey"}>Team Name:</label>
                    <div className={"input-error-div"}>
                        <Input
                            type="text"
                            placeholder={"Max 20 characters"}
                            id={"teamName"}
                            value={teamNameInput}
                            onChange={(e) => setTeamNameInput(e.target.value)}
                        />
                        {errors.teamName && <span className="text-red small-text">{errors.teamName}</span>}
                    </div>
                    <div></div>
                </div>

                {/* Team leader display */}
                <div className='input-group'>
                    <label className={"main-text text-grey"}>Team Leader:</label>
                    <div className={"main-text"}>{userData.name} ({teamLead})</div>
                    <div></div>
                </div>

                {/* Display team members email address if there are team members */}
                {
                    members && members.length > 0 ?
                        <div className='input-group'>
                            {
                                members.map((member, index) => (
                                    <Fragment key={index}>
                                        {index === 0 ?
                                            <label className={"main-text text-grey"}>Team Members:</label> :
                                            <div></div>}
                                        <div className="main-text">
                                            {member}
                                            <button className="icon-btn"
                                                    onClick={(event) =>
                                                        handleRemoveMember(event, member)}>
                                                {trashIcon}
                                            </button>
                                        </div>
                                        <div></div>
                                    </Fragment>
                                ))
                            }
                        </div> :
                        null
                }

                {/* Input field to add new members */}
                <div className='input-group'>
                    {members && members.length === 0 ?
                        <label className={"main-text text-grey"}>Team Members:</label> :
                        <div></div>
                    }
                    <div className={"input-error-div"}>
                        <Input
                            type="email"
                            placeholder="example@gmail.com"
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                        />
                        {errors.email && <span className="text-red small-text">{errors.email}</span>}
                    </div>
                    <button className="icon-btn" onClick={handleAddMember}>
                        {plusIcon}
                    </button>
                </div>

                {/* Button to create the team */}
                <Button type={"submit"} className="btn-brown btn-submit"
                        onClick={(event) => handleCreateTeam(event)}>
                    Create Team
                </Button>
            </div>
        </Modal>
    );
};

export default TeamCreationModal;
