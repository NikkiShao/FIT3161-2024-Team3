/**
 * File Description: Task database testing
 * File version: 1.0
 * Contributors: Nikki
 */

import {Meteor} from "meteor/meteor";
import {Accounts} from "meteor/accounts-base";
import {resetDatabase} from 'meteor/xolvio:cleaner';
import "../imports/api/methods/task";
import TaskCollection from "../imports/api/collections/task";
import BoardCollection from "../imports/api/collections/board";

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

        const testBoard = {
            boardName: "test board",
            boardCode: "code123",
            boardDeadline: "2024-09-05T17:55:00.000Z",
            boardDescription: "description string",
            teamId: "testTeamId",
            boardTags: [{tagName: "test1", tagColour: "#000000"}],
            boardStatuses: [
                {"statusName": "To Do", "statusOrder": 1},
                {"statusName": "Done", "statusOrder": 2}
            ],
        }

        const testPinnedTaskData = {
            taskName: "test task",
            taskDesc: "test description",
            taskDeadlineDate: "2024-09-05T17:55:00.000Z",
            taskIsPinned: false,
            boardId: "", // added dynamically during test cases
            statusName: "Done",
            tagNames: ["a", "b"],
            contributions: [{email: "test@test.com", percent: 12}],
        }

        const testUnpinnedTaskData = {
            taskName: "test task",
            taskDesc: "test description",
            taskDeadlineDate: "2024-09-05T17:55:00.000Z",
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

            // insert board which task belongs to
            const boardId = BoardCollection.insert(testBoard);
            testPinnedTaskData.boardId = boardId;

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

            // insert board which task belongs to
            const boardId = BoardCollection.insert(testBoard);
            testUnpinnedTaskData.boardId = boardId;

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

        // todo: here add test cases for EACH input being invalid for ADDING a task

        /**
         * Test case to check if a task can be updated successfully.
         */
        it('can update task details', function () {

            // create test user for logging username
            Accounts.createUser(testUser);

            // insert board which task belongs to
            const boardId = BoardCollection.insert(testBoard);
            testPinnedTaskData.boardId = boardId;

            // insert in a team to edit
            const taskId = TaskCollection.insert(testPinnedTaskData);

            // create edited task object
            const editedTask = {
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


        /**
         * Test case to check if a task can be deleted successfully.
         */
        it('can delete task', function () {

            // create test user for logging username
            Accounts.createUser(testUser);

            // insert board which task belongs to
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

        }).timeout(10000);


    });
}
