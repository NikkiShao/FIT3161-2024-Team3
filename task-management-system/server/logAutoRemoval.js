/**
 * File Description: Log entry cleanup for removing entries older than one year
 * File version: 1.0
 * Contributors: Sam
 */

import { Meteor } from "meteor/meteor";
import LogEntryCollection from "/imports/api/collections/logEntry";

/**
 * Automatically cleans up log entries older than one year.
 * Runs at a specified interval.
 */
export function autoCleanOldLogEntries(hour = 8) { // Set to run at 8am by default
    const now = new Date();
    const cleanTime = new Date(now);
    cleanTime.setHours(hour, 0, 0, 0);
    const timeUntilClean = cleanTime - now;

    const dayInMilliseconds = 1000 * 60 * 60 * 24;

    // Run the task immediately and then at the specified hour every day
    cleanOldLogEntries();
    Meteor.setTimeout(() => {
        cleanOldLogEntries();
        Meteor.setInterval(cleanOldLogEntries, dayInMilliseconds);
    }, timeUntilClean);
}

/**
 * Checks the log entries to see if they are older than one year and deletes them.
 */
export function cleanOldLogEntries() {
    console.log("Starting log entry cleanup...");

    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const oneYearAgoISO = oneYearAgo.toISOString();
    console.log(`Looking for entries older than: ${oneYearAgoISO}`);

    // Use MongoDB query to directly find old entries
    const oldEntries = LogEntryCollection.find({
        logEntryDatetime: { $lt: oneYearAgoISO }
    }).fetch();

    console.log(`Found ${oldEntries.length} old log entries.`);

    if (oldEntries.length > 0) {
        const deletedCount = LogEntryCollection.remove({
            _id: { $in: oldEntries.map(entry => entry._id) }
        });
        console.log(`Deleted ${deletedCount} log entries older than one year.`);
    } else {
        console.log("No log entries older than one year found.");
    }

    console.log("Log entry cleanup finished.");
}

