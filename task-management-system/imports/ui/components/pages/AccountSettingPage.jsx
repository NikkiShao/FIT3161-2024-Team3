/**
 * File Description: Account Settings Page
 * Contributors: Mark, Audrey, Nikki
 * Version: 1.4
 */

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

/**
 * Account settings page component
 */
function AccountSettings() {

    const userData = getUserInfo();
    const alphanumericSpaceRegex = /^[A-Za-z0-9 ]+$/i;
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

    const [nameInput, setNameInput] = useState('');
    const [emailInput, setEmailInput] = useState('');
    const [emailNotificationOn, setEmailNotificationOn] = useState(userData.notificationOn ? "On" : "Off");

    const [errorMessage, setErrorMessage] = useState(''); // State to store error message
    const [updateSuccess, setUpdateSuccess] = useState(null)

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        emailNotification: "",
        updatedFields: ""
    });

    const isLoadingUsers = useSubscribe('all_users');

    const result = useTracker(() => {
        return UserCollection.find({"emails.address": emailInput}).fetch();
    });

    // state to determine if the delete modal is open or not
    const [modalOpen, setModalOpen] = useState(false);
    const onOpenModal = () => setModalOpen(true);
    const onCloseModal = () => setModalOpen(false);

    // get user's teams data
    const isLoading = useSubscribe('all_user_teams', userData.email)();
    const teamsData = useTracker(() => {
        if (!isLoading) {
            return TeamCollection.find({teamMembers: userData.email}).fetch();
        }
        return [];
    }, [userData.email, isLoading]);

    // default inputs
    if (userData.id !== null && nameInput === '' && emailInput === '') {
        setNameInput(userData.name);
        setEmailInput(userData.email);
        setEmailNotificationOn(userData.notificationOn ? "On" : "Off");
    }

    // handler for submission
    const handleSubmit = (event) => {
        event.preventDefault();

        // reset messages
        setUpdateSuccess(null);
        setErrorMessage('');

        const updatedFields = {};
        const newError = {};
        let isError = false;

        // Check if name has changed and validate
        if (nameInput !== userData.name) {
            if (nameInput === '') {
                newError.name = "Please fill in your name";
                isError = true;
            } else if (!alphanumericSpaceRegex.test(nameInput)) {
                newError.name = "Name can only contain alphanumeric characters and spaces";
                isError = true;
            } else if (nameInput.length > 30) {
                newError.name = "Name can not exceed 30 characters";
                isError = true;
            }
            updatedFields.name = nameInput;
        }

        // Check if email has changed and validate
        if (emailInput !== userData.email) {
            if (emailInput === '') {
                newError.email = "Please fill in your email";
                isError = true;
            } else if (!emailRegex.test(emailInput)) {
                newError.email = "Please enter a valid email address";
                isError = true;
            }

            if (isLoadingUsers && result.length > 0) {
                newError.email = "Email address already exists";
                isError = true;
            }

            updatedFields.email = emailInput;
        }

        // Check if email notifications setting has changed
        const boolEmailNotificationOn = emailNotificationOn === "On";
        if (boolEmailNotificationOn !== userData.notificationOn) {
            updatedFields.notificationOn = boolEmailNotificationOn;
        }

        if (Object.keys(updatedFields).length === 0) {
            newError.updatedFields = "No changes detected";
            isError = true;
        }
        setErrors(newError);

        if (!isError) {

            const updateUserPromise = new Promise((resolve, reject) => {
                Meteor.call('update_user_info',
                    userData.id, nameInput, emailInput, boolEmailNotificationOn,
                    (error, result) => {
                        if (error) {
                            reject(error)
                        } else {
                            resolve(result)
                            setUpdateSuccess(true)
                        }
                    })
            })

            // Update team data if email changed
            if (updatedFields.email) {
                teamsData.forEach((team) => {
                    let isErrored = false;

                    const isLeader = (team.teamLeader === userData.email)
                    const updatedTeamLeader = isLeader ? updatedFields.email : team.teamLeader
                    const updatedTeamMembers = team.teamMembers.map(member => member === userData.email ? updatedFields.email : member)

                    new Promise((resolve, reject) => {
                        Meteor.call('update_team', team._id, team.teamInvitations, true, {
                                teamName: team.teamName,
                                teamLeader: updatedTeamLeader,
                                teamMembers: updatedTeamMembers,
                                teamInvitations: team.teamInvitations
                            }, (error, result) => {
                                if (error) {
                                    reject(error)
                                } else {
                                    resolve(result)
                                }
                            }
                        )

                    }).catch(() => {
                        setUpdateSuccess(false);
                        isErrored = true;
                        setErrorMessage(`Failed to update associated team information, please try again.`);

                    }).then(() => {
                        // check that teams update hasn't failed, if it has stop here
                        if (!isErrored) {
                            // Call method to update user info
                            updateUserPromise.catch(() => {
                                setUpdateSuccess(false)
                                setErrorMessage(`Failed to update user information, please try again.`);
                            })
                        }

                    })
                });
            } else {
                // email not updated, can directly update user info
                updateUserPromise.catch(() => {
                    setUpdateSuccess(false)
                    setErrorMessage(`Failed to update user information, please try again.`);
                })
            }
        }
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
                            value={nameInput}
                            placeholder='Enter Name'
                            onChange={e => setNameInput(e.target.value)}
                        />
                        {errors.name && <span className="text-red small-text">{errors.name}</span>}
                    </div>
                </div>

                <div className="settings-form-input">
                    <label className={"main-text text-grey"}>Email:</label>
                    <div className={"input-error-div"}>
                        <Input
                            type="email"
                            value={emailInput}
                            placeholder='Enter Email Address'
                            onChange={e => setEmailInput(e.target.value)}
                        />
                        {errors.email && <span className="text-red small-text">{errors.email}</span>}
                    </div>
                </div>

                <div className="settings-form-input">
                    <label className={"main-text text-grey"}>Email Notifications:</label>
                    <select defaultValue={emailNotificationOn} className={"input-base input-tiny"}
                            onChange={e => setEmailNotificationOn(e.target.value)}>
                        <option value="On">On</option>
                        <option value="Off">Off</option>
                    </select>
                </div>

                <Button className={"btn-brown btn-submit"} onClick={handleSubmit}>
                    Save Changes
                </Button>
                {updateSuccess === null ? null :
                    updateSuccess ?
                        <span className="text-green small-text non-clickable">Account details has been updated!</span> :
                        <span className="text-red small-text non-clickable">{errorMessage}</span>
                }
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
