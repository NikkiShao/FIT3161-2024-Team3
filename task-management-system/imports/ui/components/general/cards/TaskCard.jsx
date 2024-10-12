/**
 * File Description: Task Card component
 * Updated Date: 14/08/2024
 * Contributors: Nikki, Samuel
 * Version: 1.5
 */

import React from "react";
import classNames from "classnames";
import { useNavigate } from "react-router-dom";

import Card from "./Card";
import TaskTag from "./TaskTag";
import TaskPin from './TaskPin';
import './card.css';
import { getUserInfo, isUrgentOverdue } from "../../util";

/**
 * Task card used to display brief details on any Task
 *
 * @param {string} taskId - ID of the task
 * @param {string} taskName - Name of the task
 * @param {string} taskDeadlineDate - deadline date of the task, ISO format date string
 * @param {string} statusName - status of the task
 * @param {boolean} taskIsPinned - if the card is pinned to dashboard
 * @param {[string]} tagNames - an array of tags. Type: objects, with the attribute: tagName and tagColour
 * @param {string} boardId - ID of the board the tag belongs to
 * @param {[Object]} boardTags - all tags for a board, containing the name and colour keys
 * @param {string} className - other classnames to add to the style of the card
 * @param {function} onPinChange - handler function for clicking the pin icon
 * @param cardProps - other props to add to the card
 * @returns {JSX.Element} - JSX element of the task card
 */
const TaskCard = ({
                      taskId,
                      taskName,
                      taskDeadlineDate,
                      statusName,
                      taskIsPinned,
                      tagNames = [],
                      boardId,
                      boardTags = [],
                      className,
                      onPinChange,
                      ...cardProps
                  }) => {

    const navigate = useNavigate();
    const userInfo = getUserInfo();

    // put each tag/colour into key value pairs
    let boardTagKey = {}
    for (let i = 0; i < boardTags.length; i++) {
        boardTagKey[boardTags[i].tagName] = boardTags[i].tagColour;
    }

    let taskCardClasses = classNames("task-card clickable", className);

    // handler function of clicking pin/unpin
    const setIsPinned = (newPinState) => {
        Meteor.call("set_is_pinned", String(taskId), newPinState, userInfo.username);
    }

    // check if more than 4 tags, if yes only display 4 days and truncate with ... tag
    if (tagNames.length >= 4) {
        tagNames = tagNames.slice(0, 3);
        tagNames.push("...");
    }

    // checking deadline date to determine if overdue/urgent
    const deadlineDate = new Date(taskDeadlineDate)
    let displayText = isUrgentOverdue(deadlineDate, statusName).toUpperCase();

    return (
        <Card className={taskCardClasses} {...cardProps}>

            {/* card top div */}
            <div id="card__header">
                <TaskPin isPinned={taskIsPinned} onPinChange={setIsPinned}/> {/* Use PinTask component */}
                <div id={"card__header-inner"}>
                    {displayText && <div style={{color: "var(--dark-red)", marginRight: "25px"}}
                          className={"text-center small-text"}>{displayText}</div>}
                    <div className="main-text one-line" style={{width:"100%"}}>{taskName}</div>
                </div>
            </div>

            {/* card middle div */}
            <div className="small-text" id={"task__deadline"}>{deadlineDate.toLocaleString()}</div>

            {/* card bottom div */}
            <div id="task__tag-div">
                {tagNames
                    .sort((a, b) => a.localeCompare(b))
                    .map((tag, index) =>
                    <TaskTag
                        key={index}
                        tagName={tag}
                        tagColour={boardTagKey[tag] || "#E0E0E0"}
                        editMode={false}
                        taskId={taskId}
                    />
                )}
            </div>
        </Card>
    );
};

export default TaskCard;
