/**
 * File Description: Task database testing
 * File version: 1.0
 * Contributors: Nikki, Audrey
 */

import {Meteor} from "meteor/meteor";
import {Accounts} from "meteor/accounts-base";
import {resetDatabase} from 'meteor/xolvio:cleaner';
import TaskCollection from "../imports/api/collections/task";
import BoardCollection from "../imports/api/collections/board";
import TeamCollection from "../imports/api/collections/team";
import "../imports/api/methods/task";

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
                {"statusName": "Done", "statusOrder": 2},
                {"statusName": "test", "statusOrder": 3}
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

        const testTask = {
            taskName: "test",
            taskDesc: "test",
            taskDeadlineDate: "2024-12-05T17:55:00.000Z",
            taskIsPinned: false,
            boardId: "",
            statusName: "test",
            tagNames: ["test1"],
            contributions: [{email: "test@test.com", percent: 12}],
        }

        /**
         * Test case to check if a task can be added successfully.
         */
        it('can add a pinned task', function () {

            // create test user for logging username
            Accounts.createUser(testUser);
            // create team for board
            const teamId = TeamCollection.insert(testTeamData);
            testBoard.teamId = teamId;
            // create board for task
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
            // create team for board
            const teamId = TeamCollection.insert(testTeamData);
            testBoard.teamId = teamId;
            // create board for task
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

        // test for empty task name
        it('errors with invalid task name: empty name', function () {
            // create test user for logging username
            Accounts.createUser(testUser);
            // create team for board
            const teamId = TeamCollection.insert(testTeamData);
            testBoard.teamId = teamId;
            // create board for task
            const boardId = BoardCollection.insert(testBoard);
            testUnpinnedTaskData.boardId = boardId;

            let isError = false;

            const addedTask = {
                _id: null,
                taskName: '',
                taskDesc: testUnpinnedTaskData.taskDesc,
                taskDeadlineDate: testUnpinnedTaskData.taskDeadlineDate,
                taskIsPinned: testUnpinnedTaskData.taskIsPinned,
                boardId: testUnpinnedTaskData.boardId,
                statusName: testUnpinnedTaskData.statusName,
                tagNames: testUnpinnedTaskData.tagNames,
                contributions: testUnpinnedTaskData.contributions,
            }

            // Wrap the Meteor.call in a Promise
            return new Promise((resolve, reject) => {
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
                assert.strictEqual(error.reason, "Invalid name input")
            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for invalid empty name input");
                }
            });
        }).timeout(10000);

        //test for invalid long team name
        it('errors with invalid name: too long name > 100 characters', function () {
            // create test user for logging username
            Accounts.createUser(testUser);
            // create team for board
            const teamId = TeamCollection.insert(testTeamData);
            testBoard.teamId = teamId;
            // create board for task
            const boardId = BoardCollection.insert(testBoard);
            testUnpinnedTaskData.boardId = boardId;

            testUnpinnedTaskData._id = null;
            let isError = false;

            const addedTask = {
                _id: null,
                taskName: "a".repeat(101),
                taskDesc: testUnpinnedTaskData.taskDesc,
                taskDeadlineDate: testUnpinnedTaskData.taskDeadlineDate,
                taskIsPinned: testUnpinnedTaskData.taskIsPinned,
                boardId: testUnpinnedTaskData.boardId,
                statusName: testUnpinnedTaskData.statusName,
                tagNames: testUnpinnedTaskData.tagNames,
                contributions: testUnpinnedTaskData.contributions,
            }
            // Wrap the Meteor.call in a Promise
            return new Promise((resolve, reject) => {
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
                assert.strictEqual(error.reason, "Invalid name input")

            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for invalid name input that is too long");
                }
            });
        }).timeout(10000);
        
        //test for empty task name
        it('errors with invalid task description: empty description', function () {
            // create test user for logging username
            Accounts.createUser(testUser);
            // create team for board
            const teamId = TeamCollection.insert(testTeamData);
            testBoard.teamId = teamId;
            // create board for task
            const boardId = BoardCollection.insert(testBoard);
            testUnpinnedTaskData.boardId = boardId;

            testUnpinnedTaskData._id = null;
        
            let isError = false;

            const addedTask = {
                _id: null,
                taskName: testUnpinnedTaskData.taskName,
                taskDesc: '',
                taskDeadlineDate: testUnpinnedTaskData.taskDeadlineDate,
                taskIsPinned: testUnpinnedTaskData.taskIsPinned,
                boardId: testUnpinnedTaskData.boardId,
                statusName: testUnpinnedTaskData.statusName,
                tagNames: testUnpinnedTaskData.tagNames,
                contributions: testUnpinnedTaskData.contributions,
            }

            // Wrap the Meteor.call in a Promise
            return new Promise((resolve, reject) => {
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
                assert.strictEqual(error.reason, "Invalid description input")

            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for invalid empty description input");
                }
            });
        }).timeout(10000);

        //test for invalid long team name
        it('errors with invalid task description: too long description > 1000 characters', function () {
            // create test user for logging username
            Accounts.createUser(testUser);
            // create team for board
            const teamId = TeamCollection.insert(testTeamData);
            testBoard.teamId = teamId;
            // create board for task
            const boardId = BoardCollection.insert(testBoard);
            testUnpinnedTaskData.boardId = boardId;

            testUnpinnedTaskData._id = null;

            let isError = false;

            const longDesc = "a".repeat(1001)
            const addedTask = {
                _id: null,
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
            return new Promise((resolve, reject) => {
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
                assert.strictEqual(error.reason, "Invalid description input")

            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for invalid description input that is too long");
                }
            });
        }).timeout(10000);
        
        //test deadline related validation
        it('errors with invalid task deadline: empty deadline', function () {
            // create test user for logging username
            Accounts.createUser(testUser);
            // create team for board
            const teamId = TeamCollection.insert(testTeamData);
            testBoard.teamId = teamId;
            // create board for task
            const boardId = BoardCollection.insert(testBoard);
            testUnpinnedTaskData.boardId = boardId;

            testUnpinnedTaskData._id = null;

            let isError = false;
            const addedTask = {
                _id: null,
                taskName: testUnpinnedTaskData.taskName,
                taskDesc: testUnpinnedTaskData.taskDesc,
                taskDeadlineDate: '',
                taskIsPinned: testUnpinnedTaskData.taskIsPinned,
                boardId: testUnpinnedTaskData.boardId,
                statusName: testUnpinnedTaskData.statusName,
                tagNames: testUnpinnedTaskData.tagNames,
                contributions: testUnpinnedTaskData.contributions,
            }
            // Wrap the Meteor.call in a Promise
            return new Promise((resolve, reject) => {
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
                assert.strictEqual(error.reason, "Invalid date-time input")

            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for invalid empty deadline input");
                }
            });
        }).timeout(10000);
        
        it('errors with invalid task deadline: incorrect deadline date time format', function () {
            // create test user for logging username
            Accounts.createUser(testUser);
            // create team for board
            const teamId = TeamCollection.insert(testTeamData);
            testBoard.teamId = teamId;
            // create board for task
            const boardId = BoardCollection.insert(testBoard);
            testUnpinnedTaskData.boardId = boardId;

            testUnpinnedTaskData._id = null;

            let isError = false;
            const addedTask = {
                _id: null,
                taskName: testUnpinnedTaskData.taskName,
                taskDesc: testUnpinnedTaskData.taskDesc,
                taskDeadlineDate: "invalid date string",
                taskIsPinned: testUnpinnedTaskData.taskIsPinned,
                boardId: testUnpinnedTaskData.boardId,
                statusName: testUnpinnedTaskData.statusName,
                tagNames: testUnpinnedTaskData.tagNames,
                contributions: testUnpinnedTaskData.contributions,
            }
            // Wrap the Meteor.call in a Promise
            return new Promise((resolve, reject) => {
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
                assert.strictEqual(error.reason, "Invalid date-time input")

            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for invalid deadline input");
                }
            });
        }).timeout(10000);

        it('errors with invalid task contribution: total exceed 100%', function () {
            // create test user for logging username
            Accounts.createUser(testUser);
            // create team for board
            const teamId = TeamCollection.insert(testTeamData);
            testBoard.teamId = teamId;
            // create board for task
            const boardId = BoardCollection.insert(testBoard);
            testUnpinnedTaskData.boardId = boardId;

            testUnpinnedTaskData._id = null;

            let isError = false;
            const addedTask = {
                _id: null,
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
            return new Promise((resolve, reject) => {
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
                assert.strictEqual(error.reason, "Invalid contribution input")

            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for invalid contribution input");
                }
            });
        }).timeout(10000);

        it('errors with invalid board: board does not exist', function () {
            // create test user for logging username
            Accounts.createUser(testUser);

            testUnpinnedTaskData._id = null;

            let isError = false;
            const addedTask = {
                _id: null,
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
            return new Promise((resolve, reject) => {
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
                assert.strictEqual(error.reason, "Could not retrieve board information")

            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for non-existing board");
                }
            });
        }).timeout(10000);
        
        /**
         * Test case to check if a task can be updated successfully.
         */
        it('can update task details', function () {
            // create test user for logging username
            Accounts.createUser(testUser);
            // create team for board
            const teamId = TeamCollection.insert(testTeamData);
            testBoard.teamId = teamId;
            // create board for task
            const boardId = BoardCollection.insert(testBoard);
            testPinnedTaskData.boardId = boardId;

            testPinnedTaskData._id = "TestId2";

            // insert in a team to edit
            const taskId = TaskCollection.insert(testPinnedTaskData);

            // create edited task object
            const editedTask = {
                _id: "TestId2",
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

        //test for empty task name
        it('errors with invalid updated task name: empty name', function () {
            // create test user for logging username
            Accounts.createUser(testUser);
            // create team for board
            const teamId = TeamCollection.insert(testTeamData);
            testBoard.teamId = teamId;
            // create board for task
            const boardId = BoardCollection.insert(testBoard);
            testPinnedTaskData.boardId = boardId;

            testPinnedTaskData._id = "TestId";

            // insert in a team to edit
            const taskId = TaskCollection.insert(testPinnedTaskData);

            let isError = false;
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
            return new Promise((resolve, reject) => {
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
                assert.strictEqual(error.reason, "Invalid name input")

            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for invalid empty name input");
                }
            });
        }).timeout(10000);

        //test for invalid long team name
        it('errors with invalid updated name: too long name > 100 characters', function () {
            // create test user for logging username
            Accounts.createUser(testUser);
            // create team for board
            const teamId = TeamCollection.insert(testTeamData);
            testBoard.teamId = teamId;
            // create board for task
            const boardId = BoardCollection.insert(testBoard);
            testPinnedTaskData.boardId = boardId;

            testPinnedTaskData._id = "TestId";

            // insert in a team to edit
            const taskId = TaskCollection.insert(testPinnedTaskData);

            // create edited task object
            let isError = false;
            const editedTask = {
                _id: "TestId",
                taskName: "a".repeat(101),
                taskDesc: "test description new",
                taskDeadlineDate: "2024-10-06T17:55:00.000Z",
                taskIsPinned: false,
                boardId: boardId, // added dynamically during test cases
                statusName: "To Do",
                tagNames: ["a", "c", "d"],
                contributions: [{email: "new1@test.com", percent: 22}, {email: "new2@test.com", percent: 62}],
            }

            // Wrap the Meteor.call in a Promise
            return new Promise((resolve, reject) => {
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
                assert.strictEqual(error.reason, "Invalid name input")

            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for invalid name input that is too long");
                }
            });
        }).timeout(10000);
        
        //test for empty task name
        it('errors with invalid updated task description: empty description', function () {
            // create test user for logging username
            Accounts.createUser(testUser);
            // create team for board
            const teamId = TeamCollection.insert(testTeamData);
            testBoard.teamId = teamId;
            // create board for task
            const boardId = BoardCollection.insert(testBoard);
            testPinnedTaskData.boardId = boardId;

            testPinnedTaskData._id = "TestId";

            // insert in a team to edit
            const taskId = TaskCollection.insert(testPinnedTaskData);

            // create edited task object
            let isError = false;
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
            return new Promise((resolve, reject) => {
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
                assert.strictEqual(error.reason, "Invalid description input")

            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for invalid empty description input");
                }
            });
        }).timeout(10000);

        //test for invalid long team name
        it('errors with invalid updated task description: too long description > 1000 characters', function () {
            // create test user for logging username
            Accounts.createUser(testUser);
            // create team for board
            const teamId = TeamCollection.insert(testTeamData);
            testBoard.teamId = teamId;
            // create board for task
            const boardId = BoardCollection.insert(testBoard);
            testPinnedTaskData.boardId = boardId;

            testPinnedTaskData._id = "TestId";

            // insert in a team to edit
            const taskId = TaskCollection.insert(testPinnedTaskData);
            const longDesc = "a".repeat(1001)
            // create edited task object
            let isError = false;
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
            return new Promise((resolve, reject) => {
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
                assert.strictEqual(error.reason, "Invalid description input")

            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for invalid description input that is too long");
                }
            });
        }).timeout(10000);
        
        //test deadline related validation
        it('errors with invalid updated task deadline: empty deadline', function () {
            // create test user for logging username
            Accounts.createUser(testUser);
            // create team for board
            const teamId = TeamCollection.insert(testTeamData);
            testBoard.teamId = teamId;
            // create board for task
            const boardId = BoardCollection.insert(testBoard);
            testPinnedTaskData.boardId = boardId;

            testPinnedTaskData._id = "TestId";

            // insert in a team to edit
            const taskId = TaskCollection.insert(testPinnedTaskData);

            // create edited task object
            let isError = false;
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
            return new Promise((resolve, reject) => {
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
                assert.strictEqual(error.reason, "Invalid date-time input")

            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for invalid empty deadline input");
                }
            });
        }).timeout(10000);
        
        it('errors with invalid updated task deadline: incorrect deadline date time format', function () {
            // create test user for logging username
            Accounts.createUser(testUser);
            // create team for board
            const teamId = TeamCollection.insert(testTeamData);
            testBoard.teamId = teamId;
            // create board for task
            const boardId = BoardCollection.insert(testBoard);
            testPinnedTaskData.boardId = boardId;

            testPinnedTaskData._id = "TestId";

            // insert in a team to edit
            const taskId = TaskCollection.insert(testPinnedTaskData);

            // create edited task object
            let isError = false;
            const editedTask = {
                _id: "TestId",
                taskName: "test task new",
                taskDesc: "test description new",
                taskDeadlineDate: "invalid datetime string",
                taskIsPinned: false,
                boardId: boardId, // added dynamically during test cases
                statusName: "To Do",
                tagNames: ["a", "c", "d"],
                contributions: [{email: "new1@test.com", percent: 22}, {email: "new2@test.com", percent: 62}],
            }

            // Wrap the Meteor.call in a Promise
            return new Promise((resolve, reject) => {
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
                assert.strictEqual(error.reason, "Invalid date-time input")

            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for invalid deadline input");
                }
            });
        }).timeout(10000);

        it('errors with invalid updated task contribution: total exceed 100%', function () {
            // create test user for logging username
            Accounts.createUser(testUser);
            // create team for board
            const teamId = TeamCollection.insert(testTeamData);
            testBoard.teamId = teamId;
            // create board for task
            const boardId = BoardCollection.insert(testBoard);
            testPinnedTaskData.boardId = boardId;

            testPinnedTaskData._id = "TestId";

            // insert in a team to edit
            const taskId = TaskCollection.insert(testPinnedTaskData);

            // create edited task object
            let isError = false;
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
            return new Promise((resolve, reject) => {
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
                assert.strictEqual(error.reason, "Invalid contribution input")

            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for invalid contribution input");
                }
            });
        }).timeout(10000);

        it('errors with update to invalid board: board does not exist', function () {
            // create test user for logging username
            Accounts.createUser(testUser);
            testUnpinnedTaskData._id = null;
            const taskId = TaskCollection.insert(testPinnedTaskData);

            // create edited task object
            let isError = false;
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
            return new Promise((resolve, reject) => {
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
                assert.strictEqual(error.reason, "Could not retrieve board information")

            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for non-existing board");
                }
            });
        }).timeout(10000);


        /**
         * Test case to check if a task can be deleted successfully.
         */
        it('can delete task', function () {

            // create test user for logging username
            Accounts.createUser(testUser);
            // create team for board
            const teamId = TeamCollection.insert(testTeamData);
            testBoard.teamId = teamId;
            // create board for task
            const boardId = BoardCollection.insert(testBoard);
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
         * Test case to check if a task can be pinned successfully.
         */
        it('can pin task', function () {

            // create test user for logging username
            Accounts.createUser(testUser);
            // create team for board
            const teamId = TeamCollection.insert(testTeamData);
            testBoard.teamId = teamId;
            // create board for task
            const boardId = BoardCollection.insert(testBoard);
            testUnpinnedTaskData.boardId = boardId;

            testUnpinnedTaskData._id = "testtestest";

            // insert in a team to edit
            const taskId = TaskCollection.insert(testUnpinnedTaskData);
            const testTask = TaskCollection.findOne(taskId);
            // Wrap the Meteor.call in a Promise
            return new Promise((resolve, reject) => {
                Meteor.call("set_is_pinned", taskId, true, testUser.username,
                    (error, taskAfter)=>{
                    if (error) {
                        reject(error);
                    } else {
                        resolve(taskAfter);
                    }
                });
            })
            .then((taskAfter) => {
                if (!taskAfter) {
                    assert.fail("Task not found after pinning");
                }
                assert.strictEqual(taskAfter.taskIsPinned, true);
                assert.notStrictEqual(taskAfter.taskPinnedDate, null);
            })
            .catch((error) => {
                assert.fail("Error for pinning task: " + error.message);
            })
        }).timeout(10000);

        /**
         * Test case to check if a task can be unpinned successfully.
         */
        it('can unpin task', function () {

            // create test user for logging username
            Accounts.createUser(testUser);
            // create team for board
            const teamId = TeamCollection.insert(testTeamData);
            testBoard.teamId = teamId;
            // create board for task
            const boardId = BoardCollection.insert(testBoard);
            testPinnedTaskData.boardId = boardId;

            testPinnedTaskData._id = "teestttttttttttttttestt";

            // insert in a team to edit
            const taskId = TaskCollection.insert(testPinnedTaskData);
            // Wrap the Meteor.call in a Promise
            return new Promise((resolve, reject) => {
                Meteor.call("set_is_pinned", taskId, false, testUser.username,
                    (error, taskAfter)=>{
                    if (error) {
                        reject(error);
                    } else {
                        resolve(taskAfter);
                    }
                });
            })
            .then((taskAfter) => {
                if (!taskAfter) {
                        assert.fail("Task not found after unpinning");
                    }
                assert.strictEqual(taskAfter.taskIsPinned, false);
                assert.strictEqual(taskAfter.taskPinnedDate, null);
            })
            .catch((error) => {
                assert.fail("Error for unpinning task: " + error.message);
            })
        }).timeout(10000);
        
        /**
         * Test case to check if a task can be unpinned successfully.
         */
        it('can remove tags and status', function () {

            // create test user for logging username
            Accounts.createUser(testUser);
            // create team for board
            const teamId = TeamCollection.insert(testTeamData);
            testBoard.teamId = teamId;
            // create board for task
            const boardId = BoardCollection.insert(testBoard);
            testTask.boardId = boardId;

            testTask._id = "test";

            // insert in a team to edit
            const taskId = TaskCollection.insert(testTask);
            removedTag = ["test1"];
            removedStatus = ["test"];

            // Wrap the Meteor.call in a Promise
            return new Promise((resolve, reject) => {
                Meteor.call("remove_deleted_statuses_tags", boardId, removedStatus, removedTag,
                    (error)=>{
                    if (error) {
                        reject(error);
                    } else {
                        resolve();
                    }
                });
            })
            .then(() => {
                TaskCollection.find({boardId: boardId, statusName: {$in: removedStatus}}).forEach(task => {
                    assert.strictEqual(task.statusName, "To Do");
                });
        
                TaskCollection.find({boardId: boardId}).forEach(task => {
                    removedTags.forEach(tag => {
                        assert.strictEqual(task.tagNames.includes(tag), false);
                    });
                });
            })
            .catch((error) => {
                assert.fail("Error for removing tags and status: " + error.message);
            })
        }).timeout(10000);
    });
}
