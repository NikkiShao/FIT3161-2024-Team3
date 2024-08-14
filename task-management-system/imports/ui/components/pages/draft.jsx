import React from 'react';
import { getUserInfo } from '../util';
import WhiteBackground from '../general/whiteBackground/WhiteBackground';

const DraftPage = () => {
    const userData = getUserInfo();
    console.log("console info on dis foking page:");
    console.log(userData);
    console.log(userData.name);
    console.log(userData.email);
    console.log(userData.id);


    return (
        <WhiteBackground>

            <div>
                <h1>Draft Page</h1>
                
            </div>

        </WhiteBackground>

    );
};

export default DraftPage;