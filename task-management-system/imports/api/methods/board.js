// /**
//  * File Description: Board database entity
//  * File version: 1.1
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
                "teamId": teamId
            }
        )
    },
    "update_board": function(boardId, boardData){
        BoardCollection.update(boardId, {$set:{
            "boardName": boardData.boardName,
            "boardCode": boardData.boardCode,
            "boardDeadline": boardData.boardDeadline,
            "boardDescription": boardData.boardDescription
        }
            
        })
    }
})