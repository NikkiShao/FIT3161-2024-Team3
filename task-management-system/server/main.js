import { Meteor } from 'meteor/meteor';
import '/imports/api/collections/team.js';
import '/imports/api/methods/teams.js'; // 确保导入方法文件
import '/imports/api/publications/team.js';
import '/imports/api/collections/board.js';
import '/imports/api/publications/board.js';
import '/imports/api/methods/board.js';
import '/imports/api/collections/user.js';
import '/imports/api/publications/user.js';
import '/imports/api/methods/user.js';

Accounts.emailTemplates.verifyEmail = {
    subject() {
        return "Verify Your Email Address";
    },
    text(user, url) {
        let emailAddress = user.emails[0].address,
            urlWithoutHash = url.replace('#/', ''),
            emailBody = `To verify your email address (${emailAddress}) visit the following link:\n\n${urlWithoutHash}\n\n 
            If you did not request this verification, please ignore this email.`;

        return emailBody;
    }
};

Meteor.startup(async () => {
    console.log('Meteor server has started');
});
