/**
 * File Description: Tag component
 * Updated Date: 30/07/2024
 * Contributors: Nikki
 * Version: 1.0
 */

import classNames from "classnames";
import React from "react";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { isDark } from '@bkwld/light-or-dark'

import './card.css';

/**
 * A tag component for any task
 *
 * @param {Object} tagName - name of tag, the text of the tag
 * @param {string} tagColour - colour code of the tag, e.g. #FFFFFF
 * @param {boolean} editMode - true: shows x button to remove, false only shows the tagName
 * @param {string} taskId - ID of the task the tag belongs to
 * @param xButtonHandler - function to call when X button is pressed, if not specified, defaults to removing tag
 * from existing task
 * @param {string} className - other classnames to override styles with
 * @param tagProps - other props to include in the tag
 * @returns {JSX.Element} - Tag element JSX object
 */
const TaskTag = ({
                     tagName,
                     tagColour,
                     editMode,
                     taskId,
                     xButtonHandler,
                     className,
                     ...tagProps
                 }) => {

    // handler for x button
    const removeTag = () => {
        Meteor.call("remove_tag ", taskId, tagName);
    }

    const taskTagClasses = classNames("task-tag non-clickable", className);
    const removeTagIcon = <XCircleIcon color={"var(--navy)"} className={"clickable"}
                                       onClick={xButtonHandler ? xButtonHandler : removeTag}
                                       strokeWidth={2} viewBox="0 0 24 24" width={20} height={20}
                                       style={{color: isDark(tagColour) ? "var(--white)" : "var(--black)"}}
    />

    return (
        <div style={{backgroundColor: tagColour, color: isDark(tagColour) ? "var(--white)" : "var(--black)"}}
             className={taskTagClasses}
             {...tagProps}>
            {tagName}
            {editMode ? removeTagIcon : null}
        </div>
    )
};

export default TaskTag;
