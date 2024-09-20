/**
 * File Description: Team database entity
 * File version: 1.2
 * Contributors: Sam, Nikki
 */

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import LogEntryCollection from '../collections/logEntry';
import UserCollection from "../collections/user";
import TeamCollection from "../collections/team";
import BoardCollection from "../collections/board";
import TaskCollection from "../collections/task";

Meteor.methods({
    'logEntry.insert'(logEntryAction, username, teamId, boardId, taskId = null) {

        if (Meteor.isServer){
            check(logEntryAction, String);
            check(username, String);
            check(teamId, String);
            check(boardId, String);

            if (taskId !== null) {
                check(taskId, String);
            }

            // Check if user exists
            const userInfo = UserCollection.findOne({username: username});
            if (!userInfo) {
                throw new Meteor.Error('user-info-missing', 'Could not retrieve user information');
            }

            // Check if team exists
            const teamInfo = TeamCollection.findOne({_id: teamId});
            if (!teamInfo) {
                throw new Meteor.Error('team-info-missing', 'Could not retrieve team information');
            }

            // Check if board exists
            const boardInfo = BoardCollection.findOne({_id: boardId});
            if (!boardInfo) {
                throw new Meteor.Error('board-info-missing', 'Could not retrieve board information');
            }

            // Check if task exists, only if taskId is provided
            if (taskId !== null) {
                const taskInfo = TaskCollection.findOne({_id: taskId});
                if (!taskInfo) {
                    throw new Meteor.Error('task-info-missing', 'Could not retrieve task information');
                }
            }

            const logEntryDatetime = new Date().toISOString();

            const logId = LogEntryCollection.insert({
                logEntryDatetime,
                logEntryAction,
                teamId,
                boardId,
                taskId,
                username,
            });

            return logId;
        }
    },

    // Add other methods if needed
});
