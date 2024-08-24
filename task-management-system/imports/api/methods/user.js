/**
 * File Description: User database entity
 * File version: 2.0
 * Contributors: Nikki, Mark
 */

import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import { Accounts } from "meteor/accounts-base";

Meteor.methods({
    /**
     * @param {string} userId - id of the user
     */

    "send_verify_email": function (userId) {
        Accounts.sendVerificationEmail(userId);
    },

    /**
    * Finds a user by id and emails a verification email
    * @param {string} userId - id of the user
    * @param {string} name - Update name for the user.
    * @param {string} email - Update email for the user.
    * @param {boolean} notification - Update email notifications state.
       */

    "update_user_info": function (userId, name, email, notification) {
        check(userId, String);
        check(name, String);
        check(email, String);
        check(notification, Boolean);

        Meteor.users.update(userId, {
            $set: {
                "profile.name": name,
                "emails.0.address": email,
                "profile.notificationOn": notification
            }
        })
    },

    /**
     * Deletes a user by id
     * @param {string} userId - id of the user
     */

    "delete_user": function (userId) {
        throw new Error()
        check(userId, String);
        Meteor.users.remove(userId);
    },




    /**
     * Checks if a user has joined any team by id
     * @param {string} userId - id of the user
     * @returns {boolean} - true if user has joined any team, false otherwise
     */
    "check_if_join_any_team": function (userId) {
        check(userId, String);

        // get infomation about if user has joined any team
        const user = Meteor.users.findOne(
            { _id: userId },
            { fields: { "profile.teamIds": 1 } }
        );

        // return true if user has joined any team
        if (user.profile && Array.isArray(user.profile.teamIds)) {
            return user.profile.teamIds.length > 0;
        }

        return false;
    }

})
