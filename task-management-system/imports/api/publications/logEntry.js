/**
 * File Description: Log entry database entity
 * File version: 1.0
 * Contributors: Nikki
 */

import { Meteor } from 'meteor/meteor'
import { LogEntryCollection } from "../collections/logEntry";

/**
 * Publishes all the log entries relating to a specific team for all its boards/tasks.
 * @param {string} teamId - The ID of the team.
 * @returns {Mongo.Cursor} - A cursor representing the result the logs to be published.
 */
Meteor.publish('all_team_logs', function (teamId) {
    return LogEntryCollection.find({teamId: teamId});
});

/**
 * Publishes all the log entries relating to a specific board for all its tasks.
 * @param {string} teamId - The ID of the team.
 * @returns {Mongo.Cursor} - A cursor representing the result the logs to be published.
 */
Meteor.publish('all_board_logs', function (boardId) {
    return LogEntryCollection.find({boardId: boardId});
});