/**
 * File Description: Account Settings Page
 * Contributors: Mark, Audrey, Nikki
 * Version: 1.3
 */

import React, {useState} from 'react';

import WhiteBackground from "../general/whiteBackground/WhiteBackground";
import PageLayout from "../../enums/PageLayout";
import VotePollModal from '../general/modal/VotePollModal';

/**
 * Account settings page component
 */
function Preview() {

    const helpText = "preview";

    return (
        <WhiteBackground pageLayout={PageLayout.LARGE_CENTER} pageHelpText={helpText}>
            <h1>Preview Page</h1>
            <VotePollModal/>
        </WhiteBackground>
    );
}

export default Preview;
