/**
 * File Description: Log entry database entity
 * File version: 1.0
 * Contributors: Nikki
 */

import { Mongo } from "meteor/mongo";

// to set up task collection
export const LogEntryCollection = new Mongo.Collection("log_entries");

export default LogEntryCollection;
