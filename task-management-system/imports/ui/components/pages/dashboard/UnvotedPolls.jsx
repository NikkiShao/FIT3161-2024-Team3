/**
 * File Description: Unvoted polls component for dashboard
 * File version: 1.0
 * Contributors: Audrey
 */
import React from 'react';
import {useSubscribe, useTracker} from 'meteor/react-meteor-data';
import {getUserInfo} from '../../util';
import TeamCollection from '../../../../api/collections/team.js';
import PollCollection from '../../../../api/collections/poll.js';
import Spinner from "react-bootstrap/Spinner";
import HoverTip from "../../general/hoverTip/HoverTip";
import QuestionMarkCircleIcon from "@heroicons/react/16/solid/QuestionMarkCircleIcon";
import Button from "../../general/buttons/Button";
import {useNavigate, useParams} from "react-router-dom";

/**
 * Unvoted polls component for dashboard
 * @returns {Element}
 * @constructor
 */
export const UnvotedPolls = () =>  {
    const userInfo = getUserInfo();
    const navigate = useNavigate();

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
    console.log(pollData);

    //uncomment when add polls is done
    const pollsToDo = pollData.filter((poll)=>{
        const deadline = new Date(poll.pollDeadlineDate);
        const today = new Date();
        const daysLeft = Math.floor((deadline - today) / (24 * 60 * 60 * 1000));
        const unvotedPolls = poll.pollOptions.every(option => !option.voterIds.includes(userInfo.id));
        return unvotedPolls && (daysLeft >= 0);
    });

    console.log(pollsToDo);

    // for help hover
    const questionIcon = <QuestionMarkCircleIcon color={"var(--dark-grey)"} strokeWidth={2} viewBox="0 0 16 16" width={25} height={25}/>;
    const helpText = "This section shows the polls to do.";

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
                              outerText={"Help"}
                              toolTipText={helpText}
                              divClassName={"page-help-tip"}
                              textClassname
                    />
                    <h2 className={"dashboard-column-title"}>Polls To Do</h2>
                    {pollsToDo.length? 
                    <div className='teams__cards-div '>
                        {pollsToDo.map((poll)=>(
                            <div className='card-base' style={{padding:'15px'}}>
                            <span style={{fontSize:'20px', fontWeight:'700', overflow:'hidden'}}>{poll.pollTitle}</span>
                            <div>
                            <label className={"text-grey"} style={{fontSize: '15px', marginRight:'5px'}}>Team:  </label>
                            <span style={{fontSize: '15px'}}> {teamsData.find(team => team._id === poll.teamId).teamName} </span>
                            </div>
                            <div>
                            <label className={"text-grey"} style={{fontSize: '15px', marginRight:'5px'}}>Deadline:  </label>
                            <span style={{fontSize: '15px'}}>
                            {new Date(poll.pollDeadlineDate).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                            })}</span>
                            </div>
                            <Button className="btn-brown" onClick={() => navigate('/teams/' + poll.teamId + '/polls/' + poll._id)}>
                                Go To Polls
                            </Button>
                        </div>
                        ))}

                    </div> :
                    <span className={"main-text non-clickable"}>
                        You don't have polls to do.
                    </span>}
            </div>
            );
    }
};

export default UnvotedPolls;