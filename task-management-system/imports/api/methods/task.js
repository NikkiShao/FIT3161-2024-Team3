/**
 * File Description: Task database entity
 * File version: 1.4
 * Contributors: Nikki, Sam
 */

import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { TaskCollection } from "/imports/api/collections/task.js";
import { Accounts } from 'meteor/accounts-base';
import "../methods/logEntry";
import BoardCollection from "../collections/board";

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
    'insert_edit_task': async function (taskData, isInsert) {
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

            let logAction = '';
            const logChanges = [];
            let taskId = taskData._id;

            // If inserting a new task
            if (isInsert) {
                taskId = TaskCollection.insert({
                    taskName: taskData.taskName,
                    taskDesc: taskData.taskDesc,
                    taskDeadlineDate: taskData.taskDeadlineDate,
                    taskIsPinned: taskData.taskIsPinned,
                    taskPinnedDate: taskData.taskIsPinned ? new Date() : null,
                    boardId: taskData.boardId,
                    statusName: taskData.statusName,
                    tagNames: taskData.tagNames,
                    contributions: taskData.contributions,
                });

                logAction = `created task: ${taskData.taskName}`;
            } else {
                // Editing an existing task
                const currentTask = TaskCollection.findOne(taskData._id);

                if (currentTask.taskName !== taskData.taskName) {
                    logChanges.push(`task name changed from '${currentTask.taskName}' to '${taskData.taskName}'`);
                }

                if (currentTask.taskDesc !== taskData.taskDesc) {
                    logChanges.push(`task description changed from '${currentTask.taskDesc}' to '${taskData.taskDesc}'`);
                }

                if (currentTask.taskDeadlineDate !== taskData.taskDeadlineDate) {
                    logChanges.push(`task deadline changed from '${currentTask.taskDeadlineDate}' to '${taskData.taskDeadlineDate}'`);
                }

                if (currentTask.statusName !== taskData.statusName) {
                    logChanges.push(`task status changed from '${currentTask.statusName}' to '${taskData.statusName}'`);
                }

                const removedTags = currentTask.tagNames.filter(tag => !taskData.tagNames.includes(tag));
                const addedTags = taskData.tagNames.filter(tag => !currentTask.tagNames.includes(tag));

                 if (addedTags.length > 0) {
                     logChanges.push(`added tags: ${addedTags.join(', ')}`);
                 }

                if (removedTags.length > 0) {
                    logChanges.push(`removed tags: ${removedTags.join(', ')}`);
                }

                // Check for changes in contributions
                const contributionChanges = [];
                currentTask.contributions.forEach((contribution, index) => {
                    const newContribution = taskData.contributions[index];
                    if (newContribution) {
                        if (contribution.percent !== newContribution.percent) {
                            // Get user name based on email
                            const user = Meteor.users.findOne({"emails.address": contribution.email});
                            const userName = user ? user.profile.name : contribution.email;

                            contributionChanges.push(`${userName} contribution changed from ${contribution.percent}% to ${newContribution.percent}%`);
                        }
                    } else {
                        const user = Meteor.users.findOne({"emails.address": contribution.email});
                        const userName = user ? user.profile.name : contribution.email;

                        contributionChanges.push(`removed contribution of ${userName}`);
                    }
                });

                // Check for any new contributions added
                taskData.contributions.slice(currentTask.contributions.length).forEach((contribution, index) => {
                    const user = Meteor.users.findOne({"emails.address": contribution.email});
                    const userName = user ? user.profile.name : contribution.email;

                    contributionChanges.push(`added contribution of ${userName}: ${contribution.percent}%`);
                });

                if (contributionChanges.length > 0) {
                    logChanges.push(contributionChanges.join(', '));
                }

                // Only log if there are actual changes
                if (logChanges.length > 0) {
                    TaskCollection.update(taskData._id, {
                        $set: {
                            taskName: taskData.taskName,
                            taskDesc: taskData.taskDesc,
                            taskDeadlineDate: taskData.taskDeadlineDate,
                            taskIsPinned: taskData.taskIsPinned,
                            taskPinnedDate: taskData.taskIsPinned ? new Date() : null,
                            boardId: taskData.boardId,
                            statusName: taskData.statusName,
                            tagNames: taskData.tagNames,
                            contributions: taskData.contributions,
                        }
                    });

                    logAction = logChanges.join(';');
                }
            }

            // get ID of the team which the task belongs to
            const teamId = BoardCollection.findOne(taskData.boardId).teamId;

            // Log the task action if there were changes
            if (logAction) {
                try {
                    await Meteor.callPromise('logEntry.insert', logAction, teamId, taskData.boardId, taskId);
                    console.log("Task logged successfully");
                } catch (error) {
                    console.error("Task logging error:", error);
                    throw new Meteor.Error('task-log-failed', 'Task logging failed');
                }
            }

            console.log("Task inserted/updated successfully");
        } catch (error) {
            console.error("Task insertion/update error:", error);
            throw new Meteor.Error('task-insertion-failed', 'Task insertion/update failed');
        }
    },

    /**
     * Deletes the task.
     *
     * @param {string} taskId - ID of the task
     */
    "delete_task": async function (taskId) {
        const task = TaskCollection.findOne(taskId);
        if (!task) {
            throw new Meteor.Error('task-not-found', 'Task not found');
        }

        // get ID of the team which the task belongs to
        const teamId = BoardCollection.findOne(task.boardId).teamId;

        // delete the task
        TaskCollection.remove({_id: taskId});

        // Log task deletion
        try {
            await Meteor.callPromise('logEntry.insert', `deleted task: ${task.taskName}`, teamId, task.boardId, taskId);
            console.log("Task deletion logged successfully");
        } catch (error) {
            console.error("Task deletion logging error:", error);
            throw new Meteor.Error('log-insert-failed', 'Failed to log task deletion');
        }
    },

    /**
     * Updates the pinned state of a task.
     *
     * @param {string} taskId - ID of the task
     * @param {boolean} isPinned - new pinned state of the task
     */
    "set_is_pinned": async function (taskId, isPinned) {
        check(taskId, String);
        check(isPinned, Boolean);

        const task = TaskCollection.findOne(taskId);
        if (!task) {
            throw new Meteor.Error('task-not-found', 'Task not found');
        }

        TaskCollection.update({_id: taskId}, {
            $set: {
                taskIsPinned: isPinned,
                taskPinnedDate: isPinned ? new Date() : null,
            },
        });

        // get ID of the team which the task belongs to
        const teamId = BoardCollection.findOne(task.boardId).teamId;

        // Log pinned state change
        try {
            const action = isPinned ? 'pinned task' : 'unpinned task';
            await Meteor.callPromise('logEntry.insert', `${action}: ${task.taskName}`, teamId, task.boardId, taskId);
            console.log("Task pinned state logged successfully");
        } catch (error) {
            console.error("Task pinning logging error:", error);
            throw new Meteor.Error('log-insert-failed', 'Failed to log task pinning');
        }
    },

    /**
     * Removes deleted statuses or tags from tasks.
     *
     * @param {string} boardId - ID of the board
     * @param {[string]} removedStatuses - Array of removed statuses
     * @param {[string]} removedTags - Array of removed tags
     */
    "remove_deleted_statuses_tags": function (boardId, removedStatuses, removedTags) {
        TaskCollection.update(
            {boardId: boardId, statusName: {$in: removedStatuses}},
            {$set: {statusName: "To Do"}},
            {multi: true}
        );
        TaskCollection.update(
            {boardId: boardId, tagNames: {$in: removedTags}},
            {$pull: {tagNames: {$in: removedTags}}},
            {multi: true}
        );
    }
});
