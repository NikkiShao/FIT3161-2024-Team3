/**
 * File Description: Team database entity
 * File version: 1.1
 * Contributors: Audrey
 */

import {Meteor} from 'meteor/meteor'
import {TeamCollection} from '/imports/api/collections/team.js';

const rand = function () {
    return Math.random().toString(36).substring(2); // remove `0.`
};

Meteor.methods({

    /**
     * add team method to create a new team
     *
     * @param name - name of the team
     * @param members - array of emails of team members
     * @param leader - leader's email
     */
    "add_team": function (name, members, leader) {

        const invitedEmailWithTokens = members.map(
            (member) => {
                return ({
                    "email": member,
                    "token": rand() + rand() + rand()
                })
            })

        // send email here

        TeamCollection.insert({
            "teamName": name,
            "teamMembers": [leader],
            "teamLeader": leader,
            "teamInvitedEmails": invitedEmailWithTokens,
        })
    },

    "update_team": function (teamId, teamsData) {
        // const idObject = new Mongo.ObjectID(teamId);


        TeamCollection.update(teamId, {
            $set:
                {
                    "teamName": teamsData.teamName,
                    "teamMembers": teamsData.teamMembers,
                    "teamLeader": teamsData.teamLeader
                }
        });
    },

    "delete_team": function (teamId) {
        TeamCollection.remove({_id: teamId});
    }
})