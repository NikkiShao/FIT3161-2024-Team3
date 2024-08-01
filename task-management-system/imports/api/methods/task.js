/**
 * File Description: Task database entity
 * File version: 1.2
 * Contributors: Nikki, Samuel
 */

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { TaskCollection } from "/imports/api/collections/task.js";

Meteor.methods({
  /**
   * Adds a new task to the database. Keep in mind this is an async method.
   *
   * @param {string} name - name of task
   * @param {datetime} deadline - deadline datetime of task
   * @param {boolean} isPinned - whether task is pinned or not
   * @param {string} boardId - the ID of the board the task belongs to
   * @param {string} status - status of the task
   * @param {[string]} tagNames - array of tag names that the task has
   * @param {string} desc - full description of the task
   */
  "add_task": function (name, desc, deadline, isPinned, boardId, status, tagNames) {
    TaskCollection.insert({
      "taskName": name,
      "taskDesc": desc,
      "taskDeadlineDate": deadline,
      "taskIsPinned": isPinned,
      "boardId": boardId,
      "status": status,
      "tagNames": tagNames,
    });
  },
  /**
   * Updates the pinned state of a task.
   *
   * @param {string} taskId - ID of the task
   * @param {boolean} isPinned - new pinned state of the task
   */
  "set_is_pinned": function (taskId, isPinned) {
    check(taskId, String);
    check(isPinned, Boolean);

    TaskCollection.update(taskId, {
      $set: {
        taskIsPinned: isPinned,
      },
    });
  },
});
