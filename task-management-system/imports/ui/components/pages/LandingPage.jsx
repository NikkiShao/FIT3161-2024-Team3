/**
 * File Description: Landing page
 * Updated Date: 02/08/2024
 * Contributors: Nikki
 * Version: 1.0
 */

import React from 'react';
import WhiteBackground from "../general/whiteBackground/WhiteBackground";
import PageLayout from "../../enums/PageLayout";
import {useNavigate} from "react-router-dom";
import {getUserInfo} from "../util";
import Button from "../general/buttons/Button";
import BaseUrlPath from "../../enums/BaseUrlPath";



/**
 * Landing page component
 */
export const LandingPage = () => {

    const navigate = useNavigate();

    const userInfo = getUserInfo();

    if (userInfo.id === null) {
        return (
            <WhiteBackground pageLayout={PageLayout.SMALL_CENTER}>
                <h1 className={"text-center"}> Welcome to Task Management System</h1>

                <div className="main-text">Please login to access your teams and boards</div>
                <Button className={"btn-brown"} onClick={() => navigate('/' + BaseUrlPath.LOGIN)}>Go to Login</Button>

            </WhiteBackground>
        )
    } else {
        navigate('/' + BaseUrlPath.DASHBOARD)
    }


}

export default LandingPage;