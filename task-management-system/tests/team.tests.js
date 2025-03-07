/**
 * File Description: Team database testing
 * File version: 1.1
 * Contributors: Nikki, Audrey
 */

import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import { resetDatabase } from 'meteor/xolvio:cleaner';
import TeamCollection from "../imports/api/collections/team";
import "../imports/api/methods/team";
import BoardCollection from "../imports/api/collections/board";
import PollCollection from "../imports/api/collections/poll";
import TaskCollection from "../imports/api/collections/task";

const assert = require('assert');

/**
 * Test suite for client-side team methods.
 */
if (Meteor.isClient) {
    /**
     * Describes test cases for team methods.
     */
    describe('Team methods', function () {

        beforeEach(function () {
            resetDatabase(); // Clear the collection before each test
        });

        const testUser1 = {
            username: "testUser1",
            password: "testPassword",
            email: "test1@test1.com",
            profile: {
                name: "Test User 1",
                notificationOn: true
            }
        };

        const testUser2 = {
            username: "testUser2",
            password: "testPassword",
            email: "test2@test2.com",
            profile: {
                name: "Test User 2",
                notificationOn: true
            }
        };

        const testTeamData = {
            name: "test team",
            leader: "test1@test1.com",
            members: ["test2@test2.com"]
        }

        const testTeam = {
            teamName: "test team",
            teamLeader: "test1@test1.com",
            teamMembers: ["test1@test1.com"],
            teamInvitations: [
                {email: "test2@test2.com", token: "testToken1"}]
        }

        const testDeleteTeam = {
            name: "testTeam",
            leader: "test1@test1.com",
            members: ["test1@test1.com"]
        }

        const testBoard = {
            boardName: "test board",
            boardCode: "code123",
            boardDeadline: "2024-12-05T17:55:00.000Z",
            boardDescription: "description string",
            teamId: "",
            boardTags: [{tagName: "test1", tagColour: "#000000"}],
            boardStatuses: [
                {"statusName": "To Do", "statusOrder": 1},
                {"statusName": "Done", "statusOrder": 2}
            ],
        }

        const testUnpinnedTaskData = {
            taskName: "test task",
            taskDesc: "test description",
            taskDeadlineDate: "2024-12-05T17:55:00.000Z",
            taskIsPinned: false,
            boardId: "", // added dynamically during test cases
            statusName: "Done",
            tagNames: ["a", "b"],
            contributions: [{email: "test@test.com", percent: 12}],
        }

        const testPolls = {
            pollTitle: "test poll",
            pollCreationDate: "2024-09-05T17:55:00.000Z",
            pollDeadlineDate: "2024-12-05T17:55:00.000Z",
            pollOptions: [{optionText: "option1", voterUsernames: []}, {optionText: "option2", voterUsernames: []}],
            teamId: "" //added during test case
        }

        /**
         * Test case to check if a team can be added successfully.
         */
        it('Can create team: team name with minimum characters and no extra member invitations', function () {
            // insert in user for leader/member
            Accounts.createUser(testUser1);

            // wrap insert call in promise
            return new Promise((resolve, reject) => {
                Meteor.call("add_team",
                    "a",
                    [],
                    testTeamData.leader,
                    false,
                    
                    (error, teamId) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(teamId);
                        }
                    }
                );
            }).then(teamId => {
                // check team ID is NOT undefined
                assert.notStrictEqual(teamId, undefined);
                // find team object and check it is not null
                const team = TeamCollection.findOne(teamId);
                assert.notStrictEqual(team, null); 
            }).catch(error => {
                assert.fail("Error adding team. Returned with error:" + error.message);
            });
        }).timeout(10000);

        /**
         * Test case to check if a team can be added successfully.
         */
        it('Can create team: team name with minimum characters and one extra member invitations', function () {
            // insert in user for leader/member
            Accounts.createUser(testUser1);

            // wrap insert call in promise
            return new Promise((resolve, reject) => {
                Meteor.call("add_team",
                    "a",
                    testTeamData.members,
                    testTeamData.leader,
                    false,
                    (error, teamId) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(teamId);
                        }
                    }
                );
            }).then(teamId => {
                // check team ID is NOT undefined
                assert.notStrictEqual(teamId, undefined);
                // find team object and check it is not null
                const team = TeamCollection.findOne(teamId);
                assert.notStrictEqual(team, null); 
            }).catch(error => {
                assert.fail("Error adding team. Returned with error:" + error.message);
            });
        }).timeout(10000);

        /**
         * Test case to check if a team can be added successfully.
         */
        it('Can create team: team name with maximum characters and no extra member invitations', function () {
            // insert in user for leader/member
            Accounts.createUser(testUser1);

            // wrap insert call in promise
            return new Promise((resolve, reject) => {
                Meteor.call("add_team",
                    "12345678901234567890",
                    [],
                    testTeamData.leader,
                    false,
                    (error, teamId) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(teamId);
                        }
                    }
                );
            }).then(teamId => {
                // check team ID is NOT undefined
                assert.notStrictEqual(teamId, undefined);
                // find team object and check it is not null
                const team = TeamCollection.findOne(teamId);
                assert.notStrictEqual(team, null); 
            }).catch(error => {
                assert.fail("Error adding team. Returned with error:" + error.message);
            });
        }).timeout(10000);


        /**
         * Test case to check if a team can be added successfully.
         */
        it('Can create team: team name with maximum characters and one extra member invitations', function () {
            // insert in user for leader/member
            Accounts.createUser(testUser1);

            // wrap insert call in promise
            return new Promise((resolve, reject) => {
                Meteor.call("add_team",
                    "12345678901234567890",
                    testTeamData.members,
                    testTeamData.leader,
                    false,
                    (error, teamId) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(teamId);
                        }
                    }
                );
            }).then(teamId => {
                // check team ID is NOT undefined
                assert.notStrictEqual(teamId, undefined);
                // find team object and check it is not null
                const team = TeamCollection.findOne(teamId);
                assert.notStrictEqual(team, null); 
            }).catch(error => {
                assert.fail("Error adding team. Returned with error:" + error.message);
            });
        }).timeout(10000);


        //test for empty team name
        it('Create team errors: an empty team name', function () {
            // insert test user
            Accounts.createUser(testUser1);
        
            let isError = false;
        
            // Wrap the Meteor.call in a Promise
            return new Promise((resolve, reject) => {
                Meteor.call("add_team",
                    '',
                    [],
                    testTeamData.leader,
                    false,
            
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                );
            }).catch((error) => {
                isError = true;
                assert.strictEqual(error.error, "add-team-failed")
            
            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for invalid empty name input");
                }
            });
        
        }).timeout(10000);

        //test for empty team name
        it('Create team errors: a team name longer than the limit', function () {
            // insert test user
            Accounts.createUser(testUser1);
        
            let isError = false;
        
            // Wrap the Meteor.call in a Promise
            return new Promise((resolve, reject) => {
                Meteor.call("add_team",
                    '123456789012345678901',
                    [],
                    testTeamData.leader,
                    false,
            
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                );
            }).catch((error) => {
                isError = true;
                assert.strictEqual(error.error, "add-team-failed")
            
            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for invalid long name input");
                }
            });
        
        }).timeout(10000);

                //test for empty team name
        it('Create team errors: team name not a string', function () {
            // insert test user
            Accounts.createUser(testUser1);
        
            let isError = false;
        
            // Wrap the Meteor.call in a Promise
            return new Promise((resolve, reject) => {
                Meteor.call("add_team",
                    12,
                    [],
                    testTeamData.leader,
                    false,
            
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                );
            }).catch((error) => {
                isError = true;
                assert.strictEqual(error.error, 400)
            
            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for invalid name input");
                }
            });
        
        }).timeout(10000);

        //test for invalid email input for team members  
        it('Create team errors: invitations contain an invalid email', function () {
            // insert test user
            Accounts.createUser(testUser1);
            let isError = false;
        
            // Wrap the Meteor.call in a Promise
            return new Promise((resolve, reject) => {
                Meteor.call("add_team",
                    "test",
                    ["test2@test2.com", "invalid email"],
                    testTeamData.leader,
                    false,
        
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                );
            }).catch((error) => {
                isError = true;
                assert.strictEqual(error.error, "add-team-failed")
        
            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for invalid email input");
                }
            });
        }).timeout(10000);
        
        //test for duplicate email in the members array
        it('Create team errors: invitations contain valid but duplicate emails', function () {
            // insert test user
            Accounts.createUser(testUser1);
            let isError = false;
        
            // Wrap the Meteor.call in a Promise
            return new Promise((resolve, reject) => {
                Meteor.call("add_team",
                    "test",
                    ["test2@test2.com", "test2@test2.com"],
                    testTeamData.leader,
                    false,
        
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                );
            }).catch((error) => {
                isError = true;
                assert.strictEqual(error.error, "add-team-failed")
        
            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for duplicate email input");
                }
            });
        }).timeout(10000);

        it('Create team errors: invitations is not an array of strings', function () {
            // insert test user
            Accounts.createUser(testUser1);
            let isError = false;
        
            // Wrap the Meteor.call in a Promise
            return new Promise((resolve, reject) => {
                Meteor.call("add_team",
                    "test",
                    [1, 2, 3],
                    testTeamData.leader,
                    false,
        
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                );
            }).catch((error) => {
                isError = true;
                assert.strictEqual(error.error, 400)
        
            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for invalid invitation input");
                }
            });
        }).timeout(10000);

        it('Create team errors: invitations not an array', function () {
            // insert test user
            Accounts.createUser(testUser1);
            let isError = false;
        
            // Wrap the Meteor.call in a Promise
            return new Promise((resolve, reject) => {
                Meteor.call("add_team",
                    "test",
                    1,
                    testTeamData.leader,
                    false,
        
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                );
            }).catch((error) => {
                isError = true;
                assert.strictEqual(error.error, 400)
        
            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for invalid invitation input");
                }
            });
        }).timeout(10000);

        it('Create team errors: team leader email is invalid', function () {
            // insert test user
            Accounts.createUser(testUser1);
            let isError = false;
        
            // Wrap the Meteor.call in a Promise
            return new Promise((resolve, reject) => {
                Meteor.call("add_team",
                    "test",
                    [],
                    "invalid email",
                    false,
        
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                );
            }).catch((error) => {
                isError = true;
                assert.strictEqual(error.error, "add-team-failed")
        
            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for ivalid leader email input");
                }
            });
        }).timeout(10000);

        it('Create team errors: team leader email is not a string', function () {
            // insert test user
            Accounts.createUser(testUser1);
            let isError = false;
        
            // Wrap the Meteor.call in a Promise
            return new Promise((resolve, reject) => {
                Meteor.call("add_team",
                    "test",
                    [],
                    1,
                    false,
        
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                );
            }).catch((error) => {
                isError = true;
                assert.strictEqual(error.error, 400)
        
            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for invalid leader email input");
                }
            });
        }).timeout(10000);

        
        /**
         * Test case to check if a team can be updated successfully.
         */
        it('Can edit team: team name with minimum characters and no extra member invitations', function () {
            // create members of team
            Accounts.createUser(testUser1);
            Accounts.createUser(testUser2);

            // insert in a team to edit
            const id = TeamCollection.insert(testTeam);

            // create edited team object
            const editedTeam = {
                teamName: "a",
                teamLeader: "test1@test1.com",
                teamMembers: ["test1@test1.com"],
                teamInvitations: []
            }

            // call update method
            Meteor.call('update_team', id, testTeam.teamInvitations, editedTeam, false);

            // get updated team object and check all updated
            const updatedTeam = TeamCollection.findOne(id);
            assert.strictEqual(updatedTeam.teamName, "a");
            assert.strictEqual(updatedTeam.teamLeader, "test1@test1.com");
            assert.deepEqual(updatedTeam.teamMembers, ["test1@test1.com"]);
            assert.deepEqual(updatedTeam.teamInvitations, []);

        }).timeout(10000);
        
        /**
         * Test case to check if a team can be updated successfully.
         */
        it('Can edit team: team name with minimum characters and one extra member invitations', function () {
            // create members of team
            Accounts.createUser(testUser1);
            Accounts.createUser(testUser2);

            // insert in a team to edit
            const id = TeamCollection.insert(testTeam);

            // create edited team object
            const editedTeam = {
                teamName: "a",
                teamLeader: "test1@test1.com",
                teamMembers: ["test1@test1.com"],
                teamInvitations: [{email: "test2@test2.com", token: "testToken2"}]
            }

            // call update method
            Meteor.call('update_team', id, testTeam.teamInvitations, editedTeam, false);

            // get updated team object and check all updated
            const updatedTeam = TeamCollection.findOne(id);
            assert.strictEqual(updatedTeam.teamName, "a");
            assert.strictEqual(updatedTeam.teamLeader, "test1@test1.com");
            assert.deepEqual(updatedTeam.teamMembers, ["test1@test1.com"]);
            assert.deepEqual(updatedTeam.teamInvitations, [{email: "test2@test2.com", token: "testToken2"}]);

        }).timeout(10000);

        /**
         * Test case to check if a team can be updated successfully.
         */
        it('Can edit team: team name with maximum characters and no extra member invitations', function () {
            // create members of team
            Accounts.createUser(testUser1);
            Accounts.createUser(testUser2);

            // insert in a team to edit
            const id = TeamCollection.insert(testTeam);

            // create edited team object
            const editedTeam = {
                teamName: "12345678901234567890",
                teamLeader: "test1@test1.com",
                teamMembers: ["test1@test1.com"],
                teamInvitations: []
            }

            // call update method
            Meteor.call('update_team', id, testTeam.teamInvitations, editedTeam, false);

            // get updated team object and check all updated
            const updatedTeam = TeamCollection.findOne(id);
            assert.strictEqual(updatedTeam.teamName, "12345678901234567890");
            assert.strictEqual(updatedTeam.teamLeader, "test1@test1.com");
            assert.deepEqual(updatedTeam.teamMembers, ["test1@test1.com"]);
            assert.deepEqual(updatedTeam.teamInvitations, []);

        }).timeout(10000);

        /**
         * Test case to check if a team can be updated successfully.
         */
        it('Can edit team: team name with maximum characters and one extra member invitations', function () {
            // create members of team
            Accounts.createUser(testUser1);
            Accounts.createUser(testUser2);

            // insert in a team to edit
            const id = TeamCollection.insert(testTeam);

            // create edited team object
            const editedTeam = {
                teamName: "12345678901234567890",
                teamLeader: "test1@test1.com",
                teamMembers: ["test1@test1.com"],
                teamInvitations: [{email: "test2@test2.com", token: "testToken2"}]
            }

            // call update method
            Meteor.call('update_team', id, testTeam.teamInvitations, editedTeam, false);

            // get updated team object and check all updated
            const updatedTeam = TeamCollection.findOne(id);
            assert.strictEqual(updatedTeam.teamName, "12345678901234567890");
            assert.strictEqual(updatedTeam.teamLeader, "test1@test1.com");
            assert.deepEqual(updatedTeam.teamMembers, ["test1@test1.com"]);
            assert.deepEqual(updatedTeam.teamInvitations, [{email: "test2@test2.com", token: "testToken2"}]);

        }).timeout(10000);

        //test for empty team name
        it("Update team errors: an empty team name", function () {
            // create members of team
            Accounts.createUser(testUser1);
            Accounts.createUser(testUser2);

            // insert in a team to edit
            const id = TeamCollection.insert(testTeam);
        
            let isError = false;

            // create team object
            const emptyNameTeam = {
                teamName: "",
                teamLeader: "test1@test1.com",
                teamMembers: ["test1@test1.com"],
                teamInvitations: []
            }

            // Wrap the Meteor.call in a Promise
            return new Promise((resolve, reject) => {
                Meteor.call("update_team", id, emptyNameTeam.teamInvitations, emptyNameTeam, false,
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                );
            }).catch((error) => {
                isError = true;
                assert.strictEqual(error.error, "update-team-failed")
            
            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for invalid empty name input");
                }
            });
        
        }).timeout(10000);

        //test for invalid long team name
        it('Update team errors: a team name longer than the limit', function () {
            // create members of team
            Accounts.createUser(testUser1);
            Accounts.createUser(testUser2);

            // insert in a team to edit
            const id = TeamCollection.insert(testTeam);
        
            let isError = false;

            // create team object
            const longNameTeam = {
                teamName: "123456789012345678901",
                teamLeader: "test1@test1.com",
                teamMembers: ["test1@test1.com"],
                teamInvitations: []
            }

            // Wrap the Meteor.call in a Promise
            return new Promise((resolve, reject) => {
                Meteor.call("update_team", id, longNameTeam.teamInvitations, longNameTeam, false,
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                );
            }).catch((error) => {
                isError = true;
                assert.strictEqual(error.error, "update-team-failed")
        
            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for invalid name input that is too long");
                }
            });
        
        }).timeout(10000);

        //test for invalid long team name
        it('Update team errors: team name not a string', function () {
            // create members of team
            Accounts.createUser(testUser1);
            Accounts.createUser(testUser2);

            // insert in a team to edit
            const id = TeamCollection.insert(testTeam);
        
            let isError = false;

            // create team object
            const editedTeam = {
                teamName: 12,
                teamLeader: "test1@test1.com",
                teamMembers: ["test1@test1.com"],
                teamInvitations: []
            }

            // Wrap the Meteor.call in a Promise
            return new Promise((resolve, reject) => {
                Meteor.call("update_team", id, editedTeam.teamInvitations, editedTeam, false,
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                );
            }).catch((error) => {
                isError = true;
                assert.strictEqual(error.error, 400)
        
            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for invalid name input");
                }
            });
        
        }).timeout(10000);

        //test for invalid long team name
        it('Update team errors: members is empty', function () {
            // create members of team
            Accounts.createUser(testUser1);
            Accounts.createUser(testUser2);

            // insert in a team to edit
            const id = TeamCollection.insert(testTeam);
        
            let isError = false;

            // create team object
            const editedTeam = {
                teamName: "test",
                teamLeader: "test1@test1.com",
                teamMembers: [],
                teamInvitations: []
            }

            // Wrap the Meteor.call in a Promise
            return new Promise((resolve, reject) => {
                Meteor.call("update_team", id, editedTeam.teamInvitations, editedTeam, false,
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                );
            }).catch((error) => {
                isError = true;
                assert.strictEqual(error.error, "update-team-failed")
        
            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for invalid team members");
                }
            });
        
        }).timeout(10000);

        //test for invalid email input for team members        
        it('Update team errors: members contain an invalid email', function () {
            // create members of team
            Accounts.createUser(testUser1);
            Accounts.createUser(testUser2);

            // insert in a team to edit
            const id = TeamCollection.insert(testTeam);
        
            let isError = false;

            // create team object
            const invalidEmailTeam = {
                teamName: "test",
                teamLeader: "test1@test1.com",
                teamMembers:  ["test1@test1.com", "invalid email"],
                teamInvitations: []
            }

            // Wrap the Meteor.call in a Promise
            return new Promise((resolve, reject) => {
                Meteor.call("update_team", id, invalidEmailTeam.teamInvitations, invalidEmailTeam, false,
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                );
            }).catch((error) => {
                isError = true;
                assert.strictEqual(error.error, "update-team-failed")
            
            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for invalid email format input");
                }
            });
        
        }).timeout(10000);

        //test for duplicate email in the members array
        it('Update team errors: members contain valid but duplicated emails', function () {
            // create members of team
            Accounts.createUser(testUser1);
            Accounts.createUser(testUser2);

            // insert in a team to edit
            const id = TeamCollection.insert(testTeam);
        
            let isError = false;

            // create team object
            const invalidEmailTeam = {
                teamName: "test",
                teamLeader: "test1@test1.com",
                teamMembers: ["test1@test1.com", "test1@test1.com"],
                teamInvitations: []
            }

            return new Promise((resolve, reject) => {
                Meteor.call("update_team", id, invalidEmailTeam.teamInvitations, invalidEmailTeam, false,
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                );
            }).catch((error) => {
                isError = true;
                assert.strictEqual(error.error, "update-team-failed")
            
            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for duplicate email input");
                }
            });
        
        }).timeout(10000);

        //test for invalid email input
        it('Update team errors: members is not an array of strings', function () {
            // create members of team
            Accounts.createUser(testUser1);
            Accounts.createUser(testUser2);

            // insert in a team to edit
            const id = TeamCollection.insert(testTeam);
        
            let isError = false;

            // create team object
            const invalidTeam = {
                teamName: "test",
                teamLeader: "test1@test1.com",
                teamMembers: [1,2,3],
                teamInvitations: []
            }

            // Wrap the Meteor.call in a Promise
            return new Promise((resolve, reject) => {
                Meteor.call("update_team", id, invalidTeam.teamInvitations, invalidTeam, false,
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                );
            }).catch((error) => {
                isError = true;
                assert.strictEqual(error.error, 400)
            
            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for invalid member email input");
                }
            });
        
        }).timeout(10000);

        //test for duplicate invitations
        it('Update team errors: members not an array', function () {
            // create members of team
            Accounts.createUser(testUser1);
            Accounts.createUser(testUser2);

            // insert in a team to edit
            const id = TeamCollection.insert(testTeam);
        
            let isError = false;

            // create team object
            const invalidTeam = {
                teamName: "test",
                teamLeader: "test1@test1.com",
                teamMembers: 1,
                teamInvitations: []
            }

            // Wrap the Meteor.call in a Promise
            return new Promise((resolve, reject) => {
                Meteor.call("update_team", id, invalidTeam.teamInvitations, invalidTeam, false,
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                );
            }).catch((error) => {
                isError = true;
                assert.strictEqual(error.error, 400)
            
            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for invalid member email input");
                }
            });
        
        }).timeout(10000);
     
        it('Update team errors: team leader email is invalid', function () {
            // create members of team
            Accounts.createUser(testUser1);
            Accounts.createUser(testUser2);

            // insert in a team to edit
            const id = TeamCollection.insert(testTeam);
        
            let isError = false;

            // create team object
            const invalidEmailTeam = {
                teamName: "test",
                teamLeader: "invalid email",
                teamMembers:  ["test1@test1.com"],
                teamInvitations: []
            }

            // Wrap the Meteor.call in a Promise
            return new Promise((resolve, reject) => {
                Meteor.call("update_team", id, invalidEmailTeam.teamInvitations, invalidEmailTeam, false,
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                );
            }).catch((error) => {
                isError = true;
                assert.strictEqual(error.error, "update-team-failed")
            
            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for invalid email format input");
                }
            });
        
        }).timeout(10000);

        it('Update team errors: team leader email is not a string', function () {
            // create members of team
            Accounts.createUser(testUser1);
            Accounts.createUser(testUser2);

            // insert in a team to edit
            const id = TeamCollection.insert(testTeam);
        
            let isError = false;

            // create team object
            const invalidEmailTeam = {
                teamName: "test",
                teamLeader: 1,
                teamMembers:  ["test1@test1.com"],
                teamInvitations: []
            }

            // Wrap the Meteor.call in a Promise
            return new Promise((resolve, reject) => {
                Meteor.call("update_team", id, invalidEmailTeam.teamInvitations, invalidEmailTeam, false,
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                );
            }).catch((error) => {
                isError = true;
                assert.strictEqual(error.error, 400)
            
            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for invalid email format input");
                }
            });
        
        }).timeout(10000);

        it('Update team errors: invitations contain valid but duplicated emails', function () {
            // create members of team
            Accounts.createUser(testUser1);
            Accounts.createUser(testUser2);

            // insert in a team to edit
            const id = TeamCollection.insert(testTeam);
        
            let isError = false;

            // create team object
            const invalidEmailTeam = {
                teamName: "test",
                teamLeader: "test1@test1.com",
                teamMembers: ["test1@test1.com"],
                teamInvitations: [{email: "test2@test2.com", token: "testToken2"}, {email: "test2@test2.com", token: "testToken2"}]
            }

            // Wrap the Meteor.call in a Promise
            return new Promise((resolve, reject) => {
                Meteor.call("update_team", id, invalidEmailTeam.teamInvitations, invalidEmailTeam, false,
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                );
            }).catch((error) => {
                isError = true;
                assert.strictEqual(error.error, "update-team-failed")
            
            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for duplicate email input");
                }
            });
        
        }).timeout(10000);

        it('Update team errors: invitations contain an invalid email', function () {
            // create members of team
            Accounts.createUser(testUser1);
            Accounts.createUser(testUser2);

            // insert in a team to edit
            const id = TeamCollection.insert(testTeam);
        
            let isError = false;

            // create team object
            const invalidEmailTeam = {
                teamName: "test",
                teamLeader: "test1@test1.com",
                teamMembers: ["test1@test1.com"],
                teamInvitations: [{email: "test2@test2.com", token: "testToken2"}, {email: "invalid email", token: "testToken2"}]
            }

            // Wrap the Meteor.call in a Promise
            return new Promise((resolve, reject) => {
                Meteor.call("update_team", id, invalidEmailTeam.teamInvitations, invalidEmailTeam, false,
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                );
            }).catch((error) => {
                isError = true;
                assert.strictEqual(error.error, "update-team-failed")
            
            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for duplicate email input");
                }
            });
        
        }).timeout(10000);

        it('Update team errors: invitations is not an array of strings', function () {
            // create members of team
            Accounts.createUser(testUser1);
            Accounts.createUser(testUser2);

            // insert in a team to edit
            const id = TeamCollection.insert(testTeam);
        
            let isError = false;

            // create team object
            const invalidEmailTeam = {
                teamName: "test",
                teamLeader: "test1@test1.com",
                teamMembers: ["test1@test1.com"],
                teamInvitations: [1,2,3]
            }

            // Wrap the Meteor.call in a Promise
            return new Promise((resolve, reject) => {
                Meteor.call("update_team", id, invalidEmailTeam.teamInvitations, invalidEmailTeam, false,
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                );
            }).catch((error) => {
                isError = true;
                assert.strictEqual(error.error, 400)
            
            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for invalid email invitation input");
                }
            });
        
        }).timeout(10000);

        it('Update team errors: invitations not an array', function () {
            // create members of team
            Accounts.createUser(testUser1);
            Accounts.createUser(testUser2);

            // insert in a team to edit
            const id = TeamCollection.insert(testTeam);
        
            let isError = false;

            // create team object
            const invalidEmailTeam = {
                teamName: "test",
                teamLeader: "test1@test1.com",
                teamMembers: ["test1@test1.com"],
                teamInvitations: 1
            }

            // Wrap the Meteor.call in a Promise
            return new Promise((resolve, reject) => {
                Meteor.call("update_team", id, invalidEmailTeam.teamInvitations, invalidEmailTeam, false,
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                );
            }).catch((error) => {
                isError = true;
                assert.strictEqual(error.error, 400)
            
            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for invalid email invitation input");
                }
            });
        
        }).timeout(10000);

        it('Update team errors: team ID is not a string', function () {
            // create members of team
            Accounts.createUser(testUser1);
            Accounts.createUser(testUser2);

            // insert in a team to edit
            const id = TeamCollection.insert(testTeam);
        
            let isError = false;

            // create team object
            const invalidEmailTeam = {
                teamName: "test",
                teamLeader: "test1@test1.com",
                teamMembers: ["test1@test1.com"],
                teamInvitations: []
            }

            // Wrap the Meteor.call in a Promise
            return new Promise((resolve, reject) => {
                Meteor.call("update_team", 1, invalidEmailTeam.teamInvitations, invalidEmailTeam, false,
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                );
            }).catch((error) => {
                isError = true;
                assert.strictEqual(error.error, 400)
            
            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for invalid ID input");
                }
            });
        
        }).timeout(10000);

        /**
         * Test case to check if a team can be deleted successfully.
         */
        it('Can delete team: string team ID that exists in database', function () {
            // create members of team
            Accounts.createUser(testUser1);
            Accounts.createUser(testUser2);
            const id = TeamCollection.insert(testDeleteTeam);
            testBoard.teamId = id;
            testPolls.teamId = id;
            const boardId = BoardCollection.insert(testBoard);
            const pollId = PollCollection.insert(testPolls);
            testUnpinnedTaskData.boardId = boardId;
            const taskId = TaskCollection.insert(testUnpinnedTaskData);

            console.log(TeamCollection.findOne(id));
            // call delete method for deletion
            Meteor.call('delete_team', id, testUser1.username);

            // check deleted team is DELETED
            const deletedTeam = TeamCollection.findOne(id);
            console.log(deletedTeam);
            const deletedPoll = PollCollection.findOne(pollId);
            const deletedTask = PollCollection.findOne(taskId);
            const deletedBoard = PollCollection.findOne(boardId);
            assert.strictEqual(deletedTeam, undefined);
            assert.strictEqual(deletedPoll, undefined);
            assert.strictEqual(deletedTask, undefined);
            assert.strictEqual(deletedBoard, undefined);
        }).timeout(10000);

            /**
         * Test case to check if a team can be deleted successfully.
         */
        it('Can delete team: string team ID that does not exists in database', function () {
            // create members of team
            Accounts.createUser(testUser1);
            Accounts.createUser(testUser2);
            const id = "RandomID";

            // call delete method for deletion
            Meteor.call('delete_team', id, testUser1.username);

            // check deleted team is DELETED
            const deletedTeam = TeamCollection.findOne(id);
            assert.strictEqual(deletedTeam, undefined);
        }).timeout(10000);

        it('Delete team errors: team ID is not a string', function () {
            // create members of team
            Accounts.createUser(testUser1);

            let isError = false;
            // Wrap the Meteor.call in a Promise
            return new Promise((resolve, reject) => {
                Meteor.call('delete_team', 1, testUser1.username,
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                );
            }).catch((error) => {
                isError = true;
                assert.strictEqual(error.error, 400)
            
            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for invalid ID input");
                }
            });
        
        }).timeout(10000);
    });
}
