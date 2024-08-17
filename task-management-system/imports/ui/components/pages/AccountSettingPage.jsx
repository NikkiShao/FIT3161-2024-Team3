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

    const [errors, setErrors] = useState({});

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

        // Check if email is already in use and if deplicated

        if (email === userData.email) {
            setErrorMessage("Email address is the same as the current email address.");
            return;
        } else if (isLoadingUsers && result.length > 0) {
            setErrorMessage("Email address already exists.");
            return;
        }


        // Update team data
        teamsData.forEach((team) => {
            const isLeader = (team.teamLeader === userData.email)
            const updatedTeamLeader = isLeader ? email : team.teamLeader
            const updatedTeamMembers = team.teamMembers.map(member => member === userData.email ? email : member)

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
        })

        // Call method to update user info
        Meteor.call('update_user_info', userData.id, name, email, emailNotifications === "On", (error) => {
            if (error) {
                setErrorMessage(`Failed to update user info: ${error.reason}`);
            } else {
                setSuccessMessage("User info updated successfully.");
            }
        });
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
