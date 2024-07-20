/**
 * File Description: Button examples
 * Updated Date: 20/07/2024
 * Contributors: Nikki
 * Version: 1.0
 */

import React from 'react';
import Button from "../../general/buttons/Button";
import {ChevronLeftIcon} from "@heroicons/react/24/outline";

const ButtonExamples = () => {

    return (
        <div className="center-spaced">

            <Button className={"btn-brown"}>Brown button</Button>
            <Button className={"btn-grey"}>Grey Button</Button>
            <Button className={"btn-light-grey"}>Light Grey Button</Button>
            <Button className={"btn-light-grey btn-square"}>Light Grey Button</Button>
            <Button className={"btn-red"}>Red Button</Button>

            <Button className={"flex flex-row gap-2 btn-back"}>
                <ChevronLeftIcon strokeWidth={2} viewBox="0 0 23 23" width={20} height={20}/>
                Back
            </Button>

        </div>
    );
};

export default ButtonExamples;