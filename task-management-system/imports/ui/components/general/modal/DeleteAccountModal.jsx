/**
 * File Description: Account Deletion modal component
 * Updated Date: 16/08/2024
 * Contributors: Mark
 * Version: 2.0
 */


import React, { useState, useEffect } from 'react';
import { Modal } from 'react-responsive-modal';
import classNames from "classnames";

import { getUserInfo } from '../../util';
import { Meteor } from 'meteor/meteor';
import {useSubscribe, useTracker} from 'meteor/react-meteor-data'
import TeamCollection from '../../../../api/collections/team.js'      


import { XCircleIcon } from "@heroicons/react/24/outline";
import Button from "../buttons/Button";
import '../../general/modal/modal.css';


const DeleteAccountModal = ({ open, closeHandler }) => {
    const userData = getUserInfo();
    const id = userData.id;
    const userEmail = userData.email;
    const [isJoined, setIsJoined] = useState(false);

    const closeIcon = <XCircleIcon color={"var(--navy)"} strokeWidth={2} viewBox="0 0 24 24" width={35} height={35} />

    const [errorMessage, setErrorMessage] = useState(''); // State to store error message
    const [successMessage, setSuccessMessage] = useState(''); // State to store success message

    const isLoading = useSubscribe('all_user_teams', userEmail)();

    const teamsData = useTracker(() => {
        if (!isLoading) {
            return TeamCollection.find({ teamMembers: userEmail }).fetch();
        }
        return [];
    }, [userEmail, isLoading]);

    useEffect(() => {
        if (teamsData.length > 0) {
            setIsJoined(true);
        } else {
            setIsJoined(false);
        }
    }, [teamsData]);

    const handleClick = () => {
        Meteor.call(
            "check_if_join_any_team", id, (result) => {
                setIsJoined(result);
            }
        )

        // usr is allowed to delete account if they are not joined to any team
        if (isJoined) {
            setErrorMessage("You must leave all the teams first.");
        } else {
            handleDelete();
        }

    }

    const handleDelete = () => {
        // Call method to delete user
        Meteor.call('delete_user', id, (error) => {
            if (error) {
                setErrorMessage(`Failed to delete user: ${error.reason}`);
            } else {
                setSuccessMessage("User deleted successfully.");
            }
        });
    };

    return (
        <Modal
            closeIcon={closeIcon}
            classNames={{
                modal: classNames('modal-base', ''),
            }}
            open={open}
            onClose={closeHandler}
            center
            styles={
                {modal: {minHeight: '400px'}}
            }
            >
            <div className='modal-div-center'>
                <h1>Delete Account?</h1>
                <p>Are you sure you would like to your account and all data associated with it? 
                    You must leave all the teams first.</p>
                <p className='alert-text'>This action cannot be reverted.</p>
            
            {/* Display error message */}
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            {/* Display success message */}
            {successMessage && <div className="success-message">{successMessage}</div>}

            <div className="button-group">
                <Button
                    type={"submit"} 
                    className="btn-red"
                    onClick={handleClick}>Delete</Button>

                <Button
                    className="btn-brown"
                    onClick={closeHandler}>Cancel</Button>

                    </div>
            </div>
        </Modal>
    );
}

export default DeleteAccountModal;