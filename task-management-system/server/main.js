import { Meteor } from 'meteor/meteor';

// Here should be all the imports
import '/imports/api/collections/board.js';
import '/imports/api/publications/board.js';
import '/imports/api/methods/board.js';

import '/imports/api/collections/contribution.js';
import '/imports/api/publications/contribution.js';

import '/imports/api/collections/poll.js';
import '/imports/api/publications/poll.js';

import '/imports/api/collections/status.js';
import '/imports/api/publications/status.js';

import '/imports/api/collections/tag.js';
import '/imports/api/publications/tag.js';

import '/imports/api/collections/task.js';
import '/imports/api/methods/task.js';
import '/imports/api/publications/task.js';

import '/imports/api/collections/board.js';
import '/imports/api/publications/board.js';
import '/imports/api/methods/board.js';

import '/imports/api/collections/user.js';
import '/imports/api/methods/user.js';
import '/imports/api/publications/user.js';

import '/imports/api/collections/team.js';
import '/imports/api/methods/team.js';
import '/imports/api/publications/team.js';

import {useSubscribe, useTracker} from "meteor/react-meteor-data";
import PollCollection from "../imports/api/collections/poll";

Accounts.emailTemplates.verifyEmail = {
    subject() {
        return "Verify Your Email Address";
    },
    text(user, url) {
        let emailAddress = user.emails[0].address,
            urlWithoutHash = url.replace('#/', ''),
            emailBody = `To verify your email address (${emailAddress}) visit the following link:\n\n${urlWithoutHash}\n\nIf you did not request this verification, please ignore this email.`;

        return emailBody;
    }
};

Meteor.startup(async () => {
//   start up functions in the future potentially

    console.log(process.env.MONGO_URL)

});
