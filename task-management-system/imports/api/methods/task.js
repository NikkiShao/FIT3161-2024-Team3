/**
 * File Description: Task database entity
 * File version: 1.8
 * Contributors: Nikki, Sam, AUdrey
 */

import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { TaskCollection } from "/imports/api/collections/task.js";
import "../methods/logEntry";
import "../methods/board";
import BoardCollection from "../collections/board";

Meteor.methods({
    /**
     * Adds a new task to the database. Keep in mind this is an async method.
     *
     * @param {object} taskData - task object containing task details
     * @param {string} taskData.taskName - title of task
     * @param {string} taskData.taskDesc - full description of the task
     * @param {string} taskData.taskDeadlineDate - deadline datetime of task
     * @param {boolean} taskData.taskIsPinned - whether task is pinned or not
     * @param {string} taskData.boardId - the ID of the board the task belongs to
     * @param {string} taskData.statusName - status of the task
     * @param {[string]} taskData.tagNames - array of tag names that the task has
     * @param {[object]} taskData.contributions - contribution details of the task
     * @param {string} username - username of the creator
     */
    'insert_task': async function (taskData, username) {
        check(taskData, {
            _id: null,
            taskName: String,
            taskDesc: String,
            taskDeadlineDate: String,
            taskIsPinned: Boolean,
            taskPinnedDate: Match.Maybe(Date),
            boardId: String,
            statusName: String,
            tagNames: [String],
            contributions: [{
                percent: Number,
                email: String,
            }]
        });
        check(username, String)

        if (taskData.taskName === '' || taskData.taskName.length > 100) {
            throw new Meteor.Error('add-task-failed', 'Invalid name input');
        }

        if (taskData.taskDesc === '' || taskData.taskDesc.length > 1000) { 
            throw new Meteor.Error('add-task-failed', 'Invalid description input');
        }


        let dateObject = new Date(taskData.taskDeadlineDate);
        if(taskData.taskDeadlineDate === '' || (isNaN(dateObject))){
            throw new Meteor.Error('add-task-failed', 'Invalid date-time input');
        }

        let totalContribution = 0;
        for(let i = 0; i < taskData.contributions.length; i++){
            if(taskData.contributions[i].percent)
                totalContribution += taskData.contributions[i].percent;
        }
        if (totalContribution > 100) {
            throw new Meteor.Error('add-task-failed', 'Invalid contribution input');
        }

        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        for(let i=0; i<taskData.contributions.length; i++){
            console.log(taskData.contributions[i]);
            const email = taskData.contributions[i].email;
            if(!emailRegex.test(email)){
                throw new Meteor.Error('add-task-failed', 'Invalid email contribution input');
            } 
        }

        const board = BoardCollection.findOne({_id: taskData.boardId});
        if (!board) {
            throw new Meteor.Error('task-missing-board', 'Could not retrieve board information');
        }

        let taskId = TaskCollection.insert({
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

        let logAction = `created task: ${taskData.taskName}`;

        if (Meteor.isServer) {
            // get ID of the team which the task belongs to
            const teamId = BoardCollection.findOne(taskData.boardId).teamId;

            // Log the task action if there were changes
            if (logAction) {
                try {
                    await Meteor.callPromise('logEntry.insert', logAction, username, teamId, taskData.boardId, taskId);
                    console.log("Task logged successfully");
                } catch (error) {
                    console.error("Task logging error:", error);
                    throw new Meteor.Error('task-log-failed', 'Task logging failed');
                }
            }
        }

        console.log("Task inserted successfully");
        return taskId;
    },

    /**
     * Adds a new task to the database. Keep in mind this is an async method.
     *
     * @param {string} taskId - ID of task to edit
     * @param {object} taskData - task object containing task details
     * @param {string} taskData._id - id of task
     * @param {string} taskData.taskName - title of task
     * @param {string} taskData.taskDesc - full description of the task
     * @param {string} taskData.taskDeadlineDate - deadline datetime of task
     * @param {boolean} taskData.taskIsPinned - whether task is pinned or not
     * @param {string} taskData.boardId - the ID of the board the task belongs to
     * @param {string} taskData.statusName - status of the task
     * @param {[string]} taskData.tagNames - array of tag names that the task has
     * @param {[object]} taskData.contributions - contribution details of the task
     * @param {string} username - username of the editor
     */
    'update_task': async function (taskId, taskData, username) {

        check(taskId, String)
        check(taskData, {
            _id: String,
            taskName: String,
            taskDesc: String,
            taskDeadlineDate: String,
            taskIsPinned: Boolean,
            taskPinnedDate: Match.Maybe(Date),
            boardId: String,
            statusName: String,
            tagNames: [String],
            contributions: [Object]
        });
        check(username, String)

        if (taskData.taskName === '' || taskData.taskName.length > 100) {
            throw new Meteor.Error('update-task-failed', 'Invalid name input');
        }

        if (taskData.taskDesc === '' || taskData.taskDesc.length > 1000) { 
            throw new Meteor.Error('update-task-failed', 'Invalid description input');
        }


        let dateObject = new Date(taskData.taskDeadlineDate);
        if(taskData.taskDeadlineDate === '' || (isNaN(dateObject))){
            throw new Meteor.Error('update-task-failed', 'Invalid date-time input');
        }

        let totalContribution = 0;
        for(let i = 0; i < taskData.contributions.length; i++){
            if(taskData.contributions[i].percent)
                totalContribution += taskData.contributions[i].percent;
        }
        if (totalContribution > 100) {
            throw new Meteor.Error('update-task-failed', 'Invalid contribution input');
        }

        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        for(let i=0; i<taskData.contributions.length; i++){
            console.log(taskData.contributions[i]);
            const email = taskData.contributions[i].email;
            if(!emailRegex.test(email)){
                throw new Meteor.Error('update-task-failed', 'Invalid email contribution input');
            } 
        }

        const board = BoardCollection.findOne({_id: taskData.boardId});
        if (!board) {
            throw new Meteor.Error('task-missing-board', 'Could not retrieve board information');
        }

        let logAction = '';
        const logChanges = [];

        // Editing an existing task
        const currentTask = TaskCollection.findOne(taskId);

        if (currentTask.taskName !== taskData.taskName) {
            logChanges.push(`task name changed from '${currentTask.taskName}' to '${taskData.taskName}'`);
        }

        if (currentTask.taskDesc !== taskData.taskDesc) {
            logChanges.push(`task description changed from '${currentTask.taskDesc}' to '${taskData.taskDesc}'`);
        }

        if (currentTask.taskDeadlineDate !== taskData.taskDeadlineDate) {
            const oldDate = new Date (currentTask.taskDeadlineDate).toLocaleString();
            const newDate = new Date (taskData.taskDeadlineDate).toLocaleString();
            logChanges.push(`task deadline changed from '${oldDate}' to '${newDate}'`);
        }

        if (currentTask.statusName !== taskData.statusName) {
            logChanges.push(`task status changed from '${currentTask.statusName}' to '${taskData.statusName}'`);
        }

        // Check for pinning state change and log it
        if (currentTask.taskIsPinned !== taskData.taskIsPinned) {
            const pinAction = taskData.taskIsPinned ? `pinned task: ${taskData.taskName}` : `unpinned task: ${taskData.taskName}`;
            logChanges.push(pinAction);
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
                    // Get username based on email
                    const user = Meteor.users.findOne({"emails.address": contribution.email});
                    const username = user ? user.profile.name : contribution.email;

                    contributionChanges.push(`${username} contribution changed from ${contribution.percent}% to ${newContribution.percent}%`);
                }
            } else {
                const user = Meteor.users.findOne({"emails.address": contribution.email});
                const username = user ? user.profile.name : contribution.email;

                contributionChanges.push(`removed contribution of ${username}`);
            }
        });

        // Check for any new contributions added
        taskData.contributions.slice(currentTask.contributions.length).forEach((contribution) => {
            const user = Meteor.users.findOne({"emails.address": contribution.email});
            const username = user ? user.profile.name : contribution.email;

            contributionChanges.push(`added contribution of ${username}: ${contribution.percent}%`);
        });

        if (contributionChanges.length > 0) {
            logChanges.push(contributionChanges.join(', '));
        }

        // Only log if there are actual changes
        if (logChanges.length > 0) {
            TaskCollection.update(taskId, {
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

            logAction = logChanges.join('; ');

        if (Meteor.isServer) {
            // get ID of the team which the task belongs to
            const teamId = BoardCollection.findOne(taskData.boardId).teamId;

            // Log the task action if there were changes
            if (logAction) {
                try {
                    await Meteor.callPromise('logEntry.insert', logAction, username, teamId, taskData.boardId, taskId);
                    console.log("Task logged successfully");
                } catch (error) {
                    console.error("Task logging error:", error);
                    throw new Meteor.Error('task-log-failed', 'Task logging failed');
                }
            }
        }
        console.log("Task updated successfully");
    }
},
    /**
     * Deletes the task.
     *
     * @param {string} taskId - ID of the task
     * @param username - username of user who deleted the task
     */
    "delete_task": async function (taskId, username) {
        check(taskId, String);
        const task = TaskCollection.findOne(taskId);
        if (!task) {
            return;
        }

        // get ID of the team which the task belongs to
        const teamId = BoardCollection.findOne(task.boardId).teamId;

        if (Meteor.isServer) {
            // Log task deletion
            try {
                await Meteor.callPromise('logEntry.insert', `deleted task: ${task.taskName}`, username, teamId, task.boardId, taskId);
                console.log("Task deletion logged successfully");
            } catch (error) {
                console.error("Task deletion logging error:", error);
                throw new Meteor.Error('log-insert-failed', 'Failed to log task deletion');
            }
        }

        // delete the task
        TaskCollection.remove({_id: taskId});
    },

    /**
     * Updates the pinned state of a task.
     *
     * @param {string} taskId - ID of the task
     * @param {boolean} isPinned - new pinned state of the task
     * @param username - username of user who pinned/unpinned the task
     */
    "set_is_pinned": async function (taskId, isPinned, username) {
        check(taskId, String);
        check(isPinned, Boolean);
        check(username, String);

        const task = TaskCollection.findOne(taskId);
        if (!task) {
            throw new Meteor.Error('task-pin-failed', 'Task not found');
        }

        TaskCollection.update({_id: taskId}, {
            $set: {
                taskIsPinned: isPinned,
                taskPinnedDate: isPinned ? new Date() : null,
            },
        });
        const taskAfter = TaskCollection.findOne(taskId);

        if (Meteor.isServer) {
            const teamId = BoardCollection.findOne(task.boardId).teamId;
            const action = isPinned ? 'pinned task' : 'unpinned task';

            // Log pinned state change
            try {
                await Meteor.callPromise('logEntry.insert', `${action}: ${task.taskName}`, username, teamId, task.boardId, taskId);
                console.log("Task pinned state logged successfully");
            } catch (error) {
                console.error("Task pinning logging error:", error);
                throw new Meteor.Error('log-insert-failed', 'Failed to log task pinning');
            }
        }
        return taskAfter;
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
