/**
 * File Description: Poll card component
 * Updated Date: 30/08/2024
 * Contributors: Mark
 * Version: 1.3
 */

import React, { useEffect, useState } from "react";

// import components and styles
import Card from "../cards/Card";
import Button from "../buttons/Button";
import './PollCard.css';
import PollStatus from "../../../enums/PollStatus";

/**
 * PollCard component to display poll information.
 * @param {string} title - The title of the poll card.
 * @param {string} startTime - The start time of the poll.
 * @param {string} closeTime - The close time of the poll.
 * @param {array} options - The options of the poll.
 */
const PollCard = ({ pollId, title, startTime, closeTime, options }) => {

    // state variabless

    const [pollStatus, setPollStatus] = useState("")
    const [highestVote, setHighestVote] = useState("");
    const [displayStartTime, setDisplayStartTime] = useState("");
    const [displayCloseTime, setDisplayCloseTime] = useState("");

    // render time in a readable format
    // 2024-09-11T22:55:00.000+00:00 -> 11 Sep 2024, 23:55
    const renderTime = (isoString) => {
        const date = new Date(isoString);

        // Get date part
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();

        // Get time part
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        const time = `${day} ${month} ${year}, ${hours}:${minutes}`;
        return time;
    }

    const findHighestVote = (options) => {
        if (pollStatus === PollStatus.OPEN) {
            setHighestVote("Ongoing");
        } else if (pollStatus === PollStatus.CLOSED) {
            let maxVotes = 0;
            let highestVotedOptions = [];
    
            options.forEach(option => {
                const voterCount = option.voterIds.length;
    
                if (voterCount > maxVotes) {
                    maxVotes = voterCount;
                    highestVotedOptions = [option.optionText]; // 重置为新的最高票数选项
                } else if (voterCount === maxVotes) {
                    if (!highestVotedOptions.includes(option.optionText)) {
                        highestVotedOptions.push(option.optionText); // 只添加一次
                    }
                }
            });
    
            setHighestVote(highestVotedOptions.join(", "));
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
        }
        else {
            setPollStatus(PollStatus.CLOSED);
        }

        // set and render display time
        setDisplayStartTime(renderTime(startTime));
        setDisplayCloseTime(renderTime(closeTime));

    }, [startTime, closeTime, pollStatus]);

    useEffect(() => {
        // set highest vote
        findHighestVote(options);
    }, [pollStatus, options]);

    return (
        <Card className="poll-card">
            <span className={`poll-status-${pollStatus.toLowerCase()}`}>{pollStatus}</span>
            <div className="poll-header">
                <h4>{title}</h4>
            </div>

            <div className="poll-details">
                <div className="poll-item">
                    <span className="poll-label">Highest Vote(s):</span>
                    <span className="highest-vote">{highestVote}</span>
                </div>
                <div className="poll-item">
                    <span>Start Time:</span>
                    <span className="poll-value">{displayStartTime}</span> 
                </div>
                <div className="poll-item">
                    <span>Close Time:</span>
                    <span className="poll-value">{displayCloseTime}</span> 
                </div>
            </div>
            <Button
                type={"submit"}
                className="btn-brown"
                onClick={() => console.log("button clicked!")}>
                View Poll
            </Button>
        </Card>
    );
};

export default PollCard;