import React, { useState } from 'react';
import { useSubscribe, useTracker } from 'meteor/react-meteor-data'
import { Meteor } from 'meteor/meteor';
import { getUserInfo } from '../util';

import WhiteBackground from "../general/whiteBackground/WhiteBackground";
import Button from "../general/buttons/Button";
import DeleteAccountModal from '../general/modal/DeleteAccountModal';
import PageLayout from "../../enums/PageLayout";

import TeamCollection from '../../../api/collections/team.js'
import "../pages/registration/registration.css"


function AccountSettings() {

    const userData = getUserInfo();
    console.log(userData);

    const userID = userData.id;
    const userEmail = userData.email;
    let notificationState = userData.notificationOn;


    const alphanumericSpaceRegex = /^[A-Za-z0-9 ]+$/i;
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [emailNotifications, setEmailNotifications] = useState(notificationState === true ? "On" : "Off");
    const [errorMessage, setErrorMessage] = useState(''); // State to store error message
    const [successMessage, setSuccessMessage] = useState(''); // State to store success message

    // state to determine if the delete modal is open or not
    const [modalOpen, setModalOpen] = useState(false);
    const onOpenModal = () => setModalOpen(true);
    const onCloseModal = () => setModalOpen(false);

    const isLoading = useSubscribe('all_user_teams', userEmail)();

    const teamsData = useTracker(() => {
        if (!isLoading) {
            return TeamCollection.find({ teamMembers: userEmail }).fetch();
        }
        return [];
    }, [userEmail, isLoading]);

    if(userID !== null && name === '' && email === ''){
        setName(userData.name);
        setEmail(userData.email);
        setEmailNotifications(userData.setEmailNotifications);}

    const handleSubmit = (event) => {
        event.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');


        if (emailNotifications === "On") {
            notificationState = true;
        } else {
            notificationState = false;
        }

        if (!name || !email) {
            setErrorMessage("Name and Email are required.");
            return;
        }

        // Validate name format using regex
        if (!alphanumericSpaceRegex.test(name)) {
            setErrorMessage("Name can only contain alphanumeric characters and spaces.");
            return;
        }

        // Validate email format using regex
        if (!emailRegex.test(email)) {
            setErrorMessage("Please enter a valid email address.");
            return;
        }

        // Update team data
        teamsData.forEach((team) => {
            const isLeader = (team.teamLeader === userEmail)
            const updatedTeamLeader = isLeader ? email : team.teamLeader
            const updatedTeamMembers = team.teamMembers.map(member => member === userEmail ? email : member)

            Meteor.call('update_team', team._id, {teamName: team.teamName, teamLeader: updatedTeamLeader, teamMembers: updatedTeamMembers }, (error) => {
                if (error) {
                    setErrorMessage(`Failed to update team info: ${error.reason}`);
                }
            }
            )
        })


        // Call method to update user info
        Meteor.call('update_user_info', userID, name, email, notificationState, (error) => {
            if (error) {
                setErrorMessage(`Failed to update user info: ${error.reason}`);
            } else {
                setSuccessMessage("User info updated successfully.");
            }
        });


    };

    return (
        <WhiteBackground pageLayout={PageLayout.LARGE_CENTER}>
            <DeleteAccountModal open={modalOpen} closeHandler={onCloseModal} />

            <h1>Account Setting Page</h1>
            <div className="input-container">
                <label> Name: </label>
                <input
                    type="text"
                    value={name}
                    placeholder='Enter Name'
                    onChange={e => setName(e.target.value)} />
                <label>Email:</label>
                <input
                    type="email"
                    value={email}
                    placeholder='Enter Email Address'
                    onChange={e => setEmail(e.target.value)} />
            </div>

            <div className="select-container">
                <label>Email Notifications:</label>
                <select value={emailNotifications} onChange={e => setEmailNotifications(e.target.value)}>
                    <option value="On">On</option>
                    <option value="Off">Off</option>
                </select>
            </div>

            {/* Display error message */}
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            {/* Display success message */}
            {successMessage && <div className="success-message">{successMessage}</div>}

            <Button
                className={"btn-brown"}
                onClick={handleSubmit}> Save Changes </Button>
            <button
                type="button"
                className="delete-button"
                onClick={onOpenModal}>
                Delete account and all data</button>
        </WhiteBackground>
    );
}

export default AccountSettings;
