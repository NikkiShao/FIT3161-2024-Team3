/**
 * File Description: Task database entity
 * File version: 1.0
 * Contributors: Nikki
 */

import { Mongo } from "meteor/mongo";

// to set up task collection
export const TaskCollection = new Mongo.Collection("tasks");

export default TaskCollection;
