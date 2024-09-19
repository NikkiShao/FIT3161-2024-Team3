/**
 * File Description: Board database entity
 * File version: 1.6
 * Contributors: Audrey, Nikki, Sam
 */
import { Meteor } from 'meteor/meteor';
import { BoardCollection } from '/imports/api/collections/board.js';
import TaskCollection from "../collections/task";
import "../methods/logEntry";
import { check } from 'meteor/check';

// Helper function to promisify Meteor.call
Meteor.callPromise = function (method, ...args) {
    return new Promise((resolve, reject) => {
        Meteor.call(method, ...args, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
};

Meteor.methods({

    /**
     * Adds a new board
     * @param name - name of board
     * @param code - board code
     * @param deadline - deadline datetime as a string
     * @param desc - board description string
     * @param teamId - ID of team the board belongs to
     * @param username - username of the creator
     */
    "add_board": async function (name, code, deadline, desc, teamId, username) {
        check(name, String);
        check(code, String);
        check(deadline, String);
        check(desc, String);
        check(teamId, String);
        check(username, String);

        // check if the board inputs are not empty
        if (name === "" || code === "" ||  desc === "") {
            throw new Meteor.Error('board-insert-failed', 'Inputs can not be an empty string');
        }

        // check if the deadline is a valid date
        if (isNaN(Date.parse(deadline))) {
            throw new Meteor.Error('board-insert-failed', 'Invalid deadline date');
        }

        // check if the code is less or equal to 10 characters
        if (code.length > 10) {
            throw new Meteor.Error('board-insert-failed', 'Board code can not exceed 10 characters');
        }

        // Check if the code is unique
        if (BoardCollection.findOne({boardCode: code})) {
            throw new Meteor.Error('board-insert-failed', 'Board code already exists');
        }

        // check if the code is alphanumeric
        if (!/^[A-Za-z0-9]+$/i.test(code)) {
            throw new Meteor.Error('board-insert-failed', 'Board code can only contain letters and numbers');
        }

        // check if the name is less or equal to 30 characters  
        if (name.length > 30) {
            throw new Meteor.Error('board-insert-failed', 'Board name can not exceed 30 characters');
        }

        // check if the description is less or equal to 150 characters
        if (desc.length > 150) {
            throw new Meteor.Error('board-insert-failed', 'Board description can not exceed 150 characters');
        }



        // Insert the new board into the collection
        const boardId = BoardCollection.insert({
            "boardName": name,
            "boardCode": code,
            "boardDeadline": deadline,
            "boardDescription": desc,
            "teamId": teamId,
            "boardTags": [],
            "boardStatuses": [
                { "statusName": "To Do", "statusOrder": 1 },
                { "statusName": "Done", "statusOrder": 2 }
            ],
        });

        if (Meteor.isServer) {

            // Log the board creation action
            try {
                await Meteor.callPromise('logEntry.insert', `created board: ${name}`, username, teamId, boardId);
                console.log("Board creation logged successfully");
            } catch (error) {
                console.error("Failed to log board creation:", error);
                throw new Meteor.Error('log-insert-failed', 'Failed to log board creation');
            }
        }

        return boardId;
    },

    /**
     * Updates a specific board
     * @param boardId - ID of board to update
     * @param boardData - new data to update to
     * @param username - username of the editor
     */
    "update_board": async function (boardId, boardData, username) {
        // Check types of input
        check(boardId, String);
        check(boardData, Object);
        check(username, String);

        // Retrieve the current board data
        const currentBoard = BoardCollection.findOne(boardId);

        // Prepare to log changes
        let changes = [];

        // Check for changes in board name
        if (currentBoard.boardName !== boardData.boardName) {
            changes.push(`board name changed from '${currentBoard.boardName}' to '${boardData.boardName}'`);
        }

        // Check for changes in board code
        if (currentBoard.boardCode !== boardData.boardCode) {
            changes.push(`board code changed from '${currentBoard.boardCode}' to '${boardData.boardCode}'`);
        }

        // Check for changes in board deadline (as a string)
        if (currentBoard.boardDeadline !== boardData.boardDeadline) {
            changes.push(`board deadline changed from '${currentBoard.boardDeadline}' to '${boardData.boardDeadline}'`);
        }

        // Check for changes in board description
        if (currentBoard.boardDescription !== boardData.boardDescription) {
            changes.push(`board description changed from '${currentBoard.boardDescription}' to '${boardData.boardDescription}'`);
        }

        // Check for status removals or additions
        const removedStatuses = currentBoard.boardStatuses.filter(
            status => !boardData.boardStatuses.some(newStatus => newStatus.statusName === status.statusName)
        ).map(status => status.statusName);

        const addedStatuses = boardData.boardStatuses.filter(
            status => !currentBoard.boardStatuses.some(oldStatus => oldStatus.statusName === status.statusName)
        ).map(status => status.statusName);

        // Add status changes to log if there are any
        if (removedStatuses.length > 0 || addedStatuses.length > 0) {
            if (removedStatuses.length > 0) {
                changes.push(`removed statuses: ${removedStatuses.join(', ')}`);
            }
            if (addedStatuses.length > 0) {
                changes.push(`added statuses: ${addedStatuses.join(', ')}`);
            }
        }

        // Check for tag removals or additions
        const removedTags = currentBoard.boardTags.filter(
            tag => !boardData.boardTags.some(newTag => newTag.tagName === tag.tagName)
        ).map(tag => tag.tagName);

        const addedTags = boardData.boardTags.filter(
            tag => !currentBoard.boardTags.some(oldTag => oldTag.tagName === tag.tagName)
        ).map(tag => tag.tagName);

        // Add tag changes to log if there are any
        if (removedTags.length > 0 || addedTags.length > 0) {
            if (addedTags.length > 0) {
                changes.push(`added tags: ${addedTags.join(', ')}`);
            }

            if (removedTags.length > 0) {
                changes.push(`removed tags: ${removedTags.join(', ')}`);
            }
        }

        // Only update and log if there are actual changes
        if (changes.length > 0) {
            // Update the board with the new data
            BoardCollection.update(boardId, {
                $set: {
                    "boardName": boardData.boardName,
                    "boardCode": boardData.boardCode,
                    "boardDeadline": boardData.boardDeadline, // deadline remains a string
                    "boardDescription": boardData.boardDescription,
                    "boardStatuses": boardData.boardStatuses,
                    "boardTags": boardData.boardTags
                }
            });

            if (Meteor.isServer) {
                const logMessage = changes.join('; ');
                try {
                    await Meteor.callPromise('logEntry.insert', `${logMessage}`, username, currentBoard.teamId, boardId);
                    console.log("Board update logged successfully");
                } catch (error) {
                    console.error("Failed to log board update:", error);
                    throw new Meteor.Error('log-insert-failed', 'Failed to log board update');
                }
            }
        }
    },

    /**
     * Delete a specific board by ID, and its related task data
     * @param boardId - ID of board to delete
     * @param username - username of user who deleted the board
     */
    "delete_board": async function (boardId, username) {
        check(boardId, String)
        check(username, String)

        // check board exists
        const board = BoardCollection.findOne(boardId);
        if (!board) {

            throw new Meteor.Error('board-delete-failed', `Board not found`);
        }

        // Retrieve all tasks associated with the board
        const tasks = TaskCollection.find({ boardId: boardId }).fetch();

        // Delete each task without logging
        for (let i = 0, len = tasks.length; i < len; i++) {
            try {
                await Meteor.callPromise('delete_task', tasks[i]._id, username);
                console.log(`Task ${tasks[i]._id} deleted successfully`);
            } catch (error) {
                console.error(`Failed to delete task ${tasks[i]._id}:`, error);
                throw new Meteor.Error('task-delete-failed', `Failed to delete task ${tasks[i]._id}`);
            }
        }


        // get ID of the team which the board belongs to
        const teamId = board.teamId;

        if (Meteor.isServer) {
            // Log the board deletion action
            try {
                await Meteor.callPromise('logEntry.insert', `deleted board with ID: ${boardId}`, username, teamId, boardId);
                console.log("Board deletion logged successfully");
            } catch (error) {
                console.error("Failed to log board deletion:", error);
                throw new Meteor.Error('log-insert-failed', 'Failed to log board deletion');
            }
        }

        // Delete the board itself
        BoardCollection.remove({ _id: boardId });
    }
});
