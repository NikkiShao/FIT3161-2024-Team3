/**
 * File Description: Account Setting page
 * Updated Date: 08/08/2024
 * Contributors: Mark
 * Version: 1.0
 */


import React, { useEffect, useState } from 'react';
import WhiteBackground from "../general/whiteBackground/WhiteBackground";
import Button from "../general/buttons/Button";
import PageLayout from "../../enums/PageLayout";
import { Meteor } from 'meteor/meteor';

import { getUserInfo } from '../util';

import "../pages/registration/registration.css"

function AccountSettings() {

    const userData = getUserInfo();
    const userID = userData.id;
    let notificationState = userData.notificationOn;


    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [emailNotifications, setEmailNotifications] = useState(notificationState === true? "On" : "Off");

    const handleSubmit = (event) => {
        event.preventDefault(); 

        if(emailNotifications === "On") {
            notificationState = true;
        } else {
            notificationState = false;
        }
        
        if (!name || !email) {
            alert("Name and Email are required.");
            return;
        }

        Meteor.call('update_user_info', userID, name, email, notificationState, (error) => {
            if (error) {
                alert(`Failed to update user info: ${error.reason}`);
            } else {
                alert("User info updated successfully.");
            }
        });
    };

    return (
        <WhiteBackground pageLayout={PageLayout.LARGE_CENTER}>
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

            <Button 
                className={"btn-brown"}
                onClick={handleSubmit}> Save Changes </Button>
            <button type="button" className="delete-button">Delete account and all data</button>
        </WhiteBackground>
    );
}

export default AccountSettings;
