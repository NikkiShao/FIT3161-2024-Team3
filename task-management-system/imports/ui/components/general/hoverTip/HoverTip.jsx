/**
 * File Description: Hover tip component
 * Updated Date: 20/07/2024
 * Contributors: Nikki
 * Version: 1.0
 */

import React from "react";
import Tippy from '@tippyjs/react/headless';
import QuestionMarkCircleIcon from "@heroicons/react/16/solid/QuestionMarkCircleIcon";
import classNames from "classnames";
import "./hoverTip.css"

/**
 * General hover tip component.
 *
 */
const HoverTip = ({icon, outerText, toolTipText, divClassName, textClassname, ...props}) => {
    const hoverTipClasses = classNames("hover-tip-base main-text", divClassName);
    const textClasses = classNames("main-text", textClassname);

    return (
        <div className={hoverTipClasses} {...props}>
            <span style={{marginRight:"7px"}} className={"main-text text-grey"}>{outerText}</span>

            <Tippy render={attrs => (
                <div
                    className="tip-text-box"
                    tabIndex="-1" {...attrs}>
                    <span className={textClasses}>{toolTipText}</span>
                </div>
            )}>
                {icon}
            </Tippy>
        </div>

    );
};

export default HoverTip;
