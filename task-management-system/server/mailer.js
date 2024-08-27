/**
 * File Description: Mailer for emailing
 * File version: 1.0
 * Contributors: Nikki
 */

import nodemailer from "nodemailer";
import {emailPass, emailUser} from "./secrets"; // file in the same folder containing creds for mail server


let transporter;

/**
 * Initialises the node mailer
 */
export function initialiseMailer() {

    // SMTP configuration with Google API
    const smtpConfig = {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // use SSL
        auth: {
            user: emailUser,
            pass: emailPass
        }
    };

    // set the transporter
    transporter = nodemailer.createTransport(smtpConfig);

    // verify connection configuration
    transporter.verify(function (error, success) {
        if (error) {
            console.log(error);
        } else {
            console.log('Server is ready to take our messages');
        }
    });
}

/**
 *
 * @returns {Promise<void>}
 * @param email - email address to send email to
 * @param token - token for invitation
 * @param teamName - name of team to be invited to
 * @param teamId - ID of the team to be invited to
 */
export async function sendTeamInvitation(email, token, teamName, teamId) {
    console.log("i sending to " + email)

    // todo: uncomment afterwards
    // return;
    const info = await transporter.sendMail({
        from: '"Task Management System"<reminders@tms.com>', // sender address
        to: email, // list of receivers
        subject: `[Task Management System] - Team Invitation for ${teamName}`, // Subject line
        // text: `You have been invited to the team: ${teamName}.`, // plain text body
        html: `
            <html>
                <head>
                    <style>
                    
                        .email-container {
                          line-height: 1.6;
                          color: #282828;
                        }
                        .btn-base {
                            color: #282828 !important;
                            min-width: 120px;
                            width: fit-content;
                            height: 20px;
                            padding: 10px 16px;
                            margin: 10px 0;
                            text-align: center;
                            text-decoration: none;
                            background-color: transparent;
                            align-items: center;
                            border-radius: 9999px;
                        }
                
                        .accept-button {
                          background-color: #8fe09c;                        }
                        .decline-button {
                          background-color: #f69797;
                        }
                    </style>
                </head>
                    <body>
                        <div class="email-container">
                            <h2>You've been invited to join the team: ${teamName}</h2>
                            <p>Hello,</p>
                            <p>You have been invited to join the team <strong>${teamName}</strong>.</p>
                            <p>Please click one of the buttons below to accept or reject the invitation:</p>
                            <a href="http://localhost:3000/accept-invite/${teamId}/${token}" class="btn-base accept-button">Accept Invitation</a>
                            <a href="http://localhost:3000/decline-invite/${teamId}/${token}" class="btn-base decline-button">Decline Invitation</a>
                            <p>Thank you!</p>
                            <br/>
                            <p>Alternatively, you may click/navigate to the below URL to accept or decline: </p>
                            <ul>
                                <li>Accept: http://localhost:3000/accept-invite/${teamId}/${token}</li>
                                <li>Decline: http://localhost:3000/decline-invite/${teamId}/${token}</li>
                            </ul>
                        </div>
                </body>
            </html>`, // html body
    });
    console.log("i sent!")

}
