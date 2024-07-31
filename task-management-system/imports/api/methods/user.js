/**
 * File Description: User database entity
 * File version: 1.0
 * Contributors: Nikki
 */

import {Meteor} from 'meteor/meteor'
import {Accounts} from "meteor/accounts-base";

Meteor.methods({
    /**
     * Finds a user by username and emails a verification email
     * @param {string} username - username of the user
     */
    "send_verify_email": function (username) {
        const user = Accounts.findUserByUsername(username);
        Accounts.sendVerificationEmail(user._id);
    }
})

