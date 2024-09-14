/**
 * File Description: Poll database entity
 * File version: 1.3
 * Contributors: Nikki, Mark
 */

import PollCollection from "../collections/poll";
import {Meteor} from "meteor/meteor";
import BoardCollection from "../collections/board";

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
        console.log("display pollId:", pollId)

        return pollId;
    },

    /**
     * Deletes the poll.
     *
     * @param pollId - ID of poll to delete
     */
    "delete_poll": async function (pollId) {
        const poll = PollCollection.findOne(pollId);
        if (!poll) {
            throw new Meteor.Error('poll-delete-failed', 'Poll not found');
        }

        // delete the poll
        PollCollection.remove({_id: pollId});

    },

    /**
     * Updates an entire poll with new data
     *
     * @param pollId - ID of poll to update
     * @param updatedPollData - the updated poll data
     */
    "update_poll": function (pollId, updatedPollData) {
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