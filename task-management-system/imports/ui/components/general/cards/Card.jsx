/**
 * File Description: Card component
 * Updated Date: 20/07/2024
 * Contributors: Nikki
 * Version: 1.0
 */

import React from "react";
import classNames from "classnames";
import "./card.css"

/**
 * General card component.
 *
 * @param {JSX.Element} children - children inside the card component, e.g. text, icons, other components
 * @param {string} className - custom classes, that can override the base style
 * @param cardProps - includes all other properties such as styles, width, height, fill, etc.
 */
const Card = ({children, className, ...cardProps}) => {
    const cardClasses = classNames("card-base", className);
    return (
        <div className={cardClasses} {...cardProps}>
            {children}
        </div>
    );
};

export default Card;
