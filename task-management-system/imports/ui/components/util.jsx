/**
 * File Description: General utility functions
 * File version: 1.3
 * Contributors: Nikki, Sam
 */

import {useState} from "react";
import {Tracker} from "meteor/tracker";
import {Meteor} from "meteor/meteor";

/**
 * random alphanumeric characters
 */
const rand = function () {
    return Math.random().toString(36).substring(2); // remove `0.`
};

/**
 * generates a random token for member invitation
 */
export const generateInvitationToken = () => {
    return rand() + rand() + rand();
}


// render time in a readable format
// 2024-09-11T22:55:00.000+00:00 -> 11 Sep 2024, 23:55
export const renderTime = (isoString) => {
    const date = new Date(isoString);

    // Get date part
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();

    // Get time part
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day} ${month} ${year}, ${hours}:${minutes}`;
}


/**
 * Retrieves current logged-in user's information
 * This can be extended to include more user related attributes.
 *
 * @returns an object containing the information of the user including username, email, name
 */
export function getUserInfo() {
    // get current user information
    const [userInfo, setUserInfo] = useState(
        {
            "id": null,
            "username": null,
            "email": null,
            "verified": false,
            "name": null,
            "notificationOn": false
        }
    );

    // tracker for the required user data updates
    Tracker.autorun(() => {
        const user = Meteor.user();
        const userId = Meteor.userId();

        if (user) {
            // user data is returned (sometimes it takes a while)
            const fetchedUserId = userId;
            const fetchedUsername = user.username;
            const fetchedEmail = user.emails[0].address;
            const fetchedEmailVerification = user.emails[0].verified;
            const fetchedName = user.profile.name;
            const fetchedNotificationOn = user.profile.notificationOn;

            // check if an update to the current user info is required or not (this is needed to prevent inf loop)
            if (
                userInfo.id !== fetchedUserId ||
                userInfo.username !== fetchedUsername ||
                userInfo.email !== fetchedEmail ||
                userInfo.verified !== fetchedEmailVerification ||
                userInfo.name !== fetchedName ||
                userInfo.notificationOn !== fetchedNotificationOn
            ) {
                setUserInfo(
                    {
                        "id": fetchedUserId,
                        "username": fetchedUsername,
                        "email": fetchedEmail,
                        "verified": fetchedEmailVerification,
                        "name": fetchedName,
                        "notificationOn": fetchedNotificationOn
                    }
                )
            }
        }
    })

    // console.log("Current logged in user:" + JSON.stringify(userInfo))
    return userInfo;
}

/**
 * Retrieves current logged-in user's information for use in Meteor methods
 * This function does not use React hooks and is safe to use outside of React components.
 *
 * @returns an object containing the information of the user including username, email, name
 */
export function getUserInfoSync() {
    const user = Meteor.user();
    const userId = Meteor.userId();

    if (user && userId) {
        return {
            "id": userId,
            "username": user.username,
            "email": user.emails[0].address,
            "verified": user.emails[0].verified,
            "name": user.profile.name,
            "notificationOn": user.profile.notificationOn
        };
    }

    return null;
}