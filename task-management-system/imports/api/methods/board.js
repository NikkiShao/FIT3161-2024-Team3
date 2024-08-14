// /**
//  * File Description: Board database entity
//  * File version: 1.1
//  * Contributors: Audrey, Nikki
//  */
import {Meteor} from 'meteor/meteor'
import {BoardCollection} from '/imports/api/collections/board.js';

Meteor.methods({

    //not done, here for testing the team page
    "add_board": function (name, code, deadline, desc, teamId) {
        BoardCollection.insert(
            {
                "boardName": name,
                "boardCode": code,
                "boardDeadline": deadline,
                "boardDescription": desc,
                "teamId": teamId,
                "tags": [],
                "statuses": [
                    {"statusName": "To Do", statusOrder: 1},
                    {"statusName": "Done", statusOrder: 2}
                ],
            }
        )
    }
})