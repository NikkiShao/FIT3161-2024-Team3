// /**
//  * File Description: Board database entity
//  * File version: 1.1
//  * Contributors: Audrey,Samuel
//  */
import {Meteor} from 'meteor/meteor'
import {BoardCollection} from '/imports/api/collections/board.js';

Meteor.methods({

    //not done, here for testing the team page
    "add_board": function (name, id, nickname, desc, deadline) {
        BoardCollection.insert(
            {
                "board": name,
                "teamId": id,
                "boardNickname": nickname,
                "boardDesc": desc,
                "boardDeadline": deadline,

            }
        )
    }
})