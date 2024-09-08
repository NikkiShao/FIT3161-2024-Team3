import React, { useState, useEffect, useCallback } from 'react';
import { Modal } from 'react-responsive-modal';
import Button from "../buttons/Button";
import './modal.css';
import { XCircleIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import "./VotePollModal.css";

const VotePollModal = ({ open, closeHandler, pollData, userName }) => {
    const closeIcon = <XCircleIcon color={"var(--navy)"} strokeWidth={2} viewBox="0 0 24 24" width={35} height={35} />;
    const [selectedOption, setSelectedOption] = useState(""); // State to hold selected option
    const [hasVoted, setHasVoted] = useState(false); // State to show voting message
    const [errorMessage, setErrorMessage] = useState(""); // State to show error message
    const [isSubmitting, setIsSubmitting] = useState(false); // State to handle submission status

    const pollId = pollData.pollId;

    // Handle the voting action
    const handleVote = useCallback((event) => {
        event.preventDefault();

        if (!selectedOption) {
            setErrorMessage("Please select an option before voting."); // Set the error message
        } else {
            setIsSubmitting(true); // Disable the button while submitting
            const updatedPollData = {
                ...pollData,
                options: pollData.options.map(option =>
                    option.voterIds.includes(userName)
                        ? {
                              ...option,
                              voterIds: option.voterIds.filter(voter => voter !== userName)
                          }
                        : option
                ).map(option =>
                    option.optionText === selectedOption
                        ? { ...option, voterIds: [...option.voterIds, userName] }
                        : option
                )
            };

            // Call the new update_poll method in poll.js and pass the entire pollData
            Meteor.call("update_poll", pollId, updatedPollData, (error) => {
                if (error) {
                    switch (error.reason) {
                        case 'Poll not found':
                            setErrorMessage("The poll you are trying to vote on does not exist.");
                            break;
                        default:
                            setErrorMessage("An unexpected error occurred.");
                    }
                    setIsSubmitting(false); // Enable the button after failure
                } else {
                    console.log("Poll successfully updated.");
                    setHasVoted(true); // Mark as voted after successful vote
                    setErrorMessage(""); // Clear any previous error messages
                    setIsSubmitting(false); // Enable the button after success
                    closeHandler(); // Optionally close modal after voting
                }
            });
        }
    }, [selectedOption, pollData, userName, closeHandler, pollId, hasVoted]);

    // Check if the user has already voted and set the state accordingly
    useEffect(() => {
        const votedOption = getUserVotedOption(pollData, userName);
        if (votedOption) {
            setHasVoted(true); // Mark as voted
            setSelectedOption(votedOption); // Set the selected option to the user's vote
        }
    }, [pollData, userName]);

    // Function to find the option that the user voted for
    const getUserVotedOption = (pollData, userName) => {
        for (let option of pollData.options) {
            if (option.voterIds.includes(userName)) {
                return option.optionText;
            }
        }
        return "";
    };

    // Handle option change
    const handleOptionChange = useCallback((event) => {
        setSelectedOption(event.target.value); // Update the selected option
        setErrorMessage(""); // Clear any error messages when an option is selected
    }, []);

    return (
        <Modal
            closeIcon={closeIcon}
            classNames={{ modal: classNames('modal-base', '') }}
            open={open}
            onClose={closeHandler}
            center>
            <div className={"modal-div-center"}>
                <h1 className={"text-center"}>{pollData.title}</h1>
                <form onSubmit={handleVote}>
                    <div className={"poll-options"}>
                        {pollData.options.map((option, index) => (
                            <div key={index} className={"poll-option"}>
                                <input
                                    type={"radio"}
                                    id={option.optionText}
                                    name={"poll-option"}
                                    value={option.optionText}
                                    checked={selectedOption === option.optionText}
                                    onChange={handleOptionChange}
                                    aria-label={`Vote for ${option.optionText}`}
                                />
                                <label htmlFor={option.optionText}>{option.optionText}</label>
                            </div>
                        ))}
                    </div>
                </form>

                {/* Show success message if the user has already voted */}
                {hasVoted && (
                    <p className="success-message">
                        You have already voted for "{selectedOption}". You can change your vote.
                    </p>
                )}

                {/* Show error messages */}
                {errorMessage && (
                    <p className="error-message">
                        {errorMessage}
                    </p>
                )}
                
                {/* Show loading message when submitting */}
                {isSubmitting && <p className="loading-message">Submitting your vote...</p>}

                <Button
                    type={"submit"}
                    className="btn-brown btn-submit btn-base"
                    onClick={handleVote}
                    disabled={isSubmitting} // Disable the button while submitting
                >
                    {isSubmitting ? "Submitting..." : "Vote"} {/* Change the button text based on submitting status */}
                </Button>
            </div>
        </Modal>
    );
};

export default VotePollModal;