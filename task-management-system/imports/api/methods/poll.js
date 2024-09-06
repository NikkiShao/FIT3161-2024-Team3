/**
 * File Description: Poll database entity
 * File version: 2.0
 * Contributors: Nikki，Mark
 */

import PollCollection from "../collections/poll";

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

        PollCollection.insert({
            pollTitle: title,
            pollCreationDate: new Date().toISOString(),
            pollDeadlineDate: deadline,
            pollOptions: optionsFormatted,
            teamId: teamId
        })
    },

    /**
     * Updates an entire poll with new data
     *
     * @param updatedPollData - the updated poll data
     */
    "update_poll": function (pollId, updatedPollData) {
        const poll = PollCollection.findOne({ _id: updatedPollData.pollId });
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