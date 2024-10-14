/**
 * File Description: Navigation bar component
 * Updated Date: 30/07/2024
 * Contributors: Nikki
 * Version: 1.0
 */

import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Tracker } from 'meteor/tracker';
import { Meteor } from "meteor/meteor";
import { ArrowUpTrayIcon, Cog6ToothIcon, HomeIcon, UserGroupIcon } from "@heroicons/react/24/outline";

import './navigationBar.css'
import { getUserInfo } from "../../util";
import BaseUrlPath from "../../../enums/BaseUrlPath";

/**
 * Navigation Bar component for all pages of the app, relies on the Route object in App.js
 * for correct routing.
 */
export const NavigationBar = () => {
    // first level URL path for underlining the nav tab
    const baseUrl = useLocation().pathname.split('/')[1];

    const userInfo = getUserInfo();

    // variables for logged in user (if any)
    const [loggedInUserId, setLoggedInUserId] = useState(userInfo.id);

    // When login status changes, this is automatically ran
    Tracker.autorun(() => {
        const userId = Meteor.userId();

        if (userId !== loggedInUserId) {
            setLoggedInUserId(Meteor.userId());
        }
    })

    return (
        // nav bar is hidden if user not logged in
        <header className={!loggedInUserId ? "hidden" : ""}>
            <nav id={"nav__outer"}>
                {/* top part with the user welcome message */}
                <div className={"small-text"} id={"nav__welcome"}>Welcome back,</div>
                <h2 id={"nav__name"}>{userInfo.name}</h2>
                <hr id={"nav__hr"}/>

                {/* from here are the navigation links */}
                <ul id={"nav__ul"}>
                    <li className={""}>
                        <NavLink id={"nav__link"}
                                 className={baseUrl === BaseUrlPath.DASHBOARD ? "nav__active menu-text" : "menu-text"}
                                 to={"/" + BaseUrlPath.DASHBOARD}>
                            <HomeIcon strokeWidth={2} width={30} height={30}/>
                            Dashboard
                        </NavLink>
                    </li>
                    <li className={""}>
                        <NavLink id={"nav__link"}
                                 className={baseUrl === BaseUrlPath.TEAMS ? "nav__active menu-text" : "menu-text"}
                                 to={"/" + BaseUrlPath.TEAMS}>
                            <UserGroupIcon strokeWidth={2} width={30} height={30}/>
                            Teams
                        </NavLink>
                    </li>

                    <li className={"menu-text"}>
                        <NavLink id={"nav__link"}
                                 className={baseUrl === BaseUrlPath.SETTINGS ? "nav__active menu-text" : "menu-text"}
                                 to={"/" + BaseUrlPath.SETTINGS}>
                            <Cog6ToothIcon strokeWidth={2} width={30} height={30}/>
                            Settings
                        </NavLink>
                    </li>
                    <li className={"menu-text"}>
                        <NavLink id={"nav__link"} className={"menu-text"} to={"/login"}
                                 onClick={() => {
                                     Meteor.logout();
                                     navigate("/" + BaseUrlPath.LOGIN);
                                 }}>
                            <ArrowUpTrayIcon strokeWidth={2} width={30} height={30}/>
                            Logout
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </header>
    )
}

export default NavigationBar;