// /**
//  * File Description: Tag database entity
//  * File version: 1.0
//  * Contributors: Audrey
//  */

import {Meteor} from 'meteor/meteor'
import {TagCollection} from '/imports/api/collections/tag.js';

Meteor.publish('tag_by_board', function(boardId){
    return TagCollection.find({boardId: boardId});
});