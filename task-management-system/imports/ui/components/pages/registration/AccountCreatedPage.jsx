/**
 * File Description: Account created page
 * Updated Date: 29/07/2024
 * Contributors: Nikki
 * Version: 1.0
 */


import React from "react";
import {useNavigate, useParams} from "react-router-dom";
import {EnvelopeOpenIcon, ArrowRightIcon} from "@heroicons/react/24/outline";

import WhiteBackground from "../../general/whiteBackground/WhiteBackground";
import PageLayout from "../../../enums/PageLayout";
import Button from "../../general/buttons/Button";


export const AccountCreatedPage = () => {
    const navigate = useNavigate();

    // grab the username ID from the URL
    const {username} = useParams();


    // method called to email user verification email
    Meteor.call("send_verify_email", username);

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
                        navigate('/login')
                    }}>
                Return to Login
            </Button>
        </WhiteBackground>
    )
}

export default AccountCreatedPage;