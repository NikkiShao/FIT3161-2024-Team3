/**
 * File Description: Task database entity
 * File version: 1.1
 * Contributors: Nikki
 */

import { Meteor } from "meteor/meteor";
import {TaskCollection} from "../collections/task.js";

/**
 * Publishes all pinned services.
 */
Meteor.publish("pinned_tasks", function () {
    return TaskCollection.find({ taskIsPinned: true });
});

/**
 * Publishes all tasks of a board.
 */
Meteor.publish("all_board_tasks", function (boardId) {
    return TaskCollection.find({ boardId: boardId });
});


/**
 * todo: remove, this is for testing
 */
Meteor.publish("all_tasks", function () {
    return TaskCollection.find();
});
