// /**
//  * File Description: Status database entity
//  * File version: 1.0
//  * Contributors: Audrey
//  */

import {Meteor} from 'meteor/meteor'
import {StatusCollection} from '/imports/api/collections/status.js';

Meteor.methods({

    "add_status": function (names, boardId) {
        StatusCollection.insert(
            {
                "statusName": ['To Do', 'Done', names],
                // "statusOrder": order,
                "boardId": boardId
            }
        )
    }
})