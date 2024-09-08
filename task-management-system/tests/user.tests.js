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
import StubCollections from 'meteor/hwillson:stub-collections';
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

        const testUser = {
            username: "testUser1",
            password: "testPassword",
            email: "test@test.com",
            profile: {
                name: "Test User 1",
                notificationOn: true
            }
        };

        beforeEach(function () {
            resetDatabase(); // Clear the collection before each test
            // StubCollections.stub(Meteor.users)

            sinon.stub(UserCollection, "insert").returns("testUserId");


            sinon.stub(Meteor.users, "update").callsFake((a,b)=> {
                console.log(a)
                console.log(b)
            });

        });

        afterEach(function (){
            // StubCollections.restore();
            UserCollection.insert.restore();
            Meteor.users.update.restore();
        })

        /**
         * Test case to check if user can be updated successfully.
         */
        it('can update user information with valid inputs', function () {
            // insert test user
            const userId = UserCollection.insert(testUser)

            Meteor.call("update_user_info", userId, 'New Name', 'newemail@email.com', false)

            const [actualUserId, actualUpdateObject] = Meteor.users.update.getCall(0).args

            // now check that the data is updated correctly
            assert.strictEqual(actualUserId, userId);
            assert.notStrictEqual(actualUpdateObject["$set"], undefined);
            assert.strictEqual(actualUpdateObject["$set"]["profile.name"], 'New Name');
            assert.strictEqual(actualUpdateObject["$set"]["emails.0.address"], 'newemail@email.com');
            assert.deepEqual(actualUpdateObject["$set"]["emails.0.verified"], false);
            assert.strictEqual(actualUpdateObject["$set"]["profile.notificationOn"], false);

        }).timeout(10000);

        // it('errors with invalid name: empty name', async function () {
        //     // insert test user
        //     Accounts.createUser(
        //         testUser,
        //         (error) => {
        //             console.log(error)
        //         },  // this param is optional
        //     );
        //
        //
        //     // const userData = await Accounts.findUserByUsername(testUser.username);
        //     let isError = false;
        //
        //     const aaa = UserCollection.findOne({ username: testUser.username });
        //
        //     console.log("aaa", aaa)
        //     // console.log("userData", userData)
        //
        //     // Wrap the Meteor.call in a Promise
        //     // new Promise((resolve, reject) => {
        //     //     Meteor.call("update_user_info",
        //     //         userId,
        //     //         '',
        //     //         'newemail@email.com',
        //     //         false,
        //     //
        //     //         (error, result) => {
        //     //             if (error) {
        //     //                 reject(error);
        //     //             } else {
        //     //                 resolve(result);
        //     //             }
        //     //         }
        //     //     );
        //     // }).catch((error) => {
        //     //     isError = true;
        //     //     assert.strictEqual(error.error, "Invalid name input")
        //     //
        //     // }).then(() => {
        //     //     if (!isError) {
        //     //         assert.fail("Did not provide required error for invalid empty name input");
        //     //     }
        //     // });
        //     assert.strictEqual(1, "2")
        //
        // });

        // it('errors with invalid name: too long name > 30 characters', function () {
        //     // insert test user
        //     const userId = UserCollection.insert(testUser);
        //     let isError = false;
        //
        //     // Wrap the Meteor.call in a Promise
        //     new Promise((resolve, reject) => {
        //         Meteor.call("update_user_info",
        //             userId,
        //             '1234567890123456789012345678901',
        //             'newemail@email.com',
        //             false,
        //
        //             (error, result) => {
        //                 if (error) {
        //                     reject(error);
        //                 } else {
        //                     resolve(result);
        //                 }
        //             }
        //         );
        //     }).catch((error) => {
        //         isError = true;
        //         assert.strictEqual(error.error, "Invalid name input")
        //
        //     }).then(() => {
        //         if (!isError) {
        //             assert.fail("Did not provide required error for invalid name input that is too long");
        //         }
        //     });
        //
        // });


        // it('errors with invalid name: special characters', function () {
        //     // insert test user
        //     const userId = UserCollection.insert(testUser);
        //     let isError = false;
        //
        //     // Wrap the Meteor.call in a Promise
        //     new Promise((resolve, reject) => {
        //         Meteor.call("update_user_info",
        //             userId,
        //             'Name!',
        //             'newemail@email.com',
        //             false,
        //
        //             (error, result) => {
        //                 if (error) {
        //                     reject(error);
        //                 } else {
        //                     resolve(result);
        //                 }
        //             }
        //         );
        //     }).catch((error) => {
        //         isError = true;
        //         assert.strictEqual(error.error, "Invalid name input")
        //
        //     }).then(() => {
        //         if (!isError) {
        //             assert.fail("Did not provide required error for invalid name with special character");
        //         }
        //     });
        //
        // });


        // it('errors with invalid email: invalid email format', function () {
        //     // insert test user
        //     const userId = UserCollection.insert(testUser);
        //     let isError = false;
        //
        //     // Wrap the Meteor.call in a Promise
        //     new Promise((resolve, reject) => {
        //         Meteor.call("update_user_info",
        //             userId,
        //             'New Name',
        //             'newemail',
        //             false,
        //
        //             (error, result) => {
        //                 if (error) {
        //                     reject(error);
        //                 } else {
        //                     resolve(result);
        //                 }
        //             }
        //         );
        //     }).catch((error) => {
        //         isError = true;
        //         assert.strictEqual(error.error, "Invalid name input")
        //
        //     }).then(() => {
        //         if (!isError) {
        //             assert.fail("Did not provide required error for invalid email format input");
        //         }
        //     });
        //
        // });

    });
}
