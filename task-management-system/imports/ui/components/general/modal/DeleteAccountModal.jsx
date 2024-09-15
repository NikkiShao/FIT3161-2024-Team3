/**
 * File Description: Account Deletion modal component
 * Updated Date: 16/08/2024
 * Contributors: Mark, Nikki
 * Version: 2.1
 */


import React, {useEffect, useState} from 'react';
import {Modal} from 'react-responsive-modal';
import classNames from "classnames";

import {getUserInfo} from '../../util';
import {Meteor} from 'meteor/meteor';
import {useSubscribe, useTracker} from 'meteor/react-meteor-data'
import TeamCollection from '../../../../api/collections/team.js'


import {XCircleIcon} from "@heroicons/react/24/outline";
import Button from "../buttons/Button";
import '../../general/modal/modal.css';


const DeleteAccountModal = ({open, closeHandler}) => {
    const userData = getUserInfo();
    const [isJoined, setIsJoined] = useState(false);

    const closeIcon = <XCircleIcon color={"var(--navy)"} strokeWidth={2} viewBox="0 0 24 24" width={35} height={35}/>

    const [errorMessage, setErrorMessage] = useState(''); // State to store error message

    const isLoading = useSubscribe('all_user_teams', userData.email)();

    const teamsData = useTracker(() => {
        if (!isLoading) {
            return TeamCollection.find({teamMembers: userData.email}).fetch();
        }
        return [];
    }, [userData.email, isLoading]);

    useEffect(() => {
        if (teamsData.length > 0) {
            setIsJoined(true);
        } else {
            setIsJoined(false);
        }
    }, [teamsData]);

    const handleClick = () => {

        // usr is allowed to delete account if they are not joined to any team
        if (isJoined) {
            setErrorMessage("Failed to delete user: You must leave all of your teams first.");
        } else {
            handleDelete();
        }
    }

    const handleDelete = () => {
        // Call method to delete user
        new Promise((resolve, reject) => {
            Meteor.call('delete_user', userData.id,
                (error, results) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results)
                    }
                })
        }).catch(() => {
            setErrorMessage("Failed to delete user: please try again");
        })
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
                <div>Are you sure you would like to delete your account and all data associated with it?</div>
                <div>You must leave all the teams first.</div>
                <div className={"main-text text-red"}>This action cannot be reverted.</div>

                <div className="button-group-row btn-submit">
                    <Button type={"submit"}
                            className="btn-red"
                            onClick={handleClick}>Delete
                    </Button>

                    <Button className="btn-grey"
                            onClick={closeHandler}>Cancel
                    </Button>
                </div>

                {/* Display error message */}
                {errorMessage && <div className="text-red small-text non-clickable">{errorMessage}</div>}
            </div>
        </Modal>
    );
}

export default DeleteAccountModal;