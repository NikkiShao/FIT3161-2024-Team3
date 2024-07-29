// /**
//  * File Description: Board database entity
//  * File version: 1.0
//  * Contributors: Audrey
//  */

import { Meteor } from "meteor/meteor";
import {BoardCollection} from "/imports/api/collections/board.js";

/**
 * Publishes all of boards
 */
Meteor.publish("all_user_boards", function () {
    return BoardCollection.find({});
})