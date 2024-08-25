/**
 * File Description: Poll database entity
 * File version: 1.0
 * Contributors: Nikki
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
                voterIds: []
            }
        })

        PollCollection.insert({
            pollTitle: title,
            pollCreationDate: new Date(),
            pollDeadlineDate: deadline,
            pollOptions: optionsFormatted,
            teamId: teamId
        })
    },
})
