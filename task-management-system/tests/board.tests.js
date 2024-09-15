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
            boardName: "test board",
            boardCode: "code123",
            boardDeadline: "2025-09-05T17:55:00.000Z",
            boardDescription: "description string",
            teamId: "testTeamId",
        }

        const testBoard = {
            boardName: "test_board",
            boardCode: "code123",
            boardDeadline: "2025-10-02T13:55:00.000Z",
            boardDescription: "description string",
            teamId: "testTeamId",
            "boardTags": [{ tagName: "test1", tagColour: "#000000" }],
            "boardStatuses": [
                { "statusName": "To Do", "statusOrder": 1 },
                { "statusName": "Done", "statusOrder": 2 }
            ],
        }

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
         * Test case to check if the board name is a string
         */
        it('adding board with invalid board name', async function () {

            // create test user for logging username
            Accounts.createUser(testUser);

            const teamId = TeamCollection.insert({ _id: "testTeamId", teamName: "Test Team" });

            // Wrap the Meteor.call in a Promise
            try {
                const resolvedError = await new Promise((resolve, reject) => {
                    Meteor.call("add_board",
                        123,
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
                assert.strictEqual(resolvedError.error, "invalid-name");
                assert.strictEqual(resolvedError.reason, "Board name must be a string");
            } catch {
                assert.fail("Adding a board with an invalid board name did NOT give an error");
            }
        }).timeout(10000);

        /**
         * Test case to check if the board name is not empty
         */

        it('adding board with empty board name', async function () {

            // create test user for logging username
            Accounts.createUser(testUser);

            const teamId = TeamCollection.insert({ _id: "testTeamId", teamName: "Test Team" });

            // Wrap the Meteor.call in a Promise
            try {
                const resolvedError = await new Promise((resolve, reject) => {
                    Meteor.call("add_board",
                        "",
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
                assert.strictEqual(resolvedError.error, "invalid-parameters");
                assert.strictEqual(resolvedError.reason, "Missing parameters");
            } catch {
                assert.fail("Adding a board with an empty board name did NOT give an error");
            }
        }
        ).timeout(10000);

        /**
         * Test case to check if the board name is not too long
         */

        it('adding board with too long board name', async function () {

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
                assert.strictEqual(resolvedError.error, "invalid-name");
                assert.strictEqual(resolvedError.reason, "Board name can not exceed 30 characters");
            } catch {
                assert.fail("Adding a board with a too long board name did NOT give an error");
            }
        }
        ).timeout(10000);


        /**
         * Test case to check if the board code is a string
         */

        it('adding board with invalid board code', async function () {

            // create test user for logging username
            Accounts.createUser(testUser);

            const teamId = TeamCollection.insert({ _id: "testTeamId", teamName: "Test Team" });

            // Wrap the Meteor.call in a Promise
            try {
                const resolvedError = await new Promise((resolve, reject) => {
                    Meteor.call("add_board",
                        testBoardData.boardName,
                        123,
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
                assert.strictEqual(resolvedError.error, "invalid-code");
                assert.strictEqual(resolvedError.reason, "Board code must be a string");
            } catch {
                assert.fail("Adding a board with an invalid board code did NOT give an error");
            }
        }
        ).timeout(10000);


        /**
         * Test case to check if the board code is not empty
         */

        it('adding board with empty board code', async function () {

            // create test user for logging username
            Accounts.createUser(testUser);

            const teamId = TeamCollection.insert({ _id: "testTeamId", teamName: "Test Team" });

            // Wrap the Meteor.call in a Promise
            try {
                const resolvedError = await new Promise((resolve, reject) => {
                    Meteor.call("add_board",
                        testBoardData.boardName,
                        "",
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
                assert.strictEqual(resolvedError.error, "invalid-parameters");
                assert.strictEqual(resolvedError.reason, "Missing parameters");
            } catch {
                assert.fail("Adding a board with an empty board code did NOT give an error");
            }
        }
        ).timeout(10000);


        /**
         * Test case to check if the board code is not too long
         */

        it('adding board with too long board code', async function () {

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
                assert.strictEqual(resolvedError.error, "invalid-code");
                assert.strictEqual(resolvedError.reason, "Board code can not exceed 10 characters");
            } catch {
                assert.fail("Adding a board with a too long board code did NOT give an error");
            }
        }
        ).timeout(10000);

        /**
         * Test case to check if the board code is alphanumeric
         */

        it('adding board with non-alphanumeric board code', async function () {
            // create test user for logging username
            Accounts.createUser(testUser);

            const teamId = TeamCollection.insert({ _id: "testTeamId", teamName: "Test Team" });

            // Wrap the Meteor.call in a Promise
            try {
                const resolvedError = await new Promise((resolve, reject) => {
                    Meteor.call("add_board",
                        testBoardData.boardName,
                        "code123@",
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
                assert.strictEqual(resolvedError.error, "invalid-code");
                assert.strictEqual(resolvedError.reason, "Board code can only contain letters and numbers");
            } catch {
                assert.fail("Adding a board with a non-alphanumeric board code did NOT give an error");
            }
        }
        ).timeout(10000);


        /**
         * Test case to check if the deadline is in the future
         */

        it('adding board with future deadline', async function () {
            // create test user for logging username
            Accounts.createUser(testUser);

            const teamId = TeamCollection.insert({ _id: "testTeamId", teamName: "Test Team" });

            // Wrap the Meteor.call in a Promise
            try {
                const resolvedError = await new Promise((resolve, reject) => {
                    Meteor.call("add_board",
                        testBoardData.boardName,
                        testBoardData.boardCode,
                        "2020-09-05T17:55:00.000Z",
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
                assert.strictEqual(resolvedError.error, "invalid-deadline");
                assert.strictEqual(resolvedError.reason, "Deadline must be in the future");
            } catch {
                assert.fail("Adding a board with a past deadline did NOT give an error");
            }
        }
        ).timeout(10000);


        /**
         * Test case to check if the deadline is not empty
         */

        it('adding board with empty deadline', async function () {
            // create test user for logging username
            Accounts.createUser(testUser);

            const teamId = TeamCollection.insert({ _id: "testTeamId", teamName: "Test Team" });

            // Wrap the Meteor.call in a Promise
            try {
                const resolvedError = await new Promise((resolve, reject) => {
                    Meteor.call("add_board",
                        testBoardData.boardName,
                        testBoardData.boardCode,
                        "",
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
                assert.strictEqual(resolvedError.error, "invalid-parameters");
                assert.strictEqual(resolvedError.reason, "Missing parameters");
            } catch {
                assert.fail("Adding a board with an empty deadline did NOT give an error");
            }
        }
        ).timeout(10000);


        /**
         * Test case to check if the description is a string 
         */

        it('adding board with invalid description', async function () {
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
                        123,
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
                assert.strictEqual(resolvedError.error, "invalid-description");
                assert.strictEqual(resolvedError.reason, "Board description must be a string");
            } catch {
                assert.fail("Adding a board with an invalid description did NOT give an error");
            }
        }
        ).timeout(10000);


        /**
         * Test case to check if the description is not empty
         */

        it('adding board with empty description', async function () {
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
                        "",
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
                assert.strictEqual(resolvedError.error, "invalid-parameters");
                assert.strictEqual(resolvedError.reason, "Missing parameters");
            } catch {
                assert.fail("Adding a board with an empty description did NOT give an error");
            }
        }
        ).timeout(10000);


        /**
         * Test case to check if the description is too long
         */
        it('adding board with too long description', async function () {
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
                assert.strictEqual(resolvedError.error, "invalid-description");
                assert.strictEqual(resolvedError.reason, "Board description can not exceed 150 characters");
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

            // insert in a board to edit
            const boardId = BoardCollection.insert(testBoard);

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
         * Test case to check if a boardId is a string
         */
        it('updating board with invalid boardId', async function () {

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
            }

            // call update method
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
                assert.strictEqual(resolvedError.error, "invalid-boardId");
                assert.strictEqual(resolvedError.reason, "Board ID must be a string");
            } catch {
                assert.fail("Updating a board with an invalid board ID did NOT give an error");
            }
        }).timeout(10000);

        /**
         * Test case when the boardId is missing
         */
        it('updating board with missing boardId', async function () {

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
            }

            // call update method
            try {
                const resolvedError = await new Promise((resolve, reject) => {
                    Meteor.call('update_board', "", editedBoard, testUser.username, (error) => {
                        if (error) {
                            resolve(error);
                        } else {
                            reject();
                        }
                    });
                });
                assert.strictEqual(resolvedError.error, "invalid-parameters");
                assert.strictEqual(resolvedError.reason, "Missing parameters");
            } catch {
                assert.fail("Updating a board with missing board ID did NOT give an error");
            }
        }).timeout(10000);

        /**
         * Test case when the board details are missing
         */
        it('updating board with missing board details', async function () {

            // create test user for logging username
            Accounts.createUser(testUser);

            // insert in a board to edit
            const boardId = BoardCollection.insert(testBoard);

            // call update method
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
                assert.strictEqual(resolvedError.error, "invalid-parameters");
                assert.strictEqual(resolvedError.reason, "Missing parameters");
            } catch {
                assert.fail("Updating a board with missing board details did NOT give an error");
            }
        }
        ).timeout(10000);


        /**
         * Test case when the board details are invalid
         */
        it('updating board with invalid board details', async function () {

            // create test user for logging username
            Accounts.createUser(testUser);

            // insert in a board to edit
            const boardId = BoardCollection.insert(testBoard);

            // call update method
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
                assert.strictEqual(resolvedError.error, "invalid-boardData");
                assert.strictEqual(resolvedError.reason, "Board data must be an object");
            } catch {
                assert.fail("Updating a board with invalid board details did NOT give an error");
            }
        }
        ).timeout(10000);


        /**
         * Test case to check if a board can be deleted successfully.
         */
        it('can delete board', function () {

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
         * Test case to check if a board can be deleted successfully.
         */
        it('errors on deleting nonexistent board', async function () {

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
