/**
 * File Description: Poll database entity
 * File version: 1.0
 * Contributors: Nikki
 */

import {Mongo} from "meteor/mongo";

// to set up task collection
export const PollCollection = new Mongo.Collection("polls");

export default PollCollection;
