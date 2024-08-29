import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';
import LogEntryCollection from '../collections/logEntry';
import {getUserInfoSync} from '/imports/ui/components/util';

Meteor.methods({
    'logEntry.insert'(logEntryAction, boardId, taskId = null) {
        check(logEntryAction, String);
        check(boardId, String);
        if (taskId !== null) {
            check(taskId, String);
        }

        if (!this.userId) {
            throw new Meteor.Error('Not authorised');
        }

        // Get user information using the synchronous function
        const userInfo = getUserInfoSync();
        if (!userInfo) {
            throw new Meteor.Error('user-info-missing', 'Could not retrieve user information');
        }

        const username = userInfo.name;
        const logEntryDatetime = new Date().toISOString();

        LogEntryCollection.insert({
            logEntryDatetime,
            logEntryAction,
            boardId,
            taskId,
            username,
        });
    },

    // Add other methods if needed
});
