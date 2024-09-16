/**
 * File Description: Task database testing
 * File version: 1.0
 * Contributors: Nikki, Audrey
 */

import {Meteor} from "meteor/meteor";
import {Accounts} from "meteor/accounts-base";
import {resetDatabase} from 'meteor/xolvio:cleaner';
import "../imports/api/methods/task";
import TaskCollection from "../imports/api/collections/task";
import BoardCollection from "../imports/api/collections/board";
import TeamCollection from "../imports/api/collections/team";
import { generateInvitationToken } from "../imports/ui/components/util";

const assert = require('assert');

/**
 * Test suite for client-side task methods.
 */
if (Meteor.isClient) {
    /**
     * Describes test cases for task methods.
     */
    describe('Task methods', function () {

        beforeEach(function () {
            resetDatabase(); // Clear the collection before each test
        });

        const testUser = {
            username: "testUser",
            password: "testPassword",
            email: "test@test.com",
            profile: {
                name: "Test User 1",
                notificationOn: true
            }
        };

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

        const testTeamData = {
            teamName: "test team",
            teamLeader: "test1@test1.com",
            teamMembers: ["test2@test2.com"],
            teamInvitations: [
                {email: "test2@test2.com", token: "testToken1"}]
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

        const testPinnedTaskData = {
            taskName: "test task",
            taskDesc: "test description",
            taskDeadlineDate: "2024-12-05T17:55:00.000Z",
            taskIsPinned: true,
            taskPinnedDate: new Date(),
            boardId: "", // added dynamically during test cases
            statusName: "Done",
            tagNames: ["a", "b"],
            contributions: [{email: "test@test.com", percent: 12}],
        }

        /**
         * Test case to check if a task can be added successfully.
         */
        it('can add a pinned task', function () {

            // create test user for logging username
            Accounts.createUser(testUser);
            const teamId = TeamCollection.insert(testTeamData);
            testBoard.teamId = teamId;
            // insert board which task belongs to
            const boardId = BoardCollection.insert(testBoard);
            testPinnedTaskData.boardId = boardId;
            testPinnedTaskData._id = null;

            // Wrap the Meteor.call in a Promise
            return new Promise((resolve, reject) => {
                Meteor.call("insert_task", testPinnedTaskData, testUser.username,
                    (error, taskId) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(taskId);
                        }
                    }
                );
            }).then(taskId => {
                // check task ID is NOT undefined
                assert.notStrictEqual(taskId, undefined);
                // find task object and check it is not null
                const task = TaskCollection.findOne(taskId);
                assert.notStrictEqual(task, null);
            }).catch(error => {
                assert.fail("Error adding task. Returned with error:" + error.message);
            });
        }).timeout(10000);

        it('can add an unpinned task', function () {

            // create test user for logging username
            Accounts.createUser(testUser);
            const teamId = TeamCollection.insert(testTeamData);
            testBoard.teamId = teamId;
            // insert board which task belongs to
            const boardId = BoardCollection.insert(testBoard);
            testUnpinnedTaskData.boardId = boardId;
            testUnpinnedTaskData._id = null;

            // Wrap the Meteor.call in a Promise
            return new Promise((resolve, reject) => {
                Meteor.call("insert_task", testUnpinnedTaskData, testUser.username,
                    (error, taskId) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(taskId);
                        }
                    }
                );
            }).then(taskId => {
                // check task ID is NOT undefined
                assert.notStrictEqual(taskId, undefined);
                // find task object and check it is not null
                const task = TaskCollection.findOne(taskId);
                assert.notStrictEqual(task, null);
            }).catch(error => {
                assert.fail("Error adding task. Returned with error:" + error.message);
            });
        }).timeout(10000);

        //test for empty task name
        it('errors with invalid task name: empty name', function () {
            // create test user for logging username
            Accounts.createUser(testUser);
            const teamId = TeamCollection.insert(testTeamData);
            testBoard.teamId = teamId;
            // insert board which task belongs to
            const boardId = BoardCollection.insert(testBoard);
            testUnpinnedTaskData.boardId = boardId;
            testUnpinnedTaskData._id = null;
            let isError = false;

            const addedTask = {
                taskName: "",
                taskDesc: testUnpinnedTaskData.taskDesc,
                taskDeadlineDate: testUnpinnedTaskData.taskDeadlineDate,
                taskIsPinned: testUnpinnedTaskData.taskIsPinned,
                boardId: testUnpinnedTaskData.boardId,
                statusName: testUnpinnedTaskData.statusName,
                tagNames: testUnpinnedTaskData.tagNames,
                contributions: testUnpinnedTaskData.contributions,
            }

            // Wrap the Meteor.call in a Promise
            new Promise((resolve, reject) => {
                Meteor.call("insert_task", addedTask, testUser.username,
            
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
                assert.strictEqual(error.error, "add-task-failed")
            
            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for invalid empty name input");
                }
            });
        });

        //test for invalid long team name
        it('errors with invalid name: too long name > 20 characters', function () {
            // create test user for logging username
            Accounts.createUser(testUser);
            const teamId = TeamCollection.insert(testTeamData);
            testBoard.teamId = teamId;
            // insert board which task belongs to
            const boardId = BoardCollection.insert(testBoard);
            testUnpinnedTaskData.boardId = boardId;
            testUnpinnedTaskData._id = null;

            const addedTask = {
                taskName: "tasktasktasktasktasktask",
                taskDesc: testUnpinnedTaskData.taskDesc,
                taskDeadlineDate: testUnpinnedTaskData.taskDeadlineDate,
                taskIsPinned: testUnpinnedTaskData.taskIsPinned,
                boardId: testUnpinnedTaskData.boardId,
                statusName: testUnpinnedTaskData.statusName,
                tagNames: testUnpinnedTaskData.tagNames,
                contributions: testUnpinnedTaskData.contributions,
            }
            // Wrap the Meteor.call in a Promise
            new Promise((resolve, reject) => {
                Meteor.call("insert_task", addedTask, testUser.username,
            
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
                assert.strictEqual(error.error, "add-task-failed")
            
            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for invalid name input that is too long");
                }
            });
        });
        
        //test for empty task name
        it('errors with invalid task description: empty description', function () {
            // create test user for logging username
            Accounts.createUser(testUser);
            const teamId = TeamCollection.insert(testTeamData);
            testBoard.teamId = teamId;
            // insert board which task belongs to
            const boardId = BoardCollection.insert(testBoard);
            testUnpinnedTaskData.boardId = boardId;
            testUnpinnedTaskData._id = null;
        
            let isError = false;

            const addedTask = {
                taskName: testUnpinnedTaskData.taskName,
                taskDesc: "",
                taskDeadlineDate: testUnpinnedTaskData.taskDeadlineDate,
                taskIsPinned: testUnpinnedTaskData.taskIsPinned,
                boardId: testUnpinnedTaskData.boardId,
                statusName: testUnpinnedTaskData.statusName,
                tagNames: testUnpinnedTaskData.tagNames,
                contributions: testUnpinnedTaskData.contributions,
            }

            // Wrap the Meteor.call in a Promise
            new Promise((resolve, reject) => {
                Meteor.call("insert_task", addedTask, testUser.username,
            
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
                assert.strictEqual(error.error, "add-task-failed")
            
            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for invalid empty description input");
                }
            });
        });

        //test for invalid long team name
        it('errors with invalid task description: too long description > 1000 characters', function () {
            // create test user for logging username
            Accounts.createUser(testUser);
            const teamId = TeamCollection.insert(testTeamData);
            testBoard.teamId = teamId;
            // insert board which task belongs to
            const boardId = BoardCollection.insert(testBoard);
            testUnpinnedTaskData.boardId = boardId;
            testUnpinnedTaskData._id = null;

            let isError = false;
            const longDesc = "12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890"
            const addedTask = {
                taskName: testUnpinnedTaskData.taskName,
                taskDesc: longDesc,
                taskDeadlineDate: testUnpinnedTaskData.taskDeadlineDate,
                taskIsPinned: testUnpinnedTaskData.taskIsPinned,
                boardId: testUnpinnedTaskData.boardId,
                statusName: testUnpinnedTaskData.statusName,
                tagNames: testUnpinnedTaskData.tagNames,
                contributions: testUnpinnedTaskData.contributions,
            }
            // Wrap the Meteor.call in a Promise
            new Promise((resolve, reject) => {
                Meteor.call("insert_task", addedTask, testUser.username,
            
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
                assert.strictEqual(error.error, "add-task-failed")
            
            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for invalid description input that is too long");
                }
            });
        });
        
        //test deadline related validation
        it('errors with invalid task deadline: empty deadline', function () {
            // create test user for logging username
            Accounts.createUser(testUser);
            const teamId = TeamCollection.insert(testTeamData);
            testBoard.teamId = teamId;
            // insert board which task belongs to
            const boardId = BoardCollection.insert(testBoard);
            testUnpinnedTaskData.boardId = boardId;
            testUnpinnedTaskData._id = null;

            let isError = false;
            const addedTask = {
                taskName: testUnpinnedTaskData.taskName,
                taskDesc: testUnpinnedTaskData.taskDesc,
                taskDeadlineDate: "",
                taskIsPinned: testUnpinnedTaskData.taskIsPinned,
                boardId: testUnpinnedTaskData.boardId,
                statusName: testUnpinnedTaskData.statusName,
                tagNames: testUnpinnedTaskData.tagNames,
                contributions: testUnpinnedTaskData.contributions,
            }
            // Wrap the Meteor.call in a Promise
            new Promise((resolve, reject) => {
                Meteor.call("insert_task", addedTask, testUser.username,
            
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
                assert.strictEqual(error.error, "add-task-failed")
            
            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for invalid empty deadline input");
                }
            });
        });
        
        it('errors with invalid task deadline: missing date deadline', function () {
            // create test user for logging username
            Accounts.createUser(testUser);
            const teamId = TeamCollection.insert(testTeamData);
            testBoard.teamId = teamId;
            // insert board which task belongs to
            const boardId = BoardCollection.insert(testBoard);
            testUnpinnedTaskData.boardId = boardId;
            testUnpinnedTaskData._id = null;

            let isError = false;
            const addedTask = {
                taskName: testUnpinnedTaskData.taskName,
                taskDesc: testUnpinnedTaskData.taskDesc,
                taskDeadlineDate: "T17:55:00.000Z",
                taskIsPinned: testUnpinnedTaskData.taskIsPinned,
                boardId: testUnpinnedTaskData.boardId,
                statusName: testUnpinnedTaskData.statusName,
                tagNames: testUnpinnedTaskData.tagNames,
                contributions: testUnpinnedTaskData.contributions,
            }
            // Wrap the Meteor.call in a Promise
            new Promise((resolve, reject) => {
                Meteor.call("insert_task", addedTask, testUser.username,
            
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
                assert.strictEqual(error.error, "add-task-failed")
            
            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for invalid deadline input");
                }
            });
        });

        it('errors with invalid task deadline: missing time deadline', function () {
            // create test user for logging username
            Accounts.createUser(testUser);
            const teamId = TeamCollection.insert(testTeamData);
            testBoard.teamId = teamId;
            // insert board which task belongs to
            const boardId = BoardCollection.insert(testBoard);
            testUnpinnedTaskData.boardId = boardId;
            testUnpinnedTaskData._id = null;

            let isError = false;
            const addedTask = {
                taskName: testUnpinnedTaskData.taskName,
                taskDesc: testUnpinnedTaskData.taskDesc,
                taskDeadlineDate: "2024-08-05T",
                taskIsPinned: testUnpinnedTaskData.taskIsPinned,
                boardId: testUnpinnedTaskData.boardId,
                statusName: testUnpinnedTaskData.statusName,
                tagNames: testUnpinnedTaskData.tagNames,
                contributions: testUnpinnedTaskData.contributions,
            }
            // Wrap the Meteor.call in a Promise
            new Promise((resolve, reject) => {
                Meteor.call("insert_task", addedTask, testUser.username,
            
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
                assert.strictEqual(error.error, "add-task-failed")
            
            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for invalid deadline input");
                }
            });
        });

        it('errors with invalid task contribution: total exceed 100%', function () {
            // create test user for logging username
            Accounts.createUser(testUser);
            const teamId = TeamCollection.insert(testTeamData);
            testBoard.teamId = teamId;
            // insert board which task belongs to
            const boardId = BoardCollection.insert(testBoard);
            testUnpinnedTaskData.boardId = boardId;
            testUnpinnedTaskData._id = null;

            let isError = false;
            const addedTask = {
                taskName: testUnpinnedTaskData.taskName,
                taskDesc: testUnpinnedTaskData.taskDesc,
                taskDeadlineDate: testUnpinnedTaskData.taskDeadlineDate,
                taskIsPinned: testUnpinnedTaskData.taskIsPinned,
                boardId: testUnpinnedTaskData.boardId,
                statusName: testUnpinnedTaskData.statusName,
                tagNames: testUnpinnedTaskData.tagNames,
                contributions: [{email: "test@test.com", percent: 120}]
            }
            // Wrap the Meteor.call in a Promise
            new Promise((resolve, reject) => {
                Meteor.call("insert_task", addedTask, testUser.username,
            
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
                assert.strictEqual(error.error, "add-task-failed")
            
            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for invalid contribution input");
                }
            });
        });

        it('errors with invalid board: board does not exist', function () {
            // create test user for logging username
            Accounts.createUser(testUser);
            testUnpinnedTaskData._id = null;

            let isError = false;
            const addedTask = {
                taskName: testUnpinnedTaskData.taskName,
                taskDesc: testUnpinnedTaskData.taskDesc,
                taskDeadlineDate: testUnpinnedTaskData.taskDeadlineDate,
                taskIsPinned: testUnpinnedTaskData.taskIsPinned,
                boardId: testUnpinnedTaskData.boardId,
                statusName: testUnpinnedTaskData.statusName,
                tagNames: testUnpinnedTaskData.tagNames,
                contributions: testUnpinnedTaskData.contributions
            }
            // Wrap the Meteor.call in a Promise
            new Promise((resolve, reject) => {
                Meteor.call("insert_task", addedTask, testUser.username,
            
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
                assert.strictEqual(error.error, "task-missing-board")
            
            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for non-existing board");
                }
            });
        });
        
        it('errors with invalid user: user does not exist', function () {
            const teamId = TeamCollection.insert(testTeamData);
            testBoard.teamId = teamId;
            // insert board which task belongs to
            const boardId = BoardCollection.insert(testBoard);
            testUnpinnedTaskData.boardId = boardId;
            testUnpinnedTaskData._id = null;

            let isError = false;
            const addedTask = {
                taskName: testUnpinnedTaskData.taskName,
                taskDesc: testUnpinnedTaskData.taskDesc,
                taskDeadlineDate: testUnpinnedTaskData.taskDeadlineDate,
                taskIsPinned: testUnpinnedTaskData.taskIsPinned,
                boardId: testUnpinnedTaskData.boardId,
                statusName: testUnpinnedTaskData.statusName,
                tagNames: testUnpinnedTaskData.tagNames,
                contributions: testUnpinnedTaskData.contributions
            }
            // Wrap the Meteor.call in a Promise
            new Promise((resolve, reject) => {
                Meteor.call("insert_task", addedTask, testUser.username,
            
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
                assert.strictEqual(error.error, "task-missing-user")
            
            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for non-existing user");
                }
            });
        });

        /**
         * Test case to check if a task can be updated successfully.
         */
        it('can update task details', function () {

            // create test user for logging username
            Accounts.createUser(testUser);
            const teamId = TeamCollection.insert(testTeamData);
            // insert board which task belongs to
            const boardId = BoardCollection.insert(testBoard);
            testBoard.teamId = teamId;
            testPinnedTaskData.boardId = boardId;
            testPinnedTaskData._id = "TestId";

            // insert in a team to edit
            const taskId = TaskCollection.insert(testPinnedTaskData);

            // create edited task object
            const editedTask = {
                _id: "TestId",
                taskName: "test task new",
                taskDesc: "test description new",
                taskDeadlineDate: "2024-10-06T17:55:00.000Z",
                taskIsPinned: false,
                boardId: boardId, // added dynamically during test cases
                statusName: "To Do",
                tagNames: ["a", "c", "d"],
                contributions: [{email: "new1@test.com", percent: 22}, {email: "new2@test.com", percent: 62}],
            }

            // call update method
            Meteor.call('update_task', taskId, editedTask, testUser.username);

            // get updated team object and check all updated
            const updatedTask = TaskCollection.findOne(taskId);
            assert.strictEqual(updatedTask.taskName, "test task new");
            assert.strictEqual(updatedTask.taskDesc, "test description new");
            assert.strictEqual(updatedTask.taskDeadlineDate, "2024-10-06T17:55:00.000Z");
            assert.strictEqual(updatedTask.taskIsPinned, false);
            assert.strictEqual(updatedTask.taskPinnedDate, null);
            assert.strictEqual(updatedTask.boardId, boardId);
            assert.strictEqual(updatedTask.statusName, "To Do");
            assert.deepEqual(updatedTask.tagNames, ["a", "c", "d"]);
            assert.deepEqual(updatedTask.contributions, [
                {email: "new1@test.com", percent: 22}, {email: "new2@test.com", percent: 62}]);

        });

        // todo: here add test cases for EACH input being invalid for UPDATING a task
        //test for empty task name
        it('errors with invalid updated task name: empty name', function () {
            // create test user for logging username
            Accounts.createUser(testUser);
            const teamId = TeamCollection.insert(testTeamData);
            // insert board which task belongs to
            const boardId = BoardCollection.insert(testBoard);
            testBoard.teamId = teamId;
            testPinnedTaskData.boardId = boardId;
            testPinnedTaskData._id = "TestId";

            // insert in a team to edit
            const taskId = TaskCollection.insert(testPinnedTaskData);

            const editedTask = {
                _id: "TestId",
                taskName: "",
                taskDesc: "test description new",
                taskDeadlineDate: "2024-10-06T17:55:00.000Z",
                taskIsPinned: false,
                boardId: boardId, // added dynamically during test cases
                statusName: "To Do",
                tagNames: ["a", "c", "d"],
                contributions: [{email: "new1@test.com", percent: 22}, {email: "new2@test.com", percent: 62}],
            }

            // Wrap the Meteor.call in a Promise
            new Promise((resolve, reject) => {
                Meteor.call("update_task", taskId, editedTask, testUser.username,
            
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
                assert.strictEqual(error.error, "update-task-failed")
            
            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for invalid empty name input");
                }
            });
        });

        //test for invalid long team name
        it('errors with invalid updated name: too long name > 20 characters', function () {
            // create test user for logging username
            Accounts.createUser(testUser);
            const teamId = TeamCollection.insert(testTeamData);
            // insert board which task belongs to
            const boardId = BoardCollection.insert(testBoard);
            testBoard.teamId = teamId;
            testPinnedTaskData.boardId = boardId;
            testPinnedTaskData._id = "TestId";

            // insert in a team to edit
            const taskId = TaskCollection.insert(testPinnedTaskData);

            // create edited task object
            const editedTask = {
                _id: "TestId",
                taskName: "tasktasktasktasktasktask",
                taskDesc: "test description new",
                taskDeadlineDate: "2024-10-06T17:55:00.000Z",
                taskIsPinned: false,
                boardId: boardId, // added dynamically during test cases
                statusName: "To Do",
                tagNames: ["a", "c", "d"],
                contributions: [{email: "new1@test.com", percent: 22}, {email: "new2@test.com", percent: 62}],
            }

            // Wrap the Meteor.call in a Promise
            new Promise((resolve, reject) => {
                Meteor.call("update_task", editedTask, testUser.username,
            
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
                assert.strictEqual(error.error, "update-task-failed")
            
            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for invalid name input that is too long");
                }
            });
        });
        
        //test for empty task name
        it('errors with invalid updated task description: empty description', function () {
            // create test user for logging username
            Accounts.createUser(testUser);
            const teamId = TeamCollection.insert(testTeamData);
            // insert board which task belongs to
            const boardId = BoardCollection.insert(testBoard);
            testBoard.teamId = teamId;
            testPinnedTaskData.boardId = boardId;
            testPinnedTaskData._id = "TestId";

            // insert in a team to edit
            const taskId = TaskCollection.insert(testPinnedTaskData);

            // create edited task object
            const editedTask = {
                _id: "TestId",
                taskName: "test task new",
                taskDesc: "",
                taskDeadlineDate: "2024-10-06T17:55:00.000Z",
                taskIsPinned: false,
                boardId: boardId, // added dynamically during test cases
                statusName: "To Do",
                tagNames: ["a", "c", "d"],
                contributions: [{email: "new1@test.com", percent: 22}, {email: "new2@test.com", percent: 62}],
            }

            // Wrap the Meteor.call in a Promise
            new Promise((resolve, reject) => {
                Meteor.call("update_task", taskId, editedTask, testUser.username,
            
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
                assert.strictEqual(error.error, "update-task-failed")
            
            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for invalid empty description input");
                }
            });
        });

        //test for invalid long team name
        it('errors with invalid updated task description: too long description > 1000 characters', function () {
            // create test user for logging username
            Accounts.createUser(testUser);
            const teamId = TeamCollection.insert(testTeamData);
            // insert board which task belongs to
            const boardId = BoardCollection.insert(testBoard);
            testBoard.teamId = teamId;
            testPinnedTaskData.boardId = boardId;
            testPinnedTaskData._id = "TestId";

            // insert in a team to edit
            const taskId = TaskCollection.insert(testPinnedTaskData);
            const longDesc = "12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890"
            // create edited task object
            const editedTask = {
                _id: "TestId",
                taskName: "test task new",
                taskDesc: longDesc,
                taskDeadlineDate: "2024-10-06T17:55:00.000Z",
                taskIsPinned: false,
                boardId: boardId, // added dynamically during test cases
                statusName: "To Do",
                tagNames: ["a", "c", "d"],
                contributions: [{email: "new1@test.com", percent: 22}, {email: "new2@test.com", percent: 62}],
            }
            // Wrap the Meteor.call in a Promise
            new Promise((resolve, reject) => {
                Meteor.call("update_task", taskId, editedTask, testUser.username,
            
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
                assert.strictEqual(error.error, "update-task-failed")
            
            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for invalid description input that is too long");
                }
            });
        });
        
        //test deadline related validation
        it('errors with invalid updated task deadline: empty deadline', function () {
            // create test user for logging username
            Accounts.createUser(testUser);
            const teamId = TeamCollection.insert(testTeamData);
            // insert board which task belongs to
            const boardId = BoardCollection.insert(testBoard);
            testBoard.teamId = teamId;
            testPinnedTaskData.boardId = boardId;
            testPinnedTaskData._id = "TestId";

            // insert in a team to edit
            const taskId = TaskCollection.insert(testPinnedTaskData);

            // create edited task object
            const editedTask = {
                _id: "TestId",
                taskName: "test task new",
                taskDesc: "test description new",
                taskDeadlineDate: "",
                taskIsPinned: false,
                boardId: boardId, // added dynamically during test cases
                statusName: "To Do",
                tagNames: ["a", "c", "d"],
                contributions: [{email: "new1@test.com", percent: 22}, {email: "new2@test.com", percent: 62}],
            }
            // Wrap the Meteor.call in a Promise
            new Promise((resolve, reject) => {
                Meteor.call("update_task", taskId, editedTask, testUser.username,
            
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
                assert.strictEqual(error.error, "update-task-failed")
            
            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for invalid empty deadline input");
                }
            });
        });
        
        it('errors with invalid updated task deadline: missing date deadline', function () {
            // create test user for logging username
            Accounts.createUser(testUser);
            const teamId = TeamCollection.insert(testTeamData);
            // insert board which task belongs to
            const boardId = BoardCollection.insert(testBoard);
            testBoard.teamId = teamId;
            testPinnedTaskData.boardId = boardId;
            testPinnedTaskData._id = "TestId";

            // insert in a team to edit
            const taskId = TaskCollection.insert(testPinnedTaskData);

            // create edited task object
            const editedTask = {
                _id: "TestId",
                taskName: "test task new",
                taskDesc: "test description new",
                taskDeadlineDate: "T17:55:00.000Z",
                taskIsPinned: false,
                boardId: boardId, // added dynamically during test cases
                statusName: "To Do",
                tagNames: ["a", "c", "d"],
                contributions: [{email: "new1@test.com", percent: 22}, {email: "new2@test.com", percent: 62}],
            }

            // Wrap the Meteor.call in a Promise
            new Promise((resolve, reject) => {
                Meteor.call("update_task", taskId, editedTask, testUser.username,
            
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
                assert.strictEqual(error.error, "update-task-failed")
            
            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for invalid deadline input");
                }
            });
        });

        it('errors with invalid updated task deadline: missing time deadline', function () {
            // create test user for logging username
            Accounts.createUser(testUser);
            const teamId = TeamCollection.insert(testTeamData);
            // insert board which task belongs to
            const boardId = BoardCollection.insert(testBoard);
            testBoard.teamId = teamId;
            testPinnedTaskData.boardId = boardId;
            testPinnedTaskData._id = "TestId";

            // insert in a team to edit
            const taskId = TaskCollection.insert(testPinnedTaskData);

            // create edited task object
            const editedTask = {
                _id: "TestId",
                taskName: "test task new",
                taskDesc: "test description new",
                taskDeadlineDate: "2024-10-06T",
                taskIsPinned: false,
                boardId: boardId, // added dynamically during test cases
                statusName: "To Do",
                tagNames: ["a", "c", "d"],
                contributions: [{email: "new1@test.com", percent: 22}, {email: "new2@test.com", percent: 62}],
            }

            // Wrap the Meteor.call in a Promise
            new Promise((resolve, reject) => {
                Meteor.call("update_task", taskId, editedTask, testUser.username,
            
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
                assert.strictEqual(error.error, "update-task-failed")
            
            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for invalid deadline input");
                }
            });
        });

        it('errors with invalid updated task contribution: total exceed 100%', function () {
            // create test user for logging username
            Accounts.createUser(testUser);
            const teamId = TeamCollection.insert(testTeamData);
            // insert board which task belongs to
            const boardId = BoardCollection.insert(testBoard);
            testBoard.teamId = teamId;
            testPinnedTaskData.boardId = boardId;
            testPinnedTaskData._id = "TestId";

            // insert in a team to edit
            const taskId = TaskCollection.insert(testPinnedTaskData);

            // create edited task object
            const editedTask = {
                _id: "TestId",
                taskName: "test task new",
                taskDesc: "test description new",
                taskDeadlineDate: "2024-10-06T17:55:00.000Z",
                taskIsPinned: false,
                boardId: boardId, // added dynamically during test cases
                statusName: "To Do",
                tagNames: ["a", "c", "d"],
                contributions: [{email: "new1@test.com", percent: 220}, {email: "new2@test.com", percent: 62}],
            }

            // Wrap the Meteor.call in a Promise
            new Promise((resolve, reject) => {
                Meteor.call("update_task", taskId, editedTask, testUser.username,
            
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
                assert.strictEqual(error.error, "update-task-failed")
            
            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for invalid contribution input");
                }
            });
        });

        it('errors with invalid board: board does not exist', function () {
            // create test user for logging username
            Accounts.createUser(testUser);
            testUnpinnedTaskData._id = null;
            const taskId = TaskCollection.insert(testPinnedTaskData);

            // create edited task object
            const editedTask = {
                _id: "TestId",
                taskName: "test task new",
                taskDesc: "test description new",
                taskDeadlineDate: "2024-10-06T17:55:00.000Z",
                taskIsPinned: false,
                boardId: "boardId", // added dynamically during test cases
                statusName: "To Do",
                tagNames: ["a", "c", "d"],
                contributions: [{email: "new1@test.com", percent: 22}, {email: "new2@test.com", percent: 62}],
            }

            // Wrap the Meteor.call in a Promise
            new Promise((resolve, reject) => {
                Meteor.call("update_task", taskId, editedTask, testUser.username,
            
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
                assert.strictEqual(error.error, "task-missing-board")
            
            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for non-existing board");
                }
            });
        });
        
        it('errors with invalid user: user does not exist', function () {
            const teamId = TeamCollection.insert(testTeamData);
            testBoard.teamId = teamId;
            // insert board which task belongs to
            const boardId = BoardCollection.insert(testBoard);
            testUnpinnedTaskData.boardId = boardId;
            testUnpinnedTaskData._id = null;
            const taskId = TaskCollection.insert(testPinnedTaskData);

            const editedTask = {
                _id: "TestId",
                taskName: "test task new",
                taskDesc: "test description new",
                taskDeadlineDate: "2024-10-06T17:55:00.000Z",
                taskIsPinned: false,
                boardId: boardId, // added dynamically during test cases
                statusName: "To Do",
                tagNames: ["a", "c", "d"],
                contributions: [{email: "new1@test.com", percent: 22}, {email: "new2@test.com", percent: 62}],
            }
            // Wrap the Meteor.call in a Promise
            new Promise((resolve, reject) => {
                Meteor.call("update_task", taskId, editedTask, testUser.username,
            
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
                assert.strictEqual(error.error, "task-missing-user")
            
            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for non-existing user");
                }
            });
        });

        /**
         * Test case to check if a task can be deleted successfully.
         */
        it('can delete task', function () {

            // create test user for logging username
            Accounts.createUser(testUser);
            const teamId = TeamCollection.insert(testTeamData);
            // insert board which task belongs to
            const boardId = BoardCollection.insert(testBoard);
            testBoard.teamId = teamId;
            testPinnedTaskData.boardId = boardId;

            // insert a collection to delete
            const taskId = TaskCollection.insert(testPinnedTaskData);

            // call delete method for deletion
            Meteor.call('delete_task', taskId, testUser.username);

            // check deleted team is DELETED
            const deletedTask = TaskCollection.findOne(taskId);
            assert.strictEqual(deletedTask, undefined);
        });

        /**
         * Test case to check if a task can be deleted successfully.
         */
        it('errors on deleting nonexistent task', function () {

            // create test user for logging username
            Accounts.createUser(testUser);

            // call delete method for deletion
            return new Promise((resolve, reject) => {
                Meteor.call('delete_task', "nonexistentId", testUser.username, (error) => {
                    if (error) {
                        resolve(error)

                    } else {
                        reject()
                    }
                });
            }).then((resolvedError) => {
                assert.strictEqual(resolvedError.error, "task-delete-failed");
                assert.strictEqual(resolvedError.reason, "Task not found");

            }).catch(() => {
                assert.fail("Deleting a nonexistent task did NOT give an error");
            })

        }).timeout(1000000);


    });
}
