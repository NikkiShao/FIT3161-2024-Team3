/**
 * File Description: Poll card component
 * Updated Date: 06/09/2024
 * Contributors: Mark, Nikki
 * Version: 1.5
 */

import React, { useEffect, useState } from "react";

// import components and styles
import Card from "../cards/Card";
import Button from "../buttons/Button";
import './pollCard.css';
import PollStatus from "../../../enums/PollStatus";
import PollResultModal from '../modal/PollResultModal.jsx';
import VotePollModal from '../modal/VotePollModal.jsx';
import { getUserInfo, renderTime } from "../../util";
import { ExclamationCircleIcon } from "@heroicons/react/16/solid";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import { useLocation } from "react-router-dom";
import BaseUrlPath from "../../../enums/BaseUrlPath";

/**
 * PollCard component to display poll information.
 * @param {string} pollId - The id of the poll.
 * @param {string} title - The title of the poll card.
 * @param {string} startTime - The start time of the poll.
 * @param {string} closeTime - The close time of the poll.
 * @param {array} options - The options of the poll.
 * @param {string} teamName - The team name of the team the poll belongs to. Optional, only used when on dashboard.
 */
const PollCard = ({pollId, title, startTime, closeTime, options, teamName}) => {

    const userInfo = getUserInfo();
    const isOnDashboard = useLocation().pathname.split('/')[1] === BaseUrlPath.DASHBOARD;

    // state variables
    const [pollStatus, setPollStatus] = useState("")
    const [highestVote, setHighestVote] = useState("");
    const [displayStartTime, setDisplayStartTime] = useState("");
    const [displayCloseTime, setDisplayCloseTime] = useState("");

    const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);
    const openVoteModal = () => setIsVoteModalOpen(true);
    const closeVoteModal = () => setIsVoteModalOpen(false);

    const [isResultModalOpen, setIsResultModalOpen] = useState(false);
    const showResultModal = () => setIsResultModalOpen(true);
    const closeResultModal = () => setIsResultModalOpen(false);

    const findHighestVote = (options) => {
        if (pollStatus === PollStatus.OPEN) {
            setHighestVote("Ongoing");
        } else if (pollStatus === PollStatus.CLOSED) {
            let maxVotes = 0;
            let highestVotedOptions = [];

            options.forEach(option => {
                const voterCount = option.voterUsernames.length;

                if (voterCount > maxVotes) {
                    maxVotes = voterCount;
                    highestVotedOptions = [option.optionText]; // 重置为新的最高票数选项
                } else if (voterCount === maxVotes) {
                    if (!highestVotedOptions.includes(option.optionText)) {
                        highestVotedOptions.push(option.optionText); // 只添加一次
                    }
                }
            });

            // only set the highest vote option is someone voted in the poll
            if (maxVotes > 0) {
                setHighestVote(highestVotedOptions.join(", "));
            } else {
                setHighestVote("No votes")
            }
        }
    }

    // display icons depending on if already voted for
    const tickIcon = <CheckIcon color={"var(--dark-grey)"} strokeWidth={3} viewBox="0 0 24 24" width={25} height={25}/>;
    const crossIcon = <XMarkIcon color={"var(--dark-grey)"} strokeWidth={3} viewBox="0 0 24 24" width={25} height={25}/>;
    const alertIcon = <ExclamationCircleIcon color={"var(--dark-red)"} strokeWidth={1} viewBox="0 0 16 16" width={25} height={25}/>;

    let votedForAlready = false;
    for (let i = 0; i < options.length; i++) {
        if (options[i].voterUsernames.includes(userInfo.username)) {
            votedForAlready = true;
            break;
        }
    }

    // use effect to set poll status and display time
    useEffect(() => {

        // check if poll is open or closed
        const currentTime = new Date().toISOString();
        const current = new Date(currentTime);
        const start = new Date(startTime); // convert ISO String to date object
        const close = new Date(closeTime);

        // set poll status by checking start and close time
        if (current < close) {
            setPollStatus(PollStatus.OPEN);
        } else {
            setPollStatus(PollStatus.CLOSED);
        }

        // set and render display time
        setDisplayStartTime(renderTime(startTime));
        setDisplayCloseTime(renderTime(closeTime, !isOnDashboard));

    }, [startTime, closeTime, pollStatus]);

    useEffect(() => {
        // set the highest vote
        findHighestVote(options);
    }, [pollStatus, options]);

    const handleViewPollClick = () => {
        if (pollStatus === PollStatus.CLOSED) {
            showResultModal();
        } else if (pollStatus === PollStatus.OPEN) {
            openVoteModal();
        }
    };

    // checks if currently on DASHBOARD
    let cardClassnames = "poll-card non-clickable"
    if (isOnDashboard) {
        cardClassnames = classNames(cardClassnames, "poll-card-mini")
    } else {
        cardClassnames = classNames(cardClassnames, "poll-card-standard")
    }


    return (
        <Card className={cardClassnames}>
            <div className="poll-card__header">
                {votedForAlready ? tickIcon : pollStatus === PollStatus.OPEN ? alertIcon : crossIcon}
                <span className={`main-text`}
                      style={{color: pollStatus === PollStatus.OPEN ? "var(--green)" : "var(--dark-grey)"}}>
                {pollStatus}</span>
            </div>
            <span className={"main-text one-line"}>{title}</span>

            <div className="poll-details">
                {isOnDashboard ?
                    <div className="poll-item">
                        <span className={"text-grey small-text"}>Team:</span>
                        <span className="small-text one-line">{teamName}</span>
                    </div>
                    :
                    <div className="poll-item">
                        <span className={"text-grey small-text"}>Highest Vote(s):</span>
                        <span className="small-text one-line">{highestVote}</span>
                    </div>
                }
                {isOnDashboard ? null :
                    <div className="poll-item">
                        <span className={"text-grey small-text"}>Start Time:</span>
                        <span className="small-text">{displayStartTime}</span>
                    </div>
                }

                <div className="poll-item">
                    <span className={"text-grey small-text"}>Close Time:</span>
                    <span className="small-text">{displayCloseTime}</span>
                </div>
            </div>
            <Button
                className="btn-brown view-button"
                onClick={handleViewPollClick}>
                {pollStatus === PollStatus.CLOSED ? "View" : "Vote"}
            </Button>

            {
                pollStatus === PollStatus.CLOSED ?
                    <PollResultModal
                        open={isResultModalOpen}
                        closeHandler={closeResultModal}
                        pollData={{title, options}}
                    /> :
                    <VotePollModal
                        open={isVoteModalOpen}
                        closeHandler={closeVoteModal}
                        pollData={{pollId, title, options}}
                    />
            }

        </Card>
    );
};

export default PollCard;