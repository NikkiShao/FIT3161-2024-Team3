/**
 * File Description: Board creation modal component
 * Updated Date: 05/08/2024
 * Contributors: Nikki
 * Version: 1.2
 */

import React, { useState } from 'react';
import classNames from "classnames";
import { Modal } from 'react-responsive-modal';

import Button from "../buttons/Button";
import Input from "../inputs/Input";
import '../../general/modal/modal.css';
import { getUserInfo } from "../../util";
import { closeModalIcon } from "../../icons";

/**
 * The popup for adding a new board
 */
export const BoardCreationModal = ({teamId, open, closeHandler}) => {

    const userInfo = getUserInfo();

    // State variables for board creation form
    const [boardNameInput, setBoardNameInput] = useState('');
    const [boardCodeInput, setBoardCodeInput] = useState('');
    const [boardDeadlineDateInput, setBoardDeadlineDateInput] = useState('');
    const [boardDeadlineTimeInput, setBoardDeadlineTimeInput] = useState('23:55');
    const [boardDescriptionInput, setBoardDescriptionInput] = useState('');

    const [errors, setErrors] = useState({
        boardName: "",
        boardCode: "",
        boardDeadline: "",
        boardDescription: "",
    });

    // Handler for creating a new board
    const handleCreateBoard = (event) => {
        event.preventDefault();

        // error checks
        let newErrors = {}
        let isError = false;

        // board name
        if (!boardNameInput.trim()) {
            newErrors.boardName = "Please fill in the board name";
            isError = true
        } else if (boardNameInput.trim().length > 30) {
            newErrors.boardName = "Board name can not exceed 30 characters";
            isError = true
        }

        // board code
        const alphanumericRegex = /^[A-Za-z0-9]+$/i;
        if (!boardCodeInput.trim()) {
            newErrors.boardCode = "Please fill in the board code";
            isError = true
        } else if (!alphanumericRegex.test(boardCodeInput)) {
            newErrors.boardCode = "Board code can only contain letters and numbers";
            isError = true
        } else if (boardCodeInput.trim().length > 10) {
            newErrors.boardCode = "Board code can not exceed 10 characters";
            isError = true
        }

        // deadline
        let deadlineDateObject = new Date(boardDeadlineDateInput + 'T' + boardDeadlineTimeInput);
        if (!boardDeadlineDateInput || !boardDeadlineTimeInput) {
            newErrors.boardDeadline = "Please fill in the board deadline";
            isError = true
        } else if (isNaN(deadlineDateObject)) {
            // deadline is invalid format
            newErrors.boardDeadline = "Deadline datetime is invalid";
            isError = true
        }

        // description
        if (!boardDescriptionInput.trim()) {
            newErrors.boardDescription = "Please fill in the board description";
            isError = true
        } else if (boardDescriptionInput.trim().length > 150) {
            newErrors.boardDescription = "Board description can not exceed 150 characters";
            isError = true
        }

        setErrors(newErrors)

        if (!isError) {
            // Call the Meteor method to add a new board
            new Promise((resolve, reject) => {
                Meteor.call('add_board',
                    boardNameInput.trim(),
                    boardCodeInput.trim(),
                    boardDeadlineDateInput + 'T' + boardDeadlineTimeInput,
                    boardDescriptionInput.trim(),
                    teamId,
                    userInfo.username,
                    (error, result) => {
                        if (error) {
                            reject(`Error: ${error.message}`);

                        } else {
                            resolve(result);

                            // reset all inputs
                            setBoardNameInput('')
                            setBoardCodeInput('')
                            setBoardDescriptionInput('')
                            setBoardDeadlineDateInput('')
                            setBoardDeadlineTimeInput('23:55')
                            closeHandler();
                        }
                    });
            }).catch(() => {
                const newError = {}
                newError.boardDescription = "Creation failed, please try again ";
                setErrors(newError)
            })
        }
    }

    return (
        <Modal
            closeIcon={closeModalIcon}
            classNames={{modal: classNames('modal-base', '')}}
            open={open}
            onClose={closeHandler}
            center
        >

            {/*external most div*/}
            <div className={"modal-div-center"}>

                <h1 className={"text-center"}>Create New Board</h1>

                {/* Input field for board name */}
                <div className='input-group-2col'>
                    <label className={"main-text text-grey"}>Board Name:</label>
                    <div className={"input-error-div"}>
                        <Input
                            type="text"
                            id={"boardName"}
                            placeholder={"Max 30 characters"}
                            value={boardNameInput}
                            onChange={(e) => setBoardNameInput(e.target.value)}
                        />
                        {errors.boardName && <span className="text-red small-text">{errors.boardName}</span>}
                    </div>
                </div>

                {/* Input field for board code */}
                <div className='input-group-2col'>
                    <label className={"main-text text-grey"}>Board Code:</label>
                    <div className={"input-error-div"}>
                        <Input
                            className={"short-input"}
                            type="text"
                            id={"boardCode"}
                            placeholder={"Max 10 characters"}
                            value={boardCodeInput}
                            onChange={(e) => setBoardCodeInput(e.target.value)}
                        />
                        {errors.boardCode && <span className="text-red small-text">{errors.boardCode}</span>}
                    </div>
                </div>

                {/* Input field for board deadline */}
                <div className='input-group-2col'>
                    <label className={"main-text text-grey"}>Deadline:</label>
                    <div className={"input-error-div"}>
                        <div className={"inner-input-group"}>
                            <Input
                                className={"short-input"}
                                type="date"
                                id={"boardDeadline"}
                                value={boardDeadlineDateInput}
                                onChange={(e) => setBoardDeadlineDateInput(e.target.value)}
                            />
                            <Input
                                className={"short-input"}
                                type="time"
                                id={"boardDeadline"}
                                value={boardDeadlineTimeInput}
                                onChange={(e) => setBoardDeadlineTimeInput(e.target.value)}
                            />
                        </div>
                        {errors.boardDeadline && <span className="text-red small-text">{errors.boardDeadline}</span>}
                    </div>
                </div>

                {/* Input field for board description */}
                <div className='input-group-2col' style={{alignItems: "start"}}>
                    <label className={"main-text text-grey"} style={{marginTop: "6px"}}>Description:</label>
                    <div className={"input-error-div"}>
                        <textarea
                            style={{minHeight: "100px", maxHeight: "250px"}}
                            className={"input-base main-text"}
                            placeholder={"Max 150 characters"}
                            id={"boardDescription"}
                            value={boardDescriptionInput}
                            onChange={(e) => setBoardDescriptionInput(e.target.value)}
                        />
                        {errors.boardDescription &&
                            <span className="text-red small-text">{errors.boardDescription}</span>}
                    </div>
                </div>

                {/* Button to create the board */}
                <Button type={"submit"} className="btn-brown btn-submit"
                        onClick={(event) => handleCreateBoard(event)}>
                    Create Board
                </Button>
            </div>
        </Modal>
    );
};

export default BoardCreationModal;
