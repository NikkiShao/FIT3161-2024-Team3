/**
 * File Description: Status database entity
 * File version: 1.0
 * Contributors: Nikki
 */

import {Mongo} from "meteor/mongo";

// to set up task collection
export const StatusCollection = new Mongo.Collection("statuses");

export default StatusCollection;
