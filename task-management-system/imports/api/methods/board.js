// /**
//  * File Description: Board database entity
//  * File version: 1.0
//  * Contributors: Audrey
//  */
import {Meteor} from 'meteor/meteor'
import {BoardCollection} from '/imports/api/collections/board.js';

Meteor.methods({

    //not done, here for testing the team page
    "add_board": function (name, id) {
        BoardCollection.insert(
            {
                "board": name,
                "teamId": id                
            }
        )
    }
})