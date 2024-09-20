/**
 * File Description: Hover Tip examples
 * Updated Date: 20/07/2024
 * Contributors: Nikki
 * Version: 1.0
 */

import React from "react";
import HoverTip from "../../general/hoverTip/HoverTip";
import { helpQuestionIcon, subAddIcon } from "../../icons";

const HoverTipExample = () => {
    return (
        <div>
            <HoverTip
                icon={helpQuestionIcon}
                outerText={"Outer text anything"}
                toolTipText={"Any text you want to put in here"}
            />
            <HoverTip
                icon={subAddIcon}
                outerText={"Abcd"}
                toolTipText={"Any text you want to put in here. Any text you want to put in here. Any text you want to put in here."}
            />
        </div>


        
    );
};

export default HoverTipExample;
