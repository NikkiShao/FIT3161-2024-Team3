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
import Button from "../buttons/Button";

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

    // handler function of clicking view button
    const handleViewClick = () => {
        navigate("teams/" + teamId + "/boards/" + boardId);
    };

    // checking deadline date to determine if overdue
    const boardDeadlineDate = new Date(boardDeadline);
    const isOverdue = boardDeadlineDate <= new Date();
    let boardCardClasses = classNames("board-card",  isOverdue? "board-card-overdue" : "", className);

    let displayText = null;
    if (isOverdue) {
        // if the deadline date is before or equal to today, show OVERDUE
        displayText = <div style={{ color: "var(--dark-red)", fontWeight: "bold" }} className={"text-center small-text overdue"}>OVERDUE</div>;
    }

    return (
        <Card className={boardCardClasses} {...cardProps}>
            {/* card top div */}
            <div id={"board-card__header"}>
                {displayText}
                <div className="main-text text-center one-line">{boardName}</div>
            </div>
            {/* card middle div */}
            <div className="board-small-text text-grey">{`Code: ${boardNickname}`}</div>
            <div className="board-small-text text-grey text-left-aligned two-line">{boardDesc}</div>
            <div className="small-text" id={"board-card__deadline"}>{`Deadline: ${boardDeadlineDate.toLocaleString()}`}</div>
            {/* card bottom div */}
            <Button className="view-button btn-brown" onClick={handleViewClick}>View</Button>
        </Card>
    );
};

export default BoardCard;
