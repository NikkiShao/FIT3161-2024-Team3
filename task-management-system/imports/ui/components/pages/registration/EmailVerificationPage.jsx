/**
 * File Description: Email verification page
 * Updated Date: 29/07/2024
 * Contributors: Nikki
 * Version: 1.0
 */

import WhiteBackground from "../../general/whiteBackground/WhiteBackground";
import PageLayout from "../../../enums/PageLayout";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

import Button from "../../general/buttons/Button";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Accounts } from "meteor/accounts-base";
import Spinner from "react-bootstrap/Spinner";
import { getUserInfo } from "../../util";
import BaseUrlPath from "../../../enums/BaseUrlPath";

/**
 * Email verification page component
 */
export const EmailVerificationPage = () => {
    const navigate = useNavigate();

    const {token} = useParams();
    const [loading, setLoading] = React.useState(true);

    console.log(token)
    const userInfo = getUserInfo();
    console.log(userInfo)

    // meteor method to verify a token
    Accounts.verifyEmail(
        token,
        function (error) {
            setLoading(false);
        });

    if (loading) {
        return (
            <WhiteBackground pageLayout={PageLayout.SMALL_CENTER}>
                <Spinner animation="border" variant="secondary" role="status"/>
            </WhiteBackground>
        );
    } else {
        if (!userInfo.verified) {
            return (
                <WhiteBackground pageLayout={PageLayout.SMALL_CENTER}>
                    <h1>Email Verification Failed</h1>

                    <span>Invalid email verification token</span>
                    <br/>
                    <Button className={"btn-brown"}
                            onClick={() => {
                                navigate('/' + BaseUrlPath.LOGIN)
                            }}>
                        Return to Login
                    </Button>
                </WhiteBackground>
            )
        } else {
            return (
                <WhiteBackground pageLayout={PageLayout.SMALL_CENTER}>
                    <h1>Email Verified</h1>

                    <CheckCircleIcon color={"var(--green)"} strokeWidth={1.5} width={120} height={120}/>

                    <span>Your email is verified!</span>
                    <br/>
                    <Button className={"btn-brown"}
                            onClick={() => {
                                navigate("/" + BaseUrlPath.DASHBOARD)
                            }}>
                        Return to Dashboard
                    </Button>
                </WhiteBackground>
            )
        }
    }
}

export default EmailVerificationPage;