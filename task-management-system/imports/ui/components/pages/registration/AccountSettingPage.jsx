import React, { useState } from 'react';
import WhiteBackground from "../../general/whiteBackground/WhiteBackground";
import Button from "../../general/buttons/Button";
import PageLayout from "../../../enums/PageLayout";
import "./registration.css"


function AccountSettings() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [emailNotifications, setEmailNotifications] = useState('On');

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Name:', name);
        console.log('Email:', email);
        console.log('Email Notifications:', emailNotifications);
    };

    return (
        <WhiteBackground pageLayout={PageLayout.SMALL_CENTER}>
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
