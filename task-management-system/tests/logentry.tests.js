/**
 * File Description: Log Entry testing
 * File version: 1.1
 * Contributors: Sam
 */

import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import { resetDatabase } from 'meteor/xolvio:cleaner';
import LogEntryCollection from "../imports/api/collections/logEntry";
import "../imports/api/methods/logEntry";

const assert = require('assert');

/**
 * Test suite for log entry methods (client-side testing).
 */
if (Meteor.isClient) {
    describe('LogEntry methods', function () {

        const testUser = {
            username: "testUser",
            password: "testPassword",
            email: "test@test.com",
            profile: {
                name: "Test User",
                notificationOn: true
            }
        };

        const validLogEntry = {
            logEntryAction: "Task completed",
            username: testUser.username,
            teamId: "team123",
            boardId: "board123",
            taskId: "task123"
        };

        beforeEach(function () {
            resetDatabase(); // Clear the collection before each test
        });

        /**
         * Test case to check if a log entry can be added successfully.
         */
        it('can add a log entry', function () {
            Accounts.createUser(testUser);

            return new Promise((resolve, reject) => {
                Meteor.call("logEntry.insert",
                    validLogEntry.logEntryAction,
                    validLogEntry.username,
                    validLogEntry.teamId,
                    validLogEntry.boardId,
                    validLogEntry.taskId,
                    (error, logId) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(logId);
                        }
                    }
                );
            }).then(logId => {
                assert.notStrictEqual(logId, undefined);
                const actualLogEntry = LogEntryCollection.findOne(logId);
                assert.notStrictEqual(actualLogEntry, null);
            }).catch(error => {
                assert.fail("Error adding log entry: " + error.message);
            });
        }).timeout(10000);

        /**
         * Test case for missing logEntryAction.
         */
        it('errors with missing logEntryAction', function () {
            Accounts.createUser(testUser);

            let isError = false;

            return new Promise((resolve, reject) => {
                Meteor.call("logEntry.insert",
                    null, // Missing logEntryAction
                    validLogEntry.username,
                    validLogEntry.teamId,
                    validLogEntry.boardId,
                    validLogEntry.taskId,
                    (error) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve();
                        }
                    }
                );
            }).catch((error) => {
                isError = true;
                assert.strictEqual(error.error, 400);
            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for missing logEntryAction");
                }
            });
        }).timeout(10000);

        /**
         * Test case for invalid logEntryAction format.
         */
        it('errors with invalid logEntryAction format', function () {
            Accounts.createUser(testUser);

            let isError = false;

            return new Promise((resolve, reject) => {
                Meteor.call("logEntry.insert",
                    12345, // Invalid logEntryAction (should be a string)
                    validLogEntry.username,
                    validLogEntry.teamId,
                    validLogEntry.boardId,
                    validLogEntry.taskId,
                    (error) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve();
                        }
                    }
                );
            }).catch((error) => {
                isError = true;
                assert.strictEqual(error.error, 400);
            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for invalid logEntryAction format");
                }
            });
        }).timeout(10000);

        /**
         * Test case for missing username.
         */
        it('errors with missing username', function () {
            Accounts.createUser(testUser);

            let isError = false;

            return new Promise((resolve, reject) => {
                Meteor.call("logEntry.insert",
                    validLogEntry.logEntryAction,
                    null, // Missing username
                    validLogEntry.teamId,
                    validLogEntry.boardId,
                    validLogEntry.taskId,
                    (error) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve();
                        }
                    }
                );
            }).catch((error) => {
                isError = true;
                assert.strictEqual(error.error, 400);
            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for missing username");
                }
            });
        }).timeout(10000);

        /**
         * Test case for invalid username format.
         */
        it('errors with invalid username format', function () {
            Accounts.createUser(testUser);

            let isError = false;

            return new Promise((resolve, reject) => {
                Meteor.call("logEntry.insert",
                    validLogEntry.logEntryAction,
                    12345, // Invalid username (should be a string)
                    validLogEntry.teamId,
                    validLogEntry.boardId,
                    validLogEntry.taskId,
                    (error) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve();
                        }
                    }
                );
            }).catch((error) => {
                isError = true;
                assert.strictEqual(error.error, 400);
            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for invalid username format");
                }
            });
        }).timeout(10000);

        /**
         * Test case for missing teamId.
         */
        it('errors with missing teamId', function () {
            Accounts.createUser(testUser);

            let isError = false;

            return new Promise((resolve, reject) => {
                Meteor.call("logEntry.insert",
                    validLogEntry.logEntryAction,
                    validLogEntry.username,
                    null, // Missing teamId
                    validLogEntry.boardId,
                    validLogEntry.taskId,
                    (error) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve();
                        }
                    }
                );
            }).catch((error) => {
                isError = true;
                assert.strictEqual(error.error, 400);
            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for missing teamId");
                }
            });
        }).timeout(10000);

        /**
         * Test case for invalid teamId format.
         */
        it('errors with invalid teamId format', function () {
            Accounts.createUser(testUser);

            let isError = false;

            return new Promise((resolve, reject) => {
                Meteor.call("logEntry.insert",
                    validLogEntry.logEntryAction,
                    validLogEntry.username,
                    12345, // Invalid teamId (should be a string)
                    validLogEntry.boardId,
                    validLogEntry.taskId,
                    (error) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve();
                        }
                    }
                );
            }).catch((error) => {
                isError = true;
                assert.strictEqual(error.error, 400);
            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for invalid teamId format");
                }
            });
        }).timeout(10000);

        /**
         * Test case for missing boardId.
         */
        it('errors with missing boardId', function () {
            Accounts.createUser(testUser);

            let isError = false;

            return new Promise((resolve, reject) => {
                Meteor.call("logEntry.insert",
                    validLogEntry.logEntryAction,
                    validLogEntry.username,
                    validLogEntry.teamId,
                    null, // Missing boardId
                    validLogEntry.taskId,
                    (error) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve();
                        }
                    }
                );
            }).catch((error) => {
                isError = true;
                assert.strictEqual(error.error, 400);
            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for missing boardId");
                }
            });
        }).timeout(10000);

        /**
         * Test case for invalid boardId format.
         */
        it('errors with invalid boardId format', function () {
            Accounts.createUser(testUser);

            let isError = false;

            return new Promise((resolve, reject) => {
                Meteor.call("logEntry.insert",
                    validLogEntry.logEntryAction,
                    validLogEntry.username,
                    validLogEntry.teamId,
                    12345, // Invalid boardId (should be a string)
                    validLogEntry.taskId,
                    (error) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve();
                        }
                    }
                );
            }).catch((error) => {
                isError = true;
                assert.strictEqual(error.error, 400);
            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for invalid boardId format");
                }
            });
        }).timeout(10000);

        /**
         * Test case for invalid taskId format.
         */
        it('errors with invalid taskId format', function () {
            Accounts.createUser(testUser);

            let isError = false;

            return new Promise((resolve, reject) => {
                Meteor.call("logEntry.insert",
                    validLogEntry.logEntryAction,
                    validLogEntry.username,
                    validLogEntry.teamId,
                    validLogEntry.boardId,
                    12345, // Invalid taskId (should be a string or null)
                    (error) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve();
                        }
                    }
                );
            }).catch((error) => {
                isError = true;
                assert.strictEqual(error.error, 400);
            }).then(() => {
                if (!isError) {
                    assert.fail("Did not provide required error for invalid taskId format");
                }
            });
        }).timeout(10000);

        /**
         * Test case to allow taskId to be null.
         */
        it('allows taskId to be null', function () {
            Accounts.createUser(testUser);

            return new Promise((resolve, reject) => {
                // Insert log entry with taskId set to null
                Meteor.call("logEntry.insert",
                    validLogEntry.logEntryAction,
                    validLogEntry.username,
                    validLogEntry.teamId,
                    validLogEntry.boardId,
                    null, // taskId is null
                    (error, logId) => {
                        if (error) {
                            reject(new Error(`Error inserting log entry with null taskId: ${error.message}`));
                        } else {
                            resolve(logId);
                        }
                    }
                );
            }).then(logId => {
                assert.notStrictEqual(logId, undefined, "Log entry ID should not be undefined");
            }).catch(error => {
                assert.fail("Error allowing taskId to be null: " + error.message);
            });
        }).timeout(10000);

        /**
         * Test case for duplicate log entries with different logIds.
         */
         it('allows duplicate log entries with different logIds', function () {
             Accounts.createUser(testUser);

             return new Promise((resolve, reject) => {
                 // Insert the first log entry
                 Meteor.call("logEntry.insert",
                     validLogEntry.logEntryAction,
                     validLogEntry.username,
                     validLogEntry.teamId,
                     validLogEntry.boardId,
                     validLogEntry.taskId,
                     (error, firstLogId) => {
                         if (error) {
                             reject(new Error(`Error inserting first log entry: ${error.message}`));
                         } else {
                             // Insert a second identical log entry
                             Meteor.call("logEntry.insert",
                                 validLogEntry.logEntryAction,
                                 validLogEntry.username,
                                 validLogEntry.teamId,
                                 validLogEntry.boardId,
                                 validLogEntry.taskId,
                                 (error, secondLogId) => {
                                     if (error) {
                                         reject(new Error(`Error inserting second log entry: ${error.message}`));
                                     } else {
                                         resolve({ firstLogId, secondLogId });
                                     }
                                 }
                             );
                         }
                     }
                 );
             }).then(({ firstLogId, secondLogId }) => {
                 assert.notStrictEqual(firstLogId, undefined, "First log entry ID should not be undefined");
                 assert.notStrictEqual(secondLogId, undefined, "Second log entry ID should not be undefined");

                 // Ensure that both log entries have different IDs
                 assert.notStrictEqual(firstLogId, secondLogId, 'Duplicate log entries should have different logIds');
             }).catch(error => {
                 assert.fail(`Error inserting duplicate log entries: ${error.message}`);
             });
         }).timeout(10000);
    });
}
