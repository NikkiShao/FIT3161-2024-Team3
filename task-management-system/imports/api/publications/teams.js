import {Meteor} from 'meteor/meteor'
import {TeamCollection} from '/imports/api/collections/team.js';

Meteor.methods({

    "add_team": function (name, members, leader) {
        TeamCollection.insert(
            {
                "teamName": name,
                "teamMembers": members,                
                "teamLeader": leader
            }
        )
    }
})