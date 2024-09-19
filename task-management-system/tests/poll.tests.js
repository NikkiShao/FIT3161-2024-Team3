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
        };

        const testPollData = {
            "pollTitle": "POLL",
            "pollCreationDate": "2024-09-10T06:27:04.648Z",
            "pollDeadlineDate": "2024-10-02T13:55:00.000Z",
            "pollOptions": ["data1", "data2", "data3"],
            "teamId": "aKeCSqyho8o38KW9S"
        };

        const testPoll = {
            "_id": "testPollId",
            "pollTitle": "test",
            "pollCreationDate": "2024-08-10T06:27:04.648Z",
            "pollDeadlineDate": "2024-08-12T13:55:00.000Z",
            "pollOptions": [{optionText: "option1", voterUsernames: []}, {optionText: "option2", voterUsernames: []}],
            "teamId": "aKeCSqyho8o38KW9S"
        };

        const pollOptions = [
            {
                "optionText": "option1",
                "voterUsernames": ["abcd", "efgh"]
            },
            {
                "optionText": "option2",
                "voterUsernames": ["1111"]
            },
            {
                "optionText": "data3",
                "voterUsernames": []
            }
        ];

        /**
         * Test case to check if a poll can be added successfully.
         */
        it('can add a poll', async function () {
            const teamId = TeamCollection.insert(testTeam);

            try {
                const pollId_1 = await new Promise((resolve, reject) => {
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
                });
                assert.notStrictEqual(pollId_1, undefined);
                const poll = PollCollection.findOne({ teamId: testPollData.teamId });
                assert.notStrictEqual(poll, null);
            } catch (error_1) {
                assert.fail("Error adding poll: " + error_1.message);
            }
        }).timeout(10000);

        /**
         * Test case to check invalid empty title.
         */
        it('errors with invalid title: empty title', async function () {
            const teamId = TeamCollection.insert(testTeam);

                return new Promise((resolve, reject) => {
                    Meteor.call("add_poll",
                        "",
                        testPollData.pollDeadlineDate,
                        testPollData.pollOptions,
                        teamId,
                        (error, pollId) => {
                            if (error) {
                                resolve(error);
                            } else {
                                reject();
                            }
                        });
                }).then((resolvedError) => {
                    assert.strictEqual(resolvedError.error, "poll-add-failed");

                }).catch((error) => {
                    assert.fail("Poll added with empty title");

                });
        })

        /**
         * Test case to check invalid empty teamId.
         */
        it('errors with invalid teamId: empty teamId', async function () {
            try {
                await new Promise((resolve, reject) => {
                    Meteor.call("add_poll",
                        testPollData.pollTitle,
                        testPollData.pollDeadlineDate,
                        testPollData.pollOptions,
                        "",
                        (error, pollId) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve(pollId);
                            }
                        });
                });
                assert.fail("Poll added with empty teamId");
            } catch (error_1) {
                assert.strictEqual(error_1.error, "poll-add-failed");
            }
        })

        /**
         * Test case to check invalid title with more than 100 characters.
         */
        it('errors with invalid title: exceeds 100 characters', async function () {
            const teamId = TeamCollection.insert(testTeam);

            try {
                await new Promise((resolve, reject) => {
                    Meteor.call("add_poll",
                        "This is a test title that exceeds the maximum number of characters allowed for a poll title. This is a test title that exceeds the maximum number of characters allowed for a poll title. The maximum number of characters allowed for a poll title is 100.",
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
                });
                assert.fail("Poll added with title exceeding 100 characters");
            } catch (error_1) {
                assert.strictEqual(error_1.error, "poll-add-failed");
            }
        })

        /**
         * Test case to check invalid deadline date.
         */
        it('errors with invalid deadline: non-date string', async function () {
            const teamId = TeamCollection.insert(testTeam);

            try {
                await new Promise((resolve, reject) => {
                    Meteor.call("add_poll",
                        testPollData.pollTitle,
                        "invalid date",
                        testPollData.pollOptions,
                        teamId,
                        (error, pollId) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve(pollId);
                            }
                        });
                });
                assert.fail("Poll added with invalid deadline date");
            } catch (error_1) {
                assert.strictEqual(error_1.error, "poll-add-failed");
            }
        })

        /**
         * Test case to check invalid deadline date in the past.
         */
        it('errors with invalid deadline: past date', async function () {
            const teamId = TeamCollection.insert(testTeam);

            try {
                await new Promise((resolve, reject) => {
                    Meteor.call("add_poll",
                        testPollData.pollTitle,
                        "2020-10-02T13:55:00.000Z",
                        testPollData.pollOptions,
                        teamId,
                        (error, pollId) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve(pollId);
                            }
                        });
                });
                assert.fail("Poll added with deadline date in the past");
            } catch (error_1) {
                assert.strictEqual(error_1.error, "poll-add-failed");
            }
        })

        /**
         * Test case to check invalid options with less than 2 options.
         */
        it('errors with invalid options: less than 2 options', async function () {
            const teamId = TeamCollection.insert(testTeam);

            try {
                await new Promise((resolve, reject) => {
                    Meteor.call("add_poll",
                        testPollData.pollTitle,
                        testPollData.pollDeadlineDate,
                        ["data1"],
                        teamId,
                        (error, pollId) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve(pollId);
                            }
                        });
                });
                assert.fail("Poll added with less than 2 options");
            } catch (error_1) {
                assert.strictEqual(error_1.error, "poll-add-failed");
            }
        })

        /**
         * Test case to check if teamId exists.
         */
        it('errors with invalid teamId: non-existent teamId', async function () {
            // Use a teamId that does not exist in the database
            const nonExistentTeamId = "nonExistentTeamId";

            try {
                await new Promise((resolve, reject) => {
                    Meteor.call("add_poll",
                        testPollData.pollTitle,
                        testPollData.pollDeadlineDate,
                        testPollData.pollOptions,
                        nonExistentTeamId,
                        (error, pollId) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve(pollId);
                            }
                        });
                });
                assert.fail("Poll added with non-existent teamId");
            } catch (error_1) {
                assert.strictEqual(error_1.error, "poll-add-failed");
                assert.strictEqual(error_1.reason, "Could not retrieve team information");
            }
        })


        /**
         * Test case to check if a poll can be updated successfully.
         */
        it('can update a poll', async function () {
            const teamId = TeamCollection.insert(testTeam);
            const pollId = PollCollection.insert(testPoll);

            Meteor.call("update_poll_votes", pollId, pollOptions)

            const updatedPoll = PollCollection.findOne(pollId);
            assert.strictEqual(updatedPoll.pollTitle, testPoll.pollTitle);
            assert.strictEqual(updatedPoll.pollCreationDate, testPoll.pollCreationDate);
            assert.strictEqual(updatedPoll.pollDeadlineDate, testPoll.pollDeadlineDate);
            assert.deepEqual(updatedPoll.pollOptions, pollOptions);
            assert.strictEqual(updatedPoll.teamId, testPoll.teamId);

        })

        /**
         * Test case to check if poll does not exist when updating.
         */
        it('errors with invalid pollId: non-existent poll for update', async function () {
            const teamId = TeamCollection.insert(testTeam);

            return new Promise((resolve, reject) => {
                Meteor.call("update_poll_votes", "invalidId", pollOptions, (error) => {
                    if (error) {
                        resolve(error);
                    } else {
                        reject();
                    }
                });
            }).then((resolvedError) => {
                assert.strictEqual(resolvedError.error, "poll-update-failed");
                assert.strictEqual(resolvedError.reason, "Poll not found");

            }).catch(() => {
                assert.fail("Editing non-existing poll did NOT give an error");
            });

        })

        /**
         * Test case to check if poll's options format is invalid.
         */
        it('errors with invalid options: incorrect format for update', async function () {
            const teamId = TeamCollection.insert(testTeam);
            const pollId = PollCollection.insert(testPoll);

            return new Promise((resolve, reject) => {
                Meteor.call("update_poll_votes", pollId, ["invalid"], (error) => {
                    if (error) {
                        resolve(error);
                    } else {
                        reject();
                    }
                });
            }).then((resolvedError) => {
                // match error from check()
                assert.strictEqual(resolvedError.error, 400);

            }).catch(() => {
                assert.fail("Updating with invalid options did NOT give an error");
            });

        })

        /**
         * Test case to check if error when 1 user votes on multiple poll's options.
         */
        it('errors with invalid options: incorrect format for update', async function () {
            const teamId = TeamCollection.insert(testTeam);
            const pollId = PollCollection.insert(testPoll);

            const pollOptions = [
                {
                    "optionText": "option1",
                    "voterUsernames": ["abcd", "efgh"]
                },
                {
                    "optionText": "option2",
                    "voterUsernames": ["abcd"]
                },
                {
                    "optionText": "data3",
                    "voterUsernames": []
                }
            ];

            return new Promise((resolve, reject) => {
                Meteor.call("update_poll_votes", pollId, pollOptions, (error) => {
                    if (error) {
                        resolve(error);
                    } else {
                        reject();
                    }
                });
            }).then((resolvedError) => {
                // match error from check()
                assert.strictEqual(resolvedError.error, "poll-update-failed");
                assert.strictEqual(resolvedError.reason, "Duplicated username in multiple poll options");

            }).catch(() => {
                assert.fail("Updating with invalid options did NOT give an error");
            });

        })

        /**
         * Test case to check if a poll can be deleted successfully.
         */
        it('can delete a poll', function () {
            const teamId = TeamCollection.insert(testTeam);
            Meteor.call("add_poll",
                testPollData.pollTitle,
                testPollData.pollDeadlineDate,
                testPollData.pollOptions,
                teamId,
                async (error, pollId) => {
                    if (error) {
                        assert.fail("Error adding poll: " + error.message);
                    } else {
                        try {
                            await new Promise((resolve, reject) => {
                                Meteor.call("delete_poll", pollId, (error_1) => {
                                    if (error_1) {
                                        reject(error_1);
                                    } else {
                                        resolve();
                                    }
                                });
                            });
                            const poll = PollCollection.findOne(pollId);
                            assert.strictEqual(poll, undefined); // Poll should not exist after deletion
                        } catch (error_2) {
                            assert.fail("Error deleting poll: " + error_2.message);
                        }
                    }
                });
        })

    });
}