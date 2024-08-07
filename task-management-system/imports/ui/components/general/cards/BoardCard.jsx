/**
 * File Description: Board Card component
 * Updated Date: 08/08/2024
 * Contributors: Samuel
 * Version: 1.0
 */

import React from "react";
import classNames from "classnames";
import Card from "./Card";
import './BoardCard.css';
import { useNavigate } from "react-router-dom";

/**
 * Board card used to display brief details on any Board
 *
 * @param {string} boardId - ID of the board
 * @param {string} boardName - Name of the board
 * @param {string} boardNickname - Nickname of the board
 * @param {string} boardDesc - description of the board
 * @param {string} boardDeadline - deadline date of the board, ISO format date string
 * @param {string} teamId - ID of the team the board belongs to
 * @param {string} className - other classnames to add to the style of the card
 * @param cardProps - other props to add to the card
 * @returns {JSX.Element} - JSX element of the board card
 */
const BoardCard = ({
    boardId,
    boardName,
    boardNickname,
    boardDesc,
    boardDeadline,
    teamId,
    className,
    ...cardProps
}) => {
    const navigate = useNavigate();

    let boardCardClasses = classNames("board-card", className);

    // handler function of clicking view button
    const handleViewClick = () => {
        navigate("/boards/" + boardId);
    };

    // checking deadline date to determine if overdue
    const boardDeadlineDate = new Date(boardDeadline);
    const today = new Date();

    let displayText = null;
    if (boardDeadlineDate <= today) {
        // if the deadline date is before or equal to today, show OVERDUE
        displayText = <div style={{ color: "var(--dark-red)" }} className={"text-center small-text overdue"}>OVERDUE</div>;
    }

    return (
        <Card className={boardCardClasses} {...cardProps}>
            {/* card top div */}
            <div id="card__header">
                {displayText}
                <div className="main-text three-line">{boardName}</div>
            </div>
            {/* card middle div */}
            <div className="small-text">{`Nickname: ${boardNickname}`}</div>
            <div className="small-text board-description">{boardDesc}</div>
            <div className="small-text" id="board__deadline">{`Deadline: ${boardDeadlineDate.toLocaleString()}`}</div>
            {/* card bottom div */}
            <button className="view-button btn-brown" onClick={handleViewClick}>View</button>
        </Card>
    );
};

export default BoardCard;
