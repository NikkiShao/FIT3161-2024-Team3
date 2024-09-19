/**
 * File Description: Board database testing
 * File version: 1.2
 * Contributors: Nikki, Mark
 */

import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
const assert = require('assert');
import { resetDatabase } from 'meteor/xolvio:cleaner';
import "../imports/api/methods/board";
import "../imports/api/methods/logEntry";
import BoardCollection from "../imports/api/collections/board";
import TeamCollection from "../imports/api/collections/team";


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
        it('errors with invalid board name: incorrect type', async function () {
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
        it('errors with invalid board name: empty string', async function () {
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
        it('errors with invalid board name: exceeds character limit', async function () {
            // create test user for logging username
            Accounts.createUser(testUser);

            const teamId = TeamCollection.insert({ _id: "testTeamId", teamName: "Test Team" });

            // Wrap the Meteor.call in a Promise
            try {
                const resolvedError = await new Promise((resolve, reject) => {
                    Meteor.call("add_board",
                        "This is a very long board name that is over 30 characters",
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
                assert.strictEqual(resolvedError.reason, "Board name can not exceed 30 characters");
            } catch {
                assert.fail("Adding a board with a too long board name did NOT give an error");
            }
        }).timeout(10000);

        /**
         * Test case for invalid board code.
         */
        it('errors with invalid board code: incorrect type', async function () {
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
        it('errors with invalid board code: empty string', async function () {
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
        it('errors with invalid board code: exceeds character limit', async function () {
            // create test user for logging username
            Accounts.createUser(testUser);

            const teamId = TeamCollection.insert({ _id: "testTeamId", teamName: "Test Team" });

            // Wrap the Meteor.call in a Promise
            try {
                const resolvedError = await new Promise((resolve, reject) => {
                    Meteor.call("add_board",
                        testBoardData.boardName,
                        "This is a very long board code that is over 10 characters",
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
        it('errors with invalid board code: non-alphanumeric characters', async function () {
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
         * Test case for duplicate board code.
         */
        it('errors with invalid board code: duplicate code', async function () {
            // create test user for logging username
            Accounts.createUser(testUser);

            const teamId = TeamCollection.insert({ _id: "testTeamId", teamName: "Test Team" });

            // Insert a board with a specific code
            const firstBoardId = BoardCollection.insert({
                boardName: "First Board",
                boardCode: "code123",
                boardDeadline: "2024-10-05T17:55:00.000Z",
                boardDescription: "First board description",
                teamId: teamId,
                boardTags: [],
                boardStatuses: [
                    { statusName: "To Do", statusOrder: 1 },
                    { statusName: "Done", statusOrder: 2 },
                ],
            });

            // Try adding another board with the same code
            try {
                const resolvedError = await new Promise((resolve, reject) => {
                    Meteor.call(
                        "add_board",
                        "Second Board",
                        "code123", // Duplicate code
                        "2025-01-01T12:00:00.000Z",
                        "Second board description",
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
                assert.strictEqual(resolvedError.reason, "Board code already exists");
            } catch {
                assert.fail("Adding a board with a duplicate board code did NOT give an error");
            }
        }).timeout(10000);

        /**
         * Test case for invalid board description.
         */
        it('errors with invalid description: incorrect type', async function () {
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
        it('errors with invalid description: empty string', async function () {
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
        it('errors with invalid description: exceeds character limit', async function () {
            // create test user for logging username
            Accounts.createUser(testUser);

            const teamId = TeamCollection.insert({ _id: "testTeamId", teamName: "Test Team" });

            // A description longer than 150 characters
            const longDescription = "This is a very long description that exceeds the character limit. " +
                "It should trigger a validation error because it is longer than 150 characters. " +
                "This additional text ensures the limit is surpassed.";

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
         * Test case for invalid boardId.
         */
        it('errors with invalid boardId: incorrect type', async function () {
            // create test user for logging username
            Accounts.createUser(testUser);

            // create edited board object
            const editedBoard = {
                boardName: "new board",
                boardCode: "updated123",
                boardDeadline: "2024-10-05T17:55:00.000Z",
                boardDescription: "edited description string",
                teamId: "testTeamId",
                boardStatuses: [
                    { "statusName": "To Do", "statusOrder": 1 },
                    { "statusName": "New Status", "statusOrder": 2 },
                    { "statusName": "Done", "statusOrder": 3 }
                ],
                boardTags: [{ tagName: "test2", tagColour: "#fff000" }],
            };

            // Call update method with an invalid boardId
            try {
                const resolvedError = await new Promise((resolve, reject) => {
                    Meteor.call('update_board', 123, editedBoard, testUser.username, (error) => {
                        if (error) {
                            resolve(error);
                        } else {
                            reject();
                        }
                    });
                });
                assert.ok(resolvedError.message.includes("Match failed"));
            } catch {
                assert.fail("Updating a board with an invalid boardId did NOT give an error");
            }
        }).timeout(10000);

        /**
         * Test case for missing board details.
         */
        it('errors with invalid boardData: missing details', async function () {
            // create test user for logging username
            Accounts.createUser(testUser);

            // insert a board to edit
            const boardId = BoardCollection.insert(testBoard);

            // Call update method with missing board details
            try {
                const resolvedError = await new Promise((resolve, reject) => {
                    Meteor.call('update_board', boardId, "", testUser.username, (error) => {
                        if (error) {
                            resolve(error);
                        } else {
                            reject();
                        }
                    });
                });
                assert.ok(resolvedError.message.includes("Match failed"));
            } catch {
                assert.fail("Updating a board with missing board details did NOT give an error");
            }
        }).timeout(10000);

        /**
         * Test case for missing boardId.
         */
        it('errors with missing boardId: missing boardId', async function () {
            // create test user for logging username
            Accounts.createUser(testUser);

            // create edited board object
            const editedBoard = {
                boardName: "new board",
                boardCode: "updated123",
                boardDeadline: "2024-10-05T17:55:00.000Z",
                boardDescription: "edited description string",
                teamId: "testTeamId",
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
         * Test case for invalid boardData.
         */
        it('errors with invalid boardData: incorrect type', async function () {
            // create test user for logging username
            Accounts.createUser(testUser);

            // insert a board to edit
            const boardId = BoardCollection.insert(testBoard);

            // Call update method with invalid boardData
            try {
                const resolvedError = await new Promise((resolve, reject) => {
                    Meteor.call('update_board', boardId, 123, testUser.username, (error) => {
                        if (error) {
                            resolve(error);
                        } else {
                            reject();
                        }
                    });
                });
                assert.ok(resolvedError.message.includes("Match failed"));
            } catch {
                assert.fail("Updating a board with invalid boardData did NOT give an error");
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

        /**
         * Test case for deleting a nonexistent board.
         */
        it('errors with invalid boardId: nonexistent board', async function () {
            // create test user for logging username
            Accounts.createUser(testUser);

            // call delete method for deletion
            try {
                const resolvedError = await new Promise((resolve, reject) => {
                    Meteor.call('delete_board', "nonexistentId", testUser.username, (error) => {
                        if (error) {
                            resolve(error);
                        } else {
                            reject();
                        }
                    });
                });
                assert.strictEqual(resolvedError.error, "board-delete-failed");
                assert.strictEqual(resolvedError.reason, "Board not found");
            } catch {
                assert.fail("Deleting a nonexistent board did NOT give an error");
            }
        }).timeout(10000);
    });
}