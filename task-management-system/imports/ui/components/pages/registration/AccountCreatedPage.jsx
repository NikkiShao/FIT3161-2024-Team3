/**
 * File Description: Account created page
 * Updated Date: 29/07/2024
 * Contributors: Nikki
 * Version: 1.0
 */


import React from "react";
import {useNavigate} from "react-router-dom";
import {ArrowRightIcon, EnvelopeOpenIcon} from "@heroicons/react/24/outline";

import WhiteBackground from "../../general/whiteBackground/WhiteBackground";
import PageLayout from "../../../enums/PageLayout";
import Button from "../../general/buttons/Button";
import BaseUrlPath from "../../../enums/BaseUrlPath";


export const AccountCreatedPage = () => {
    const navigate = useNavigate();

    return (
        <WhiteBackground pageLayout={PageLayout.SMALL_CENTER}>

            <h1>Account Created</h1>

            <div id={"reg2__icons"}>
                <ArrowRightIcon color={"var(--green)"} strokeWidth={2} width={80} height={80}/>
                <EnvelopeOpenIcon color={"var(--navy)"} strokeWidth={1.5} width={120} height={120}/>
            </div>

            <span>Your account has been successfully created!</span>
            <span>An email has been sent to verify your email address</span>
            <br/>
            <Button className={"btn-brown"}
                    onClick={() => {
                        navigate('/' + BaseUrlPath.LOGIN)
                    }}>
                Return to Login
            </Button>
        </WhiteBackground>
    )
}

export default AccountCreatedPage;