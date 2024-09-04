/**
 * File Description: Unvoted polls component for dashboard
 * File version: 1.1
 * Contributors: Audrey, Nikki
 */
import React from 'react';
import {useSubscribe, useTracker} from 'meteor/react-meteor-data';
import {getUserInfo} from '../../util';
import TeamCollection from '../../../../api/collections/team.js';
import PollCollection from '../../../../api/collections/poll.js';
import Spinner from "react-bootstrap/Spinner";
import HoverTip from "../../general/hoverTip/HoverTip";
import QuestionMarkCircleIcon from "@heroicons/react/16/solid/QuestionMarkCircleIcon";
import {useNavigate} from "react-router-dom";
import PollCard from "../../general/cards/PollCard";

/**
 * Unvoted polls component for dashboard
 */
export const UnvotedPolls = () =>  {
    const userInfo = getUserInfo();

    //fetch team's data
    const isLoadingTeams = useSubscribe('all_user_teams', userInfo.email);
    const teamsData = useTracker(() => {
        return TeamCollection.find({teamMembers: userInfo.email}).fetch();
    });

    //get the polls
    let teamIds = teamsData.map((team) => team._id);
    const isLoadingPolls = useSubscribe('all_teams_polls', teamIds);
    const pollData = useTracker(() => {
        return PollCollection.find({teamId: {$in: teamIds}}).fetch();
    });

    const pollsToDo = pollData.filter((poll)=>{
        const deadline = new Date(poll.pollDeadlineDate);
        const today = new Date();
        const daysLeft = Math.floor((deadline - today) / (24 * 60 * 60 * 1000));
        const unvotedPolls = poll.pollOptions.every(option => !option.voterIds.includes(userInfo.id));
        return unvotedPolls && (daysLeft >= 0);
    });

    // for help hover
    const questionIcon = <QuestionMarkCircleIcon color={"var(--dark-grey)"} strokeWidth={2} viewBox="0 0 16 16" width={25} height={25}/>;
    const helpText = "This section shows the ongoing polls you have not voted in yet.";

    if (isLoadingTeams() || isLoadingPolls()) {
        return (
            <div className={"background-base dashboard-item dashboard-deadline-column"}>
                <Spinner animation="border" variant="secondary" role="status"/>
            </div>
    )
    } else {
        return (
            <div className={"background-base dashboard-item dashboard-deadline-column"}>
                    <HoverTip icon={questionIcon}
                              toolTipText={helpText}
                              divClassName={"page-help-tip"}
                              textClassname
                    />
                    <h2 className={"dashboard-column-title"}>Polls To Do</h2>
                    {pollsToDo.length?
                    <div className='teams__cards-div text-left-aligned'>
                        {pollsToDo.map((poll)=>(
                            <PollCard
                                key={poll._id}
                                title={poll.pollTitle}
                                startTime={poll.pollCreationDate}
                                closeTime={poll.pollDeadlineDate}
                                options={poll.pollOptions}
                                teamName={teamsData.find(team => team._id === poll.teamId).teamName}>
                            </PollCard>
                        ))}

                    </div> :
                    <span className={"main-text text-grey non-clickable"}>
                        You don't have any polls to do.
                    </span>}
            </div>
            );
    }
};

export default UnvotedPolls;