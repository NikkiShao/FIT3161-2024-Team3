/**
 * File Description: Input examples
 * Updated Date: 20/07/2024
 * Contributors: Nikki
 * Version: 1.0
 */

import React from 'react';
import { UserIcon } from "@heroicons/react/24/outline";
import Input from "../../general/inputs/Input";

const ButtonExamples = () => {

    return (
        <div className="center-spaced">

            <Input
                label={<label className="main-text">{"Any input label"}</label>}
                placeholder={"Place holder text ..."}
            />

            <div className="position-relative">
                <UserIcon
                    className={"position-absolute"}
                    style={{translate: "12.5px 12.5px"}}
                    strokeWidth={2} width={20} height={20} color="#747474"/>
                <Input
                    style={{paddingLeft: "40px"}}
                    placeholder={"Input with icon ..."}
                />

            </div>

            <div className="main-text underline">Specialty input:</div>

            <Input type="color"/>
            <Input type="file"/>
            <Input type="range" className={"accent-secondary-purple hover:accent-secondary-purple-hover"}/>

            <div className="main-text underline">Date time related input:</div>
            <Input type="time"/>
            <Input type="week"/>
            <Input type="month"/>
            <Input type="date"/>
            <Input type="datetime-local"/>


            <div className="main-text underline">Text based:</div>
            <Input type="email" placeholder={"email input"}/>
            <Input type="number" placeholder={"number input"}/>
            <Input type="password" placeholder={"password input"}/>
            <Input type="search" placeholder={"search input"}/>
            <Input type="tel" placeholder={"telephone input"}/>
            <Input type="text" placeholder={"text input"}/>
            <Input type="url" placeholder={"url input"}/>
        </div>
    );
};

export default ButtonExamples;