/**
 * File Description: Team database entity
 * File version: 1.3
 * Contributors: Audrey, Nikki
 */

import {Meteor} from 'meteor/meteor'
import {TeamCollection} from '/imports/api/collections/team.js';
import {sendTeamInvitation} from "../mailer";
import {generateInvitationToken} from "../../ui/components/util";
import BoardCollection from "../collections/board";
import BaseUrlPath from "../../ui/enums/BaseUrlPath";

Meteor.methods({
    /**
     * add team method to create a new team
     *
     * @param name - name of the team
     * @param members - array of emails of team members
     * @param leader - leader's email
     * @param emailOn - true to email, false to not send email
     */
    "add_team": function (name, members, leader, emailOn) {

        const invitedEmailWithTokens = members.map(
            (member) => {
                return ({
                    "email": member,
                    "token": generateInvitationToken()
                })
            })

        const teamId = TeamCollection.insert({
            "teamName": name,
            "teamMembers": [leader],
            "teamLeader": leader,
            "teamInvitations": invitedEmailWithTokens,
        })

        // send email here
        if (emailOn) {
            for (let i = 0, len = invitedEmailWithTokens.length; i < len; i++) {
                sendTeamInvitation(invitedEmailWithTokens[i].email, invitedEmailWithTokens[i].token, name, id)
                    .catch((error) => {
                        console.log("Email sent with error: " + invitedEmailWithTokens[i].email)
                        console.log(error);
                    })
            }
        }

        return teamId;
    },

    /**
     * Updates a specific team
     *
     * @param teamId - ID of team to update
     * @param existingInvites - the existing/previous list of invites
     * @param teamsData - the updated teams data
     * @param emailOn - true to email, false to not send email
     */
    "update_team": function (teamId, existingInvites, teamsData, emailOn) {

        TeamCollection.update(teamId, {
            $set:
                {
                    "teamName": teamsData.teamName,
                    "teamMembers": teamsData.teamMembers,
                    "teamLeader": teamsData.teamLeader,
                    "teamInvitations": teamsData.teamInvitations,
                }
        });

        if (emailOn) {
            // send email here
            const existingInviteEmails = existingInvites.map((invite) => invite.email.toLowerCase());
            for (let i = 0, len = teamsData.teamInvitations.length; i < len; i++) {

                if (!existingInviteEmails.includes(teamsData.teamInvitations[i].email.toLowerCase())) {
                    // existing emails DOES NOT include this email, send
                    sendTeamInvitation(teamsData.teamInvitations[i].email, teamsData.teamInvitations[i].token, teamsData.teamName, teamId)
                        .catch((error) => {
                            console.log("Email sent with error: " + teamsData.teamInvitations[i].email)
                            console.log(error);
                        })
                }
            }
        }

    },

    /**
     * Delete a specific team by ID, and its related board and task data
     * @param teamId - ID of team to delete
     * @param username - ID of user who deleted the team
     */
    "delete_team": function (teamId, username) {

        // remove all related boards and tasks first
        const boards = BoardCollection.find({teamId: teamId}).fetch();

        // delete each board (the board delete will delete its tasks)
        for (let i = 0, len = boards.length; i < len; i++) {
            new Promise((resolve, reject) => {
                Meteor.call('delete_board', boards[i]._id, username, (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                });
            }).catch((error) => {
                throw new Error(error)
            })
        }

        TeamCollection.remove({_id: teamId});
    }
})