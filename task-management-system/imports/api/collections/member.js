/**
 * File Description: Member database entity
 * File version: 1.0
 * Contributors: Nikki
 */

import {Mongo} from "meteor/mongo";

// to set up task collection
export const MemberCollection = new Mongo.Collection("members");

export default MemberCollection;
