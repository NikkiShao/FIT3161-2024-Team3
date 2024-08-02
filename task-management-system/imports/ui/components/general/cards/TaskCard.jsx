/**
 * File Description: Task Card component
 * Updated Date: 01/08/2024
 * Contributors: Nikki, Samuel
 * Version: 1.2
 */

import React from "react";
import classNames from "classnames";
import Card from "./Card";
import './card.css';
import TaskTag from "./TaskTag";
import { useNavigate } from "react-router-dom";
import PinTask from './PinTask';

/**
 * Task card used to display brief details on any Task
 *
 * @param {string} taskId - ID of the task
 * @param {string} taskName - Name of the task
 * @param {string} taskDeadline - deadline date of the task, ISO format date string
 * @param {string} taskStatus - status of the task
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
  taskStatus,
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
  const setIsPinned = (newPinState) => {
    Meteor.call("set_is_pinned", String(taskId), newPinState);
  }

  // check if more than 4 tags, if yes only display 4 days and truncate with ... tag
  if (tags.length >= 4) {
    tags = tags.slice(0, 3);
    tags.push({ tagName: "...", tagColour: "#E0E0E0" });
  }

  // checking deadline date to determine if overdue/urgent
  const taskDeadlineDate = new Date(taskDeadline);
  const today = new Date();
  let urgentStartDate = new Date();
  urgentStartDate.setTime(today.getTime() - 3 * 24 * 60 * 60 * 1000) // three before now after

  let displayText = null;
  if (taskDeadlineDate <= today && taskStatus !== "done") {
    // after current datetime and NOT done
    displayText = <div style={{ color: "var(--dark-red)", marginRight: "25px" }} className={"text-center small-text"}>OVERDUE</div>
  } else if (taskDeadlineDate >= urgentStartDate && taskStatus !== "done") {
    displayText = <div style={{ color: "var(--dark-red)", marginRight: "25px" }} className={"text-center small-text"}>URGENT</div>
  }

  return (
    <Card className={taskCardClasses} {...cardProps} onClick={taskClickHandler}>

      {/* card top div */}
      <div id="card__header">
        <PinTask isPinned={isPinned} onPinChange={setIsPinned} /> {/* Use PinTask component */}
        <div id={"card__header-inner"}>
          {displayText}
          <div className="main-text three-line">{taskName}</div>
        </div>
      </div>

      {/* card middle div */}
      <div className="small-text" id={"task__deadline"}>{taskDeadlineDate.toLocaleString()}</div>

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
