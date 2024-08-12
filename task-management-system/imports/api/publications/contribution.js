/**
 * File Description: Contribution database entity
 * File version: 1.0
 * Contributors: Nikki
 */

import ContributionCollection from "../collections/contribution";

/**
 * Publishes all tasks of a board.
 */
Meteor.publish("all_board_contributions", function (boardId) {
    return ContributionCollection.find({ boardId: boardId });
});
