/**
 * File Description: Board database entity
 * File version: 1.3
 * Contributors: Audrey, Nikki
 */
import {Meteor} from 'meteor/meteor'
import {BoardCollection} from '/imports/api/collections/board.js';
import TaskCollection from "../collections/task";

Meteor.methods({

    /**
     * Adds a new board
     * @param name - name of board
     * @param code - board code
     * @param deadline - deadline datetime
     * @param desc - board description string
     * @param teamId - ID of team the board belongs to
     */
    "add_board": function (name, code, deadline, desc, teamId) {
        BoardCollection.insert(
            {
                "boardName": name,
                "boardCode": code,
                "boardDeadline": deadline,
                "boardDescription": desc,
                "teamId": teamId,
                "boardTags": [],
                "boardStatuses": [
                    {"statusName": "To Do", "statusOrder": 1},
                    {"statusName": "Done", "statusOrder": 2}
                ],
            }
        )
    },
    /**
     * Updates a specific board
     * @param boardId - ID of board to update
     * @param boardData - new data to update to
     */
    "update_board": function(boardId, boardData){
        BoardCollection.update(boardId, {$set:{
            "boardName": boardData.boardName,
            "boardCode": boardData.boardCode,
            "boardDeadline": boardData.boardDeadline,
            "boardDescription": boardData.boardDescription,
            "boardStatuses": boardData.boardStatuses,
            "boardTags": boardData.boardTags
        }
            
        })
    },
    /**
     * Delete a specific board by ID, and its related task data
     * @param boardId - ID of board to delete
     */
    "delete_board": function(boardId){

        // remove all tasks first
        const tasks = TaskCollection.find({boardId: boardId}).fetch();

        // delete each task belonging to a board
        for (let i = 0, len = tasks.length; i < len; i++) {
            new Promise((resolve, reject) => {
                Meteor.call('delete_task', tasks[i]._id, (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                });
            }).catch((error) => {
                throw new Error(error)
            })
        }

        // then remove the board
        BoardCollection.remove({_id: boardId});
    }
})