/**
 * File Description: (Poll) Option database entity
 * File version: 1.0
 * Contributors: Nikki
 */

import {Mongo} from "meteor/mongo";

// to set up task collection
export const OptionCollection = new Mongo.Collection("options");

export default OptionCollection;
