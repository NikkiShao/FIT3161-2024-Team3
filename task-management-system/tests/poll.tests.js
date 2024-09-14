import { Meteor } from "meteor/meteor";
import { resetDatabase } from 'meteor/xolvio:cleaner';
import PollCollection from "../imports/api/collections/poll";
import TeamCollection from "../imports/api/collections/team";
import "../imports/api/methods/team";
import "../imports/api/methods/poll";

const assert = require('assert');

/**
 * Test suite for poll methods.
 */
if (Meteor.isClient) {
    describe('Poll methods', function () {

        beforeEach(async function () {
            await resetDatabase(); // Clear the collection before each test
        });

        const testTeam = {
            "_id": "aKeCSqyho8o38KW9S",
            "teamName": "name",
            "teamMembers": [
                "cathayensis@qq.com"
            ],
            "teamLeader": "cathayensis@qq.com",
            "teamInvitations": [
                {
                    "email": "name@qqc.com",
                    "token": "jies8wdfxml3ewsk6vn1htj9ud8diqxpm"
                }
            ]
        }

        const testPollData = {
            "pollTitle": "POLL",
            "pollCreationDate": "2024-09-10T06:27:04.648Z",
            "pollDeadlineDate": "2024-10-02T13:55:00.000Z",
            "pollOptions": ["data1", "data2", "data3"],
            "teamId": "aKeCSqyho8o38KW9S"
        }

        /**
         * Test case to check if a poll can be added successfully.
         */
        it('can add a poll', function () {
            const teamId = TeamCollection.insert(testTeam);
            return new Promise((resolve, reject) => {
                Meteor.call("add_poll",
                    testPollData.pollTitle,
                    testPollData.pollDeadlineDate,
                    testPollData.pollOptions,
                    teamId,
                    (error, pollId) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(pollId);
                        }
                    });
            }).then(pollId => {
                assert.notStrictEqual(pollId, undefined);
                const poll = PollCollection.findOne({ teamId: testPollData.teamId });
                assert.notStrictEqual(poll, null);
            }).catch(error => {
                assert.fail("Error adding poll: " + error.message);
            });
        }).timeout(15000);

    });
}