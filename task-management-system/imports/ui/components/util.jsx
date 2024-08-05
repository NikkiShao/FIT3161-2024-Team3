/**
 * File Description: General utility functions
 * File version: 1.0
 * Contributors: Nikki
 */

import {useState} from "react";
import {Tracker} from "meteor/tracker";
import {Meteor} from "meteor/meteor";

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

    console.log("Current logged in user:" + JSON.stringify(userInfo))
    return userInfo;
}