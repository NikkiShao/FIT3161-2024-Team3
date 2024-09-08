/**
 * File Description: User database entity
 * File version: 2.3
 * Contributors: Nikki, Mark
 */

import {Meteor} from 'meteor/meteor'
import {check} from 'meteor/check'
import {Accounts} from "meteor/accounts-base";
import UserCollection from "../collections/user";
import user from "../collections/user";

Meteor.methods({
    /**
     * @param {string} userId - id of the user. This is a serverside function only.
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

        // input validations
        const alphanumericSpaceRegex = /^[A-Za-z0-9 ]+$/i;
        if (name === '' || !alphanumericSpaceRegex.test(name) || name.length > 30) {
            throw new Meteor.Error('user-update-failed', 'Invalid name input');
        }

        // get all users, check if current email already exists
        const allUsers = UserCollection.find().fetch();
        const allOtherUserEmails = allUsers.filter((user) => user._id !== userId).map(user => user.emails[0].address);
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

        if (email === '' || !emailRegex.test(email)) {
            throw new Meteor.Error('user-update-failed', 'Invalid email input');

        } else if (allOtherUserEmails.includes(email)) {
            throw new Meteor.Error('user-update-failed', 'Email address already exists');
        }

        Meteor.users.update(userId, {
            $set: {
                "profile.name": name,
                "emails.0.address": email,
                "emails.0.verified": false,
                "profile.notificationOn": notification
            }
        })

    },

    /**
     * Deletes a user by id
     * @param {string} userId - id of the user
     */
    "delete_user": function (userId) {
        check(userId, String);
        Meteor.users.remove(userId);
    },

})
