/**
 * File Description: Task database entity
 * File version: 1.0
 * Contributors: Nikki
 */

import { Meteor } from "meteor/meteor";
import {TaskCollection} from "/imports/api/collections/task.js";

/**
 * Publishes all pinned services.
 */
Meteor.publish("pinned_tasks", function () {
    return TaskCollection.find({ taskIsPinned: true });
});
