import { Meteor } from 'meteor/meteor';
import '/imports/api/collections/team.js';
import '/imports/api/publications/team.js';
import '/imports/api/methods/team.js';
import '/imports/api/collections/board.js';
import '/imports/api/publications/board.js';
import '/imports/api/methods/board.js';
import TeamCollection from '../imports/api/collections/team';

// Here should be all the imports

Meteor.startup(async () => {
//   start up functions in the future potentially
    
});