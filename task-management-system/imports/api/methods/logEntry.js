/**
 * File Description: Team database entity
 * File version: 1.1
 * Contributors: Sam, Nikki
 */

import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';
import LogEntryCollection from '../collections/logEntry';
import UserCollection from "../collections/user";

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

            // Get user information using the synchronous function
            const userInfo = UserCollection.findOne({username: username});

            if (!userInfo) {
                throw new Meteor.Error('user-info-missing', 'Could not retrieve user information');
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
