/**
 * File Description: Board database testing
 * File version: 1.2
 * Contributors: Nikki, Mark
 */

import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import { resetDatabase } from 'meteor/xolvio:cleaner';
import BoardCollection from "../imports/api/collections/board";
import TeamCollection from "../imports/api/collections/team";
import "../imports/api/methods/board";
import "../imports/api/methods/logEntry";

const assert = require('assert');


/**
 * Test suite for client-side board methods.
 */
if (Meteor.isClient) {
    /**
     * Describes test cases for board methods.
     */
    describe('Board methods', function () {

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

        const testTeam = {
            teamName: "test team",
            teamLeader: "test1@test1.com",
            teamMembers: ["test2@test2.com"],
            teamInvitations: [
                { email: "test2@test2.com", token: "testToken1" }]
        }


        const testBoardData = {
            boardName: "test_board",
            boardCode: "code123",
            boardDeadline: "2025-09-05T17:55:00.000Z",
            boardDescription: "description string",
            teamId: "testTeamId",
        };

        const testBoard = {
            boardName: "test_board",
            boardCode: "code123",
            boardDeadline: "2025-10-02T13:55:00.000Z",
            boardDescription: "description string",
            teamId: "testTeamId",
            boardTags: [{ tagName: "test1", tagColour: "#000000" }],
            boardStatuses: [
                { statusName: "To Do", statusOrder: 1 },
                { statusName: "Done", statusOrder: 2 }
            ],
        };

        /**
         * Test case to check if a board can be added successfully.
         */
        it('can add a board', async function () {
            // create test user for logging username
            Accounts.createUser(testUser);

            const teamId = TeamCollection.insert({ _id: "testTeamId", teamName: "Test Team" });

            // Wrap the Meteor.call in a Promise
            try {
                const boardId = await new Promise((resolve, reject) => {
                    Meteor.call("add_board",
                        testBoardData.boardName,
                        testBoardData.boardCode,
                        testBoardData.boardDeadline,
                        testBoardData.boardDescription,
                        teamId,
                        testUser.username,
                        (error, result) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve(result);
                            }
                        }
                    );
                });
                // check board ID is NOT undefined
                assert.notStrictEqual(boardId, undefined);
                // find board object and check it is not null
                const board = BoardCollection.findOne(boardId);
                assert.notStrictEqual(board, null);
            } catch (e) {
                assert.fail("Error adding board. Returned with error:" + e.message);
            }
        }).timeout(10000);

        /**
         * Test case for invalid board name.
         */
        it('errors with invalid board name during insert: incorrect type', async function () {
            // create test user for logging username
            Accounts.createUser(testUser);

            const teamId = TeamCollection.insert({ _id: "testTeamId", teamName: "Test Team" });

            // Wrap the Meteor.call in a Promise
            try {
                const resolvedError = await new Promise((resolve, reject) => {
                    Meteor.call("add_board",
                        123, // Invalid name, should be a string
                        testBoardData.boardCode,
                        testBoardData.boardDeadline,
                        testBoardData.boardDescription,
                        teamId,
                        testUser.username,
                        (error, result) => {
                            if (error) {
                                resolve(error);
                            } else {
                                reject();
                            }
                        }
                    );
                });
                // Check that the error message contains "Match failed"
                assert.ok(resolvedError.message.includes("Match failed"));
            } catch {
                assert.fail("Adding a board with an invalid board name did NOT give an error");
            }
        }).timeout(10000);

        /**
         * Test case for empty board name.
         */
        it('errors with invalid board name during insert: empty string', async function () {
            // create test user for logging username
            Accounts.createUser(testUser);

            const teamId = TeamCollection.insert({ _id: "testTeamId", teamName: "Test Team" });

            // Wrap the Meteor.call in a Promise
            try {
                const resolvedError = await new Promise((resolve, reject) => {
                    Meteor.call("add_board",
                        "", // Empty name
                        testBoardData.boardCode,
                        testBoardData.boardDeadline,
                        testBoardData.boardDescription,
                        teamId,
                        testUser.username,
                        (error, result) => {
                            if (error) {
                                resolve(error);
                            } else {
                                reject();
                            }
                        }
                    );
                });
                assert.strictEqual(resolvedError.error, "board-insert-failed");
                assert.strictEqual(resolvedError.reason, "Inputs can not be an empty string");
            } catch {
                assert.fail("Adding a board with an empty board name did NOT give an error");
            }
        }).timeout(10000);

        /**
         * Test case for too long board name.
         */
        it('errors with invalid board name during insert: exceeds character limit 30', async function () {
            // create test user for logging username
            Accounts.createUser(testUser);

            const teamId = TeamCollection.insert({ _id: "testTeamId", teamName: "Test Team" });

            // Wrap the Meteor.call in a Promise
            try {
                const resolvedError = await new Promise((resolve, reject) => {
                    Meteor.call("add_board",
                        "a".repeat(31),
                        testBoardData.boardCode,
                        testBoardData.boardDeadline,
                        testBoardData.boardDescription,
                        teamId,
                        testUser.username,
                        (error) => {
                            if (error) {
                                resolve(error);
                            } else {
                                reject();
                            }
                        }
                    );
                });
                assert.strictEqual(resolvedError.error, "board-insert-failed");
                assert.strictEqual(resolvedError.reason, "Board name can not exceed 30 characters");
            } catch {
                assert.fail("Adding a board with a too long board name did NOT give an error");
            }
        }).timeout(10000);

        /**
         * Test case for invalid board code.
         */
        it('errors with invalid board code during insert: incorrect type', async function () {
            // create test user for logging username
            Accounts.createUser(testUser);

            const teamId = TeamCollection.insert({ _id: "testTeamId", teamName: "Test Team" });

            // Wrap the Meteor.call in a Promise
            try {
                const resolvedError = await new Promise((resolve, reject) => {
                    Meteor.call("add_board",
                        testBoardData.boardName,
                        123, // Invalid code, should be a string
                        testBoardData.boardDeadline,
                        testBoardData.boardDescription,
                        teamId,
                        testUser.username,
                        (error, result) => {
                            if (error) {
                                resolve(error);
                            } else {
                                reject();
                            }
                        }
                    );
                });
                assert.ok(resolvedError.message.includes("Match failed"));
            } catch {
                assert.fail("Adding a board with an invalid board code did NOT give an error");
            }
        }).timeout(10000);

        /**
         * Test case for empty board code.
         */
        it('errors with invalid board code during insert: empty string', async function () {
            // create test user for logging username
            Accounts.createUser(testUser);

            const teamId = TeamCollection.insert({ _id: "testTeamId", teamName: "Test Team" });

            // Wrap the Meteor.call in a Promise
            try {
                const resolvedError = await new Promise((resolve, reject) => {
                    Meteor.call("add_board",
                        testBoardData.boardName,
                        "", // Empty code
                        testBoardData.boardDeadline,
                        testBoardData.boardDescription,
                        teamId,
                        testUser.username,
                        (error, result) => {
                            if (error) {
                                resolve(error);
                            } else {
                                reject();
                            }
                        }
                    );
                });
                assert.strictEqual(resolvedError.error, "board-insert-failed");
                assert.strictEqual(resolvedError.reason, "Inputs can not be an empty string");
            } catch {
                assert.fail("Adding a board with an empty board code did NOT give an error");
            }
        }).timeout(10000);

        /**
         * Test case for too long board code.
         */
        it('errors with invalid board code during insert: exceeds character limit 10', async function () {
            // create test user for logging username
            Accounts.createUser(testUser);

            const teamId = TeamCollection.insert({ _id: "testTeamId", teamName: "Test Team" });

            // Wrap the Meteor.call in a Promise
            try {
                const resolvedError = await new Promise((resolve, reject) => {
                    Meteor.call("add_board",
                        testBoardData.boardName,
                        "a".repeat(11),
                        testBoardData.boardDeadline,
                        testBoardData.boardDescription,
                        teamId,
                        testUser.username,
                        (error, result) => {
                            if (error) {
                                resolve(error);
                            } else {
                                reject();
                            }
                        }
                    );
                });
                assert.strictEqual(resolvedError.error, "board-insert-failed");
                assert.strictEqual(resolvedError.reason, "Board code can not exceed 10 characters");
            } catch {
                assert.fail("Adding a board with a too long board code did NOT give an error");
            }
        }).timeout(10000);

        /**
         * Test case for non-alphanumeric board code.
         */
        it('errors with invalid board code during insert: non-alphanumeric characters', async function () {
            // create test user for logging username
            Accounts.createUser(testUser);

            const teamId = TeamCollection.insert({ _id: "testTeamId", teamName: "Test Team" });

            // Wrap the Meteor.call in a Promise
            try {
                const resolvedError = await new Promise((resolve, reject) => {
                    Meteor.call("add_board",
                        testBoardData.boardName,
                        "code123@", // Non-alphanumeric code
                        testBoardData.boardDeadline,
                        testBoardData.boardDescription,
                        teamId,
                        testUser.username,
                        (error, result) => {
                            if (error) {
                                resolve(error);
                            } else {
                                reject();
                            }
                        }
                    );
                });
                assert.strictEqual(resolvedError.error, "board-insert-failed");
                assert.strictEqual(resolvedError.reason, "Board code can only contain letters and numbers");
            } catch {
                assert.fail("Adding a board with a non-alphanumeric board code did NOT give an error");
            }
        }).timeout(10000);

        /**
         * Test case for invalid board description.
         */
        it('errors with invalid description during insert: incorrect type', async function () {
            // create test user for logging username
            Accounts.createUser(testUser);

            const teamId = TeamCollection.insert({ _id: "testTeamId", teamName: "Test Team" });

            // Wrap the Meteor.call in a Promise
            try {
                const resolvedError = await new Promise((resolve, reject) => {
                    Meteor.call("add_board",
                        testBoardData.boardName,
                        testBoardData.boardCode,
                        testBoardData.boardDeadline,
                        123, // Invalid description, should be a string
                        teamId,
                        testUser.username,
                        (error, result) => {
                            if (error) {
                                resolve(error);
                            } else {
                                reject();
                            }
                        }
                    );
                });
                assert.ok(resolvedError.message.includes("Match failed"));
            } catch {
                assert.fail("Adding a board with an invalid description did NOT give an error");
            }
        }).timeout(10000);

        /**
         * Test case for empty board description.
         */
        it('errors with invalid description during insert: empty string', async function () {
            // create test user for logging username
            Accounts.createUser(testUser);

            const teamId = TeamCollection.insert({ _id: "testTeamId", teamName: "Test Team" });

            // Wrap the Meteor.call in a Promise
            try {
                const resolvedError = await new Promise((resolve, reject) => {
                    Meteor.call("add_board",
                        testBoardData.boardName,
                        testBoardData.boardCode,
                        testBoardData.boardDeadline,
                        "", // Empty description
                        teamId,
                        testUser.username,
                        (error, result) => {
                            if (error) {
                                resolve(error);
                            } else {
                                reject();
                            }
                        }
                    );
                });
                assert.strictEqual(resolvedError.error, "board-insert-failed");
                assert.strictEqual(resolvedError.reason, "Inputs can not be an empty string");
            } catch {
                assert.fail("Adding a board with an empty description did NOT give an error");
            }
        }).timeout(10000);

        /**
         * Test case for too long board description.
         */
        it('errors with invalid description during insert: exceeds character limit 150', async function () {
            // create test user for logging username
            Accounts.createUser(testUser);

            const teamId = TeamCollection.insert({ _id: "testTeamId", teamName: "Test Team" });

            // A description longer than 150 characters
            const longDescription = "a".repeat(151);

            // Wrap the Meteor.call in a Promise
            try {
                const resolvedError = await new Promise((resolve, reject) => {
                    Meteor.call("add_board",
                        testBoardData.boardName,
                        testBoardData.boardCode,
                        testBoardData.boardDeadline,
                        longDescription, // Use the long description here
                        teamId,
                        testUser.username,
                        (error, result) => {
                            if (error) {
                                resolve(error);
                            } else {
                                reject();
                            }
                        }
                    );
                });
                assert.strictEqual(resolvedError.error, "board-insert-failed");
                assert.strictEqual(resolvedError.reason, "Board description can not exceed 150 characters");
            } catch {
                assert.fail("Adding a board with a too long description did NOT give an error");
            }
        }).timeout(10000);

        /**
         * Test case for invalid deadline format.
         */
        it('errors with invalid deadline during insert: incorrect date time format', async function () {
            // create test user for logging username
            Accounts.createUser(testUser);

            const teamId = TeamCollection.insert({ _id: "testTeamId", teamName: "Test Team" });

            // Wrap the Meteor.call in a Promise
            try {
                const resolvedError = await new Promise((resolve, reject) => {
                    Meteor.call("add_board",
                        testBoardData.boardName,
                        testBoardData.boardCode,
                        "invalid date",
                        testBoardData.boardDescription,
                        teamId,
                        testUser.username,
                        (error, result) => {
                            if (error) {
                                resolve(error);
                            } else {
                                reject();
                            }
                        }
                    );
                });
                assert.strictEqual(resolvedError.error, "board-insert-failed");
                assert.strictEqual(resolvedError.reason, "Invalid deadline date");
            } catch {
                assert.fail("Adding a board with a too long description did NOT give an error");
            }
        }).timeout(10000);

        /**
         * Test case to check if a board can be updated successfully.
         */
        it('can update board details', function () {

            // create test user for logging username
            Accounts.createUser(testUser);

            const teamId = TeamCollection.insert({ _id: "testTeamId", teamName: "Test Team" });

            // insert in a board to edit
            const boardId = BoardCollection.insert(testBoard);

            // create edited board object
            const editedBoard = {
                boardName: "new board",
                boardCode: "updated123",
                boardDeadline: "2024-10-05T17:55:00.000Z",
                boardDescription: "edited description string",
                teamId: teamId,
                boardStatuses: [
                    { "statusName": "To Do", "statusOrder": 1 },
                    { "statusName": "New Status", "statusOrder": 2 },
                    { "statusName": "Done", "statusOrder": 3 }
                ],
                boardTags: [{ tagName: "test2", tagColour: "#fff000" }],
            }

            // call update method
            Meteor.call('update_board', boardId, editedBoard, testUser.username);

            // get updated board object and check all updated
            const updatedBoard = BoardCollection.findOne(boardId);
            assert.strictEqual(updatedBoard.boardName, 'new board');
            assert.strictEqual(updatedBoard.boardCode, 'updated123');
            assert.strictEqual(updatedBoard.boardDeadline, '2024-10-05T17:55:00.000Z');
            assert.strictEqual(updatedBoard.boardDescription, 'edited description string');
            assert.strictEqual(updatedBoard.teamId, 'testTeamId');
            assert.deepEqual(updatedBoard.boardStatuses, [
                { "statusName": "To Do", "statusOrder": 1 },
                { "statusName": "New Status", "statusOrder": 2 },
                { "statusName": "Done", "statusOrder": 3 }
            ]);
            assert.deepEqual(updatedBoard.boardTags, [{ tagName: "test2", tagColour: "#fff000" }]);
        });

        /**
         * Test case for updating with missing boardId.
         */
        it('errors with missing boardId during update: missing boardId', async function () {
            // create test user for logging username
            Accounts.createUser(testUser);

            const teamId = TeamCollection.insert({ _id: "testTeamId", teamName: "Test Team" });

            // create edited board object
            const editedBoard = {
                boardName: "new board",
                boardCode: "updated123",
                boardDeadline: "2024-10-05T17:55:00.000Z",
                boardDescription: "edited description string",
                teamId: teamId,
                boardStatuses: [
                    { "statusName": "To Do", "statusOrder": 1 },
                    { "statusName": "New Status", "statusOrder": 2 },
                    { "statusName": "Done", "statusOrder": 3 }
                ],
                boardTags: [{ tagName: "test2", tagColour: "#fff000" }],
            };

            // Call update method with missing boardId (undefined)
            try {
                const resolvedError = await new Promise((resolve, reject) => {
                    Meteor.call('update_board', undefined, editedBoard, testUser.username, (error) => {
                        if (error) {
                            resolve(error);
                        } else {
                            reject();
                        }
                    });
                });
                assert.ok(resolvedError.message.includes("Match failed"));
            } catch {
                assert.fail("Updating a board with missing boardId did NOT give an error");
            }
        }).timeout(10000);


        /**
         * Test case for updating with board name whose type is incorrect.
         */
        it('errors with invalid board name during update: incorrect type', async function () {
            // create test user for logging username
            Accounts.createUser(testUser);

            // insert in a board to edit
            const boardId = BoardCollection.insert(testBoard);

            // create edited board object
            const editedBoard = {
                boardName: 123,
                boardCode: "code123",
                boardDeadline: "2025-10-02T13:55:00.000Z",
                boardDescription: "description string",
                teamId: "testTeamId",
                boardTags: [{ tagName: "test1", tagColour: "#000000" }],
                boardStatuses: [
                    { statusName: "To Do", statusOrder: 1 },
                    { statusName: "Done", statusOrder: 2 }
                ],
            };

            // Call update method with incorrect board name type
            try {
                const resolvedError = await new Promise((resolve, reject) => {
                    Meteor.call('update_board', boardId, editedBoard, testUser.username, (error) => {
                        if (error) {
                            resolve(error);
                        } else {
                            reject();
                        }
                    });
                });
                assert.ok(resolvedError.message.includes("Match failed"));
            } catch {
                assert.fail("Updating a board with an invalid board name did NOT give an error");
            }
        }).timeout(10000);

        /**
         * Test case for updating with empty board name.
         */
        it('errors with invalid board name during update: empty string', async function () {
            // create test user for logging username
            Accounts.createUser(testUser);

            // insert in a board to edit
            const boardId = BoardCollection.insert(testBoard);

            // create edited board object
            const editedBoard = {
                boardName: "",
                boardCode: "code123",
                boardDeadline: "2025-10-02T13:55:00.000Z",
                boardDescription: "description string",
                teamId: "testTeamId",
                boardTags: [{ tagName: "test1", tagColour: "#000000" }],
                boardStatuses: [
                    { statusName: "To Do", statusOrder: 1 },
                    { statusName: "Done", statusOrder: 2 }
                ],
            };

            // Call update method with empty board name
            try {
                const resolvedError = await new Promise((resolve, reject) => {
                    Meteor.call('update_board', boardId, editedBoard, testUser.username, (error) => {
                        if (error) {
                            resolve(error);
                        } else {
                            reject();
                        }
                    });
                });
                assert.strictEqual(resolvedError.error, "board-update-failed");
                assert.strictEqual(resolvedError.reason, "Inputs can not be an empty string");
            } catch {
                assert.fail("Updating a board with an empty board name did NOT give an error");
            }
        }).timeout(10000);


        /**
         * Test case for updating board with name exceeding 30 characters.
         */

        it('errors with invalid board name during update: exceeds character limit 30', async function () {
            // create test user for logging username
            Accounts.createUser(testUser);

            // insert in a board to edit
            const boardId = BoardCollection.insert(testBoard);

            // create edited board object
            const editedBoard = {
                boardName: "a".repeat(31),
                boardCode: "code123",
                boardDeadline: "2025-10-02T13:55:00.000Z",
                boardDescription: "description string",
                teamId: "testTeamId",
                boardTags: [{ tagName: "test1", tagColour: "#000000" }],
                boardStatuses: [
                    { statusName: "To Do", statusOrder: 1 },
                    { statusName: "Done", statusOrder: 2 }
                ],
            };

            // Call update method with board name exceeding 30 characters
            try {
                const resolvedError = await new Promise((resolve, reject) => {
                    Meteor.call('update_board', boardId, editedBoard, testUser.username, (error) => {
                        if (error) {
                            resolve(error);
                        } else {
                            reject();
                        }
                    });
                });
                assert.strictEqual(resolvedError.error, "board-update-failed");
                assert.strictEqual(resolvedError.reason, "Board name can not exceed 30 characters");
            } catch {
                assert.fail("Updating a board with a too long board name did NOT give an error");
            }
        }).timeout(10000);


        /**
         * Test case for updating with board code with length exceeding 10 characters during update.
         */
        it('errors with invalid board code during update: exceeds character limit 10', async function () {
            // create test user for logging username
            Accounts.createUser(testUser);

            // insert in a board to edit
            const boardId = BoardCollection.insert(testBoard);

            // create edited board object
            const editedBoard = {
                boardName: "test_board",
                boardCode: "a".repeat(11),
                boardDeadline: "2025-10-02T13:55:00.000Z",
                boardDescription: "description string",
                teamId: "testTeamId",
                boardTags: [{ tagName: "test1", tagColour: "#000000" }],
                boardStatuses: [
                    { statusName: "To Do", statusOrder: 1 },
                    { statusName: "Done", statusOrder: 2 }
                ],
            };

            // Call update method with board code exceeding 10 characters
            try {
                const resolvedError = await new Promise((resolve, reject) => {
                    Meteor.call('update_board', boardId, editedBoard, testUser.username, (error) => {
                        if (error) {
                            resolve(error);
                        } else {
                            reject();
                        }
                    });
                });
                assert.strictEqual(resolvedError.error, "board-update-failed");
                assert.strictEqual(resolvedError.reason, "Board code can not exceed 10 characters");
            } catch {
                assert.fail("Updating a board with a too long board code did NOT give an error");
            }
        }).timeout(10000);


        /**
         * Test case for updating with empty board code.
         */
        it('errors with invalid board code during update: empty string', async function () {
            // create test user for logging username
            Accounts.createUser(testUser);

            // insert in a board to edit
            const boardId = BoardCollection.insert(testBoard);

            // create edited board object
            const editedBoard = {
                boardName: "test_board",
                boardCode: "",
                boardDeadline: "2025-10-02T13:55:00.000Z",
                boardDescription: "description string",
                teamId: "testTeamId",
                boardTags: [{ tagName: "test1", tagColour: "#000000" }],
                boardStatuses: [
                    { statusName: "To Do", statusOrder: 1 },
                    { statusName: "Done", statusOrder: 2 }
                ],
            };

            // Call update method with empty board code
            try {
                const resolvedError = await new Promise((resolve, reject) => {
                    Meteor.call('update_board', boardId, editedBoard, testUser.username, (error) => {
                        if (error) {
                            resolve(error);
                        } else {
                            reject();
                        }
                    });
                });
                assert.strictEqual(resolvedError.error, "board-update-failed");
                assert.strictEqual(resolvedError.reason, "Inputs can not be an empty string");
            } catch {
                assert.fail("Updating a board with an empty board code did NOT give an error");
            }
        }).timeout(10000);




        /**
         * Test case for updating with non-alphanumeric board code.
         */
        it('errors with invalid board code during update: non-alphanumeric characters', async function () {
            // create test user for logging username
            Accounts.createUser(testUser);

            // insert in a board to edit
            const boardId = BoardCollection.insert(testBoard);

            // create edited board object
            const editedBoard = {
                boardName: "test_board",
                boardCode: "code123@",
                boardDeadline: "2025-10-02T13:55:00.000Z",
                boardDescription: "description string",
                teamId: "testTeamId",
                boardTags: [{ tagName: "test1", tagColour: "#000000" }],
                boardStatuses: [
                    { statusName: "To Do", statusOrder: 1 },
                    { statusName: "Done", statusOrder: 2 }
                ],
            };

            // Call update method with non-alphanumeric board code
            try {
                const resolvedError = await new Promise((resolve, reject) => {
                    Meteor.call('update_board', boardId, editedBoard, testUser.username, (error) => {
                        if (error) {
                            resolve(error);
                        } else {
                            reject();
                        }
                    });
                });
                assert.strictEqual(resolvedError.error, "board-update-failed");
                assert.strictEqual(resolvedError.reason, "Board code can only contain letters and numbers");
            } catch {
                assert.fail("Updating a board with a non-alphanumeric board code did NOT give an error");
            }
        }).timeout(10000);

        /**
         * Test case for updating with invalid board description.
         */
        it('errors with invalid description during update: incorrect type', async function () {
            // create test user for logging username
            Accounts.createUser(testUser);

            // insert in a board to edit
            const boardId = BoardCollection.insert(testBoard);

            // create edited board object
            const editedBoard = {
                boardName: "test_board",
                boardCode: "code123",
                boardDeadline: "2025-10-02T13:55:00.000Z",
                boardDescription: 123, // Invalid description, should be a string
                teamId: "testTeamId",
                boardTags: [{ tagName: "test1", tagColour: "#000000" }],
                boardStatuses: [
                    { statusName: "To Do", statusOrder: 1 },
                    { statusName: "Done", statusOrder: 2 }
                ],
            };

            // Call update method with invalid description
            try {
                const resolvedError = await new Promise((resolve, reject) => {
                    Meteor.call('update_board', boardId, editedBoard, testUser.username, (error) => {
                        if (error) {
                            resolve(error);
                        } else {
                            reject();
                        }
                    });
                });
                assert.ok(resolvedError.message.includes("Match failed"));
            } catch {
                assert.fail("Updating a board with an invalid description did NOT give an error");
            }
        }).timeout(10000);


        /**
         * Test case for updating with empty board description.
         */

        it('errors with invalid description during update: empty string', async function () {
            // create test user for logging username
            Accounts.createUser(testUser);

            // insert in a board to edit
            const boardId = BoardCollection.insert(testBoard);

            // create edited board object
            const editedBoard = {
                boardName: "test_board",
                boardCode: "code123",
                boardDeadline: "2025-10-02T13:55:00.000Z",
                boardDescription: "", // Empty description
                teamId: "testTeamId",
                boardTags: [{ tagName: "test1", tagColour: "#000000" }],
                boardStatuses: [
                    { statusName: "To Do", statusOrder: 1 },
                    { statusName: "Done", statusOrder: 2 }
                ],
            };

            // Call update method with empty description
            try {
                const resolvedError = await new Promise((resolve, reject) => {
                    Meteor.call('update_board', boardId, editedBoard, testUser.username, (error) => {
                        if (error) {
                            resolve(error);
                        } else {
                            reject();
                        }
                    });
                });
                assert.strictEqual(resolvedError.error, "board-update-failed");
                assert.strictEqual(resolvedError.reason, "Inputs can not be an empty string");
            } catch {
                assert.fail("Updating a board with an empty description did NOT give an error");
            }
        }).timeout(10000);



        /**
         * Test case for updating with board description exceeding 150 characters.
         */

        it('errors with invalid description during update: exceeds character limit 150', async function () {
            // create test user for logging username
            Accounts.createUser(testUser);

            // insert in a board to edit
            const boardId = BoardCollection.insert(testBoard);

            // A description longer than 150 characters
            const longDescription = "a".repeat(151);

            // create edited board object
            const editedBoard = {
                boardName: "test_board",
                boardCode: "code123",
                boardDeadline: "2025-10-02T13:55:00.000Z",
                boardDescription: longDescription, // Use the long description here
                teamId: "testTeamId",
                boardTags: [{ tagName: "test1", tagColour: "#000000" }],
                boardStatuses: [
                    { statusName: "To Do", statusOrder: 1 },
                    { statusName: "Done", statusOrder: 2 }
                ],
            };

            // Call update method with description exceeding 150 characters
            try {
                const resolvedError = await new Promise((resolve, reject) => {
                    Meteor.call('update_board', boardId, editedBoard, testUser.username, (error) => {
                        if (error) {
                            resolve(error);
                        } else {
                            reject();
                        }
                    });
                });
                assert.strictEqual(resolvedError.error, "board-update-failed");
                assert.strictEqual(resolvedError.reason, "Board description can not exceed 150 characters");
            } catch {
                assert.fail("Updating a board with a too long description did NOT give an error");
            }
        }).timeout(10000);


        /**
         * Test case for updating with invalid deadline format.
         */

        it('errors with invalid deadline during update: incorrect date time format', async function () {
            // create test user for logging username
            Accounts.createUser(testUser);

            // insert in a board to edit
            const boardId = BoardCollection.insert(testBoard);

            // create edited board object
            const editedBoard = {
                boardName: "test_board",
                boardCode: "code123",
                boardDeadline: "invalid date",
                boardDescription: "description string",
                teamId: "testTeamId",
                boardTags: [{ tagName: "test1", tagColour: "#000000" }],
                boardStatuses: [
                    { statusName: "To Do", statusOrder: 1 },
                    { statusName: "Done", statusOrder: 2 }
                ],
            };

            // Call update method with invalid deadline format
            try {
                const resolvedError = await new Promise((resolve, reject) => {
                    Meteor.call('update_board', boardId, editedBoard, testUser.username, (error) => {
                        if (error) {
                            resolve(error);
                        } else {
                            reject();
                        }
                    });
                });
                assert.strictEqual(resolvedError.error, "board-update-failed");
                assert.strictEqual(resolvedError.reason, "Invalid deadline date");
            } catch {
                assert.fail("Updating a board with an invalid deadline format did NOT give an error");
            }
        }).timeout(10000);


        /**
         * Test case for updating a non-existent board.
         */
        it('errors with updating a non-existent boardId', async function () {
            // create test user for logging username
            Accounts.createUser(testUser);

            // create edited board object
            const editedBoard = {
                boardName: "test_board",
                boardCode: "code123",
                boardDeadline: "2025-10-02T13:55:00.000Z",
                boardDescription: "description string",
                teamId: "testTeamId",
                boardTags: [{ tagName: "test1", tagColour: "#000000" }],
                boardStatuses: [
                    { statusName: "To Do", statusOrder: 1 },
                    { statusName: "Done", statusOrder: 2 }
                ],
            };

            // Call update method with non-existent boardId
            try {
                const resolvedError = await new Promise((resolve, reject) => {
                    Meteor.call('update_board', "non-existent-id", editedBoard, testUser.username, (error) => {
                        if (error) {
                            resolve(error);
                        } else {
                            reject();
                        }
                    });
                });
                assert.strictEqual(resolvedError.error, "board-update-failed");
                assert.strictEqual(resolvedError.reason, "Board does not exist");
            } catch {
                assert.fail("Updating a non-existent board did NOT give an error");
            }
        }).timeout(10000);




        /**
         * Test case for deleting a board successfully.
         */
        it('can delete a board', function () {
            // create test user for logging username
            Accounts.createUser(testUser);

            // insert a collection to delete
            const boardId = BoardCollection.insert(testBoardData);

            // call delete method for deletion
            Meteor.call('delete_board', boardId, testUser.username);

            // check deleted team is DELETED
            const deletedBoard = BoardCollection.findOne(boardId);
            assert.strictEqual(deletedBoard, undefined);
        });

    });
}