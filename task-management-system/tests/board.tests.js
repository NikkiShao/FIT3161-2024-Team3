/**
 * File Description: Board database testing
 * File version: 1.0
 * Contributors: Nikki
 */

import {Meteor} from "meteor/meteor";
import {Accounts} from "meteor/accounts-base";
const assert = require('assert');
import {resetDatabase} from 'meteor/xolvio:cleaner';
import "../imports/api/methods/board";
import BoardCollection from "../imports/api/collections/board";

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
            boardDeadline: "2024-09-05T17:55:00.000Z",
            boardDescription: "description string",
            teamId: "testTeamId",
        }

        const testBoard = {
            boardName: "test board",
            boardCode: "code123",
            boardDeadline: "2024-09-05T17:55:00.000Z",
            boardDescription: "description string",
            teamId: "testTeamId",
            "boardTags": [{tagName: "test1", tagColour: "#000000"}],
            "boardStatuses": [
                {"statusName": "To Do", "statusOrder": 1},
                {"statusName": "Done", "statusOrder": 2}
            ],
        }

        /**
         * Test case to check if a board can be added successfully.
         */
        it('can add a board', function () {

            // create test user for logging username
            Accounts.createUser(testUser);

            // Wrap the Meteor.call in a Promise
            return new Promise((resolve, reject) => {
                Meteor.call("add_board",
                    testBoardData.boardName,
                    testBoardData.boardCode,
                    testBoardData.boardDeadline,
                    testBoardData.boardDescription,
                    testBoardData.teamId,
                    testUser.username,
                    (error, boardId) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(boardId);
                        }
                    }
                );
            }).then(boardId => {
                // check board ID is NOT undefined
                assert.notStrictEqual(boardId, undefined);
                // find board object and check it is not null
                const board = BoardCollection.findOne(boardId);
                assert.notStrictEqual(board, null);
            }).catch(error => {
                assert.fail("Error adding board. Returned with error:" + error.message);
            });
        }).timeout(10000);

        // todo: here add test cases for EACH input being invalid for ADDING a board

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
                    {"statusName": "To Do", "statusOrder": 1},
                    {"statusName": "New Status", "statusOrder": 2},
                    {"statusName": "Done", "statusOrder": 3}
                ],
                boardTags: [{tagName: "test2", tagColour: "#fff000"}],
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
                {"statusName": "To Do", "statusOrder": 1},
                {"statusName": "New Status", "statusOrder": 2},
                {"statusName": "Done", "statusOrder": 3}
            ]);
            assert.deepEqual(updatedBoard.boardTags, [{tagName: "test2", tagColour: "#fff000"}]);
        });

        // todo: here add test cases for EACH input being invalid for UPDATING a board


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
        it('errors on deleting nonexistent board', function () {

            // create test user for logging username
            Accounts.createUser(testUser);

            // call delete method for deletion
            return new Promise((resolve, reject) => {
                Meteor.call('delete_board', "nonexistentId", testUser.username, (error) => {
                    if (error) {
                        resolve(error)

                    } else {
                        reject()
                    }
                });
            }).then((resolvedError) => {
                assert.strictEqual(resolvedError.error, "board-delete-failed");
                assert.strictEqual(resolvedError.reason, "Board not found");

            }).catch(() => {
                assert.fail("Deleting a nonexistent board did NOT give an error");
            })

        }).timeout(10000);


    });
}
