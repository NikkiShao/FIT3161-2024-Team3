/**
 * File Description: Upcoming deadlines component
 * File version: 1.1
 * Contributors: Audrey, Nikki
 */
import React from 'react';
import {useSubscribe, useTracker} from 'meteor/react-meteor-data';
import {getUserInfo, timeLeft} from '../../util';
import TeamCollection from '../../../../api/collections/team.js';
import TaskCollection from '../../../../api/collections/task.js';
import BoardCollection from '../../../../api/collections/board.js';
import Spinner from "react-bootstrap/Spinner";
import HoverTip from "../../general/hoverTip/HoverTip";
import QuestionMarkCircleIcon from "@heroicons/react/16/solid/QuestionMarkCircleIcon";

/**
 * Upcoming deadlines component for dashboard
 * @returns {Element}
 * @constructor
 */
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

    // filter and calculate days
    const today = new Date();

    const filteredTasks = taskData.filter((task) => {

        const deadline = new Date(task.taskDeadlineDate);
        const daysLeft = Math.floor((deadline - today) / (24 * 60 * 60 * 1000));
        return (task.statusName !== "Done") && daysLeft <= 6;

    }).map((task) => {

        const deadline = new Date(task.taskDeadlineDate);
        const {daysLeft, hoursLeft, minutesLeft} =  timeLeft(deadline)

        return {
            ...task,
            daysLeft: daysLeft < 0 ? 'OVERDUE' : daysLeft, // negative days means overdue, 0 means there might still be some hours
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
    // for help hover
    const questionIcon = <QuestionMarkCircleIcon color={"var(--dark-grey)"} strokeWidth={2} viewBox="0 0 16 16" width={25} height={25}/>;
    const helpText = "This section shows the tasks due within 7 days.";

    if (isLoadingTeams() || isLoadingBoards() || isLoadingTasks()) {
        return (
            <div className={"background-base dashboard-item dashboard-deadline-column"}>
                <Spinner animation="border" variant="secondary" role="status"/>
            </div>
    )
    } else {
        return (
            <div className={"background-base dashboard-item dashboard-deadline-column"}>
                    <HoverTip icon={questionIcon}
                              outerText={"Help"}
                              toolTipText={helpText}
                              divClassName={"page-help-tip"}
                              textClassname
                    />
                    <h2 className={"dashboard-column-title"}>Upcoming Deadlines</h2>
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
                                            <td><span className={"main-text text-dark-red"}>{task.daysLeft}</span></td>
                                        </>) :
                                        (<>
                                        {task.daysLeft < 3 ?
                                            (<>
                                                <td><span className={"main-text text-red"}>{getBoardCode(task.boardId)}</span></td>
                                                <td><span className={"main-text text-red"}>{task.taskName}</span></td>
                                                <td><span className={"main-text text-red"}>{task.daysLeft} d {task.hoursLeft} hr {task.minutesLeft} min</span></td>
                                            </>) :
                                            (<>
                                                <td><span className={"main-text"}>{getBoardCode(task.boardId)}</span></td>
                                                <td><span className={"main-text"}>{task.taskName}</span></td>
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
                </div>
            );
    }
};

export default UpcomingDeadlines;