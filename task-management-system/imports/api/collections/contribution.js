/**
 * File Description: Contribution database entity
 * File version: 1.0
 * Contributors: Nikki
 */

import {Mongo} from "meteor/mongo";

// to set up task collection
export const ContributionCollection = new Mongo.Collection("contributions");

export default ContributionCollection;
