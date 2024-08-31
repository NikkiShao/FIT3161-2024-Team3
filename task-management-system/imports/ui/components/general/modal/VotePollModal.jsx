import React, { useState } from 'react';
import { Modal } from 'react-responsive-modal';
import Button from "../buttons/Button";
import './modal.css';
import { MinusCircleIcon, PlusCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";

/**
 * The modal for voting in an open poll
 * @param {boolean} open - Controls whether the modal is open or closed.
 * @param {function} closeHandler - Function to handle closing the modal.
 * @param {object} pollData - Data for the poll, including title and options.
 */
const VotePollModal = ({ open, closeHandler, pollData }) => {
    const closeIcon = <XCircleIcon color={"var(--navy)"} strokeWidth={2} viewBox="0 0 24 24" width={35} height={35} />;


    // Handle the voting action
    const handleVote = (event) => {
        event.preventDefault();
        console.log("WTF!");
    };

    return (
        <Modal
            closeIcon={closeIcon}
            classNames={{ modal: classNames('modal-base', '') }}
            open={open}
            onClose={closeHandler}
            center>
            <h1>Voting</h1>
            <p>To be implemented</p>
        </Modal>
    );
};

export default VotePollModal;