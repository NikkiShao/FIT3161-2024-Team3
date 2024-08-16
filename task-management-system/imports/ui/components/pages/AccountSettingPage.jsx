import React, { useState } from 'react';
import WhiteBackground from "../general/whiteBackground/WhiteBackground";
import Button from "../general/buttons/Button";
import PageLayout from "../../enums/PageLayout";
import { Meteor } from 'meteor/meteor';
import { getUserInfo } from '../util';
import "../pages/registration/registration.css"
import DeleteAccountModal from '../general/modal/DeleteAccountModal';


function AccountSettings() {

    const userData = getUserInfo();
    console.log(userData);


    const userID = userData.id;
    let notificationState = userData.notificationOn;
    let userName = userData.name;
    let userEmail = userData.email;

    const alphanumericSpaceRegex = /^[A-Za-z0-9 ]+$/i;
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [emailNotifications, setEmailNotifications] = useState(notificationState === true ? "On" : "Off");
    const [errorMessage, setErrorMessage] = useState(''); // State to store error message
    const [successMessage, setSuccessMessage] = useState(''); // State to store success message

    const [modalOpen, setModalOpen] = useState(false);
    const onOpenModal = () => setModalOpen(true);
    const onCloseModal = () => setModalOpen(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        // Clear previous error message
        setErrorMessage('');

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
                onClick={ onOpenModal }>
                Delete account and all data</button>
        </WhiteBackground>
    );
}

export default AccountSettings;
