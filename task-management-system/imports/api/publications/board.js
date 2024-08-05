/**
 * File Description: Board database entity
 * File version: 1.1
 * Contributors: Audrey, Nikki
 */

import {Meteor} from 'meteor/meteor'
import {BoardCollection} from "../collections/board";

/**
 * Publishes all the boards that belong to any team in a given list of team IDs.
 * @param {[string]} teamId - The array of IDs of the teams.
 * @returns {Mongo.Cursor} - A cursor representing the result of the boards to be published.
 */
Meteor.publish('all_teams_boards', function (teamIds) {
    return BoardCollection.find({teamId: {$in: teamIds}});
});

// todo: remove later, for testing
Meteor.publish('all_boards', function () {
    return BoardCollection.find();
})
