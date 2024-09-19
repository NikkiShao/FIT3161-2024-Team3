/**
 * File Description: Poll database entity
 * File version: 1.3
 * Contributors: Nikki, Mark
 */

import PollCollection from "../collections/poll";
import { Meteor } from "meteor/meteor";
import BoardCollection from "../collections/board";
import { check } from "meteor/check";
import TeamCollection from "../collections/team";

Meteor.methods({
    /**
     * Creates a new poll
     *
     * @param title - title of poll
     * @param deadline - deadline of poll
     * @param options - list of option text
     * @param teamId - ID of the team the poll belongs to
     */
    "add_poll": function (title, deadline, options, teamId) {

        // validation checks of inputs
        check(title, String);
        check(deadline, String);
        check(options, [String]);
        check(teamId, String);

        // Validate teamId exists
        if (!TeamCollection.findOne
            ({ _id: teamId })) {
            throw new Meteor.Error("poll-add-failed", "Could not retrieve team information");
        }

        // Validate poll title is not empty and does not exceed 50 characters
        if (title.trim() === "") {
            throw new Meteor.Error("poll-add-failed", "Poll title is required");
        }
        if (title.length > 100) {
            throw new Meteor.Error("poll-add-failed", "Poll title cannot exceed 50 characters");
        }

        // Validate poll deadline is a valid date and in the future
        const deadlineDate = new Date(deadline);
        if (isNaN(deadlineDate.getTime())) {
            throw new Meteor.Error("poll-add-failed", "Invalid poll deadline date");
        }
        if (deadlineDate < new Date()) {
            throw new Meteor.Error("poll-add-failed", "Poll deadline must be in the future");
        }

        // Validate deadline date format is in ISO format
        if (deadlineDate.toISOString() !== deadline) {
            throw new Meteor.Error("poll-add-failed", "Invalid poll deadline date format");
        }

        // Validate options contain at least two valid strings and none of the options are empty
        if (options.length < 2) {
            throw new Meteor.Error("poll-add-failed", "At least two poll options are required");
        }
        options.forEach(option => {
            if (option.trim() === "") {
                throw new Meteor.Error("poll-add-failed", "Poll option text cannot be empty");
            }
        });

        // Validate teamId is not empty
        if (teamId.trim() === "") {
            throw new Meteor.Error("poll-add-failed", "Invalid teamId");
        }

        const optionsFormatted = options.map((option) => {
            return {
                optionText: option,
                voterUsernames: []
            }
        })

        const pollId = PollCollection.insert({
            pollTitle: title,
            pollCreationDate: new Date().toISOString(),
            pollDeadlineDate: deadline,
            pollOptions: optionsFormatted,
            teamId: teamId
        })
        // console.log("display pollId:", pollId)

        return pollId;
    },

    /**
     * Deletes the poll.
     *
     * @param pollId - ID of poll to delete
     */
    "delete_poll": async function (pollId) {
        check(pollId, String);

        const poll = PollCollection.findOne(pollId);
        if (!poll) {
            throw new Meteor.Error('poll-delete-failed', 'Poll not found');
        }

        // delete the poll
        PollCollection.remove({ _id: pollId });

    },

    /**
     * Updates an entire poll with new data
     *
     * @param pollId - ID of poll to update
     * @param updatedPollData - the updated poll data
     */
    "update_poll": function (pollId, updatedPollData) {
        // Validate inputs
        check(pollId, String);
        check(updatedPollData, Object);

        // Check if poll exists
        if (!PollCollection.findOne({ _id: pollId })) {
            throw new Meteor.Error("poll-update-failed", "Poll not found");
        }

        // Validate the options format
        if (!Array.isArray(updatedPollData.options) || updatedPollData.options.some(option => {
            return !option.optionText || !Array.isArray(option.voterUsernames);
        })) {
            throw new Meteor.Error('invalid-options', 'Invalid options data.');
        }


        const poll = PollCollection.findOne({ _id: pollId });
        console.log("Poll: ", poll);
        if (!poll) {
            throw new Meteor.Error("Poll not found");
        }

        PollCollection.update(pollId,
            {
                $set: {
                    "pollOptions": updatedPollData.options,
                }
            }
        );
    }
});