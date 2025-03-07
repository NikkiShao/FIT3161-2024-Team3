/**
 * File Description: Mailer for emailing
 * File version: 1.2
 * Contributors: Nikki
 */

import nodemailer from "nodemailer";
import { isUrgentOverdue, timeLeft } from "../ui/components/util";
import { Meteor } from "meteor/meteor";


let transporter;

/**
 * Initialises the node mailer
 */
export async function initialiseMailer() {

    // SMTP configuration with Google API
    const smtpConfig = {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // use SSL
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    };

    // set the transporter
    transporter = nodemailer.createTransport(smtpConfig);

    // verify connection configuration
    await transporter.verify(function (error, success) {
        if (error) {
            console.log(error);
            return false;
        } else {
            console.log('Server is ready to take our messages');
            return true;
        }
    });
}

Meteor.methods({

    /**
     *
     * @returns {Promise<void>}
     * @param email - email address to send email to
     * @param token - token for invitation
     * @param teamName - name of team to be invited to
     * @param teamId - ID of the team to be invited to
     */
    "send_team_invitation" : async function (email, token, teamName, teamId) {
        console.log("i sending to " + email)

        // add the final / to the root url if it doesn'cdtt have it already
        let rootUrl = process.env.ROOT_URL;
        if (rootUrl[rootUrl.length - 1] !== "/") {
            rootUrl += "/"
        }

        const info = await transporter.sendMail({
            from: `"University Task Management System"${process.env.EMAIL_USER}`, // sender address
            to: email, // list of receivers
            subject: `[UTM] - Team Invitation for ${teamName}`, // Subject line
            html: `
            <html lang="en">
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
                            <a href="${rootUrl}accept-invite/${teamId}/${token}" class="btn-base accept-button">Accept Invitation</a>
                            <a href="${rootUrl}decline-invite/${teamId}/${token}" class="btn-base decline-button">Decline Invitation</a>
                            <p>Thank you!</p>
                            <br/>
                            <p>Alternatively, you may click/navigate to the below URL to accept or decline: </p>
                            <ul>
                                <li>Accept: ${rootUrl}accept-invite/${teamId}/${token}</li>
                                <li>Decline: ${rootUrl}decline-invite/${teamId}/${token}</li>
                            </ul>
                        </div>
                </body>
            </html>`, // html body
        });
        console.log("i sent!")
    }


})

/**
 * Sends out a reminder email to a specific user based on given information
 *
 * @param email - email address to send
 * @param name - name of user
 * @param teamsToSend - the list of team IDs and the team names to send about
 * @param boardsByTeam - object containing each board that needs to be sent grouped by team IDs
 */
export async function sendReminder(email, name, teamsToSend, boardsByTeam) {

    console.log("Sending reminder to: " + email)

    let teamSections = teamsToSend.map(team => {

        const teamBoards = boardsByTeam[team.teamId]

        let boardsSection = teamBoards.map(board => {
            const boardUrgency = isUrgentOverdue(board.boardDeadline)

            let tasksSection = board.tasks.map(task => {
                const taskUrgency = isUrgentOverdue(task.taskDeadlineDate, task.statusName)
                const {daysLeft, hoursLeft, minutesLeft} = timeLeft(task.taskDeadlineDate)
                const formatedStr = daysLeft > 0 ? `(${daysLeft} d ${hoursLeft} hr ${minutesLeft} min)` : "OVERDUE"

                return `
                    <li>
                        ${task.taskName}:  <span class="${taskUrgency}">${formatedStr}</span>
                    </li>`
            }).join('');

            return `<h4>Board: ${board.boardName} ${boardUrgency === "overdue" ? "- OVERDUE" : ""}</h4>
                <ul>${tasksSection}</ul>`;
        }).join('');

        return `<h3>Team: ${team.teamName}</h3>${boardsSection}`;
        
    }).join('<br />');

    const info = await transporter.sendMail({
        from: `"University Task Management System"${process.env.EMAIL_USER}`, // sender address
        to: email, // list of receivers
        subject: `[UTM] - Upcoming Deadlines`, // Subject line
        html: `
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <style>
                .email-container {
                    line-height: 1.6;
                    color: #282828;
                }
                .urgent {
                    color: #F45151 !important;
                } 
                .overdue {
                    color: #B74C4C !important;
                }
                h3 {
                    font-size: 18px;
                    margin-bottom: 0;
                    color: #4A4E69 !important;
                }
                h4 {
                    font-size: 14px;
                    margin-bottom: 0;
                    color: #725245 !important;
                    text-decoration: underline;
                    text-decoration-thickness: 2px;
                }
                
            </style>
        </head>
        <body>
            <div class="email-container">
                <h2>University Task Management System: Upcoming Deadlines</h2>
                <p>Hi ${name},</p>
                <p>You have the following upcoming deadlines from your teams:</p>
                ${teamSections}
                <br />
                <p>Note that an email reminder will no longer be sent out for any boards that are more than 7 days overdue.</p>
                <p>You may also manually disable this email notification in your account settings.</p>
            </div>
        </body>
    </html>`, // html body
    });
}