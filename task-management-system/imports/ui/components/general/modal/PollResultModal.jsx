/**
 * File Description: Poll Result Modal
 * Updated Date: 07/09/2024
 * Contributors: Mark, Nikki
 * Version: 1.6
 */

import React from 'react';
import { useSubscribe, useTracker } from "meteor/react-meteor-data";
import { useParams } from "react-router-dom";
import { Modal } from 'react-responsive-modal';
import Spinner from "react-bootstrap/Spinner";
import classNames from "classnames";
import { CheckIcon } from "@heroicons/react/24/outline";
import UserCollection from "../../../../api/collections/user";
import TeamCollection from "../../../../api/collections/team";
import { closeModalIcon, helpQuestionIcon } from "../../icons";
import HoverTip from "../hoverTip/HoverTip";
import "./polls.css";

/**
 * The modal for displaying poll results in a closed poll
 * @param {boolean} open - Controls whether the modal is open or closed.
 * @param {function} closeHandler - Function to handle closing the modal.
 * @param {object} pollData - Data for the poll, including title and options with their respective votes.
 */
const PollResultModal = ({open, closeHandler, pollData}) => {
    const {teamId} = useParams();

    // Use useTracker hook to get all the user data
    // Fetching the team data
    const isLoadingTeam = useSubscribe('specific_team', teamId);
    const teamData = useTracker(() => {
        return TeamCollection.findOne({_id: teamId});
    });

    const isLoadingUsers = useSubscribe('all_users');
    const teamMembersData = useTracker(() => {
        return UserCollection.find({"emails.address": {$in: teamData ? teamData.teamMembers : []}}).fetch();
    });

    const isLoading = isLoadingTeam() || isLoadingUsers();

    const highestIcon = (
        <CheckIcon
            color={"var(--green)"}
            strokeWidth={2}
            viewBox='0 0 24 24'
            width={35}
            height={35}
        />
    )

    if (isLoading) {
        // loading
        return <Spinner animation="border" variant="secondary" role="status"/>

    } else {

        const poll = {
            question: pollData.title,
            answers: pollData.options.map((option) => option.optionText),
            answersWeight: pollData.options.map((option) => option.voterUsernames.length),
            voters: pollData.options.map((option) => {

                // for each option
                return option.voterUsernames.map(username => {
                    // map each user name to: <name> (@<username>) format
                    const targetUser = teamMembersData.find(user => user.username === username)
                    return targetUser?.profile?.name ? `${targetUser.profile.name} (@${username})` : username;
                });
            }),
        };

        const pollCount = poll.answersWeight.reduce((acc, curr) => acc + curr, 0);
        const maxVotes = Math.max(...poll.answersWeight);

        return (
            <Modal
                closeIcon={closeModalIcon}
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
                        <HoverTip icon={helpQuestionIcon}
                                  outerText={""}
                                  toolTipText={"You may hover over any poll option that are too long to see the full text."}
                                  style={{marginBottom: "10px"}}
                        />
                    </div>

                    {/* area for displaying answers */}
                    <div className="poll__main-div">
                        {poll.answers.map((answer, i) => {
                            const percentage = pollCount > 0
                                ? Math.round((poll.answersWeight[i] * 100) / pollCount)
                                : 0;

                            return (
                                <div key={i} className={"full-width"}>
                                    <div className='each-option'>
                                        <div className="poll__option results">
                                            {/* Only show HoverTip if the answer is truncated */}
                                            {answer.length > 25 ?
                                                (
                                                    <HoverTip
                                                        icon={<span className='one-line'>{answer}</span>}  // Display truncated text
                                                        outerText={""}  // No outer text
                                                        toolTipText={answer}  // Show full answer on hover
                                                        divClassName={"more-info-mouse"}  // Custom class name
                                                        isBlue={false}
                                                    />
                                                ) : (
                                                    <span className='one-line main-text'>{answer}</span>  // Display the full answer if not truncated
                                                )}
                                            <span className={"text-grey non-clickable"} style={{minWidth: "50px", textAlign: "end"}}>
                                            {percentage}%
                                        </span>
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
                                            <span key={voter + j} className="text-grey small-text non-clickable">
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
    }
};

export default PollResultModal;