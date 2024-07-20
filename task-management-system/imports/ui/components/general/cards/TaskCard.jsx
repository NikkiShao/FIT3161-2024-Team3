/**
 * File Description: Task Card component
 * Updated Date: 20/07/2024
 * Contributors: Nikki
 * Version: 1.0
 */

import React from "react";
import classNames from "classnames";
import Card from "./Card";

/**
 * A type of Card, used for tasks.
 *
 * @param {JSX.Element} children - children inside the card component, e.g. text, icons, other components
 * @param {string} className - custom classes, that can override the base style
 * @param cardProps - includes all other properties such as styles, width, height, fill, etc.
 */
const TaskCard = ({children, className, ...cardProps}) => {
    const taskCardClasses = classNames("task-card", className);
    return (
        <Card className={taskCardClasses} {...cardProps}>
            {children}
        </Card>
    );
};

export default TaskCard;
