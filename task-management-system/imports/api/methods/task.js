/**
 * File Description: Task database entity
 * File version: 1.2
 * Contributors: Nikki, Samuel
 */

import {Meteor} from 'meteor/meteor';
import {check, Match} from 'meteor/check';
import {TaskCollection} from "/imports/api/collections/task.js";

Meteor.methods({
    /**
     * Adds a new task to the database. Keep in mind this is an async method.
     *
     * @param {object} taskData - task object containing task details
     * @param {string | null} taskData._id - id of task, if inserting a new one, it will be null
     * @param {string} taskData.taskName - title of task
     * @param {string} taskData.taskDesc - full description of the task
     * @param {string} taskData.taskDeadlineDate - deadline datetime of task
     * @param {boolean} taskData.taskIsPinned - whether task is pinned or not
     * @param {string} taskData.boardId - the ID of the board the task belongs to
     * @param {string} taskData.statusName - status of the task
     * @param {[string]} taskData.tagNames - array of tag names that the task has
     * @param {[object]} taskData.contributions - contribution details of the task
     * @param {boolean} isInsert
     */
    'insert_edit_task'(taskData, isInsert) {
        try {
            console.log(isInsert)
            console.log("Inserting task:", taskData);

            check(taskData, {
                _id: Match.Any,
                taskName: String,
                taskDesc: String,
                taskDeadlineDate: String,
                taskIsPinned: Boolean,
                boardId: String,
                statusName: String,
                tagNames: [String],
                contributions: [Object]
            });

            // Convert deadline to Date object
            const dateObject = new Date(taskData.taskDeadlineDate)
            if (isNaN(dateObject.getTime())) {
                throw new Meteor.Error('invalid-deadline', 'Deadline must be a valid date');
            }

            if (isInsert) {
                TaskCollection.insert({
                    taskName: taskData.taskName,
                    taskDesc: taskData.taskDesc,
                    taskDeadlineDate: taskData.taskDeadlineDate,
                    taskIsPinned: taskData.taskIsPinned,
                    boardId: taskData.boardId,
                    statusName: taskData.statusName,
                    tagNames: taskData.tagNames,
                    contributions: taskData.contributions
                });

            } else {
                // edit
                TaskCollection.update(taskData._id, {
                    $set: {
                        taskName: taskData.taskName,
                        taskDesc: taskData.taskDesc,
                        taskDeadlineDate: taskData.taskDeadlineDate,
                        taskIsPinned: taskData.taskIsPinned,
                        boardId: taskData.boardId,
                        statusName: taskData.statusName,
                        tagNames: taskData.tagNames,
                        contributions: taskData.contributions
                    }
                })
            }

            console.log("Task inserted successfully");
        } catch (error) {
            console.error("Task insertion error:", error);
            throw new Meteor.Error('task-insertion-failed', 'Task insertion failed');
        }
    },
    /**
     * Deletes the task.
     *
     * @param {string} taskId - ID of the task
     */
    "delete_task": function (taskId) {
        TaskCollection.remove({_id: taskId});
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

        TaskCollection.update({_id: taskId}, {
            $set: {
                taskIsPinned: isPinned,
            },
        });
    },
});
