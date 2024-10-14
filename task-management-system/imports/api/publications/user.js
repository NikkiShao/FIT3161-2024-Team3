/**
 * File Description: User database entity
 * File version: 1.1
 * Contributors: Nikki
 */

import { Meteor } from 'meteor/meteor'
import { UserCollection } from "../collections/user";

/**
 * Publishes all users.
 * todo: remove this is for develop
 */
Meteor.publish('all_users', function() {
    return UserCollection.find();
});


/**
 * Publishes users with given username.
 *
 * @param {string} username - The username of the user to be published.
 * @returns {Mongo.Cursor} - A cursor representing the result of the user to be published.
 */
Meteor.publish('specific_username_user', function(username) {
    // Check if the username matches the user
    return UserCollection.find({username:username});
});
