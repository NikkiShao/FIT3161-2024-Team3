/**
 * File Description: Team database testing
 * File version: 1.1
 * Contributors: Nikki, Audrey
 */

import {Meteor} from "meteor/meteor";
import {Accounts} from "meteor/accounts-base";
import {resetDatabase} from 'meteor/xolvio:cleaner';
import "../imports/api/methods/team";
import TeamCollection from "../imports/api/collections/team";

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

        /**
         * Test case to check if a team can be added successfully.
         */
        it('can add a team', function () {
            // insert in user for leader/member
            Accounts.createUser(testUser1);

            // wrap insert call in promise
            return new Promise((resolve, reject) => {
                Meteor.call("add_team",
                    testTeamData.name,
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
        it('errors with invalid name: empty name', function () {
            // insert test user
            Accounts.createUser(testUser1);
        
            let isError = false;
        
            // Wrap the Meteor.call in a Promise
            new Promise((resolve, reject) => {
                Meteor.call("add_team",
                    '',
                    testTeamData.members,
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
            // assert.strictEqual(1, "2")
        
        });

        //test for invalid long team name
        it('errors with invalid name: too long name > 20 characters', function () {
            // insert test user
            Accounts.createUser(testUser1);
            let isError = false;
        
            // Wrap the Meteor.call in a Promise
            new Promise((resolve, reject) => {
                Meteor.call("add_team",
                    "teamteamteamteamteamteam",
                    testTeamData.members,
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
                    assert.fail("Did not provide required error for invalid name input that is too long");
                }
            });
        
        });

        //test for invalid email input for team members  
        it('errors with invalid email: invalid email format', function () {
            // insert test user
            Accounts.createUser(testUser1);
            let isError = false;
        
            // Wrap the Meteor.call in a Promise
            new Promise((resolve, reject) => {
                Meteor.call("add_team",
                    testTeamData.name,
                    ["email"],
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
        });
        
        //test for duplicate email in the members array
        it('errors with email: duplicate member email', function () {
            // insert test user
            Accounts.createUser(testUser1);
            let isError = false;
        
            // Wrap the Meteor.call in a Promise
            new Promise((resolve, reject) => {
                Meteor.call("add_team",
                    testTeamData.name,
                    ["test1@test1.com", "test1@test1.com"],
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
        });

        
        /**
         * Test case to check if a team can be updated successfully.
         */
        it('can edit a team', function () {
            // create members of team
            Accounts.createUser(testUser1);
            Accounts.createUser(testUser2);

            // insert in a team to edit
            const id = TeamCollection.insert(testTeam);

            // create edited team object
            const editedTeam = {
                teamName: "test team New",
                teamLeader: "test2@test2.com",
                teamMembers: ["test1@test1.com", "test2@test2.com"],
                teamInvitations: [{email: "test3@test3.com", token: "testToken2"}]
            }

            // call update method
            Meteor.call('update_team', id, testTeam.teamInvitations, editedTeam, false);

            // get updated team object and check all updated
            const updatedTeam = TeamCollection.findOne(id);
            assert.strictEqual(updatedTeam.teamName, "test team New");
            assert.strictEqual(updatedTeam.teamLeader, "test2@test2.com");
            assert.deepEqual(updatedTeam.teamMembers, ["test1@test1.com", "test2@test2.com"]);
            assert.deepEqual(updatedTeam.teamInvitations, [{email: "test3@test3.com", token: "testToken2"}]);

        });

        //test for empty team name
        it('errors with invalid updated name: empty name', function () {
            // create members of team
            Accounts.createUser(testUser1);
            Accounts.createUser(testUser2);

            // insert in a team to edit
            const id = TeamCollection.insert(testTeam);
        
            let isError = false;

            // create team object
            const emptyNameTeam = {
                teamName: "",
                teamLeader: "test2@test2.com",
                teamMembers: ["test1@test1.com", "test2@test2.com"],
                teamInvitations: [{email: "test3@test3.com", token: "testToken2"}]
            }

            // Wrap the Meteor.call in a Promise
            new Promise((resolve, reject) => {
                Meteor.call("update_team", id, testTeam.teamInvitations, emptyNameTeam, false,
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
        
        });

        //test for invalid long team name
        it('errors with updated invalid name: too long name > 20 characters', function () {
            // create members of team
            Accounts.createUser(testUser1);
            Accounts.createUser(testUser2);

            // insert in a team to edit
            const id = TeamCollection.insert(testTeam);
        
            let isError = false;

            // create team object
            const longNameTeam = {
                teamName: "test team test team test team",
                teamLeader: "test2@test2.com",
                teamMembers: ["test1@test1.com", "test2@test2.com"],
                teamInvitations: [{email: "test3@test3.com", token: "testToken2"}]
            }

            // Wrap the Meteor.call in a Promise
            new Promise((resolve, reject) => {
                Meteor.call("update_team", id, testTeam.teamInvitations, longNameTeam, false,
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
        
        });

        //test for invalid email input for team members        
        it('errors with invalid updated email: invalid email format', function () {
            // create members of team
            Accounts.createUser(testUser1);
            Accounts.createUser(testUser2);

            // insert in a team to edit
            const id = TeamCollection.insert(testTeam);
        
            let isError = false;

            // create team object
            const invalidEmailTeam = {
                teamName: "test teamm",
                teamLeader: "test2@test2.com",
                teamMembers: ["email", "test2@test2.com"],
                teamInvitations: [{email: "test3@test3.com", token: "testToken2"}]
            }

            // Wrap the Meteor.call in a Promise
            new Promise((resolve, reject) => {
                Meteor.call("update_team", id, testTeam.teamInvitations, invalidEmailTeam, false,
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
        
        });

        //test for duplicate email in the members array
        it('errors with invalid updated email: duplicate email', function () {
            // create members of team
            Accounts.createUser(testUser1);
            Accounts.createUser(testUser2);

            // insert in a team to edit
            const id = TeamCollection.insert(testTeam);
        
            let isError = false;

            // create team object
            const invalidEmailTeam = {
                teamName: "test teamm",
                teamLeader: "test2@test2.com",
                teamMembers: ["test2@test2.com", "test2@test2.com"],
                teamInvitations: [{email: "test3@test3.com", token: "testToken2"}]
            }

            new Promise((resolve, reject) => {
                Meteor.call("update_team", id, testTeam.teamInvitations, invalidEmailTeam, false,
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
        
        });

        //test for invalid email input
        it('errors with invalid updated invitation email: invalid email format', function () {
            // create members of team
            Accounts.createUser(testUser1);
            Accounts.createUser(testUser2);

            // insert in a team to edit
            const id = TeamCollection.insert(testTeam);
        
            let isError = false;

            // create team object
            const invalidEmailTeam = {
                teamName: "test team",
                teamLeader: "test2@test2.com",
                teamMembers: ["test1@test1.com", "test2@test2.com"],
                teamInvitations: [{email: "email", token: "testToken2"}]
            }

            // Wrap the Meteor.call in a Promise
            new Promise((resolve, reject) => {
                Meteor.call("update_team", id, testTeam.teamInvitations, invalidEmailTeam, false,
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
                    assert.fail("Did not provide required error for invalid invitation email format input");
                }
            });
        
        });

        //test for duplicate invitations
        it('errors with invalid updated invitation email: duplicate email', function () {
            // create members of team
            Accounts.createUser(testUser1);
            Accounts.createUser(testUser2);

            // insert in a team to edit
            const id = TeamCollection.insert(testTeam);
        
            let isError = false;

            // create team object
            const invalidEmailTeam = {
                teamName: "test team",
                teamLeader: "test2@test2.com",
                teamMembers: ["test1@test1.com", "test2@test2.com"],
                teamInvitations: [{email: "test3@test3.com", token: "testToken1"}, {email: "test3@test3.com", token: "testToken2"}]
            }

            // Wrap the Meteor.call in a Promise
            new Promise((resolve, reject) => {
                Meteor.call("update_team", id, testTeam.teamInvitations, invalidEmailTeam, false,
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
                    assert.fail("Did not provide required error for duplicate invitation email input");
                }
            });
        
        });
        
        /**
         * Test case to check if a team can be deleted successfully.
         */
        it('can delete a team', function () {
            // create members of team
            Accounts.createUser(testUser1);
            Accounts.createUser(testUser2);

            // insert a collection
            const id = TeamCollection.insert(testTeam);

            // call delete method for deletion
            Meteor.call('delete_team', id, testUser1.username);

            // check deleted team is DELETED
            const deletedBooking = TeamCollection.findOne(id);
            assert.strictEqual(deletedBooking, undefined);

        });
    });
}
