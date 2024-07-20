/**
 * File Description: Team database entity
 * File version: 1.0
 * Contributors: Nikki
 */

import {Mongo} from "meteor/mongo";

// to set up task collection
export const TeamCollection = new Mongo.Collection("teams");

export default TeamCollection;
