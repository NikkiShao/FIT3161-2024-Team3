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
    const [selectedOption, setSelectedOption] = useState("");

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
            <div className="modal-div-center">
                <h2 className="text-center">{pollData.title}</h2>

                <form onSubmit={handleVote}>
                    {/* Render poll options */}
                    <div className='input-group'>
                        {pollData.options.map((option, index) => (
                            <div key={index} className="poll-option">
                                <label className="main-text">
                                    <input
                                        type="radio"
                                        name="pollOption"
                                        value={option.optionText}
                                        checked={selectedOption === option.optionText}
                                        onChange={() => setSelectedOption(option.optionText)}
                                    />
                                    {option.optionText}
                                </label>
                            </div>
                        ))}
                    </div>

                    {/* Button to submit the vote */}
                    <Button type="submit" className="btn-brown btn-submit">
                        Vote
                    </Button>
                </form>
            </div>
        </Modal>
    );
};

export default VotePollModal;