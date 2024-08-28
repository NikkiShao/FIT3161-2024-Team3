import UserCollection from "../imports/api/collections/user";
import TeamCollection from "../imports/api/collections/team";
import BoardCollection from "../imports/api/collections/board";
import TaskCollection from "../imports/api/collections/task";
import {isUrgentOverdue} from "../imports/ui/components/util";


export function autoNotify() {
    const now = new Date();

    // getting data
    const teamsData = TeamCollection.find({}).fetch();
    const boardsData = BoardCollection.find({}).fetch();
    const taskData = TaskCollection.find({}).fetch();
    const userData = UserCollection.find({"profile.notificationOn": true}).fetch();

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

    // get every board grouped by the team they belong to. format: {<team ID>: [<boards>]}
    const boardsByTeam = {}
    for (let i = 0; i < boardsData.length; i++) {

        // FIND only the relevant tasks data
        const boardDeadlineDate = new Date(boardsData[i].boardDeadline)
        let relevantTasks = [] // relevant tasks
        const allBoardTask = tasksByBoard[boardsData[i]._id]; // all of this board's tasks

        // if allBoardTask is undefined, then there are no tasks, relevant tasks stay empty
        if (allBoardTask !== undefined) {

            if (boardDeadlineDate < now) {
                // BOARD deadline passed, ALL non-done tasks has to be emailed for
                relevantTasks = allBoardTask;

            } else {
                // board deadline has NOT passed, only urgent/overdue non-done tasks has to be emailed
                relevantTasks = allBoardTask.filter((task) =>
                    isUrgentOverdue(task.taskDeadlineDate, task.statusName) !== ""
                )
            }
        }

        // combine the relevant tasks data with board data
        const boardWithTasks = {
            ...boardsData[i],
            tasks: relevantTasks,
        }

        // console.log("-----------------------------------------------------------------------------")
        // console.log(boardWithTasks)
        // console.log("-----------------------------------------------------------------------------")

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

    // check through all teams
    let toSendThisTeam = []

    for (let i = 0; i < teamsData.length; i++) {
        // store team name, which is needed to be sent in the email
        if (boardsByTeam[teamsData[i]._id] !== undefined) {
            boardsByTeam[teamsData[i]._id].teamName = teamsData[i].teamName;
        }


        // go through each team for its team members
        // record team IDs that require for each user
    }




    // check if they belong to any team need notifying, if so collate email
    // send email

    // email template in MAILER.js


    console.log(userData)
    // send email to user



}