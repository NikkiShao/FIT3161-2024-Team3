/**
 * File Description: Background card for all pages
 * Updated Date: 20/07/2024
 * Contributors: Nikki
 * Version: 1.0
 */

import React from 'react';
import classNames from "classnames";
import "./whiteBackground.css"

import PageLayout from "../../../enums/PageLayout";


/**
 * Depending on the given pageLayout, returns a <div> which serves as the outermost component of any PAGE.
 *
 * @param {JSX.Element} children - anything that goes onto the background, e.g. text, icons, any other components
 * @param {string} className - custom classes, that can override the base style
 * @param {PageLayout} pageLayout the layout required of the page - a value of Enum PageLayout class
 * @param divProps - includes all other properties such as styles, width, height, fill, etc.
 */
export const WhiteBackground = ({children, className, pageLayout, ...divProps}) => {

    // the classes for the div outside the actual white page, determines its alignment (left/right/center)
    let outerDivStyle = {
        minHeight: "95vh",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center"
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

    return (
        <div style={outerDivStyle}>
            <div {...divProps} className={pageMainDivClasses}>
                {children}
            </div>
        </div>
    );
};

export default WhiteBackground;
