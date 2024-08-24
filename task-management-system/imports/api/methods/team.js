/**
 * File Description: Team database entity
 * File version: 1.1
 * Contributors: Audrey
 */

import {Meteor} from 'meteor/meteor'
import {TeamCollection} from '/imports/api/collections/team.js';
import {sendTeamInvitation} from "../../../server/mailer";
import {generateInvitationToken} from "../../ui/components/util";

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
                    "token": generateInvitationToken()
                })
            })

        const id = TeamCollection.insert({
            "teamName": name,
            "teamMembers": [leader, "alice@alice.com", "bob@bob.com"],
            "teamLeader": leader,
            "teamInvitations": invitedEmailWithTokens,
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

    /**
     * Updates a specific team
     *
     * @param teamId - ID of team to update
     * @param existingInvites - the existing/previous list of invites
     * @param teamsData - the updated teams data
     */
    "update_team": function (teamId, existingInvites, teamsData) {

        TeamCollection.update(teamId, {
            $set:
                {
                    "teamName": teamsData.teamName,
                    "teamMembers": teamsData.teamMembers,
                    "teamLeader": teamsData.teamLeader,
                    "teamInvitations": teamsData.teamInvitations,
                }
        });

        // send email here
        const existingInviteEmails = existingInvites.map((invite) => invite.email.toLowerCase());
        for (let i = 0, len = teamsData.teamInvitations.length; i < len; i++) {

            if (!existingInviteEmails.includes(teamsData.teamInvitations[i].email.toLowerCase())) {
                // existing emails DOES NOT include this email, send
                sendTeamInvitation(teamsData.teamInvitations[i].email, teamsData.teamInvitations[i].token, teamsData.teamName, teamId)
                    .catch((error) => {
                        console.log("Email sent with error: " + email)
                        console.log(error);
                    })
            }
        }
    },

    /**
     * Delete a specific team by ID, and its related board and task data
     * @param teamId - ID of team to delete
     */
    "delete_team": function (teamId) {

        // remove all related boards and tasks first



        TeamCollection.remove({_id: teamId});
    }
})