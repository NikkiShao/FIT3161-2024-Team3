/**
 * File Description: Hover Tip examples
 * Updated Date: 20/07/2024
 * Contributors: Nikki
 * Version: 1.0
 */

import React from "react";
import HoverTip from "../../general/hoverTip/HoverTip";
import QuestionMarkCircleIcon from "@heroicons/react/16/solid/QuestionMarkCircleIcon";
import {PlusCircleIcon} from "@heroicons/react/24/outline";

const HoverTipExample = () => {
    const questionIcon = <QuestionMarkCircleIcon color={"var(--dark-grey)"} strokeWidth={2} viewBox="0 0 16 16" width={25} height={25}/>;
    const plusIcon = <PlusCircleIcon color={"var(--dark-grey)"} strokeWidth={2} viewBox="0 0 24 24" width={30}
                                     height={30}/>;
    return (
        <div>
            <HoverTip
                icon={questionIcon}
                outerText={"Outer text anything"}
                toolTipText={"Any text you want to put in here"}
            />
            <HoverTip
                icon={plusIcon}
                outerText={"Abcd"}
                toolTipText={"Any text you want to put in here. Any text you want to put in here. Any text you want to put in here."}
            />
        </div>


        
    );
};

export default HoverTipExample;
