import { Meteor } from 'meteor/meteor';
import '/imports/api/collections/team.js';
import '/imports/api/publications/team.js';
import '/imports/api/methods/team.js';
import '/imports/api/collections/board.js';
import '/imports/api/publications/board.js';
import '/imports/api/methods/board.js';
import '/imports/api/methods/task.js';
import '/imports/api/publications/task.js';

import '/imports/api/collections/user.js';
import '/imports/api/publications/user.js';
import '/imports/api/methods/user.js';


// Here should be all the imports


Accounts.emailTemplates.verifyEmail = {
    subject() {
        return "Verify Your Email Address";
    },
    text( user, url ) {
        let emailAddress   = user.emails[0].address,
            urlWithoutHash = url.replace( '#/', '' ),
            emailBody      = `To verify your email address (${emailAddress}) visit the following link:\n\n${urlWithoutHash}\n\n 
            If you did not request this verification, please ignore this email.`;

        return emailBody;
    }
};

Meteor.startup(async () => {
//   start up functions in the future potentially
//     Meteor.call('add_team', 'team name 3', ['team member1', 'team member2', 'team member3', 'leader'], 'leader');

    console.log('Meteor server has started');
});
