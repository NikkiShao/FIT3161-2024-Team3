/**
 * File Description: Task Card component
 * Updated Date: 30/07/2024
 * Contributors: Nikki,Samuel
 * Version: 1.1
 */

import React from "react";
import classNames from "classnames";
import Card from "./Card";
import './card.css';
import TaskTag from "./TaskTag";
import {useNavigate} from "react-router-dom";

/**
 * Task card used to display brief details on any Task
 *
 * @param {string} taskId - ID of the task
 * @param {string} taskName - Name of the task
 * @param {string} taskDeadline - deadline date of the task, ISO format date string
 * @param {boolean} isPinned - if the card is pinned to dashboard
 * @param {[Object]} tags - an array of tags. Type: objects, with the attribute: tagName and tagColour
 * @param {string} boardId - ID of the board the tag belongs to
 * @param {boolean} onDashboard - whether this task card is pinned and on the dashboard or displayed in the board page
 * @param {string} className - other classnames to add to the style of the card
 * @param cardProps - other props to add to the card
 * @returns {JSX.Element} - JSX element of the task card
 */
const TaskCard = ({
                      taskId,
                      taskName,
                      taskDeadline,
                      isPinned,
                      tags,
                      boardId,
                      onDashboard,
                      className,
                      ...cardProps
                  }) => {

    const navigate = useNavigate();

    let taskCardClasses = classNames("task-card clickable", className);
    const taskClickHandler = () => {
        // if this is on the dashboard, bring user to the board
        if (onDashboard) {
            navigate("/boards/" + boardId);
        } else {
            // todo: create task popup component
            console.log("clicked, open up task popup!");
        }
    }

    // handler function of clicking pin/unpin
    const setIsPinned = (event, status) => {
        // todo backend + promise
        event.stopPropagation(); // to prevent card being clicked
        Meteor.call("set_is_pinned", taskId, status);
    }

    // check if more than 4 tags, if yes only display 4 days and truncate with ... tag
    if (tags.length >= 4) {
        tags = tags.slice(0, 3);
        tags.push({tagName: "...", tagColour: "#E0E0E0"});
    }

    const pinEmptyIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" className={"clickable"} width="25" height="25" fill="var(--navy)"
             style={{minWidth: "25px", minHeight: "25px"}} viewBox="0 0 16 16" onClick={(e) => setIsPinned(e, true)}>
            <path
                d="M4.146.146A.5.5 0 0 1 4.5 0h7a.5.5 0 0 1 .5.5c0 .68-.342 1.174-.646 1.479-.126.125-.25.224-.354.298v4.431l.078.048c.203.127.476.314.751.555C12.36 7.775 13 8.527 13 9.5a.5.5 0 0 1-.5.5h-4v4.5c0 .276-.224 1.5-.5 1.5s-.5-1.224-.5-1.5V10h-4a.5.5 0 0 1-.5-.5c0-.973.64-1.725 1.17-2.189A6 6 0 0 1 5 6.708V2.277a3 3 0 0 1-.354-.298C4.342 1.674 4 1.179 4 .5a.5.5 0 0 1 .146-.354m1.58 1.408-.002-.001zm-.002-.001.002.001A.5.5 0 0 1 6 2v5a.5.5 0 0 1-.276.447h-.002l-.012.007-.054.03a5 5 0 0 0-.827.58c-.318.278-.585.596-.725.936h7.792c-.14-.34-.407-.658-.725-.936a5 5 0 0 0-.881-.61l-.012-.006h-.002A.5.5 0 0 1 10 7V2a.5.5 0 0 1 .295-.458 1.8 1.8 0 0 0 .351-.271c.08-.08.155-.17.214-.271H5.14q.091.15.214.271a1.8 1.8 0 0 0 .37.282"/>
        </svg>)
    const pinFilledIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" className={"clickable"} width="25" height="25" fill="var(--navy)"
             style={{minWidth: "25px", minHeight: "25px"}} viewBox="0 0 16 16" onClick={(e) => setIsPinned(e, false)}
        >
            <path
                d="M4.146.146A.5.5 0 0 1 4.5 0h7a.5.5 0 0 1 .5.5c0 .68-.342 1.174-.646 1.479-.126.125-.25.224-.354.298v4.431l.078.048c.203.127.476.314.751.555C12.36 7.775 13 8.527 13 9.5a.5.5 0 0 1-.5.5h-4v4.5c0 .276-.224 1.5-.5 1.5s-.5-1.224-.5-1.5V10h-4a.5.5 0 0 1-.5-.5c0-.973.64-1.725 1.17-2.189A6 6 0 0 1 5 6.708V2.277a3 3 0 0 1-.354-.298C4.342 1.674 4 1.179 4 .5a.5.5 0 0 1 .146-.354"/>
        </svg>
    )

    return (
        <Card className={taskCardClasses} {...cardProps} onClick={taskClickHandler}>

            {/* card top div */}
            <div id="card__header">
                {isPinned ? pinFilledIcon : pinEmptyIcon}
                <div className="main-text three-line">{taskName}</div>
            </div>

            {/* card middle div */}
            <div className="small-text" id={"task__deadline"}>{new Date(taskDeadline).toLocaleString()}</div>

            {/* card bottom div */}
            <div id="task__tag-div">
                {tags.map(tag =>
                    <TaskTag
                        key={tag.tagName}
                        tagName={tag.tagName}
                        tagColour={tag.tagColour}
                        editMode={false}
                        taskId={taskId}
                    />
                )}
            </div>
        </Card>
    );
};

export default TaskCard;
