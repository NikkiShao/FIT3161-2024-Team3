import {Meteor} from 'meteor/meteor'
import {TeamCollection} from '../collections/team';

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