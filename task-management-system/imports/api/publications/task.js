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
 * todo: remove, this is for testing
 */
Meteor.publish("all_tasks", function () {
    return TaskCollection.find();
});

/**
 * find task based on boardId
 */
Meteor.publish('tasks_for_board', function (boardId) {
  console.log('Publishing tasks for boardId:', boardId);
  return TaskCollection.find({ boardId });
});

