// /**
//  * File Description: Tag database entity
//  * File version: 1.0
//  * Contributors: Audrey
//  */

import {Meteor} from 'meteor/meteor'
import {StatusCollection} from '/imports/api/collections/status.js';

Meteor.publish('status_by_board', function(boardId){
    return StatusCollection.find({boardId: boardId});
});