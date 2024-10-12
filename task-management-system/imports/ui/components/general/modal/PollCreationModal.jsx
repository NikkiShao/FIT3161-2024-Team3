/**
 * File Description: Poll creation modal component
 * Updated Date: 25/08/2024
 * Contributors: Nikki
 * Version: 1.2
 */

import React, { Fragment, useState } from 'react';
import classNames from "classnames";
import { Modal } from 'react-responsive-modal';

import Button from "../buttons/Button";
import Input from "../inputs/Input";
import '../../general/modal/modal.css';
import { closeModalIcon, minusCircleIcon, subAddIcon } from "../../icons";

/**
 * The popup for adding a new poll
 */
export const PollCreationModal = ({teamId, open, closeHandler}) => {

    // State variables for poll creation form
    const [pollTitleInput, setPollTitleInput] = useState('');
    const [pollDeadlineDateInput, setPollDeadlineDateInput] = useState('');
    const [pollDeadlineTimeInput, setPollDeadlineTimeInput] = useState('23:55');
    const [pollOptions, setPollOptions] = useState([]);
    const [newOptionInput, setNewOptionInput] = useState('');

    const [errors, setErrors] = useState({
        pollTitle: "",
        pollDeadline: "",
        pollOptions: "",
    });

    // for date checking
    const minDeadlineDate = new Date();

    // Handler for adding an option
    const handleAddOption = (event) => {
        event ? event.preventDefault() : null;
        const newError = {}

        // test option validity
        if (!newOptionInput.trim()) {
            newError.pollOptions = "Poll option cannot be empty";

        } else if (pollOptions.includes(newOptionInput.trim())) {
            newError.pollOptions = "Poll option has already been added";

        }  else {
            setPollOptions([...pollOptions, newOptionInput.trim()]);
            setNewOptionInput('')
        }
        setErrors(newError)
    };

    // Handler for removing an option
    const handleRemoveOption = (event, optionToRemove) => {
        event.preventDefault();
        setPollOptions(pollOptions.filter(option => option !== optionToRemove));
    };

    // Handler for creating a new poll
    const handleCreatePoll = (event) => {
        event.preventDefault();

        // error checks
        let newErrors = {}
        let isError = false;

        // poll name
        if (!pollTitleInput.trim()) {
            newErrors.pollTitle = "Please fill in the poll title";
            isError = true
        } else if (pollTitleInput.trim().length > 50) {
            newErrors.pollTitle = "Poll title can not exceed 50 characters";
            isError = true
        }

        // deadline
        let deadlineDateObject = new Date(pollDeadlineDateInput + 'T' + pollDeadlineTimeInput);
        if (!pollDeadlineDateInput || !pollDeadlineTimeInput) {
            newErrors.pollDeadline = "Please fill in the poll deadline";
            isError = true
        } else if (deadlineDateObject < new Date()) {
            // deadline is passed, invalid
            newErrors.pollDeadline = "Deadline must be in the future";
            isError = true
        }

        // if poll option has text, check user hasn't forgotten to press the + button
        if (newOptionInput.trim() !== "") {
            newErrors.pollOptions = "You still have an unconfirmed poll option left in the input. " +
                "Please press the '+' to add it or clear the input.";
            isError = true
        }

        // options
        if (pollOptions.length < 2) {
            newErrors.pollOptions = "You must have at least 2 poll options";
            isError = true
        }

        setErrors(newErrors)

        if (!isError) {
            // Call the Meteor method to add a new poll
            new Promise((resolve, reject) => {
                Meteor.call('add_poll',
                    pollTitleInput.trim(),
                    deadlineDateObject.toISOString(),
                    pollOptions,
                    teamId,
                    (error, result) => {
                        if (error) {
                            reject(`Error: ${error.message}`);

                        } else {
                            resolve(result);

                            // reset all inputs
                            setPollTitleInput('')
                            setPollOptions([])
                            setNewOptionInput("")
                            setPollDeadlineDateInput('')
                            setPollDeadlineTimeInput('23:55')
                            closeHandler();
                        }
                    });
            }).catch(() => {
                const newError = {}
                newError.pollOptions = "Creation failed, please try again ";
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

                <h1 className={"text-center"}>Create New Poll</h1>

                {/* Input field for poll name */}
                <div className='input-group'>
                    <label className={"main-text text-grey"}>Poll Title:</label>
                    <div className={"input-error-div"}>
                        <Input
                            type="text"
                            id={"pollName"}
                            placeholder={"Max 50 characters"}
                            value={pollTitleInput}
                            onChange={(e) => setPollTitleInput(e.target.value)}
                        />
                        {errors.pollTitle && <span className="text-red small-text">{errors.pollTitle}</span>}
                    </div>
                    <div />
                </div>

                {/* Input field for poll deadline */}
                <div className='input-group'>
                    <label className={"main-text text-grey"}>Deadline:</label>
                    <div className={"input-error-div"}>
                        <div className={"inner-input-group"}>
                            <Input
                                className={"short-input"}
                                type="date"
                                min={minDeadlineDate.toISOString().split('T')[0]}
                                id={"pollDeadline"}
                                value={pollDeadlineDateInput}
                                onChange={(e) => setPollDeadlineDateInput(e.target.value)}
                            />
                            <Input
                                className={"short-input"}
                                type="time"
                                id={"pollDeadline"}
                                value={pollDeadlineTimeInput}
                                onChange={(e) => setPollDeadlineTimeInput(e.target.value)}
                            />
                        </div>
                        {errors.pollDeadline && <span className="text-red small-text">{errors.pollDeadline}</span>}
                    </div>
                    <div/>
                </div>

                {/* Display existing poll options */}
                {
                    pollOptions && pollOptions.length > 0 ?
                        <div className='input-group'>
                            {
                                pollOptions
                                    .map((option, index) => (
                                        <Fragment key={index}>
                                            {index === 0 ?
                                                <label className={"main-text text-grey"}>Options:</label> :
                                                <div></div>}
                                            <div className="main-text">
                                                {option}
                                                <button className="icon-btn"
                                                        onClick={(event) =>
                                                            handleRemoveOption(event, option)}>
                                                    {minusCircleIcon}
                                                </button>
                                            </div>
                                            <div></div>
                                        </Fragment>
                                    ))
                            }
                        </div> :
                        null
                }

                {/* Input field for new poll options */}
                <div className='input-group'>
                    {pollOptions && pollOptions.length === 0 ?
                        <label className={"main-text text-grey"}>Options:</label> :
                        <div></div>
                    }
                    <div className={"input-error-div"}>
                        <Input
                            type="text"
                            value={newOptionInput}
                            onChange={(e) => setNewOptionInput(e.target.value)}
                        />
                        {errors.pollOptions && <span className="text-red small-text">{errors.pollOptions}</span>}
                    </div>
                    <button className="icon-btn" onClick={handleAddOption}>
                        {subAddIcon}
                    </button>
                </div>


                {/* Button to create the poll */}
                <Button type={"submit"} className="btn-brown btn-submit"
                        onClick={(event) => handleCreatePoll(event)}>
                    Create Poll
                </Button>
            </div>
        </Modal>
    );
};

export default PollCreationModal;
