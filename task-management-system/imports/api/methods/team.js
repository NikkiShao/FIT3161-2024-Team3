/**
 * File Description: Team database entity
 * File version: 1.1
 * Contributors: Audrey
 */

import {Meteor} from 'meteor/meteor'
import {TeamCollection} from '/imports/api/collections/team.js';

Meteor.methods({

    /**
     * add team method to create a new team
     *
     * @param name - name of the team
     * @param members - array of emails of team members, includes the leader
     * @param leader - leader's email
     */
    "add_team": function (name, members, leader) {
        TeamCollection.insert(
            {
                "teamName": name,
                "teamMembers": members,                
                "teamLeader": leader
            }
        )
    },
    "update_team": function (teamId, teamsData){
        const idObject = new Mongo.ObjectID(teamId);
        TeamCollection.update(idObject, {$set: 
            {
                "teamName": teamsData.teamName,
                "teamMembers": teamsData.teamMembers,
                "teamLeader": teamsData.teamLeader
            }
        });
    }
})