/**
 * File Description: Email notification reminder related functions
 * File version: 1.0
 * Contributors: Nikki
 */

import {Meteor} from "meteor/meteor";
import UserCollection from "../imports/api/collections/user";
import TeamCollection from "../imports/api/collections/team";
import BoardCollection from "../imports/api/collections/board";
import TaskCollection from "../imports/api/collections/task";
import {isUrgentOverdue} from "../imports/ui/components/util";
import {sendReminder} from "./mailer";


/**
 * Automatically sends notification about reminders every set interval, at a specific hour
 * @param hour - the hour to send the notification at, by default it is at 8am.
 */
export function autoSendNotification (hour = 8) {
    const now = new Date();
    const sendTime = new Date(now);
    sendTime.setHours(hour, 0, 0, 0);
    const timeUntilSend = sendTime - now;

    const dayInMilliseconds = 1000 * 60 * 60 * 24;
    // const minInMilliseconds = 1000 * 60 ; // for testing purposes, fires each minute

    // Run the task immediately and then at midnight
    Meteor.setTimeout(() => {
        sendReminderNotification();
        Meteor.setInterval(sendReminderNotification, dayInMilliseconds);
    }, timeUntilSend);
}

/**
 * Checks through every user, team, board, task for ones that need to send emails about.
 *
 * This includes every non-done task on an OVERDUE board and all URGENT or OVERDUE tasks.
 * Emails will only be sent to users who turned their email notification on.
 */
export function sendReminderNotification() {
    console.log("i sending notification!!!")

    const now = new Date();

    // getting data
    const teamsData = TeamCollection.find({}).fetch();
    const boardsData = BoardCollection.find({}).fetch();
    const taskData = TaskCollection.find({}).fetch();

    // 1.
    // first aggregate data
    // get every task group by the board they belong to. format: {<board ID>: [<tasks>]}
    const tasksByBoard = {}
    for (let i = 0; i < taskData.length; i++) {

        // skip over all "done" tasks, they never have to be emailed about
        if (taskData[i].statusName === "Done") {
            continue;
        }

        // each task belongs to a board, get its board ID
        const boardId = taskData[i].boardId;

        if (tasksByBoard[boardId] === undefined) {
            // this board ID is currently empty, add new entry
            tasksByBoard[boardId] = [taskData[i]]

        } else {
            // this board ID already has task, push to add another one
            tasksByBoard[boardId].push(taskData[i]);
        }
    }

    // 2.
    // get every board grouped by the team they belong to. format: {<team ID>: [<boards>]}
    const boardsByTeam = {}
    for (let i = 0; i < boardsData.length; i++) {

        // FIND only the relevant tasks data
        const boardDeadlineDate = new Date(boardsData[i].boardDeadline)
        let relevantTasks = [] // relevant tasks
        const allBoardTask = tasksByBoard[boardsData[i]._id]; // all of this board's tasks
        let sevenDaysLater = new Date();
        sevenDaysLater.setTime(boardDeadlineDate.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days after now

        // if allBoardTask is undefined, then there are no tasks, relevant tasks stay empty
        if (allBoardTask !== undefined) {

            if (sevenDaysLater < now) {
                // board is MORE than 7 days after deadline, no longer email about it
                continue;

            } else if (boardDeadlineDate < now) {
                // BOARD deadline passed, but not more than 7 days, ALL non-done tasks has to be emailed for
                relevantTasks = allBoardTask;

            } else {
                // board deadline has NOT passed, only urgent/overdue non-done tasks has to be emailed
                relevantTasks = allBoardTask.filter((task) =>
                    isUrgentOverdue(task.taskDeadlineDate, task.statusName) !== ""
                )
            }
        }

        // if there are no relevant task, then this team doesn't need to be emailed about
        if (relevantTasks.length > 0) {

            // combine the relevant tasks data with board data
            const boardWithTasks = {
                ...boardsData[i],
                tasks: relevantTasks,
            }

            // each board belongs to a team, get its team ID
            const teamId = boardsData[i].teamId;

            if (boardsByTeam[teamId] === undefined) {
                // this team ID is currently empty, add new entry
                boardsByTeam[teamId] = [boardWithTasks]

            } else {
                // this team ID already has board, push to add another one
                boardsByTeam[teamId].push(boardWithTasks);
            }
        }
    }

    // 3.
    // check through all teams
    let toSendForEachUser = {} // aka. teamsByUser
    for (let i = 0; i < teamsData.length; i++) {
        // variables for readability
        const teamId = teamsData[i]._id;
        const membersEmail = teamsData[i].teamMembers;

        // if undefined, then this team has no boards, thus nothing to email about
        if (boardsByTeam[teamId] !== undefined) {

            // go through each team member
            for (let j = 0; j < membersEmail.length; j++) {
                // get member's username
                const email = membersEmail[j];

                // record team IDs and team name for each member as needing to be emailed
                const teamEntry = {teamId: teamId, teamName: teamsData[i].teamName}
                if (toSendForEachUser[email] === undefined) {
                    // this username is currently empty, add new entry
                    toSendForEachUser[email] = [teamEntry]

                } else {
                    // this username already has board, push to add another one
                    toSendForEachUser[email].push(teamEntry);
                }
            }
        }
    }

    // 4.
    // send email to users
    const userData = UserCollection.find({"profile.notificationOn": true}).fetch();

    for (let i=0; i < userData.length; i++) {
        const userEmail = userData[i].emails[0].address;
        const name = userData[i].profile.name;

        // if its undefined, means user doesn't need emailing
        if (toSendForEachUser[userEmail] !== undefined) {

            sendReminder(userEmail, name, toSendForEachUser[userEmail], boardsByTeam)
                .then((result) => {

            })

        }
    }

    console.log("i finished sending notification!")

}