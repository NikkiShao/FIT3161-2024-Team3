import { Meteor } from 'meteor/meteor';
import '../imports/api/collections/team';
import '../imports/api/methods/teams'; 
import '../imports/api/publications/teams';



Meteor.startup(async () => {
    console.log('Meteor server has started');
});
