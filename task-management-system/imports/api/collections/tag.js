/**
 * File Description: Tag database entity
 * File version: 1.0
 * Contributors: Nikki
 */

import {Mongo} from "meteor/mongo";

// to set up task collection
export const TagCollection = new Mongo.Collection("tags");

export default TagCollection;
