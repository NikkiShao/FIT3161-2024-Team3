/**
 * File Description: Team database entity
 * File version: 1.3
 * Contributors: Audrey, Nikki
 */

import {Meteor} from 'meteor/meteor'
import {TeamCollection} from "../collections/team";

/**
 * Publishes one team based on given team ID to the client.
 * @param {string} teamId - The ID of the team to be published.
 * @returns {Mongo.Cursor} - A cursor representing the result the team to be published.
 */
Meteor.publish('specific_team', function (teamId) {
    return TeamCollection.find({
        _id: teamId
    });
});

/**
 * Publishes all of a specific user's teams
 */
Meteor.publish("all_user_teams", function (email) {
    return TeamCollection.find({teamMembers: email});
});

/**
 * todo: remove, this is for testing
 */
Meteor.publish("all_teams", function () {
    return TeamCollection.find();
});

Meteor.publish('team_by_id', function (teamId) {
    return TeamCollection.find({
        _id: teamId
    });
});