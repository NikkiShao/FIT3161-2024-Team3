/**
 * File Description: Tag component
 * Updated Date: 30/07/2024
 * Contributors: Nikki
 * Version: 1.0
 */

import classNames from "classnames";
import React from "react";
import {XCircleIcon} from "@heroicons/react/24/outline";

import './card.css';

/**
 * A tag component for any task
 *
 * @param {string} tagName - name of tag, the text of the tag
 * @param {string} tagColour - colour code of the tag, e.g. #FFFFFF
 * @param {boolean} editMode - true: shows x button to remove, false only shows the tagName
 * @param {string} taskId - ID of the task the tag belongs to
 * @param {string} className - other classnames to override styles with
 * @param tagProps - other props to include in the tag
 * @returns {JSX.Element} - Tag element JSX object
 */
const TaskTag = ({
                     tagName,
                     tagColour,
                     editMode,
                     taskId,
                     className,
                     ...tagProps
                 }) => {

    // handler for x button
    const removeTag = () => {
        // todo backend + promise
        console.log("remove tag" + tagName);
        Meteor.call("remove_tag ", taskId, tagName);
    }

    const taskTagClasses = classNames("task-tag", className);
    const removeTagIcon = <XCircleIcon color={"var(--navy)"} className={"clickable"} onClick={removeTag}
                                       strokeWidth={1.5} viewBox="0 0 24 24" width={18} height={18} />

    return (
        <div style={{backgroundColor: tagColour}}
             className={taskTagClasses}
             {...tagProps}>
            {tagName}
            {editMode ? removeTagIcon : null}
        </div>
    )
};

export default TaskTag;
