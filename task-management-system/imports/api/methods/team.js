/**
 * File Description: Team database entity
 * File version: 1.1
 * Contributors: Audrey
 */

import {Meteor} from 'meteor/meteor'
import {TeamCollection} from '/imports/api/collections/team.js';
import {sendTeamInvitation} from "../../../server/mailer";

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

        const id = TeamCollection.insert({
            "teamName": name,
            "teamMembers": [leader],
            "teamLeader": leader,
            "teamInvitedEmails": invitedEmailWithTokens,
        })

        // send email here
        for (let i = 0, len = invitedEmailWithTokens.length; i < len; i++) {
            sendTeamInvitation(invitedEmailWithTokens[i].email, invitedEmailWithTokens[i].token, name, id)
                .catch((error) => {
                    console.log("Email sent with error: " + email)
                    console.log(error);
                })
        }
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