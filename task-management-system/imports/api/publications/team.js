/**
 * File Description: Team database entity
 * File version: 1.0
 * Contributors: Audrey, Nikki
 */

import { Meteor } from "meteor/meteor";
import {TeamCollection} from "/imports/api/collections/team.js";

/**
 * Publishes all of a specific user's teams
 */
Meteor.publish("all_user_teams", function (email) {
    return TeamCollection.find({ teamMembers: {$in: [email]} });
});