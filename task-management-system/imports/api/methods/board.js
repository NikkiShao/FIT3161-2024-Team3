// /**
//  * File Description: Board database entity
//  * File version: 1.2
//  * Contributors: Audrey, Nikki
//  */
import {Meteor} from 'meteor/meteor'
import {BoardCollection} from '/imports/api/collections/board.js';

Meteor.methods({

    "add_board": function (name, code, deadline, desc, teamId) {
        BoardCollection.insert(
            {
                "boardName": name,
                "boardCode": code,
                "boardDeadline": deadline,
                "boardDescription": desc,
                "teamId": teamId,
                "boardStatuses": ["To Do", "Done"],
                "boardTags": []
            }
        )
    },
    "update_board": function(boardId, boardData){
        console.log(boardData.boardStatuses)
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
    "delete_board": function(boardId){
        BoardCollection.remove({_id: boardId});
    }
})