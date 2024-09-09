/**
 * File Description: Poll Voting Modal
 * Updated Date: 09/09/2024
 * Contributors: Mark, Nikki
 * Version: 1.5
 */

import React, { useCallback, useEffect, useState } from 'react';
import { Modal } from 'react-responsive-modal';
import classNames from "classnames";
import QuestionMarkCircleIcon from "@heroicons/react/16/solid/QuestionMarkCircleIcon";
import { XCircleIcon } from "@heroicons/react/24/outline";
import HoverTip from "../hoverTip/HoverTip";
import Button from "../buttons/Button";
import './modal.css';
import "./polls.css";

const VotePollModal = ({ open, closeHandler, pollData, userName }) => {
    const closeIcon = <XCircleIcon color={"var(--navy)"} strokeWidth={2} viewBox="0 0 24 24" width={35} height={35} />;

    const [pastOption, setPastOption] = useState(""); // State to hold selected option
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
                    option.voterUsernames.includes(userName)
                        ? {
                            ...option,
                            voterUsernames: option.voterUsernames.filter(voter => voter !== userName)
                        }
                        : option
                ).map(option =>
                    option.optionText === selectedOption
                        ? { ...option, voterUsernames: [...option.voterUsernames, userName] }
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
                    // console.log("Poll successfully updated.");
                    setHasVoted(true); // Mark as voted after successful vote
                    setErrorMessage(""); // Clear any previous error messages
                    setIsSubmitting(false); // Enable the button after success
                    closeHandler(); // Optionally close modal after voting
                    setPastOption(getUserVotedOption(pollData, userName));
                }
            });
        }
    }, [selectedOption, pollData, userName, closeHandler, pollId, hasVoted]);

    useEffect(() => {
        const votedOption = getUserVotedOption(pollData, userName);
        if (votedOption) {
            setHasVoted(true);
            setSelectedOption(votedOption);
        } else {
            setHasVoted(false);
            setSelectedOption("");
        }
        setPastOption(votedOption);
    }, [pollData, userName]);

    // Function to find the option that the user voted for
    const getUserVotedOption = (pollData, userName) => {
        for (let option of pollData.options) {
            if (option.voterUsernames.includes(userName)) {
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

    const questionIcon = <QuestionMarkCircleIcon color={"var(--dark-grey)"} strokeWidth={2} viewBox="0 0 16 16"
        width={20} height={20} />;

    return (
        <Modal
            closeIcon={closeIcon}
            classNames={{ modal: classNames('modal-base', '') }}
            open={open}
            onClose={closeHandler}
            center>
            <div className={"modal-div-center"}>

                {/* poll title */}
                <div className={"header-space-centered"}>
                    <div style={{ width: "25px", visibility: "hidden" }}></div>
                    <h1 className={"text-center"}> {pollData.title}</h1>
                    <HoverTip icon={questionIcon}
                        outerText={""}
                        toolTipText={"You may change your vote anytime before the poll is closed."}
                        style={{ marginBottom: "10px" }}
                    />
                </div>


                {/* area for displaying options */}
                <form onSubmit={handleVote} className={"poll__main-div"}>

                    {pollData.options.map((option, index) => {
                        const isLongOption = option.optionText.length > 25;
                        const truncatedOptionText = isLongOption
                            ? option.optionText.substring(0, 25) + '...'
                            : option.optionText;  

                        return (
                            <label key={index} className={"poll__option voting clickable"} htmlFor={option.optionText}>
                                <input
                                    type={"radio"}
                                    id={option.optionText}
                                    name={"poll-option"}
                                    value={option.optionText}
                                    checked={selectedOption === option.optionText}
                                    onChange={handleOptionChange}
                                    aria-label={`Vote for ${option.optionText}`}
                                />
                                {/* Display hoverTip if the option text is too long */}
                                {isLongOption ? (
                                    <HoverTip
                                        icon={<span className={"main-text one-line"}>{truncatedOptionText}</span>}
                                        toolTipText={option.optionText}  
                                        divClassName={"more-info-mouse"} 
                                        isBlue={false}
                                    />
                                ) : (
                                    <span className={"main-text"}>{option.optionText}</span>
                                )}
                            </label>
                        );
                    })}

                </form>

                {/* Show success message if the user has already voted */}
                {hasVoted && (
                    <span className="text-green small-text">You have already voted for "{pastOption}".
                        You can change your vote</span>)}

                {/* Show error messages */}
                {errorMessage && (<span className="text-red small-text">{errorMessage}</span>)}

                {/* Show loading message when submitting */}
                {isSubmitting && <span className="text-grey small-text">Submitting your vote...</span>}

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