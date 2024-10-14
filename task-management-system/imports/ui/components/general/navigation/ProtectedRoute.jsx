/**
 * File Description: Protected route component that only checks user against access requirements
 * File version: 1.0
 * Contributors: Nikki
 */

import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { Tracker } from "meteor/tracker";
import { Meteor } from "meteor/meteor";
import RoutingAccess from "/imports/ui/enums/RoutingAccess";
import UrlBasePath from "/imports/ui/enums/BaseUrlPath";
import Spinner from "react-bootstrap/Spinner";

/**
 * Protects a route that can ONLY be accessed either logged-in or NOT logged-in users.
 *      Redirects users that are not logged accessing logged-in content -> sign in
 *      Redirects users that are logged in accessing not non-login content -> home page
 *
 * @param {JSX.Element} children - Page/Component to be protected, such as the login/register page,
 *                                 accounts page, messages page etc.
 * @param {RoutingAccess} accessReq - a value of the RoutingAccess enum, determining what type of access the page
 *                                    needs to be able to be accessed
 */
export const ProtectedRoute = ({children, accessReq}) => {

    // variables to check if user is in the process of logging in/out
    const [logoutLoading, setLogoutLoading] = useState(Meteor.loggingOut());
    const [loginLoading, setLoginLoading] = useState(Meteor.loggingIn());

    const [loggedInUserId, setLoggedInUserId] = useState(Meteor.userId());

    // When login status changes, this is automatically ran
    Tracker.autorun(() => {
        const userId = Meteor.userId();

        if (userId !== loggedInUserId) {
            setLoggedInUserId(Meteor.userId());
        }
    })

    // tracker for logging out variable
    Tracker.autorun(() => {
        const currentLoading = Meteor.loggingOut();

        if (logoutLoading !== currentLoading) {
            setLogoutLoading(currentLoading);
        }
    })

    // tracker for logging in variable
    Tracker.autorun(() => {
        const currentLoading = Meteor.loggingIn();

        if (loginLoading !== currentLoading) {
            setLoginLoading(currentLoading);
        }
    })

    if (logoutLoading || loginLoading) {
        // if user is logging in or logging out, for it to complete
        let marginStyle = {}
        if (loggedInUserId) {
            marginStyle.marginLeft = "300px";
        }

        return (
            <div id={"pr__div"} style={marginStyle}>
                <Spinner animation="border" variant="secondary" role="status"/>
            </div>
        );

    } else {
        // not in the process of logging in/out, then check if the access requirement is met
        switch (accessReq) {
            case RoutingAccess.SIGNED_OUT_ONLY:
                if (loggedInUserId !== null) {
                    // user IS authenticated, cannot access the given page, redirect to home page
                    return <Navigate to={"/" + UrlBasePath.DASHBOARD}/>;
                }
                return children;

            case RoutingAccess.SIGNED_IN_ONLY:
                if (loggedInUserId === null) {
                    // user is NOT authenticated, cannot access page, redirect to login page
                    return <Navigate to={"/" + UrlBasePath.LOGIN}/>;
                }
                return children;
        }
    }
};

export default ProtectedRoute;