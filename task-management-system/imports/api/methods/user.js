/**
 * File Description: User database entity
 * File version: 1.0
 * Contributors: Nikki
 */

import {Meteor} from 'meteor/meteor'
import {Accounts} from "meteor/accounts-base";

Meteor.methods({
    /**
     * Finds a user by id and emails a verification email
     * @param {string} id - id of the user
     */
    "send_verify_email": function (id) {
        Accounts.sendVerificationEmail(id);

    }
})

