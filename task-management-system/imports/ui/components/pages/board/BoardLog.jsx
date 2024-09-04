/**
 * File Description: Board log's page
 * Updated Date: 31/08/2024
 * Contributors: Nikki
 * Version: 1.0
 */

import React from 'react';
import WhiteBackground from "../../general/whiteBackground/WhiteBackground";
import PageLayout from "../../../enums/PageLayout";
import {useSubscribe, useTracker} from "meteor/react-meteor-data";
import LogEntryCollection from "../../../../api/collections/logEntry";
import {useNavigate, useParams} from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import Button from "../../general/buttons/Button";
import BaseUrlPath from "../../../enums/BaseUrlPath";
import {ChevronLeftIcon} from "@heroicons/react/24/outline";
import BoardCollection from "../../../../api/collections/board";

/**
 * Board log component
 */
export const BoardLog = () => {

    const navigate = useNavigate();
    const {boardId, teamId} = useParams();

    // load data
    const isLoadingLogs = useSubscribe('all_board_logs', boardId);
    const logsData = useTracker(() => {
        return LogEntryCollection.find({boardId: boardId}).fetch();
    });

    const isLoadingBoard = useSubscribe('specific_board', boardId);
    const boardData = useTracker(() => {
        return BoardCollection.findOne({_id: boardId});
    });

    const isLoading = isLoadingBoard()  || isLoadingLogs();
    const helpText = "This is a table contains a history of all actions performed on the board and its tasks."

    if (isLoading) {
        // display a loading icon when the page is loading
        return (
            <WhiteBackground pageLayout={PageLayout.LARGE_CENTER}>
                <Spinner animation="border" variant="secondary" role="status"/>
            </WhiteBackground>
        )
    } else {
        return (
            <WhiteBackground pageLayout={PageLayout.LARGE_CENTER} pageHelpText={helpText}>
                <div className="header-space-between">
                    <Button className={"flex flex-row gap-2 btn-back"}
                            onClick={() => {
                                navigate(-1);
                            }}>
                        <ChevronLeftIcon strokeWidth={2} viewBox="0 0 23 23" width={20} height={20}/>
                        Back
                    </Button>

                    <h1 className={"text-center"}>Board History for: {boardData ? boardData.boardName : boardId}</h1>
                    <div style={{width: "120px"}}/>
                </div>

                <table className={"table table-striped table-bordered table-hover non-clickable"}>
                    <thead>
                    <tr key={'header'} className="text-center">
                        <th style={{width: "15%"}}>Date time</th>
                        <th style={{width: "15%"}}>Username</th>
                        <th style={{width: "20%"}}>Task ID</th>
                        <th style={{width: "50%"}}>Action Description</th>
                    </tr>
                    </thead>
                    <tbody className="text-center">
                    {
                        logsData.map((log) => (
                            <tr key={log._id}>
                                <td>{new Date(log.logEntryDatetime).toLocaleString()}</td>
                                <td>{log.username}</td>
                                <td>{log.taskId ? log.taskId : "N/A"}</td>
                                <td>{log.logEntryAction}</td>
                            </tr>
                        ))
                    }

                    </tbody>
                </table>

            </WhiteBackground>
        )
    }
}

export default BoardLog;