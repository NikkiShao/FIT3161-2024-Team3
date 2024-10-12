/**
 * File Description: Team creation modal component
 * Updated Date: 05/08/2024
 * Contributors: Mark, Nikki
 * Version: 2.3
 */

import React, { Fragment, useState } from 'react';
import classNames from "classnames";
import { Modal } from 'react-responsive-modal';
import Button from "../buttons/Button";
import Input from "../inputs/Input";
import { getUserInfo } from "../../util";
import '../../general/modal/modal.css';
import { closeModalIcon, minusCircleIcon, subAddIcon } from "../../icons";

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

    // Handler for adding a new team member
    const handleAddMember = (event) => {
        event ? event.preventDefault() : null;
        const newError = {}

        // test email validity
        if (members.map((member) => member.toLowerCase()).includes(emailInput.toLowerCase().trim())) {
            newError.email = "Email has already been added";

        } else if (emailInput.toLowerCase().trim() === teamLead.toLowerCase()) {
            newError.email = "You are already in the team";

        } else if (!emailRegex.test(emailInput)) {
            newError.email = "Please input a valid email address";

        } else {
            setMembers([...members, emailInput.trim()]);
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
        if (!teamNameInput.trim()) {
            newErrors.teamName = "Please fill in your team name";
            isError = true;
        } else if (teamNameInput.trim().length > 20) {
            newErrors.teamName = "Team name can not exceed 20 characters";
            isError = true
        }

        // if email has text, check user hasn't forgotten to press the + button
        if (emailInput !== "") {
            newErrors.email = "You still have an unconfirmed email address left in the input. " +
                "Please press the '+' to add it or clear the input.";
            isError = true
        }

        setErrors(newErrors)

        if (!isError) {
            // Call the Meteor method to add a new team
            new Promise((resolve, reject) => {

                Meteor.call('add_team', teamNameInput.trim(), members, teamLead, true,
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
            closeIcon={closeModalIcon}
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
                                                {minusCircleIcon}
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
                <div className='input-group' style={{alignItems: "start"}}>
                    {members && members.length === 0 ?
                        <label className={"main-text text-grey"} style={{marginTop: "8px"}}>Team Members:
                        </label> :
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
                    <button className="icon-btn" style={{marginTop: "7px"}} onClick={handleAddMember}>
                        {subAddIcon}
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
