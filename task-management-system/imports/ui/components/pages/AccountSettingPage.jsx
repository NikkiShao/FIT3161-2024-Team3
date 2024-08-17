import React, {useState} from 'react';
import {useSubscribe, useTracker} from 'meteor/react-meteor-data'
import {Meteor} from 'meteor/meteor';
import {getUserInfo} from '../util';

import WhiteBackground from "../general/whiteBackground/WhiteBackground";
import Button from "../general/buttons/Button";
import DeleteAccountModal from '../general/modal/DeleteAccountModal';
import PageLayout from "../../enums/PageLayout";

import TeamCollection from '../../../api/collections/team.js'
import UserCollection from '../../../api/collections/user.js';
import "../pages/registration/registration.css"
import Input from "../general/inputs/Input";


function AccountSettings() {

    const userData = getUserInfo();

    const alphanumericSpaceRegex = /^[A-Za-z0-9 ]+$/i;
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [emailNotifications, setEmailNotifications] = useState(userData.notificationOn ? "On" : "Off");

    const [errorMessage, setErrorMessage] = useState(''); // State to store error message
    const [successMessage, setSuccessMessage] = useState(''); // State to store success message

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        emailNotification: "",
        updatedFields: ""
    });

    const isLoadingUsers = useSubscribe('all_users');

    const result = useTracker(() => {
        return UserCollection.find({"emails.address": email}).fetch();
    });

    // state to determine if the delete modal is open or not
    const [modalOpen, setModalOpen] = useState(false);
    const onOpenModal = () => setModalOpen(true);
    const onCloseModal = () => setModalOpen(false);

    const isLoading = useSubscribe('all_user_teams', userData.email)();

    const teamsData = useTracker(() => {
        if (!isLoading) {
            return TeamCollection.find({teamMembers: userData.email}).fetch();
        }
        return [];
    }, [userData.email, isLoading]);

    if (userData.id !== null && name === '' && email === '') {
        setName(userData.name);
        setEmail(userData.email);
        setEmailNotifications(userData.notificationOn);
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');
    
        const updatedFields = {};
        const newError = {};
        let isError = false;
    
        // Check if name has changed and validate
        if (name !== userData.name) {
            if (!name) {
                newError.name = "Please fill in your name";
                isError = true;
            }
            if (!alphanumericSpaceRegex.test(name)) {
                newError.name = "Name can only contain alphanumeric characters and spaces";
                isError = true;
            }
            updatedFields.name = name;
        }
    
        // Check if email has changed and validate
        if (email !== userData.email) {
            if (!email) {
                newError.email = "Please fill in your email";
                isError = true;
            }
            if (!emailRegex.test(email)) {
                newError.email = "Please enter a valid email address";
                isError = true;
            }
    
            if (isLoadingUsers && result.length > 0) {
                newError.email = "Email address already exists";
                isError = true;
            }
    
            updatedFields.email = email;
        }
    
        // Check if email notifications setting has changed
        if (emailNotifications !== userData.notificationOn) {
            updatedFields.notificationOn = emailNotifications === "On";
        }
    
        if (Object.keys(updatedFields).length === 0) {
            newError.updatedFields = "No changes detected";
            isError = true;
        }
        setErrors(newError);

        if(!isError){
        // Update team data if email changed
        if (updatedFields.email) {
            teamsData.forEach((team) => {
                const isLeader = (team.teamLeader === userData.email)
                const updatedTeamLeader = isLeader ? updatedFields.email : team.teamLeader
                const updatedTeamMembers = team.teamMembers.map(member => member === userData.email ? updatedFields.email : member)
    
                Meteor.call('update_team', team._id, {
                        teamName: team.teamName,
                        teamLeader: updatedTeamLeader,
                        teamMembers: updatedTeamMembers
                    }, (error) => {
                        if (error) {
                            setErrorMessage(`Failed to update team info: ${error.reason}`);
                        }
                    }
                )
            });
        }
    
        // Call method to update user info
        Meteor.call('update_user_info', userData.id, updatedFields.name || userData.name, updatedFields.email || userData.email, updatedFields.notificationOn !== undefined ? updatedFields.notificationOn : userData.notificationOn, (error) => {
            if (error) {
                setErrorMessage(`Failed to update user info: ${error.reason}`);
            } else {
                setSuccessMessage("User info updated successfully.");
            }
        });}
    };
    
    const helpText = "This is the page where you can modify your account related details. " +
        "You can also delete your account and all associated data."

    return (
        <WhiteBackground pageLayout={PageLayout.LARGE_CENTER} pageHelpText={helpText}>
            <DeleteAccountModal open={modalOpen} closeHandler={onCloseModal}/>

            <h1>Account Setting Page</h1>

            <form className={"settings-form"}>

                <div className="settings-form-input">
                    <label className={"main-text text-grey"}>Name:</label>
                    <div className={"input-error-div"}>
                        <Input
                            type="text"
                            value={name}
                            placeholder='Enter Name'
                            onChange={e => setName(e.target.value)}
                        />
                        {errors.name && <span className="text-red small-text">{errors.name}</span>}
                    </div>
                </div>

                <div className="settings-form-input">
                    <label className={"main-text text-grey"}>Email:</label>
                    <div className={"input-error-div"}>
                        <Input
                            type="email"
                            value={email}
                            placeholder='Enter Email Address'
                            onChange={e => setEmail(e.target.value)}
                        />
                        {errors.email && <span className="text-red small-text">{errors.email}</span>}
                    </div>
                </div>

                <div className="settings-form-input">
                    <label className={"main-text text-grey"}>Email Notifications:</label>
                    <div className={"input-error-div"}>
                        <select value={emailNotifications} className={"input-base input-tiny"}
                                onChange={e => setEmailNotifications(e.target.value)}>
                            <option value="On">On</option>
                            <option value="Off">Off</option>
                        </select>
                        {errors.emailNotification &&
                            <span className="text-red small-text">{errors.emailNotification}</span>}
                    </div>
                </div>

                {/* Display error message */}
                {errorMessage && <div className="text-red">{errorMessage}</div>}

                {/* Display success message */}
                {successMessage && <div className="text-green">{successMessage}</div>}

                {errors.updatedFields && <span className="text-red small-text">{errors.updatedFields}</span>}

                <Button
                    className={"btn-brown btn-submit"}
                    onClick={handleSubmit}> Save Changes </Button>
            </form>

            <div style={{width: "100%", minWidth: "100%", maxWidth: "100%", textAlign: "right"}}
                 className={"text-red underline clickable"}
                 onClick={onOpenModal}
            >Delete account and all data
            </div>
        </WhiteBackground>
    );
}

export default AccountSettings;
