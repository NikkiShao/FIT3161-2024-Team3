import { Meteor } from 'meteor/meteor';

// Here should be all the imports
import '/imports/api/collections/board.js';
import '/imports/api/publications/board.js';
import '/imports/api/methods/board.js';

import '/imports/api/collections/poll.js';
import '/imports/api/methods/poll.js';
import '/imports/api/publications/poll.js';

import '/imports/api/collections/task.js';
import '/imports/api/methods/task.js';
import '/imports/api/publications/task.js';

import '/imports/api/collections/user.js';
import '/imports/api/methods/user.js';
import '/imports/api/publications/user.js';

import '/imports/api/collections/team.js';
import '/imports/api/methods/team.js';
import '/imports/api/publications/team.js';

import '/imports/api/collections/logEntry.js';
import '/imports/api/methods/logEntry.js';
import '/imports/api/publications/logEntry.js';

import { initialiseMailer } from "../imports/api/mailer";
import { autoSendNotification } from "./notification";
import { autoCleanOldLogEntries } from "./logAutoRemoval";


Accounts.emailTemplates.verifyEmail = {
    subject() {
        return "[UTM] Verify Your Email Address";
    },
    text(user, url) {
        let emailAddress = user.emails[0].address,
            urlWithoutHash = url.replace('#/', ''),
            emailBody = `To verify your email address (${emailAddress}) visit the following link:\n\n${urlWithoutHash}\n\nIf you did not request this verification, please ignore this email.`;

        return emailBody;
    }
};

Meteor.startup(async () => {
    // start up functions in the future potentially
    // console.log(process.env.MONGO_URL)

    if (Meteor.isServer) {
        Accounts.emailTemplates.from = `"University Task Management System"${process.env.EMAIL_USER}`

        // initialise the node mailer
        await initialiseMailer()

        // set up auto email notification
        autoSendNotification()

        // set up automatic log entry cleanup
        autoCleanOldLogEntries();
    }
});
