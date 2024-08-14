/**
 * File Description: Board database entity
 * File version: 1.2
 * Contributors: Audrey, Nikki
 */

import {Meteor} from 'meteor/meteor'
import {BoardCollection} from "../collections/board";

/**
 * Publishes all the boards that belong to any team in a given list of team IDs.
 * @param {[string]} teamIds - The array of IDs of the teams.
 * @returns {Mongo.Cursor} - A cursor representing the result of the boards to be published.
 */
Meteor.publish('all_teams_boards', function (teamIds) {
    return BoardCollection.find({teamId: {$in: teamIds}});
});

/**
 * Publishes all the boards that belong to a single team.
 * @param {string} teamId - The IDs of the team.
 * @returns {Mongo.Cursor} - A cursor representing the result of the boards to be published.
 */
Meteor.publish('all_team_boards', function (teamId) {
    return BoardCollection.find({teamId: teamId});
});

/**
 * Publishes a specific boards.
 * @param {string} boardId - The IDs of the board.
 * @returns {Mongo.Cursor} - A cursor representing the result of the board to be published.
 */
Meteor.publish('specific_board', function (boardId) {
    return BoardCollection.find({_id: boardId});
});

// todo: remove later, for testing
Meteor.publish('all_boards', function () {
    return BoardCollection.find();
})
