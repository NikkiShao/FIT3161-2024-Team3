/**
 * File Description: Hover tip component
 * Updated Date: 20/07/2024
 * Contributors: Nikki
 * Version: 1.1
 */

import React from "react";
import Tippy from '@tippyjs/react/headless';
import QuestionMarkCircleIcon from "@heroicons/react/16/solid/QuestionMarkCircleIcon";
import classNames from "classnames";
import "./hoverTip.css"

/**
 * General hover tip component
 *
 * @param icon - the icon to display
 * @param outerText - the text to display next to the icon
 * @param toolTipText - the text to display on hover
 * @param divClassName - extra class names to give to the component's external div
 * @param textClassname - extra class names to give to the component's text
 * @param isBlue - if board is blue or grey
 * @param props - other properties
 */
const HoverTip = ({icon, outerText, toolTipText, divClassName, textClassname, isBlue=true, ...props}) => {
    const hoverTipClasses = classNames("hover-tip-base main-text", divClassName);
    const textClasses = classNames("main-text", textClassname);

    return (
        <div className={hoverTipClasses} {...props}>
            {outerText ?
                <span style={{marginRight: "7px"}} className={"main-text text-grey"}>{outerText}</span> : null
            }

            <Tippy render={attrs => (
                <div
                    className={classNames("tip-text-box", isBlue ? "tip-blue" : "tip-grey")}
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
