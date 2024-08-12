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
   * @param {object} task - task object containing task details
   * @param {string} task.taskName - title of task
   * @param {string} task.taskDesc - full description of the task
   * @param {string} task.taskDeadlineDate - deadline datetime of task
   * @param {boolean} task.taskIsPinned - whether task is pinned or not
   * @param {string} task.boardId - the ID of the board the task belongs to
   * @param {string} task.statusName - status of the task
   * @param {[string]} task.tagNames - array of tag names that the task has
   * @param contribution - contribution details of the task
   */
  'insert_task'(task, contribution) {
    try {
      console.log("Inserting task:", task);

      check(task, {
        taskName: String,
        taskDesc: String,
        taskDeadlineDate: Date,
        taskIsPinned: Boolean,
        boardId: String,
        statusName: String,
        tagNames: [String],
      });

      // Convert deadline to Date object
      if (isNaN(task.taskDeadlineDate.getTime())) {
        throw new Meteor.Error('invalid-deadline', 'Deadline must be a valid date');
      }

      TaskCollection.insert({
        taskName: task.taskName,
        taskDesc: task.taskDesc,
        taskDeadlineDate: task.taskDeadlineDate.toISOString(),
        taskIsPinned: task.taskIsPinned,
        boardId: task.boardId,
        statusName: task.statusName,
        tagNames: task.tagNames,
      });

      // todo insert contribution entities
      for (let entry in contribution) {
        // insert an entry of contribution into database

      }

      console.log("Task inserted successfully");
    } catch (error) {
      console.error("Task insertion error:", error);
      throw new Meteor.Error('task-insertion-failed', 'Task insertion failed');
    }
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

    TaskCollection.update({ _id: taskId }, {
      $set: {
        taskIsPinned: isPinned,
      },
    });
  },
});
