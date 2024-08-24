import {Meteor} from 'meteor/meteor';

// Here should be all the imports
import '/imports/api/collections/board.js';
import '/imports/api/publications/board.js';
import '/imports/api/methods/board.js';

import '/imports/api/collections/poll.js';
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

// file in the same folder containing creds for mail server
import {emailPass, emailUser} from "./secrets.js"
import nodemailer from "nodemailer";

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
    // start up functions in the future potentially
    console.log(process.env.MONGO_URL)

    if (Meteor.isServer) {

        const smtpConfig = {
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // use SSL
            auth: {
                user: emailUser,
                pass: emailPass
            }
        };

        const transporter = nodemailer.createTransport(smtpConfig);

        // verify connection configuration
        transporter.verify(function (error, success) {
            if (error) {
                console.log(error);
            } else {
                console.log('Server is ready to take our messages');
            }
        });

        // const info = await transporter.sendMail({
        //     from: '"Task Management System"<reminders@tms.com>', // sender address
        //     to: "nsha0054@student.monash.edu", // list of receivers
        //     subject: "Hello", // Subject line
        //     text: "Hello world", // plain text body
        //     // html: "<b>Hello world?</b>", // html body
        // });

    }
});
