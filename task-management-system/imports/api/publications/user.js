/**
 * File Description: User database entity
 * File version: 1.0
 * Contributors: Nikki
 */

import {Meteor} from 'meteor/meteor'
import {UserCollection} from "../collections/user";

/**
 * Publishes all users.
 */
Meteor.publish('all_users', function() {
    return UserCollection.find();
});


/**
 * Publishes all bookings associated with a specific user to the client.
 *
 * @param {string} username - The username of the user to be published.
 * @returns {Mongo.Cursor} - A cursor representing the result of the user to be published.
 */
Meteor.publish('specific_user', function(username) {
    // Check if the username matches either the user
    return UserCollection.find({username:username});
});