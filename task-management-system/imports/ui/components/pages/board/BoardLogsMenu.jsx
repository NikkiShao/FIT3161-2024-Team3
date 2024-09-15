/**
 * File Description: Board logs menu page
 * Updated Date: 31/08/2024
 * Contributors: Nikki
 * Version: 1.0
 */

import React from 'react';
import WhiteBackground from "/imports/ui/components/general/whiteBackground/WhiteBackground";
import PageLayout from "/imports/ui/enums/PageLayout";
import {useNavigate, useParams} from "react-router-dom";
import {useSubscribe, useTracker} from "meteor/react-meteor-data";
import LogEntryCollection from "../../../../api/collections/logEntry";
import Spinner from "react-bootstrap/Spinner";
import BoardCollection from "../../../../api/collections/board";
import Button from "../../general/buttons/Button";
import BaseUrlPath from "../../../enums/BaseUrlPath";
import {backLeftArrow} from "../../icons";


/**
 * A page for tables of all logs to select from
 */
export const BoardLogsMenu = () => {

    const navigate = useNavigate();
    const {teamId} = useParams();

    const isLoadingLogs = useSubscribe('all_team_logs', teamId);
    const logsData = useTracker(() => {
        return LogEntryCollection.find({teamId: teamId}).fetch();
    });

    const isLoadingBoards = useSubscribe('all_team_boards', teamId);
    const currentBoardsData = useTracker(() => {
        return BoardCollection.find({teamId: teamId}).fetch();
    });

    const currentBoardIds = currentBoardsData.map((board) => board._id)

    // list of board IDs that are now deleted
    const allBoardIds = new Set(logsData.map((logEntry) => logEntry.boardId));
    const deletedBoardIds = Array.from(allBoardIds).filter((item) => !currentBoardIds.includes(item));

    const isLoading = isLoadingLogs() || isLoadingBoards();

    const helpText = "This is a table of all current and past boards. You may select to view any specific board's history from here."

    if (isLoading) {
        // display a loading icon when the page is loading
        return (
            <WhiteBackground pageLayout={PageLayout.LARGE_CENTER}>
                <Spinner animation="border" variant="secondary" role="status"/>
            </WhiteBackground>
        )
    } else {

        let currentBoardsTable = null;
        if (currentBoardsData.length > 0) {
            currentBoardsTable = (
                <div className={"logs-background"}>
                    <h2 className={"text-center default__heading2"}>Current Board Logs</h2>
                    <table className={"table table-striped table-bordered table-hover non-clickable"}>
                        <thead>
                        <tr key={'header'} className="text-center">
                            <th>Board ID</th>
                            <th>Board Name</th>
                            <th>Board Code</th>
                            <th style={{width: "25%"}}></th>
                        </tr>
                        </thead>
                        <tbody className="text-center">
                        {
                            currentBoardsData.map((board) => (
                                <tr key={board._id}>
                                    <td>{board._id}</td>
                                    <td>{board.boardName}</td>
                                    <td>{board.boardCode}</td>
                                    <td><Button className={"btn-brown"}
                                                style={{minWidth: "125px", display: "inline-flex"}}
                                                onClick={() => navigate(board._id)}>
                                        View Details
                                    </Button></td>
                                </tr>
                            ))
                        }

                        </tbody>
                    </table>
                </div>
            )
        }

        let deletedBoardsTable = null;
        if (deletedBoardIds.length > 0) {
            deletedBoardsTable = (
                <div className={"logs-background"}>
                    <h2 className={"text-center default__heading2"}>Deleted Board Logs</h2>
                    <table className={"table table-striped table-bordered table-hover non-clickable"}>
                        <thead>
                        <tr key={'header'} className="text-center">
                            <th>Board ID</th>
                            <th style={{width: "25%"}}></th>
                        </tr>
                        </thead>
                        <tbody className="text-center">
                        {
                            deletedBoardIds.map((boardId) => (
                                <tr key={boardId}>
                                    <td>{boardId}</td>
                                    <td><Button className={"btn-brown"}
                                                style={{minWidth: "125px", display: "inline-flex"}}
                                                onClick={() => navigate(boardId)}>
                                        View Details
                                    </Button></td>
                                </tr>
                            ))
                        }
                        </tbody>
                    </table>
                </div>
            )
        }

        return (
            <WhiteBackground pageLayout={PageLayout.LARGE_CENTER} pageHelpText={helpText}>
                <div className="header-space-between">
                    <Button className={"flex flex-row gap-2 btn-back"}
                            onClick={() => {
                                navigate('/' + BaseUrlPath.TEAMS + "/" + teamId);
                            }}>
                        {backLeftArrow}
                        Back
                    </Button>

                    <h1 className={"text-center"}>Boards History</h1>
                    <div style={{width: "120px"}}/>
                </div>

                {currentBoardsTable}
                {deletedBoardsTable}

                {logsData.length === 0 ?
                    <span className={"main-text non-clickable"}>Your logs are currently empty.</span> : null
                }
            </WhiteBackground>
        )
    }
}

export default BoardLogsMenu;