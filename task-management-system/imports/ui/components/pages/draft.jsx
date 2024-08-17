import React from 'react';
import {useSubscribe, useTracker} from 'meteor/react-meteor-data'
import { getUserInfo } from '../util';
import WhiteBackground from '../general/whiteBackground/WhiteBackground';
import Button from '../general/buttons/Button';
import TeamCollection from '../../../api/collections/team.js'      


const DraftPage = () => {
    const userData = getUserInfo();
    console.log("console info on dis foking page:");
    console.log(userData);
    console.log(userData.name);
    const userEmail = userData.email;
    console.log(userData.id);

    const isLoading = useSubscribe('all_user_teams', userEmail)();

    const teamsData = useTracker(() => {
        if (!isLoading) {
            return TeamCollection.find({ teamMembers: userEmail }).fetch();
        }
        return [];
    }, [userEmail, isLoading]);

    const handleClick = () => {
        console.log("button clicked!!!")
        console.log("teamsData:")
        console.log(userEmail)
        console.log("Render:", teamsData);    
        console.log("team leader:", teamsData[0].teamLeader)
    }

    return (
        <WhiteBackground>

            <div>
                <h1>Draft Page</h1>
                <Button
                    onClick={ handleClick }
                    >Click me</Button>
            </div>

        </WhiteBackground>

    );
};

export default DraftPage;