/**
 * File Description: User database testing
 * File version: 1.0
 * Contributors: Nikki
 */

import {Meteor} from "meteor/meteor";
import {Accounts} from "meteor/accounts-base";
import {resetDatabase} from 'meteor/xolvio:cleaner';
import "../imports/api/methods/user.js";
import UserCollection from "../imports/api/collections/user";
import sinon from 'sinon';

const assert = require('assert');


/**
 * Test suite for client-side booking methods.
 */
if (Meteor.isClient) {
    /**
     * Describes test cases for booking methods.
     */
    describe('User methods', function () {

        const testUser1 = {
            _id: "testUserId1",
            username: "testUser1",
            password: "testPassword",
            emails: [{address: "test@test.com", verified: true}],
            profile: {
                name: "Test User 1",
                notificationOn: true
            }
        };

        const testUser1Input = {
            _id: "testUserId1",
            username: "testUser1",
            password: "testPassword",
            email: "test@test.com",
            profile: {
                name: "Test User 1",
                notificationOn: true
            }
        };

        const testUser2 = {
            _id: "testUserId2",
            username: "testUser2",
            password: "testPassword",
            emails: [{address: "test2@test2.com", verified: false}],
            profile: {
                name: "Test User 2",
                notificationOn: false
            }
        };

        const testUser2Input = {
            _id: "testUserId2",
            username: "testUser2",
            password: "testPassword",
            email: "test2@test2.com",
            profile: {
                name: "Test User 2",
                notificationOn: false
            }
        };

        beforeEach(function () {
            resetDatabase(); // Clear the collection before each test

            sinon.stub(UserCollection, "insert").callsFake((userObject) => {
                return userObject._id;
            });
            sinon.stub(UserCollection, "find").returns({
                fetch: sinon.stub().returns([testUser1, testUser2])
            });
            sinon.stub(Meteor.users, "update");
            sinon.stub(Meteor.users, "remove");

        });

        afterEach(function () {
            UserCollection.insert.restore();
            Meteor.users.update.restore();
            UserCollection.find.restore();
            Meteor.users.remove.restore();
        })

        // update_user_info

        /**
         * Test case to check if user can be updated successfully: update_user_info
         */
        it('can update user information with valid inputs', function () {
            // insert test user
            const userId = UserCollection.insert(testUser1)

            Meteor.call("update_user_info", userId, 'New Name', 'newemail@email.com', false)

            // get arguments that the method stub was called with
            const [actualUserId, actualUpdateObject] = Meteor.users.update.getCall(0).args

            // now check that the data is updated correctly
            assert.strictEqual(actualUserId, userId);
            assert.notStrictEqual(actualUpdateObject["$set"], undefined);
            assert.strictEqual(actualUpdateObject["$set"]["profile.name"], 'New Name');
            assert.strictEqual(actualUpdateObject["$set"]["emails.0.address"], 'newemail@email.com');
            assert.deepEqual(actualUpdateObject["$set"]["emails.0.verified"], false);
            assert.strictEqual(actualUpdateObject["$set"]["profile.notificationOn"], false);

        }).timeout(10000);

        /**
         * Test cases to check invalid name inputs for update_user_info
         */
        it('errors with invalid name: empty name', function () {

            // insert test user
            const userId = UserCollection.insert(testUser1)

            // call delete method for deletion
            return new Promise((resolve, reject) => {
                Meteor.call('update_user_info', userId, '', 'newemail@email.com', false, (error) => {
                    if (error) {
                        resolve(error)

                    } else {
                        reject()
                    }
                });
            }).then((resolvedError) => {
                assert.strictEqual(resolvedError.error, "user-update-failed")
                assert.strictEqual(resolvedError.reason, "Invalid name input");

            }).catch(() => {
                assert.fail("Did not provide required error for invalid empty name input");
            })

        }).timeout(5000);
        
        it('errors with invalid name: too long name > 30 characters', function () {

            // insert test user
            const userId = UserCollection.insert(testUser1)

            // call delete method for deletion
            return new Promise((resolve, reject) => {
                Meteor.call('update_user_info', userId, '0123456789012345678901234567891', 'newemail@email.com', false, (error) => {
                    if (error) {
                        resolve(error)

                    } else {
                        reject()
                    }
                });
            }).then((resolvedError) => {
                assert.strictEqual(resolvedError.error, "user-update-failed")
                assert.strictEqual(resolvedError.reason, "Invalid name input");

            }).catch(() => {
                assert.fail("Did not provide required error for invalid name input that is too long");
            })

        })
        it('errors with invalid name: special characters', function () {

            // insert test user
            const userId = UserCollection.insert(testUser1)

            // call delete method for deletion
            return new Promise((resolve, reject) => {
                Meteor.call('update_user_info', userId, 'Name!', 'newemail@email.com', false, (error) => {
                    if (error) {
                        resolve(error)

                    } else {
                        reject()
                    }
                });
            }).then((resolvedError) => {
                assert.strictEqual(resolvedError.error, "user-update-failed")
                assert.strictEqual(resolvedError.reason, "Invalid name input");

            }).catch(() => {
                assert.fail("Did not provide required error for invalid name with special character");
            })

        })

        /**
         * Test cases to check invalid email inputs for update_user_info
         */
        it('errors with invalid email: empty email', function () {

            // insert test user
            const userId = UserCollection.insert(testUser1)

            // call delete method for deletion
            return new Promise((resolve, reject) => {
                Meteor.call('update_user_info', userId, 'New Name', '', false, (error) => {
                    if (error) {
                        resolve(error)

                    } else {
                        reject()
                    }
                });
            }).then((resolvedError) => {
                assert.strictEqual(resolvedError.error, "user-update-failed")
                assert.strictEqual(resolvedError.reason, "Invalid email input");

            }).catch(() => {
                assert.fail("Did not provide required error for invalid empty email input");
            })

        })
        it('errors with invalid email: invalid email format', function () {

            // insert test user
            const userId = UserCollection.insert(testUser1)

            // call delete method for deletion
            return new Promise((resolve, reject) => {
                Meteor.call('update_user_info', userId, 'New Name', 'invalidEmail', false, (error) => {
                    if (error) {
                        resolve(error)

                    } else {
                        reject()
                    }
                });
            }).then((resolvedError) => {
                assert.strictEqual(resolvedError.error, "user-update-failed")
                assert.strictEqual(resolvedError.reason, "Invalid email input");

            }).catch(() => {
                assert.fail("Did not provide required error for invalid email format input");
            })

        })
        it('errors with invalid email: existing email', function () {

            // insert test user
            Accounts.createUser(testUser1Input);
            Accounts.createUser(testUser2Input);

            const userId1 = UserCollection.insert(testUser1)
            const userId2 = UserCollection.insert(testUser2)

            // call delete method for deletion
            return new Promise((resolve, reject) => {
                Meteor.call('update_user_info', userId1, 'New Name', 'test2@test2.com', false, (error) => {
                    if (error) {
                        resolve(error)

                    } else {
                        reject()
                    }
                });
            }).then((resolvedError) => {
                assert.strictEqual(resolvedError.error, "user-update-failed")
                assert.strictEqual(resolvedError.reason, "Email address already exists");

            }).catch(() => {
                assert.fail("Did not provide required error for changing to existing email");
            })

        }).timeout(10000);

        /**
         * Test cases to check invalid email inputs for update_user_info
         */
        it('errors with invalid notification status: incorrect type', function () {

            // insert test user
            const userId1 = UserCollection.insert(testUser1)

            // call delete method for deletion
            return new Promise((resolve, reject) => {
                Meteor.call('update_user_info', userId1, 'New Name', 'test@test.com', 'On', (error) => {
                    if (error) {
                        resolve(error)

                    } else {
                        reject()
                    }
                });
            }).then((resolvedError) => {
                assert.strictEqual(resolvedError.error, 400)
                assert.strictEqual(resolvedError.reason, "Match failed");

            }).catch(() => {
                assert.fail("Did not provide required error for changing with wrong notification type");
            })

        }).timeout(10000);


        // delete_user
        /**
         * Test case to check if a team can be deleted successfully.
         */
        it('can delete a user', function () {
            // create members of team
            let userId = UserCollection.insert(testUser1)

            // call delete method for deletion
            Meteor.call('delete_user', userId);

            // get arguments that the method stub was called with
            const [actualUserId] = Meteor.users.remove.getCall(0).args
            assert.strictEqual(actualUserId, userId);

        });

    });
}
