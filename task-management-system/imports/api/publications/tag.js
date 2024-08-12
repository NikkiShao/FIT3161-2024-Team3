/**
 * File Description: Tag database entity
 * File version: 1.0
 * Contributors: Nikki
 */

import TagCollection from "../collections/tag";

/**
 * Publishes all tags of a board.
 */
Meteor.publish("all_board_tags", function (boardId) {
    return TagCollection.find({boardId: boardId});
});
