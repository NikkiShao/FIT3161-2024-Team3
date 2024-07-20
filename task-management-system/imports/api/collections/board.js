/**
 * File Description: Board database entity
 * File version: 1.0
 * Contributors: Nikki
 */

import {Mongo} from "meteor/mongo";

// to set up task collection
export const BoardCollection = new Mongo.Collection("boards");

export default BoardCollection;
