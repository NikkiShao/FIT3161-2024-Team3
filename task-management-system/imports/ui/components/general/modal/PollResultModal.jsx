import React from 'react';
import { Modal } from 'react-responsive-modal';
import { XCircleIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import './modal.css';
import "./PollResult.css";



/**
 * The modal for displaying poll results in a closed poll
 * @param {boolean} open - Controls whether the modal is open or closed.
 * @param {function} closeHandler - Function to handle closing the modal.
 * @param {object} pollData - Data for the poll, including title and options with their respective votes.
 */
const PollResultModal = ({ open, closeHandler, pollData }) => {
    const poll = {
        question: pollData.title,
        answers: pollData.options.map((option) => option.optionText),
        answersWeight: pollData.options.map((option) => option.voterIds.length),
    };

    // Mock poll data indicating the wanted structure
    // const poll = {
    //     question: "How are you?",
    //     answers: ["Good", "Bad", "Very good", "Sad", "haha"],
    //     answersWeight: [5, 2, 1, 2, 6],
    // };
    // console.log(poll);

    const pollCount = poll.answersWeight.reduce((acc, curr) => acc + curr, 0);

    const closeIcon = <XCircleIcon color={"var(--navy)"} strokeWidth={2} viewBox="0 0 24 24" width={35} height={35} />;

    return (
        <Modal
            closeIcon={closeIcon}
            classNames={{ modal: classNames('modal-base', '') }}
            open={open}
            onClose={closeHandler}
            center>
            <div className={"modal-div-center"}>


                <div className="poll">
                    <div className="question">{poll.question}</div>
                    <div className="answers">
                        {poll.answers.map((answer, i) => {
                            const percentage = pollCount
                                ? Math.round((poll.answersWeight[i] * 100) / pollCount)
                                : 0;
                            return (
                                <div className="answer" key={i}>
                                    {answer}
                                    <span
                                        className="percentage-bar"
                                        style={{ width: `${percentage}%` }}
                                    ></span>
                                    <span className="percentage-value">{percentage}%</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>


        </Modal>
    );
};

export default PollResultModal;