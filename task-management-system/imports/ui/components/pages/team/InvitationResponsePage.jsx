/**
 * File Description: Invitation response page
 * Updated Date: 25/08/2024
 * Contributors: Nikki
 * Version: 1.1
 */

import React from 'react';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSubscribe, useTracker } from "meteor/react-meteor-data";
import Spinner from "react-bootstrap/Spinner";
import TeamCollection from "../../../../api/collections/team";
import WhiteBackground from "../../general/whiteBackground/WhiteBackground";
import PageLayout from "../../../enums/PageLayout";
import Button from "../../general/buttons/Button";
import BaseUrlPath from "../../../enums/BaseUrlPath";
import { getUserInfo } from "../../util";


/**
 * Invitation response page
 */
export const InvitationResponsePage = () => {
    const navigate = useNavigate();

    // check base path, if invite accept or decline
    const baseUrl = useLocation().pathname.split('/')[1];
    const {teamId, token} = useParams();

    const userInfo = getUserInfo();
    const [dbUpdateSuccess, setDbUpdateSuccess] = React.useState(null);

    // get specific team data
    const isLoadingTeams = useSubscribe('specific_team', teamId);
    const teamData = useTracker(() => {
        return TeamCollection.findOne({_id: teamId});
    })

    if (isLoadingTeams()) {
        return (
            <WhiteBackground pageLayout={PageLayout.SMALL_CENTER}>
                <Spinner animation="border" variant="secondary" role="status"/>
            </WhiteBackground>
        )

    } else {

        // either to login (not logged in) or to dashboard (if logged in)
        const loginDashboardButtons = (
            userInfo.id ?
                <Button className={"btn-brown"}
                        onClick={() => {
                            navigate('/' + BaseUrlPath.DASHBOARD)
                        }}>
                    Return to dashboard
                </Button>
                :
                <Button className={"btn-brown"}
                        onClick={() => {
                            navigate('/' + BaseUrlPath.LOGIN)
                        }}>
                    Return to login
                </Button>
        )

        // variables for each display
        const successInviteAcceptDiv = (
            <WhiteBackground pageLayout={PageLayout.SMALL_CENTER}>
                <h1>Invitation Accepted</h1>

                <span>You have accepted the invitation!</span>
                <span>Click the button to go to the team's page.</span>
                <br/>
                <Button className={"btn-brown"}
                        onClick={() => {
                            navigate('/' + BaseUrlPath.TEAMS + '/' + teamId)
                        }}>
                    View the team's page
                </Button>
            </WhiteBackground>
        )

        const errorInviteAcceptDiv = (
            <WhiteBackground pageLayout={PageLayout.SMALL_CENTER}>
                <h1>Error in Accepting Invite</h1>

                <span>This is a valid team invitation however, an error occurred when accepting the invitation.</span>
                <span>Please try again later.</span>
                <span>If this issue persists, ask your team leader to re-invite you.</span>
                <br/>
                <Button className={"btn-brown"}
                        onClick={() => {
                            navigate('/' + BaseUrlPath.DASHBOARD)
                        }}>
                    Return to Dashboard
                </Button>
            </WhiteBackground>
        )

        const successInviteDeclineDiv = (
            <WhiteBackground pageLayout={PageLayout.SMALL_CENTER}>
                <h1>Invitation Declined</h1>

                <span>You have declined the invitation</span>
                <br/>
                {loginDashboardButtons}
            </WhiteBackground>
        )

        const errorInviteDeclineDiv = (
            <WhiteBackground pageLayout={PageLayout.SMALL_CENTER}>
                <h1>Error in Declining Invite</h1>

                <span>Error in declining team invitation. Please try again.</span>
                <span>If this issue persists, you may ignore the invitation.</span>
                <br/>
                {loginDashboardButtons}
            </WhiteBackground>
        )

        // request has already been process, display results
        if (dbUpdateSuccess === true) {
            // if database update before was successful

            if (baseUrl === "accept-invite") {
                // invite accepted success
                return successInviteAcceptDiv;

            } else if (baseUrl === "decline-invite") {
                // invite declined success
                return successInviteDeclineDiv;

            }

        } else if (dbUpdateSuccess === false) {
            // if database update before failed

            if (baseUrl === "accept-invite") {
                // invite accepted error
                return errorInviteAcceptDiv;

            } else if (baseUrl === "decline-invite") {
                // invite decline error
                return errorInviteDeclineDiv;
            }
        }

        // dbUpdateSuccess = null, has not been process yet, process request first
        const invalidInviteDiv = (
            <WhiteBackground pageLayout={PageLayout.SMALL_CENTER}>
                <h1>Invalid Invitation</h1>

                <span>The invitation link is invalid</span>
                {
                    baseUrl === "accept-invite" ?
                        <span>Please try again later or get your team leader to re-invite you.</span> :
                        <span>You may ignore the invitation.</span>
                }
                <br/>
                {loginDashboardButtons}
            </WhiteBackground>
        )

        const alreadyMemberDiv = (
            <WhiteBackground pageLayout={PageLayout.SMALL_CENTER}>
                <h1>Existing Member</h1>

                <span>You are already in the team.</span>
                <br/>
                <Button className={"btn-brown"}
                        onClick={() => {
                            navigate('/' + BaseUrlPath.TEAMS + '/' + teamId)
                        }}>
                    View the team's page
                </Button>
            </WhiteBackground>
        )

        // check that team exists and token is valid
        if (!teamData) {
            // team is not found, invalid invitation
            return invalidInviteDiv;
        }

        // check that user is not already in the team
        if (userInfo.id && teamData.teamMembers.includes(userInfo.email)) {
            // if user is currently a member
            return alreadyMemberDiv;
        }

        // look for if token is in the team
        let tokenIndex = null;
        for (let i = 0; i < teamData.teamInvitations.length; i++) {
            if (teamData.teamInvitations[i].token === token) {
                // found the token, record index (needed for removing later)
                tokenIndex = i;
                break;
            }
        }

        if (tokenIndex === null) {
            // token not found, invalid invitation
            return invalidInviteDiv;
        }

        if (baseUrl === "accept-invite") {

            const loginRequiredDiv = (
                <WhiteBackground pageLayout={PageLayout.SMALL_CENTER}>
                    <h1>Please login</h1>
                    <span>You must login before you can accept a team invitation.</span>
                    <span>If you do not have an account you will have to register first.</span>
                    <br/>
                    <Button className={"btn-brown"}
                            onClick={() => {
                                navigate('/' + BaseUrlPath.LOGIN)
                            }}>
                        Go to login page
                    </Button>
                </WhiteBackground>
            )

            if (!userInfo.id) {
                // if user is not logged in, they need to be logged in: action needed
                return loginRequiredDiv;

            } else if (teamData.teamInvitations[tokenIndex].email !== userInfo.email) {
                // check if user is NOT matching the invited email of that token
                return invalidInviteDiv;

            } else {
                // this is a valid invitation. Process team invite acceptance:

                // remove member from team invitation and add to members list
                const newInvitationList = teamData.teamInvitations.toSpliced(tokenIndex, 1);
                const newMemberList = teamData.teamMembers.concat(userInfo.email);

                // update database
                new Promise((resolve, reject) => {
                    Meteor.call('update_team', teamId, teamData.teamInvitations,
                        {
                            "teamName": teamData.teamName,
                            "teamLeader": teamData.teamLeader,
                            "teamMembers": newMemberList,
                            "teamInvitations": newInvitationList,

                        }, true, (error, result) => {
                            if (error) {
                                reject(error)

                            } else {
                                resolve(result)
                                setDbUpdateSuccess(true)
                            }
                        })
                }).catch(() => {
                    // errored in database action
                    setDbUpdateSuccess(false)
                });

                return (
                    // loading
                    <WhiteBackground pageLayout={PageLayout.SMALL_CENTER}>
                        <Spinner animation="border" variant="secondary" role="status"/>
                    </WhiteBackground>
                )
            }

        } else if (baseUrl === "decline-invite") {

            // decline and remove invitation from team
            const newInvitationList = teamData.teamInvitations.toSpliced(tokenIndex, 1);

            new Promise((resolve, reject) => {
                Meteor.call('update_team', teamId, teamData.teamInvitations,
                    {
                        "teamName": teamData.teamName,
                        "teamLeader": teamData.teamLeader,
                        "teamMembers": teamData.teamMembers,
                        "teamInvitations": newInvitationList,

                    }, true, (error, result) => {
                        if (error) {
                            reject(error)

                        } else {
                            resolve(result)
                            setDbUpdateSuccess(true)
                        }
                    })
            }).catch(() => {
                // errored in database action
                setDbUpdateSuccess(false)
            })

            return (
                // loading
                <WhiteBackground pageLayout={PageLayout.SMALL_CENTER}>
                    <Spinner animation="border" variant="secondary" role="status"/>
                </WhiteBackground>
            )
        }
    }
}

export default InvitationResponsePage;