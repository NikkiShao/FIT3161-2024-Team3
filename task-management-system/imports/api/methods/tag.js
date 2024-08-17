// /**
//  * File Description: Tag database entity
//  * File version: 1.0
//  * Contributors: Audrey
//  */

import {Meteor} from 'meteor/meteor'
import {TagCollection} from '/imports/api/collections/tag.js';

Meteor.methods({

    "add_tag": function (tags, boardId) {
        TagCollection.insert(
            {
                "tags": tags, //array of name and colour pair
                "boardId": boardId
            }
        )
    }
})