/**
 * File Description: Poll database entity
 * File version: 1.0
 * Contributors: Nikki
 */

import { Meteor } from 'meteor/meteor'
import { PollCollection } from "../collections/poll";

/**
 * Publishes all the polls that belong to a team based on given team ID.
 * @param {string} teamId - The ID of the team.
 * @returns {Mongo.Cursor} - A cursor representing the result of the polls to be published.
 */
Meteor.publish('all_team_polls', function (teamId) {
    return PollCollection.find({teamId: teamId});
});

/**
 * Publishes all the polls.
 * todo: remove, this is for testing
 */
Meteor.publish('all_polls', function () {
    return PollCollection.find();
});

Meteor.publish('all_teams_polls', function (teamIds) {
    return PollCollection.find({teamId: {$in: teamIds}});
});
