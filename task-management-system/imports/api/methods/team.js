/**
 * File Description: Team database entity
 * File version: 1.5
 * Contributors: Audrey, Nikki
 */

import { Meteor } from 'meteor/meteor'
import { TeamCollection } from '/imports/api/collections/team.js';
import { generateInvitationToken } from "../../ui/components/util";
import BoardCollection from "../collections/board";
import PollCollection from "../collections/poll";
import { check } from "meteor/check";
import "../methods/poll";


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

        //check input types
        check(name,String);
        check(members,[String]);
        check(leader,String);
        check(emailOn, Boolean);

        // input validations for name
        if (name === '' || name.length > 20) {
            throw new Meteor.Error('add-team-failed', 'Invalid name input');
        }

        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

        if(!emailRegex.test(leader)){
            throw new Meteor.Error('add-team-failed', 'Invalid team leader input');
        }

        //validate email input for team members attribute
        const memberArray = new Array()
        for(let i=0; i<members.length; i++){
            const email = members[i];
            if(!emailRegex.test(email)){
                throw new Meteor.Error('add-team-failed', 'Invalid email input');
            } else if(memberArray.includes(email)){
                throw new Meteor.Error('add-team-failed', 'Duplicate email input');
            }
            memberArray.push(email);
        }

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

                new Promise((resolve, reject) => {
                    Meteor.callAsync("send_team_invitation", invitedEmailWithTokens[i].email, invitedEmailWithTokens[i].token, name, teamId,
                        (error, result) => {
                            if (error) {
                                reject(error)

                            } else {
                                resolve(result)
                            }
                        })

                }).catch((error) => {
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
        //check input types
        check(teamId, String);
        check(existingInvites, [{
            email: String,
            token: String,
        }]);
        check(teamsData, {
            teamName: String,
            teamLeader: String,
            teamMembers: [String],
            teamInvitations: [{
                email: String,
                token: String,
            }]
        });
        check(emailOn, Boolean);

        //validate name input
        if (teamsData.teamName === ''|| teamsData.teamName.length > 20) {
            throw new Meteor.Error('update-team-failed', 'Invalid team name input');
        }

        //validate email input for team members
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

        if(!emailRegex.test(teamsData.teamLeader)){
            throw new Meteor.Error('update-team-failed', 'Invalid team leader input');
        }

        const teamMembersArray = new Array()
        for(let i=0; i<teamsData.teamMembers.length; i++){
            const email = teamsData.teamMembers[i];
            if(!emailRegex.test(email)){
                throw new Meteor.Error('update-team-failed', 'Invalid email input');
            } else if(teamMembersArray.includes(email)){
                throw new Meteor.Error('update-team-failed', 'Duplicate email input');
            }
            teamMembersArray.push(email);
        }
        //validate email for invitations
        const invitationArray = new Array()
        for(let i=0; i<teamsData.teamInvitations.length; i++){
            const invite = teamsData.teamInvitations[i];
            if(!emailRegex.test(invite.email)){
                throw new Meteor.Error('update-team-failed', 'Invalid email input');
            } else if(invitationArray.includes(invite.email)){
                throw new Meteor.Error('update-team-failed', 'Duplicate email input');
            }
            invitationArray.push(invite.email);
        }

        if(teamsData.teamMembers.length < 1){
            throw new Meteor.Error('update-team-failed', 'Invalid empty member input');
        }

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
                    new Promise((resolve, reject) => {
                        Meteor.callAsync("send_team_invitation", teamsData.teamInvitations[i].email, teamsData.teamInvitations[i].token, teamsData.teamName, teamId,
                            (error, result) => {
                                if (error) {
                                    reject(error)

                                } else {
                                    resolve(result)
                                }
                            })

                    }).catch((error) => {
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
        check(teamId, String);
        check(user, String);
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

        // remove all related polls
        const polls = PollCollection.find({teamId: teamId}).fetch();
        
        // delete each board (the board delete will delete its tasks)
        for (let i = 0, len = polls.length; i < len; i++) {
            new Promise((resolve, reject) => {
                Meteor.call('delete_poll', polls[i]._id, (error, result) => {
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