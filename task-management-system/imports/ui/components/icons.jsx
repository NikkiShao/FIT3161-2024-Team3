import {
    CheckIcon,
    ChevronLeftIcon,
    Cog8ToothIcon,
    DocumentTextIcon,
    MinusCircleIcon,
    PlusCircleIcon,
    PlusIcon,
    XCircleIcon
} from "@heroicons/react/24/outline";
import React from "react";
import QuestionMarkCircleIcon from "@heroicons/react/16/solid/QuestionMarkCircleIcon";

export const closeModalIcon = <XCircleIcon color={"var(--navy)"} strokeWidth={2} viewBox="0 0 24 24" width={35} height={35}/>;
export const saveIcon = <CheckIcon strokeWidth={2} viewBox="0 0 24 24" width={23} height={23} style={{marginRight: "5px"}}/>;
export const settingsIcon = <Cog8ToothIcon strokeWidth={2} viewBox="0 0 24 24" width={26} height={26} style={{marginRight: "5px"}}/>
export const logsIcon = <DocumentTextIcon strokeWidth={2} viewBox="0 0 24 24" width={23} height={23} style={{marginRight: "5px"}}/>
export const addIcon = <PlusIcon strokeWidth={2} viewBox="0 0 24 24" width={23} height={23} style={{marginRight: "5px"}}/>;
export const subAddIcon = <PlusCircleIcon color={"var(--dark-grey)"} strokeWidth={2} viewBox="0 0 24 24" width={30} height={30}/>;
export const minusCircleIcon = <MinusCircleIcon color={"var(--dark-grey)"} strokeWidth={2} viewBox="0 0 24 24" width={30} height={30}/>;
export const backLeftArrow = <ChevronLeftIcon strokeWidth={2} viewBox="0 0 23 23" width={20} height={20}/>;
export const helpQuestionIcon = <QuestionMarkCircleIcon color={"var(--dark-grey)"} strokeWidth={2} viewBox="0 0 16 16" width={25} height={25}/>;
