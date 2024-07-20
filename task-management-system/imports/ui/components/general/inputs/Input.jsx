/**
 * File Description: Input component
 * Updated Date: 20/07/2024
 * Contributors: Nikki
 * Version: 1.0
 */

import React from "react";
import classNames from "classnames";
import "./input.css"

/**
 * General input component.
 *
 * @param {JSX.Element} children - children inside the input component, e.g. text, icons, other components
 * @param {string} className - custom classes, that can override the base style
 * @param {JSX.Element} label - an optional JSX <label> element
 * @param inputProps - includes all other properties such as styles, width, height, fill, etc.
 */
const Input = ({children, className, label, ...inputProps}) => {
    const inputClasses = classNames("input-base", className);

    if (label) {
        // label given
        return (
            <div className="flex flex-col gap-1">
                {label}
                <input className={inputClasses} {...inputProps}>
                    {children}
                </input>
            </div>
        );

    } else {
        // no label given
        return (
            <input className={inputClasses} {...inputProps}>
                {children}
            </input>
        );
    }
};

export default Input;
