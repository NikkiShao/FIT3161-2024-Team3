/**
 * File Description: Status database entity
 * File version: 1.0
 * Contributors: Nikki
 */

import StatusCollection from "../collections/status";

/**
 * Publishes all status belonging to  a board.
 */
Meteor.publish("all_board_statuses", function (boardId) {
    return StatusCollection.find({ boardId: boardId });
});
