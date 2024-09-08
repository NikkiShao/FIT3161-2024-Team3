/**
 * File Description: Poll Result Modal
 * Updated Date: 07/09/2024
 * Contributors: Mark, Nikki
 * Version: 1.4
 */

import React from 'react';
import {Modal} from 'react-responsive-modal';
import {CheckIcon, XCircleIcon} from "@heroicons/react/24/outline";
import classNames from "classnames";
import "../../../../../client/main.css";
import "./polls.css";
import HoverTip from "../hoverTip/HoverTip";
import QuestionMarkCircleIcon from "@heroicons/react/16/solid/QuestionMarkCircleIcon";
import {useTracker} from "meteor/react-meteor-data";
import UserCollection from "../../../../api/collections/user";

/**
 * The modal for displaying poll results in a closed poll
 * @param {boolean} open - Controls whether the modal is open or closed.
 * @param {function} closeHandler - Function to handle closing the modal.
 * @param {object} pollData - Data for the poll, including title and options with their respective votes.
 */
const PollResultModal = ({open, closeHandler, pollData}) => {
    
    const getUserByUsername = (username) => {
        return useTracker(() => {
            // Subscribe to the specific user data based on the username
            const subscription = Meteor.subscribe('specific_username_user', username);
            
            // Check if the subscription is ready
            if (!subscription.ready()) {
                return {user: null, isLoading: true};
            }
    
            // Fetch the user data from the collection
            const user = UserCollection.findOne({username: username});
    
            return {user, isLoading: false};
        }, [username]);
    };

    const getNamesByUsernames = (usernames) => {
        return usernames.map(username => {
            const { user } = getUserByUsername(username); 
            return user && user.profile && user.profile.name ? user.profile.name : "Unknown";
        });
    };
    

    const poll = {
        question: pollData.title,
        answers: pollData.options.map((option) => option.optionText),
        answersWeight: pollData.options.map((option) => option.voterUsernames.length),
        voters: pollData.options.map((option) => getNamesByUsernames(option.voterUsernames)),  // Use toNames here
    };

    const pollCount = poll.answersWeight.reduce((acc, curr) => acc + curr, 0);
    const maxVotes = Math.max(...poll.answersWeight);



    const closeIcon = (
        <XCircleIcon
            color={"var(--navy)"}
            strokeWidth={2}
            viewBox="0 0 24 24"
            width={35}
            height={35}
        />
    );

    const highestIcon = (
        <CheckIcon
            color={"var(--green)"}
            strokeWidth={2}
            viewBox='0 0 24 24'
            width={35}
            height={35}
        />
    )

    const questionIcon = <QuestionMarkCircleIcon color={"var(--dark-grey)"} strokeWidth={2} viewBox="0 0 16 16" width={20} height={20}/>;

    return (
        <Modal
            closeIcon={closeIcon}
            classNames={{modal: classNames('modal-base', '')}}
            open={open}
            onClose={closeHandler}
            center
        >
            <div className={"modal-div-center"}>
                {/* poll title */}
                <div className={"header-space-centered"}>
                    <div style={{width: "25px", visibility: "hidden"}}></div>
                    <h1 className={"text-center"}> {poll.question}</h1>
                    <HoverTip icon={questionIcon}
                              outerText={""}
                              toolTipText={"You may hover over any poll option that are too long to see the full text."}
                              style={{marginBottom: "10px"}}
                    />
                </div>

                {/* area for displaying answers */}
                <div className="poll__main-div">
                    {poll.answers.map((answer, i) => {
                        const percentage = pollCount
                            ? Math.round((poll.answersWeight[i] * 100) / pollCount)
                            : 0;

                        // Determine if the answer exceeds 30 characters, truncate if necessary
                        const truncatedAnswer = answer.length > 25
                            ? answer.substring(0, 25) + '...'
                            : answer;

                        return (
                            <div key={i} className={"full-width"}>
                                <div className='each-option'>
                                    <div className="poll__option results">
                                        {/* Only show HoverTip if the answer is truncated */}
                                        {answer.length > 25 ?
                                            (
                                                <HoverTip
                                                    icon={<span
                                                        className='one-line'>{truncatedAnswer}</span>}  // Display truncated text
                                                    outerText={""}  // No outer text
                                                    toolTipText={answer}  // Show full answer on hover
                                                    divClassName={"more-info-mouse"}  // Custom class name
                                                    isBlue={false}
                                                />
                                            ) : (
                                                <span className='one-line main-text'>{answer}</span>  // Display the full answer if not truncated
                                            )}
                                        <span className={"text-grey non-clickable"}>{percentage}%</span>
                                        {/* the below is the background grey that fills depending on the voting % */}
                                        <span
                                            className="percentage-bar"
                                            style={{width: `${percentage}%`}}
                                        ></span>
                                    </div>
                                    {/* Display closeIcon if this answer has the maximum votes */}
                                    {poll.answersWeight[i] === maxVotes && maxVotes !== 0 && (
                                        <span className="max-vote-icon">
                                            {highestIcon}
                                        </span>
                                    )}
                                </div>

                                <div className="voters">
                                    {poll.voters[i].map((voter, j) => (
                                        <span key={voter} className="text-grey small-text non-clickable">
                                            {voter}
                                            {j < poll.voters[i].length - 1 ? ', ' : ''}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </Modal>
    );
};

export default PollResultModal;