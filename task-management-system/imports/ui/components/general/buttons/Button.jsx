/**
 * File Description: Button component
 * Updated Date: 20/07/2024
 * Contributors: Nikki
 * Version: 1.0
 */

import React, {forwardRef} from "react";
import classNames from "classnames";
import "./button.css"

/**
 * General button component.
 * forwardRef allows a component to accept a ref from a higher level component and assign it to a child component,
 * see https://react.dev/reference/react/forwardRef
 *
 * @param {JSX.Element} children - children inside the button component, e.g. text, icons, other components
 * @param {string} className - custom classes, that can override the base style
 * @param buttonProps - includes all other properties such as styles, width, height, fill, etc.
 */
const Button = forwardRef(({children, className, ...buttonProps}, ref) => {
    const buttonClasses = classNames("btn-base main-text", className);
    return (
        <button ref={ref} className={buttonClasses} type="button" {...buttonProps}>
            {children}
        </button>
    );
});

export default Button;
