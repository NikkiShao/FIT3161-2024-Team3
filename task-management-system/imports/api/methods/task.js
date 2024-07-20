/**
 * File Description: Task database entity
 * File version: 1.0
 * Contributors: Nikki
 */

import {Meteor} from 'meteor/meteor'
import {TaskCollection} from "/imports/api/collections/task.js";

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
     * @param {string} desc - full description of the task     */
    "add_service": function (name, desc, deadline, isPinned, boardId, status, tagNames) {
        TaskCollection.insert(
            {
                "taskName": name,
                "taskDesc": desc,
                "taskDeadlineDate": deadline,
                "taskIsPinned": isPinned,
                "boardId": boardId,
                "status": status,
                "tagNames": tagNames,
            }
        )
    }
})

