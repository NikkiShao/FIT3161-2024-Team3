/**
 * File Description: Background card for all pages
 * Updated Date: 30/07/2024
 * Contributors: Nikki
 * Version: 1.1
 */

import React, {useState} from 'react';
import classNames from "classnames";
import {Tracker} from 'meteor/tracker';
import "./whiteBackground.css"

import PageLayout from "../../../enums/PageLayout";
import HoverTip from "../hoverTip/HoverTip";
import QuestionMarkCircleIcon from "@heroicons/react/16/solid/QuestionMarkCircleIcon";


/**
 * Depending on the given pageLayout, returns a <div> which serves as the outermost component of any PAGE.
 *
 * @param {JSX.Element} children - anything that goes onto the background, e.g. text, icons, any other components
 * @param {string} className - custom classes, that can override the base style
 * @param {PageLayout} pageLayout the layout required of the page - a value of Enum PageLayout class
 * @param {string} pageHelpText - text about what the page is, what you can do, i.e. the help text
 * @param divProps - includes all other properties such as styles, width, height, fill, etc.
 */
export const WhiteBackground = ({children, className, pageLayout, pageHelpText, ...divProps}) => {

    // the classes for the div outside the actual white page, determines its alignment (left/right/center)
    let outerDivStyle = {
        minHeight: "95vh",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        marginLeft: "300px"
    }

    // this part ensures that margin is correct when user logged in vs not logged in (when logged in left side has a menu bar)
    const [loggedInUserId, setLoggedInUserId] = useState(Meteor.userId());

    // When login status changes, this is automatically ran
    Tracker.autorun(() => {
        const userId = Meteor.userId();

        if (userId !== loggedInUserId) {
            setLoggedInUserId(Meteor.userId());
        }
    })

    if (!loggedInUserId) {
    // if user is NOT logged in, nav bar is NOT displayed, move display to the center right
        outerDivStyle.marginLeft = "0";
    }

    // all pages will have a background with white-glass-base, and the standard shadow
    let pageMainDivClasses = classNames("background-base", className);

    if (!pageLayout || pageLayout === PageLayout.LARGE_CENTER) {
        // default to large center
        pageMainDivClasses = classNames("large-page", pageMainDivClasses);

    } else if (pageLayout === PageLayout.SMALL_CENTER) {
        // small page in the center
        outerDivStyle.alignItems = "center";
        pageMainDivClasses = classNames("small-page", pageMainDivClasses);

    } else if (pageLayout === PageLayout.FREE) {
        // todo

    }
    // for help hover
    const questionIcon = <QuestionMarkCircleIcon color={"var(--dark-grey)"} strokeWidth={2} viewBox="0 0 16 16" width={25} height={25}/>;

    return (
        <div style={outerDivStyle}>
            <div {...divProps} className={pageMainDivClasses}>
                {/*todo: make only appear when there is text*/}
                {
                    pageHelpText ?
                    <HoverTip icon={questionIcon}
                              outerText={"Help"}
                              toolTipText={pageHelpText}
                              divClassName={"page-help-tip"}
                              textClassname
                    /> : null
                }
                {children}
            </div>
        </div>
    );
};

export default WhiteBackground;
