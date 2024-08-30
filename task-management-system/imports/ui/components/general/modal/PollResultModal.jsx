import React from 'react';
import { Modal } from 'react-responsive-modal';
import {MinusCircleIcon, PlusCircleIcon, XCircleIcon} from "@heroicons/react/24/outline";
import classNames from "classnames";
import Button from "../buttons/Button";
import './modal.css';

/**
 * The modal for displaying poll results in a closed poll
 * @param {boolean} open - Controls whether the modal is open or closed.
 * @param {function} closeHandler - Function to handle closing the modal.
 * @param {object} pollData - Data for the poll, including title and options with their respective votes.
 */
const PollResultModal = ({ open, closeHandler, pollData }) => {


    const closeIcon = <XCircleIcon color={"var(--navy)"} strokeWidth={2} viewBox="0 0 24 24" width={35} height={35}/>;

    return (
        <Modal
            closeIcon={closeIcon}
            classNames={{modal: classNames('modal-base', '')}}
            open={open}
            onClose={closeHandler}
            center>
            <h1>Poll Results</h1>

        </Modal>
    );
};

export default PollResultModal;