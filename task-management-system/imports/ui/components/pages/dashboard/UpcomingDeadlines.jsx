import React, {useState} from 'react';
import {useSubscribe, useTracker} from 'meteor/react-meteor-data';
import {Meteor} from 'meteor/meteor';
import {getUserInfo} from '../../util';
import WhiteBackground from "../../general/whiteBackground/WhiteBackground.jsx";
import TeamCollection from '../../../../api/collections/team.js';
import TaskCollection from '../../../../api/collections/task.js';
import BoardCollection from '../../../../api/collections/board.js';
import PageLayout from '../../../enums/PageLayout'
import Spinner from "react-bootstrap/Spinner";

export const UpcomingDeadlines = () =>  {
    const userInfo = getUserInfo();

    //fetch team's data
    const isLoadingTeams = useSubscribe('all_user_teams', userInfo.email);
    const teamsData = useTracker(() => {
        return TeamCollection.find({teamMembers: userInfo.email}).fetch();
    });

    //get the boards
    let teamIds = teamsData.map((team) => team._id);
    const isLoadingBoards = useSubscribe('all_teams_boards', teamIds);
    const boardData = useTracker(() => {
        return BoardCollection.find({teamId: {$in: teamIds}}).fetch();
    });

    //get the board tasks
    let boardIds = boardData.map((board) => board._id);
    const isLoadingTasks = useSubscribe('all_board_task', boardIds);
    const taskData = useTracker(()=>{
        return TaskCollection.find({boardId: {$in: boardIds}}).fetch();
    });

    // get board for tasks
    const getBoardCode = (boardId) => {
        const board = BoardCollection.find({_id:boardId}).fetch();
        return board[0].boardCode;
    }

    //filter and calculate days
    const today = new Date();
    const filteredTasks = taskData.filter((task) => {
        const deadline = new Date(task.taskDeadlineDate);
        const daysLeft = Math.ceil((deadline - today) / (24 * 60 * 60 * 1000));
        const hoursLeft = Math.floor(((deadline - today) % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
        const minutesLeft = Math.floor(((deadline - today) % (60 * 60 * 1000)) / (60 * 1000));
        return (task.statusName !== "Done") && daysLeft <= 7;
    }).map((task) => {
        const deadline = new Date(task.taskDeadlineDate);
        const daysLeft = Math.ceil((deadline - today) / (24 * 60 * 60 * 1000));
        const formatDate = deadline.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
        const hoursLeft = Math.floor(((deadline - today) % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
        const minutesLeft = Math.floor(((deadline - today) % (60 * 60 * 1000)) / (60 * 1000));
        return {
            ...task,
            daysLeft: daysLeft <= 0 ? 'OVERDUE' : daysLeft,
            formatDate: formatDate,
            hoursLeft: hoursLeft,
            minutesLeft: minutesLeft
        };
    });

    const sortedTask = filteredTasks.sort((a,b)=>{
        if(a.daysLeft === 'OVERDUE' && b.daysLeft === 'OVERDUE'){
            return 0;
        }
        if(a.daysLeft === 'OVERDUE'){
            return -1;
        }
        if(b.daysLeft === 'OVERDUE'){
            return 1;
        }
        return a.daysLeft - b.daysLeft;
    })

    const helpText = "This section shows the tasks due within 7 days highlighting overdue and urgent tasks.";
    if (isLoadingTeams() || isLoadingBoards() || isLoadingTasks()) {
        return (
            <WhiteBackground pageLayout={PageLayout.LARGE_CENTER}>
                <Spinner animation="border" variant="secondary" role="status"/>
            </WhiteBackground>
        )
    } else {
        return (
                <WhiteBackground pageHelpText={helpText} pageLayout={PageLayout.LARGE_CENTER} style={{minWidth: '780px', maxWidth: '780px', padding: '10px', height: 'calc(60vh - 100px)', overflowY: 'auto', scrollbarWidth: 'thin'}}>
                    <h1 className={"text-center default__heading1"}>Upcoming Deadlines</h1>
                    {sortedTask.length ?                        
                    <table className={"table table-striped table-bordered table-hover non-clickable"}>
                                <thead>
                                <tr key={'header'} className="text-center">
                                    <th>Board Code</th>
                                    <th>Task Name</th>
                                    {/* <th>Due Date</th> */}
                                    <th>Time Left</th>
                                </tr>
                                </thead>
                                <tbody className="text-center">
                                {sortedTask.map((task)=>(
                                    <tr key={task._id} style={{color: task.daysLeft === 'OVERDUE' ? 'var(--dark-red)' : (task.daysLeft < 3 && task.daysLeft > 0) ? 'var(--red)' : 'var(--black)'}}>
                                        {task.daysLeft === 'OVERDUE' ? 
                                        (<>
                                            <td><span className={"main-text text-dark-red"}>{getBoardCode(task.boardId)}</span></td>
                                            <td><span className={"main-text text-dark-red"}>{task.taskName}</span></td>
                                            {/* <td><span className={"main-text text-dark-red"}>{task.formatDate}</span></td> */}
                                            <td><span className={"main-text text-dark-red"}>{task.daysLeft}</span></td>
                                        </>) : 
                                        (<>
                                        {task.daysLeft < 3 ? 
                                            (<>
                                                <td><span className={"main-text text-red"}>{getBoardCode(task.boardId)}</span></td>
                                                <td><span className={"main-text text-red"}>{task.taskName}</span></td>
                                                {/* <td><span className={"main-text text-red"}>{task.formatDate}</span></td> */}
                                                <td><span className={"main-text text-red"}>{task.daysLeft} d {task.hoursLeft} hr {task.minutesLeft} min</span></td>
                                            </>) :
                                            (<>
                                                <td><span className={"main-text"}>{getBoardCode(task.boardId)}</span></td>
                                                <td><span className={"main-text"}>{task.taskName}</span></td>
                                                {/* <td><span className={"main-text"}>{task.formatDate}</span></td> */}
                                                <td><span className={"main-text"}>{task.daysLeft} d {task.hoursLeft} hr {task.minutesLeft} min</span></td>
                                            </>)}
                                        </>)}

                                    </tr>
                                ))}
                                </tbody>
                    </table> : 
                    <span className={"main-text non-clickable"}>
                        You don't have anything due for the next 7 days.
                    </span>}
                </WhiteBackground>
            );
    }
};

export default UpcomingDeadlines;