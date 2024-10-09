/**
 * File Description: Task database testing
 * File version: 1.0
 * Contributors: Nikki, Audrey
 */

import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import { resetDatabase } from 'meteor/xolvio:cleaner';
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
            username: "testUser1",
            password: "testPassword",
            email: "test@test.com",
            profile: {
                name: "Test User 1",
                notificationOn: true
            }
        };

        const testUser2 = {
            username: "testUser2",
            password: "testPassword",
            email: "test@test.com",
            profile: {
                name: "Test User 2",
                notificationOn: false
            }
        };

        const testBoard = {
            boardName: "test board",
            boardCode: "code123",
            boardDeadline: "2024-12-05T17:55:00.000Z",
            boardDescription: "description string",
            teamId: "",
            boardTags: [{tagName: "tag1", tagColour: "#000000"}],
            boardStatuses: [
                {"statusName": "To Do", "statusOrder": 1},
                {"statusName": "Done", "statusOrder": 2},
                {"statusName": "Test Status", "statusOrder": 3}
            ],
        }

        const testTeamData = {
            teamName: "test",
            teamLeader: "test1@test1.com",
            teamMembers: ["test1@test1.com", "test2@test2.com"],
            teamInvitations: []
                // {email: "test2@test2.com", token: "testToken1"}]
        }

        const testUnpinnedTaskData = {
            taskName: "a",
            taskDesc: "b",
            taskDeadlineDate: "2024-08-10T23:55:00.000Z",
            taskIsPinned: false,
            boardId: "", // added dynamically during test cases
            statusName: "To Do",
            tagNames: ["tag1"],
            contributions: [{email: "test1@test1.com", percent: 60}],
        }

        const testPinnedTaskData = {
            taskName: "a",
            taskDesc: "b",
            taskDeadlineDate: "2024-08-10T23:55:00.000Z",
            taskIsPinned: true,
            taskPinnedDate: new Date(),
            boardId: "", // added dynamically during test cases
            statusName: "To Do",
            tagNames: ["tag1"],
            contributions: [{email: "test1@test1.com", percent: 60}],
        }

        const testTask = {
            taskName: "test",
            taskDesc: "test",
            taskDeadlineDate: "2024-08-10T23:55:00.000Z",
            taskIsPinned: true,
            taskPinnedDate: new Date(),
            boardId: "",
            statusName: "To Do",
            tagNames: ["tag1"],
            contributions: [{email: "test1@test1.com", percent: 60 }],
        }

        /**
         * Test case to check if a task can be added successfully.
         */
        it('Can create task: task name and description with minimum characters, and is pinned', function () {

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

        it('Can create task: task name and description with minimum characters, and is not pinned', function () {

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

        it('Can create task: task name and with minimum characters, description with maximum characters, and is pinned', function () {

            // create test user for logging username
            Accounts.createUser(testUser);
            // create team for board
            const teamId = TeamCollection.insert(testTeamData);
            testBoard.teamId = teamId;
            // create board for task
            const boardId = BoardCollection.insert(testBoard);
            testPinnedTaskData.boardId = boardId;
            testPinnedTaskData.taskDesc = 'b'.repeat(1000);

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

        it('Can create task: task name with maximum characters, description with minimum characters, and is not pinned', function () {

            // create test user for logging username
            Accounts.createUser(testUser);
            // create team for board
            const teamId = TeamCollection.insert(testTeamData);
            testBoard.teamId = teamId;
            // create board for task
            const boardId = BoardCollection.insert(testBoard);
            testUnpinnedTaskData.boardId = boardId;
            testUnpinnedTaskData.taskName = 'a'.repeat(100);

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

        it('Can create task: task name and description with maximum characters, and is pinned', function () {

            // create test user for logging username
            Accounts.createUser(testUser);
            // create team for board
            const teamId = TeamCollection.insert(testTeamData);
            testBoard.teamId = teamId;
            // create board for task
            const boardId = BoardCollection.insert(testBoard);
            testPinnedTaskData.boardId = boardId;
            testPinnedTaskData.taskName = 'a'.repeat(100);
            testPinnedTaskData.taskDesc = 'b'.repeat(1000);

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

        it('Can create task: task name and description with maximum characters, and is not pinned', function () {

            // create test user for logging username
            Accounts.createUser(testUser);
            // create team for board
            const teamId = TeamCollection.insert(testTeamData);
            testBoard.teamId = teamId;
            // create board for task
            const boardId = BoardCollection.insert(testBoard);
            testUnpinnedTaskData.boardId = boardId;
            testUnpinnedTaskData.taskName = 'a'.repeat(100);
            testUnpinnedTaskData.taskDesc = 'b'.repeat(1000);

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
        it('Create task errors: empty task name', function () {
            // create test user for logging username
            Accounts.createUser(testUser);
            // create team for board
            const teamId = TeamCollection.insert(testTeamData);
            testBoard.teamId = teamId;
            // create board for task
            const boardId = BoardCollection.insert(testBoard);
            testPinnedTaskData.boardId = boardId;

            let isError = false;

            const addedTask = {
                _id: null,
                taskName: '',
                taskDesc: "test",
                taskDeadlineDate: testPinnedTaskData.taskDeadlineDate,
                taskIsPinned: testPinnedTaskData.taskIsPinned,
                boardId: testPinnedTaskData.boardId,
                statusName: testPinnedTaskData.statusName,
                tagNames: testPinnedTaskData.tagNames,
                contributions: testPinnedTaskData.contributions,
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
        it('Create task errors: task name longer than the limit', function () {
            // create test user for logging username
            Accounts.createUser(testUser);
            // create team for board
            const teamId = TeamCollection.insert(testTeamData);
            testBoard.teamId = teamId;
            // create board for task
            const boardId = BoardCollection.insert(testBoard);
            testPinnedTaskData.boardId = boardId;

            testPinnedTaskData._id = null;
            let isError = false;

            const addedTask = {
                _id: null,
                taskName: "a".repeat(101),
                taskDesc: "test",
                taskDeadlineDate: testPinnedTaskData.taskDeadlineDate,
                taskIsPinned: testPinnedTaskData.taskIsPinned,
                boardId: testPinnedTaskData.boardId,
                statusName: testPinnedTaskData.statusName,
                tagNames: testPinnedTaskData.tagNames,
                contributions: testPinnedTaskData.contributions,
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

        //test for invalid long team name
        it('Create task errors: task name is not a string', function () {
            // create test user for logging username
            Accounts.createUser(testUser);
            // create team for board
            const teamId = TeamCollection.insert(testTeamData);
            testBoard.teamId = teamId;
            // create board for task
            const boardId = BoardCollection.insert(testBoard);
            testPinnedTaskData.boardId = boardId;

            testPinnedTaskData._id = null;
            let isError = false;

            const addedTask = {
                _id: null,
                taskName: 1,
                taskDesc: "test",
                taskDeadlineDate: testPinnedTaskData.taskDeadlineDate,
                taskIsPinned: testPinnedTaskData.taskIsPinned,
                boardId: testPinnedTaskData.boardId,
                statusName: testPinnedTaskData.statusName,
                tagNames: testPinnedTaskData.tagNames,
                contributions: testPinnedTaskData.contributions,
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
                assert.strictEqual(error.error, 400)
            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for invalid name input");
                }
            });
        }).timeout(10000);
        
        //test for empty task name
        it('Create task errors: empty task description', function () {
            // create test user for logging username
            Accounts.createUser(testUser);
            // create team for board
            const teamId = TeamCollection.insert(testTeamData);
            testBoard.teamId = teamId;
            // create board for task
            const boardId = BoardCollection.insert(testBoard);
            testPinnedTaskData.boardId = boardId;

            testPinnedTaskData._id = null;
        
            let isError = false;

            const addedTask = {
                _id: null,
                taskName: "test",
                taskDesc: '',
                taskDeadlineDate: testPinnedTaskData.taskDeadlineDate,
                taskIsPinned: testPinnedTaskData.taskIsPinned,
                boardId: testPinnedTaskData.boardId,
                statusName: testPinnedTaskData.statusName,
                tagNames: testPinnedTaskData.tagNames,
                contributions: testPinnedTaskData.contributions,
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
        it('Create task errors: task description longer than the limit', function () {
            // create test user for logging username
            Accounts.createUser(testUser);
            // create team for board
            const teamId = TeamCollection.insert(testTeamData);
            testBoard.teamId = teamId;
            // create board for task
            const boardId = BoardCollection.insert(testBoard);
            testPinnedTaskData.boardId = boardId;

            testPinnedTaskData._id = null;

            let isError = false;

            const longDesc = "a".repeat(1001)
            const addedTask = {
                _id: null,
                taskName: "test",
                taskDesc: longDesc,
                taskDeadlineDate: testPinnedTaskData.taskDeadlineDate,
                taskIsPinned: testPinnedTaskData.taskIsPinned,
                boardId: testPinnedTaskData.boardId,
                statusName: testPinnedTaskData.statusName,
                tagNames: testPinnedTaskData.tagNames,
                contributions: testPinnedTaskData.contributions,
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

        it('Create task errors: task description is not a string', function () {
            // create test user for logging username
            Accounts.createUser(testUser);
            // create team for board
            const teamId = TeamCollection.insert(testTeamData);
            testBoard.teamId = teamId;
            // create board for task
            const boardId = BoardCollection.insert(testBoard);
            testPinnedTaskData.boardId = boardId;

            testPinnedTaskData._id = null;

            let isError = false;

            const addedTask = {
                _id: null,
                taskName: "test",
                taskDesc: 1,
                taskDeadlineDate: testPinnedTaskData.taskDeadlineDate,
                taskIsPinned: testPinnedTaskData.taskIsPinned,
                boardId: testPinnedTaskData.boardId,
                statusName: testPinnedTaskData.statusName,
                tagNames: testPinnedTaskData.tagNames,
                contributions: testPinnedTaskData.contributions,
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
                assert.strictEqual(error.error, 400)

            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for invalid description input");
                }
            });
        }).timeout(10000);
        
        //test deadline related validation
        it('Create task errors: deadline date is an invalid date time string', function () {
            // create test user for logging username
            Accounts.createUser(testUser);
            // create team for board
            const teamId = TeamCollection.insert(testTeamData);
            testBoard.teamId = teamId;
            // create board for task
            const boardId = BoardCollection.insert(testBoard);
            testPinnedTaskData.boardId = boardId;

            testPinnedTaskData._id = null;

            let isError = false;
            const addedTask = {
                _id: null,
                taskName: "test",
                taskDesc: "test",
                taskDeadlineDate: "invalid date",
                taskIsPinned: testPinnedTaskData.taskIsPinned,
                boardId: testPinnedTaskData.boardId,
                statusName: testPinnedTaskData.statusName,
                tagNames: testPinnedTaskData.tagNames,
                contributions: testPinnedTaskData.contributions,
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
        
        it('Create task errors: deadline date is not a string', function () {
            // create test user for logging username
            Accounts.createUser(testUser);
            // create team for board
            const teamId = TeamCollection.insert(testTeamData);
            testBoard.teamId = teamId;
            // create board for task
            const boardId = BoardCollection.insert(testBoard);
            testPinnedTaskData.boardId = boardId;

            testPinnedTaskData._id = null;

            let isError = false;
            const addedTask = {
                _id: null,
                taskName: testPinnedTaskData.taskName,
                taskDesc: testPinnedTaskData.taskDesc,
                taskDeadlineDate: 1,
                taskIsPinned: testPinnedTaskData.taskIsPinned,
                boardId: testPinnedTaskData.boardId,
                statusName: testPinnedTaskData.statusName,
                tagNames: testPinnedTaskData.tagNames,
                contributions: testPinnedTaskData.contributions,
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
                assert.strictEqual(error.error, 400)

            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for invalid deadline input");
                }
            });
        }).timeout(10000);

        it('Create task errors: is pinned status is not a boolean', function () {
            // create test user for logging username
            Accounts.createUser(testUser);
            // create team for board
            const teamId = TeamCollection.insert(testTeamData);
            testBoard.teamId = teamId;
            // create board for task
            const boardId = BoardCollection.insert(testBoard);
            testPinnedTaskData.boardId = boardId;

            testPinnedTaskData._id = null;

            let isError = false;
            const addedTask = {
                _id: null,
                taskName: "test",
                taskDesc: "test",
                taskDeadlineDate: testPinnedTaskData.taskDeadlineDate,
                taskIsPinned: 1,
                boardId: testPinnedTaskData.boardId,
                statusName: testPinnedTaskData.statusName,
                tagNames: testPinnedTaskData.tagNames,
                contributions: testPinnedTaskData.contributions,
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
                assert.strictEqual(error.error, 400)

            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for invalid pin input");
                }
            });
        }).timeout(10000);

        it('Create task errors: Board ID is a string, but does not exist in the database', function () {
            // create test user for logging username
            Accounts.createUser(testUser);

            testPinnedTaskData._id = null;

            let isError = false;
            const addedTask = {
                _id: null,
                taskName: "test",
                taskDesc: "test",
                taskDeadlineDate: testPinnedTaskData.taskDeadlineDate,
                taskIsPinned: testPinnedTaskData.taskIsPinned,
                boardId: "testBoard",
                statusName: testPinnedTaskData.statusName,
                tagNames: testPinnedTaskData.tagNames,
                contributions: testPinnedTaskData.contributions
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
                    assert.fail("Did not provide required error for invalid board");
                }
            });
        }).timeout(10000);

        it('Create task errors: Board ID is not a string', function () {
            // create test user for logging username
            Accounts.createUser(testUser);

            testPinnedTaskData._id = null;

            let isError = false;
            const addedTask = {
                _id: null,
                taskName: "test",
                taskDesc: "test",
                taskDeadlineDate: testPinnedTaskData.taskDeadlineDate,
                taskIsPinned: testPinnedTaskData.taskIsPinned,
                boardId: 1,
                statusName: testPinnedTaskData.statusName,
                tagNames: testPinnedTaskData.tagNames,
                contributions: testPinnedTaskData.contributions
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
                assert.strictEqual(error.error, 400)

            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for invalid board");
                }
            });
        }).timeout(10000);

        it('Create task errors: status is not a string', function () {
            // create test user for logging username
            Accounts.createUser(testUser);
            // create team for board
            const teamId = TeamCollection.insert(testTeamData);
            testBoard.teamId = teamId;
            // create board for task
            const boardId = BoardCollection.insert(testBoard);
            testPinnedTaskData.boardId = boardId;

            testPinnedTaskData._id = null;

            let isError = false;
            const addedTask = {
                _id: null,
                taskName: "test",
                taskDesc: "test",
                taskDeadlineDate: testPinnedTaskData.taskDeadlineDate,
                taskIsPinned: testPinnedTaskData.taskIsPinned,
                boardId: testPinnedTaskData.boardId,
                statusName: 1,
                tagNames: testPinnedTaskData.tagNames,
                contributions: testPinnedTaskData.contributions,
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
                assert.strictEqual(error.error, 400)

            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for invalid status input");
                }
            });
        }).timeout(10000);

        it('Create task errors: tags is not an array', function () {
            // create test user for logging username
            Accounts.createUser(testUser);
            // create team for board
            const teamId = TeamCollection.insert(testTeamData);
            testBoard.teamId = teamId;
            // create board for task
            const boardId = BoardCollection.insert(testBoard);
            testPinnedTaskData.boardId = boardId;

            testPinnedTaskData._id = null;

            let isError = false;
            const addedTask = {
                _id: null,
                taskName: "test",
                taskDesc: "test",
                taskDeadlineDate: testPinnedTaskData.taskDeadlineDate,
                taskIsPinned: testPinnedTaskData.taskIsPinned,
                boardId: testPinnedTaskData.boardId,
                statusName: testPinnedTaskData.statusName,
                tagNames: 1,
                contributions: testPinnedTaskData.contributions,
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
                assert.strictEqual(error.error, 400)

            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for invalid status input");
                }
            });
        }).timeout(10000);

        it('Create task errors: tags is not an array of strings', function () {
            // create test user for logging username
            Accounts.createUser(testUser);
            // create team for board
            const teamId = TeamCollection.insert(testTeamData);
            testBoard.teamId = teamId;
            // create board for task
            const boardId = BoardCollection.insert(testBoard);
            testPinnedTaskData.boardId = boardId;

            testPinnedTaskData._id = null;

            let isError = false;
            const addedTask = {
                _id: null,
                taskName: "test",
                taskDesc: "test",
                taskDeadlineDate: testPinnedTaskData.taskDeadlineDate,
                taskIsPinned: testPinnedTaskData.taskIsPinned,
                boardId: testPinnedTaskData.boardId,
                statusName: testPinnedTaskData.statusName,
                tagNames: [1],
                contributions: testPinnedTaskData.contributions,
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
                assert.strictEqual(error.error, 400)

            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for invalid status input");
                }
            });
        }).timeout(10000);

        it('Create task errors: contribution has valid emails but total percent exceeds 100', function () {
            // create test user for logging username
            Accounts.createUser(testUser);
            // create team for board
            const teamId = TeamCollection.insert(testTeamData);
            testBoard.teamId = teamId;
            // create board for task
            const boardId = BoardCollection.insert(testBoard);
            testPinnedTaskData.boardId = boardId;

            testPinnedTaskData._id = null;

            let isError = false;
            const addedTask = {
                _id: null,
                taskName: "test",
                taskDesc: "test",
                taskDeadlineDate: testPinnedTaskData.taskDeadlineDate,
                taskIsPinned: testPinnedTaskData.taskIsPinned,
                boardId: testPinnedTaskData.boardId,
                statusName: testPinnedTaskData.statusName,
                tagNames: testPinnedTaskData.tagNames,
                contributions: [{email: "test1@test1.com", percent: 102}]
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

        it('Create task errors: contribution contains an invalid email address', function () {
            // create test user for logging username
            Accounts.createUser(testUser);
            // create team for board
            const teamId = TeamCollection.insert(testTeamData);
            testBoard.teamId = teamId;
            // create board for task
            const boardId = BoardCollection.insert(testBoard);
            testPinnedTaskData.boardId = boardId;

            testPinnedTaskData._id = null;

            let isError = false;
            const addedTask = {
                _id: null,
                taskName: "test",
                taskDesc: "test",
                taskDeadlineDate: testPinnedTaskData.taskDeadlineDate,
                taskIsPinned: testPinnedTaskData.taskIsPinned,
                boardId: testPinnedTaskData.boardId,
                statusName: testPinnedTaskData.statusName,
                tagNames: testPinnedTaskData.tagNames,
                contributions: [{email: "invalid", percent: 100}]
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

            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for invalid email contribution input");
                }
            });
        }).timeout(10000);

        it('Create task errors: contribution is not an array', function () {
            // create test user for logging username
            Accounts.createUser(testUser);
            // create team for board
            const teamId = TeamCollection.insert(testTeamData);
            testBoard.teamId = teamId;
            // create board for task
            const boardId = BoardCollection.insert(testBoard);
            testPinnedTaskData.boardId = boardId;

            testPinnedTaskData._id = null;

            let isError = false;
            const addedTask = {
                _id: null,
                taskName: "test",
                taskDesc: "test",
                taskDeadlineDate: testPinnedTaskData.taskDeadlineDate,
                taskIsPinned: testPinnedTaskData.taskIsPinned,
                boardId: testPinnedTaskData.boardId,
                statusName: testPinnedTaskData.statusName,
                tagNames: testPinnedTaskData.tagNames,
                contributions: 1
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
                assert.strictEqual(error.error, 400)

            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for invalid contribution input");
                }
            });
        }).timeout(10000);

        /**
         * Test case to check if a task can be updated successfully.
         */
        it('Can update task: task name and description with minimum characters, and is pinned', function () {
            // create test user for logging username
            Accounts.createUser(testUser);
            // create team for board
            const teamId = TeamCollection.insert(testTeamData);
            testBoard.teamId = teamId;
            // create board for task
            const boardId = BoardCollection.insert(testBoard);
            testUnpinnedTaskData.boardId = boardId;

            testUnpinnedTaskData._id = "testTask";
            const newDate = new Date();
            // insert in a team to edit
            const taskId = TaskCollection.insert(testUnpinnedTaskData);
            // create edited task object
            const editedTask = {
                _id: "testTask",
                taskName: "b",
                taskDesc: "a",
                taskDeadlineDate: "2024-08-10T17:55:00.000Z",
                taskIsPinned: true,
                boardId: boardId, // added dynamically during test cases
                statusName: "To Do",
                tagNames: ["tag1"],
                contributions: [{email:"test1@test1.com", percent: 60}],
            }

            // call update method
            Meteor.call('update_task', taskId, editedTask, testUser.username);

            // get updated team object and check all updated
            const updatedTask = TaskCollection.findOne(taskId);
            assert.strictEqual(updatedTask.taskName, "b");
            assert.strictEqual(updatedTask.taskDesc, "a");
            assert.strictEqual(updatedTask.taskDeadlineDate, "2024-08-10T17:55:00.000Z");
            assert.strictEqual(updatedTask.taskIsPinned, true);
            assert.strictEqual(updatedTask.boardId, boardId);
            assert.strictEqual(updatedTask.statusName, "To Do");
            assert.deepEqual(updatedTask.tagNames, ["tag1"]);
            assert.deepEqual(updatedTask.contributions, [
                {email:"test1@test1.com", percent: 60}]);

        });

        it('Can update task: task name and description with minimum characters, and is not pinned', function () {
            // create test user for logging username
            Accounts.createUser(testUser);
            // create team for board
            const teamId = TeamCollection.insert(testTeamData);
            testBoard.teamId = teamId;
            // create board for task
            const boardId = BoardCollection.insert(testBoard);
            testPinnedTaskData.boardId = boardId;

            testPinnedTaskData._id = "testTask";

            // insert in a team to edit
            const taskId = TaskCollection.insert(testPinnedTaskData);

            // create edited task object
            const editedTask = {
                _id: "testTask",
                taskName: "b",
                taskDesc: "a",
                taskDeadlineDate: "2024-08-10T17:55:00.000Z",
                taskIsPinned: false,
                boardId: boardId, // added dynamically during test cases
                statusName: "To Do",
                tagNames: ["tag1"],
                contributions: [{email:"test1@test1.com", percent: 60}],
            }

            // call update method
            Meteor.call('update_task', taskId, editedTask, testUser.username);

            // get updated team object and check all updated
            const updatedTask = TaskCollection.findOne(taskId);
            assert.strictEqual(updatedTask.taskName, "b");
            assert.strictEqual(updatedTask.taskDesc, "a");
            assert.strictEqual(updatedTask.taskDeadlineDate, "2024-08-10T17:55:00.000Z");
            assert.strictEqual(updatedTask.taskIsPinned, false);
            assert.strictEqual(updatedTask.boardId, boardId);
            assert.strictEqual(updatedTask.statusName, "To Do");
            assert.deepEqual(updatedTask.tagNames, ["tag1"]);
            assert.deepEqual(updatedTask.contributions, [
                {email:"test1@test1.com", percent: 60}]);

        });

        it('Can update task: task name and with minimum characters, description with maximum characters, and is pinned', function () {
            // create test user for logging username
            Accounts.createUser(testUser);
            // create team for board
            const teamId = TeamCollection.insert(testTeamData);
            testBoard.teamId = teamId;
            // create board for task
            const boardId = BoardCollection.insert(testBoard);
            testUnpinnedTaskData.boardId = boardId;

            testUnpinnedTaskData._id = "testTask";
            // insert in a team to edit
            const taskId = TaskCollection.insert(testUnpinnedTaskData);
            // create edited task object
            const editedTask = {
                _id: "testTask",
                taskName: "b",
                taskDesc: "a".repeat(1000),
                taskDeadlineDate: "2024-08-10T17:55:00.000Z",
                taskIsPinned: true,
                boardId: boardId, // added dynamically during test cases
                statusName: "To Do",
                tagNames: ["tag1"],
                contributions: [{email:"test1@test1.com", percent: 60}],
            }

            // call update method
            Meteor.call('update_task', taskId, editedTask, testUser.username);

            // get updated team object and check all updated
            const updatedTask = TaskCollection.findOne(taskId);
            assert.strictEqual(updatedTask.taskName, "b");
            assert.strictEqual(updatedTask.taskDesc, "a".repeat(1000));
            assert.strictEqual(updatedTask.taskDeadlineDate, "2024-08-10T17:55:00.000Z");
            assert.strictEqual(updatedTask.taskIsPinned, true);
            assert.strictEqual(updatedTask.boardId, boardId);
            assert.strictEqual(updatedTask.statusName, "To Do");
            assert.deepEqual(updatedTask.tagNames, ["tag1"]);
            assert.deepEqual(updatedTask.contributions, [
                {email:"test1@test1.com", percent: 60}]);

        });

        it('Can update task: task name with maximum characters, description with minimum characters, and is not pinned', function () {
            // create test user for logging username
            Accounts.createUser(testUser);
            // create team for board
            const teamId = TeamCollection.insert(testTeamData);
            testBoard.teamId = teamId;
            // create board for task
            const boardId = BoardCollection.insert(testBoard);
            testPinnedTaskData.boardId = boardId;

            testPinnedTaskData._id = "testTask";

            // insert in a team to edit
            const taskId = TaskCollection.insert(testPinnedTaskData);

            // create edited task object
            const editedTask = {
                _id: "testTask",
                taskName: "b".repeat(100),
                taskDesc: "a",
                taskDeadlineDate: "2024-08-10T17:55:00.000Z",
                taskIsPinned: false,
                boardId: boardId, // added dynamically during test cases
                statusName: "To Do",
                tagNames: ["tag1"],
                contributions: [{email:"test1@test1.com", percent: 60}],
            }

            // call update method
            Meteor.call('update_task', taskId, editedTask, testUser.username);

            // get updated team object and check all updated
            const updatedTask = TaskCollection.findOne(taskId);
            assert.strictEqual(updatedTask.taskName, "b".repeat(100));
            assert.strictEqual(updatedTask.taskDesc, "a");
            assert.strictEqual(updatedTask.taskDeadlineDate, "2024-08-10T17:55:00.000Z");
            assert.strictEqual(updatedTask.taskIsPinned, false);
            assert.strictEqual(updatedTask.boardId, boardId);
            assert.strictEqual(updatedTask.statusName, "To Do");
            assert.deepEqual(updatedTask.tagNames, ["tag1"]);
            assert.deepEqual(updatedTask.contributions, [
                {email:"test1@test1.com", percent: 60}]);

        });

        it('Can update task: task name and description with maximum characters, and is pinned', function () {
            // create test user for logging username
            Accounts.createUser(testUser);
            // create team for board
            const teamId = TeamCollection.insert(testTeamData);
            testBoard.teamId = teamId;
            // create board for task
            const boardId = BoardCollection.insert(testBoard);
            testUnpinnedTaskData.boardId = boardId;

            testUnpinnedTaskData._id = "testTask";
            // insert in a team to edit
            const taskId = TaskCollection.insert(testUnpinnedTaskData);
            // create edited task object
            const editedTask = {
                _id: "testTask",
                taskName: "b".repeat(100),
                taskDesc: "a".repeat(1000),
                taskDeadlineDate: "2024-08-10T17:55:00.000Z",
                taskIsPinned: true,
                boardId: boardId, // added dynamically during test cases
                statusName: "To Do",
                tagNames: ["tag1"],
                contributions: [{email:"test1@test1.com", percent: 60}],
            }

            // call update method
            Meteor.call('update_task', taskId, editedTask, testUser.username);

            // get updated team object and check all updated
            const updatedTask = TaskCollection.findOne(taskId);
            assert.strictEqual(updatedTask.taskName, "b".repeat(100));
            assert.strictEqual(updatedTask.taskDesc, "a".repeat(1000));
            assert.strictEqual(updatedTask.taskDeadlineDate, "2024-08-10T17:55:00.000Z");
            assert.strictEqual(updatedTask.taskIsPinned, true);
            assert.strictEqual(updatedTask.boardId, boardId);
            assert.strictEqual(updatedTask.statusName, "To Do");
            assert.deepEqual(updatedTask.tagNames, ["tag1"]);
            assert.deepEqual(updatedTask.contributions, [
                {email:"test1@test1.com", percent: 60}]);

        });

        
        it('Can update task: task name and description with maximum characters, and is not pinned', function () {
            // create test user for logging username
            Accounts.createUser(testUser);
            // create team for board
            const teamId = TeamCollection.insert(testTeamData);
            testBoard.teamId = teamId;
            // create board for task
            const boardId = BoardCollection.insert(testBoard);
            testUnpinnedTaskData.boardId = boardId;

            testUnpinnedTaskData._id = "testTask";
            // insert in a team to edit
            const taskId = TaskCollection.insert(testUnpinnedTaskData);
            // create edited task object
            const editedTask = {
                _id: "testTask",
                taskName: "b".repeat(100),
                taskDesc: "a".repeat(1000),
                taskDeadlineDate: "2024-08-10T17:55:00.000Z",
                taskIsPinned: false,
                boardId: boardId, // added dynamically during test cases
                statusName: "To Do",
                tagNames: ["tag1"],
                contributions: [{email:"test1@test1.com", percent: 60}],
            }

            // call update method
            Meteor.call('update_task', taskId, editedTask, testUser.username);

            // get updated team object and check all updated
            const updatedTask = TaskCollection.findOne(taskId);
            assert.strictEqual(updatedTask.taskName, "b".repeat(100));
            assert.strictEqual(updatedTask.taskDesc, "a".repeat(1000));
            assert.strictEqual(updatedTask.taskDeadlineDate, "2024-08-10T17:55:00.000Z");
            assert.strictEqual(updatedTask.taskIsPinned, false);
            assert.strictEqual(updatedTask.boardId, boardId);
            assert.strictEqual(updatedTask.statusName, "To Do");
            assert.deepEqual(updatedTask.tagNames, ["tag1"]);
            assert.deepEqual(updatedTask.contributions, [
                {email:"test1@test1.com", percent: 60}]);

        });

        //test for empty task name
        it('Update task errors: empty task name', function () {
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
                taskDesc: "test",
                taskDeadlineDate: "2024-08-10T23:55:00.000Z",
                taskIsPinned: true,
                boardId: boardId,
                statusName: "To Do",
                tagNames: ["tag1"],
                contributions: [{email: "test1@test1.com", percent: 60}],
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
        it('Update task errors: task name longer than the limit', function () {
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
                taskDesc: "test",
                taskDeadlineDate: "2024-08-10T23:55:00.000Z",
                taskIsPinned: true,
                boardId: boardId,
                statusName: "To Do",
                tagNames: ["tag1"],
                contributions: [{email: "test1@test1.com", percent: 60}],
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

        it('Update task errors: task name is not a string', function () {
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
                taskName: 1,
                taskDesc: "test",
                taskDeadlineDate: "2024-08-10T23:55:00.000Z",
                taskIsPinned: true,
                boardId: boardId,
                statusName: "To Do",
                tagNames: ["tag1"],
                contributions: [{email: "test1@test1.com", percent: 60}],
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
                assert.strictEqual(error.error, 400)

            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for invalid name input");
                }
            });
        }).timeout(10000);

        //test for empty description
        it('Update task errors: empty task description', function () {
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
                taskName: "test",
                taskDesc: "",
                taskDeadlineDate: "2024-08-10T23:55:00.000Z",
                taskIsPinned: true,
                boardId: boardId,
                statusName: "To Do",
                tagNames: ["tag1"],
                contributions: [{email: "test1@test1.com", percent: 60}],
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

        it('Update task errors: task description longer than the limit', function () {
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
            const longDesc = "b".repeat(1001)
            // create edited task object
            let isError = false;
            const editedTask = {
                _id: "TestId",
                taskName: "test",
                taskDesc: longDesc,
                taskDeadlineDate: "2024-08-10T23:55:00.000Z",
                taskIsPinned: true,
                boardId: boardId,
                statusName: "To Do",
                tagNames: ["tag1"],
                contributions: [{email: "test1@test1.com", percent: 60}],
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

        it('Update task errors: task description is not a string', function () {
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
                taskName: "test",
                taskDesc: 1,
                taskDeadlineDate: "2024-08-10T23:55:00.000Z",
                taskIsPinned: true,
                boardId: boardId,
                statusName: "To Do",
                tagNames: ["tag1"],
                contributions: [{email: "test1@test1.com", percent: 60}],
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
                assert.strictEqual(error.error, 400)
            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for invalid description input that is too long");
                }
            });
        }).timeout(10000);

        //test deadline related validation
        it('Update task errors: deadline date is an invalid date time string', function () {
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
                taskName: "test",
                taskDesc: "test",
                taskDeadlineDate: "invalid date",
                taskIsPinned: true,
                boardId: boardId,
                statusName: "To Do",
                tagNames: ["tag1"],
                contributions: [{email: "test1@test1.com", percent: 60}],
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
        
        it('Update task errors: deadline date is not a string', function () {
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
                taskName: "test",
                taskDesc: "test",
                taskDeadlineDate: 1,
                taskIsPinned: true,
                boardId: boardId,
                statusName: "To Do",
                tagNames: ["tag1"],
                contributions: [{email: "test1@test1.com", percent: 60}],
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
                assert.strictEqual(error.error, 400)

            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for invalid deadline input");
                }
            });
        }).timeout(10000);

        it('Update task errors: is pinned status is not a boolean', function () {
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
                taskName: "test",
                taskDesc: "test",
                taskDeadlineDate: "2024-08-10T23:55:00.000Z",
                taskIsPinned: 1,
                boardId: boardId,
                statusName: "To Do",
                tagNames: ["tag1"],
                contributions: [{email: "test1@test1.com", percent: 60}],
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
                assert.strictEqual(error.error, 400)

            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for invalid pinned status");
                }
            });
        }).timeout(10000);


        it('Update task errors: Board ID is a string, but does not exist in the database', function () {
            // create test user for logging username
            Accounts.createUser(testUser);
            testUnpinnedTaskData._id = null;
            const taskId = TaskCollection.insert(testPinnedTaskData);

            // create edited task object
            let isError = false;
            const editedTask = {
                _id: "TestId",
                taskName: "test",
                taskDesc: "test",
                taskDeadlineDate: "2024-08-10T23:55:00.000Z",
                taskIsPinned: true,
                boardId: "testBoard",
                statusName: "To Do",
                tagNames: ["tag1"],
                contributions: [{email: "test1@test1.com", percent: 60}],
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

        it('Update task errors: Board ID is not a string', function () {
            // create test user for logging username
            Accounts.createUser(testUser);
            testUnpinnedTaskData._id = null;
            const taskId = TaskCollection.insert(testPinnedTaskData);

            // create edited task object
            let isError = false;
            const editedTask = {
                _id: "TestId",
                taskName: "test",
                taskDesc: "test",
                taskDeadlineDate: "2024-08-10T23:55:00.000Z",
                taskIsPinned: true,
                boardId: 1,
                statusName: "To Do",
                tagNames: ["tag1"],
                contributions: [{email: "test1@test1.com", percent: 60}],
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
                assert.strictEqual(error.error, 400)

            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for non-existing board");
                }
            });
        }).timeout(10000);
      
        it('Update task errors: status is not a string', function () {
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
                taskName: "test",
                taskDesc: "test",
                taskDeadlineDate: "2024-08-10T23:55:00.000Z",
                taskIsPinned: true,
                boardId: boardId,
                statusName: 1,
                tagNames: ["tag1"],
                contributions: [{email: "test1@test1.com", percent: 60}],
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
                assert.strictEqual(error.error, 400)

            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for invalid pinned status");
                }
            });
        }).timeout(10000);

        it('Update task errors: tags is not an array', function () {
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
                taskName: "test",
                taskDesc: "test",
                taskDeadlineDate: "2024-08-10T23:55:00.000Z",
                taskIsPinned: true,
                boardId: boardId,
                statusName: "To Do",
                tagNames: 1,
                contributions: [{email: "test1@test1.com", percent: 60}],
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
                assert.strictEqual(error.error, 400)

            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for invalid pinned status");
                }
            });
        }).timeout(10000);

        it('Update task errors: tags is not an array of strings', function () {
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
                taskName: "test",
                taskDesc: "test",
                taskDeadlineDate: "2024-08-10T23:55:00.000Z",
                taskIsPinned: true,
                boardId: boardId,
                statusName: "To Do",
                tagNames: [1],
                contributions: [{email: "test1@test1.com", percent: 60}],
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
                assert.strictEqual(error.error, 400)

            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for invalid pinned status");
                }
            });
        }).timeout(10000);

        it('Update task errors: contribution has valid emails but total percent exceeds 100', function () {
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
                taskName: "test",
                taskDesc: "test",
                taskDeadlineDate: "2024-08-10T23:55:00.000Z",
                taskIsPinned: true,
                boardId: boardId,
                statusName: "To Do",
                tagNames: ["tag1"],
                contributions: [{email: "test1@test1.com", percent: 102}],
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

        it('Update task errors: contribution contains an invalid email address', function () {
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
                taskName: "test",
                taskDesc: "test",
                taskDeadlineDate: "2024-08-10T23:55:00.000Z",
                taskIsPinned: true,
                boardId: boardId,
                statusName: "To Do",
                tagNames: ["tag1"],
                contributions: [{email: "invalid", percent: 60}],
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
                assert.strictEqual(error.reason, 'Invalid email contribution input')

            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for invalid contribution input");
                }
            });
        }).timeout(10000);

        it('Update task errors: contribution is not an array', function () {
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
                taskName: "test",
                taskDesc: "test",
                taskDeadlineDate: "2024-08-10T23:55:00.000Z",
                taskIsPinned: true,
                boardId: boardId,
                statusName: "To Do",
                tagNames: ["tag1"],
                contributions: 1,
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
                assert.strictEqual(error.error, 400)
            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for invalid contribution input");
                }
            });
        }).timeout(10000);

        it('Update task errors: task ID is not a string array', function () {
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
                taskName: "test",
                taskDesc: "test",
                taskDeadlineDate: "2024-08-10T23:55:00.000Z",
                taskIsPinned: true,
                boardId: boardId,
                statusName: "To Do",
                tagNames: ["tag1"],
                contributions: [{email: "test1@test1.com", percent: 60}],
            }

            // Wrap the Meteor.call in a Promise
            return new Promise((resolve, reject) => {
                Meteor.call("update_task", 1, editedTask, testUser.username,
            
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
                    assert.fail("Did not provide required error for invalid task ID");
                }
            });
        }).timeout(10000);

        /**
         * Test case to check if a task can be deleted successfully.
         */
        it('Can delete task: string task ID that exists in database', function () {

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

        it('Can delete task: string task ID that does not exists in database', function () {

            // create test user for logging username
            Accounts.createUser(testUser);
            const taskId = "randomID";
            // call delete method for deletion
            Meteor.call('delete_task', taskId, testUser.username);

            // check deleted team is DELETED
            const deletedTask = TaskCollection.findOne(taskId);
            assert.strictEqual(deletedTask, undefined);
        });

        it('Can delete task: string task ID that does not exists in database', function () {

            // create test user for logging username
            Accounts.createUser(testUser);
            return new Promise((resolve, reject) => {
                Meteor.call('delete_task', 1, testUser.username,
            
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
                    assert.fail("Did not provide required error for invalid task ID");
                }
            });
        }).timeout(10000);

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
