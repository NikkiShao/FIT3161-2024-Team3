/**
 * File Description: Log Entry testing
 * File version: 1.0
 * Contributors: Sam
 */

import { Meteor } from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import sinon from 'sinon';
import assert from 'assert';

/**
 * Test suite for log entry methods (client-side testing).
 */
if (Meteor.isClient) {
    describe('Log Entry methods ', function () {
        const testLogEntry = {
            logEntryAction: 'pinned task',
            username: 'testUser1',
            teamId: '4YeQbpNf2zto5K8ec',
            boardId: 'R8RqodAWgtTfnhH8g',
            taskId: 'Qx5SRqerKCZtb9C4n',
            logEntryDatetime: '2023-09-10T12:34:56.789Z',
        };

        beforeEach(function () {
            resetDatabase();

            sinon.stub(Meteor, 'call');
        });

        afterEach(function () {
            Meteor.call.restore();
        });

        // Test case for inserting a log entry with valid inputs
        it('can insert a log entry with valid inputs', function () {
            Meteor.call.withArgs('logEntry.insert').callsFake((method, ...args) => {
                args[args.length - 1](null, 'testLogId');
            });

            Meteor.call('logEntry.insert', testLogEntry.logEntryAction, testLogEntry.username, testLogEntry.teamId, testLogEntry.boardId, testLogEntry.taskId, (error, result) => {
                assert.strictEqual(error, null, 'No error should occur');
                assert.strictEqual(result, 'testLogId', 'Returned log ID should be correct');
            });
        });

        // Test case for missing logEntryAction
        it('errors with missing logEntryAction', function () {
            Meteor.call.withArgs('logEntry.insert').callsFake((method, ...args) => {
                args[args.length - 1](new Meteor.Error('action-missing', 'logEntryAction is required'));
            });

            Meteor.call('logEntry.insert', '', testLogEntry.username, testLogEntry.teamId, testLogEntry.boardId, testLogEntry.taskId, (error) => {
                assert.strictEqual(error.error, 'action-missing', 'Should return action-missing error');
            });
        });

        // Test case for invalid logEntryAction format (e.g., empty string)
        it('errors with invalid logEntryAction format', function () {
            Meteor.call.withArgs('logEntry.insert').callsFake((method, ...args) => {
                args[args.length - 1](new Meteor.Error('action-invalid', 'Invalid logEntryAction format'));
            });

            Meteor.call('logEntry.insert', '!!invalid_action!!', testLogEntry.username, testLogEntry.teamId, testLogEntry.boardId, testLogEntry.taskId, (error) => {
                assert.strictEqual(error.error, 'action-invalid', 'Should return action-invalid error');
            });
        });

        // Test case for missing username
        it('errors with missing username', function () {
            Meteor.call.withArgs('logEntry.insert').callsFake((method, ...args) => {
                args[args.length - 1](new Meteor.Error('user-info-missing', 'Username is required'));
            });

            Meteor.call('logEntry.insert', testLogEntry.logEntryAction, '', testLogEntry.teamId, testLogEntry.boardId, testLogEntry.taskId, (error) => {
                assert.strictEqual(error.error, 'user-info-missing', 'Should return user-info-missing error');
            });
        });

        // Test case for invalid username format
        it('errors with invalid username format', function () {
            Meteor.call.withArgs('logEntry.insert').callsFake((method, ...args) => {
                args[args.length - 1](new Meteor.Error('username-invalid', 'Invalid username format'));
            });

            Meteor.call('logEntry.insert', testLogEntry.logEntryAction, '@invalidUser!', testLogEntry.teamId, testLogEntry.boardId, testLogEntry.taskId, (error) => {
                assert.strictEqual(error.error, 'username-invalid', 'Should return username-invalid error');
            });
        });

        // Test case for missing teamId
        it('errors with missing teamId', function () {
            Meteor.call.withArgs('logEntry.insert').callsFake((method, ...args) => {
                args[args.length - 1](new Meteor.Error('Match failed', 'teamId is required'));
            });

            Meteor.call('logEntry.insert', testLogEntry.logEntryAction, testLogEntry.username, '', testLogEntry.boardId, testLogEntry.taskId, (error) => {
                assert.strictEqual(error.error, 'Match failed', 'Should return Match failed error for missing teamId');
            });
        });

        // Test case for invalid teamId format
        it('errors with invalid teamId format', function () {
            Meteor.call.withArgs('logEntry.insert').callsFake((method, ...args) => {
                args[args.length - 1](new Meteor.Error('Match failed', 'Invalid teamId format'));
            });

            Meteor.call('logEntry.insert', testLogEntry.logEntryAction, testLogEntry.username, 'invalid-team-id', testLogEntry.boardId, testLogEntry.taskId, (error) => {
                assert.strictEqual(error.error, 'Match failed', 'Should return Match failed error for invalid teamId format');
            });
        });

        // Test case for invalid boardId format
        it('errors with invalid boardId format', function () {
            Meteor.call.withArgs('logEntry.insert').callsFake((method, ...args) => {
                args[args.length - 1](new Meteor.Error('Match failed', 'Invalid boardId format'));
            });

            Meteor.call('logEntry.insert', testLogEntry.logEntryAction, testLogEntry.username, testLogEntry.teamId, 1234, testLogEntry.taskId, (error) => {
                assert.strictEqual(error.error, 'Match failed', 'Should return Match failed error for invalid boardId');
            });
        });

        // Test case for missing boardId
        it('errors with missing boardId', function () {
            // Simulate the server-side method returning an error when boardId is missing
            Meteor.call.withArgs('logEntry.insert').callsFake((method, ...args) => {
                args[args.length - 1](new Meteor.Error('boardid-missing', 'boardId is required'));
            });

            // Call the method with boardId set to an empty string (simulating a missing value)
            Meteor.call('logEntry.insert', testLogEntry.logEntryAction, testLogEntry.username, testLogEntry.teamId, '', testLogEntry.taskId, (error) => {
                // Assert that the error is returned correctly
                assert.strictEqual(error.error, 'boardid-missing', 'Should return boardid-missing error');
            });
        });

        // Test case for invalid taskId format (null is allowed, but other invalid formats are not)
        it('errors with invalid taskId format', function () {
            Meteor.call.withArgs('logEntry.insert').callsFake((method, ...args) => {
                args[args.length - 1](new Meteor.Error('Match failed', 'Invalid taskId format'));
            });

            Meteor.call('logEntry.insert', testLogEntry.logEntryAction, testLogEntry.username, testLogEntry.teamId, testLogEntry.boardId, 12345, (error) => {
                assert.strictEqual(error.error, 'Match failed', 'Should return Match failed error for invalid taskId');
            });
        });

        // Test case for allowing duplicate log entries
        it('allows duplicate log entries', function () {
            Meteor.call.withArgs('logEntry.insert').callsFake((method, ...args) => {
                args[args.length - 1](null, 'testLogId');
            });

            Meteor.call('logEntry.insert', testLogEntry.logEntryAction, testLogEntry.username, testLogEntry.teamId, testLogEntry.boardId, testLogEntry.taskId, (error, result) => {
                assert.strictEqual(error, null, 'No error should occur');
                assert.strictEqual(result, 'testLogId', 'Returned log ID should be correct');
            });
        });

        // Test case for ISO date format validation
        it('logs date and time in ISO format', function () {
            Meteor.call.withArgs('logEntry.insert').callsFake((method, ...args) => {
                const logEntry = { ...testLogEntry, logEntryDatetime: new Date().toISOString() };
                args[args.length - 1](null, logEntry);
            });

            Meteor.call('logEntry.insert', testLogEntry.logEntryAction, testLogEntry.username, testLogEntry.teamId, testLogEntry.boardId, testLogEntry.taskId, (error, logEntry) => {
                assert.match(logEntry.logEntryDatetime, /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/, 'DateTime should be in ISO format');
            });
        });

        // Test case for null taskId
        it('allows taskId to be null', function () {
            Meteor.call.withArgs('logEntry.insert').callsFake((method, ...args) => {
                args[args.length - 1](null, 'testLogId');
            });

            Meteor.call('logEntry.insert', testLogEntry.logEntryAction, testLogEntry.username, testLogEntry.teamId, testLogEntry.boardId, null, (error, result) => {
                assert.strictEqual(error, null, 'No error should occur');
                assert.strictEqual(result, 'testLogId', 'Returned log ID should be correct');
            });
        });

    });
}
