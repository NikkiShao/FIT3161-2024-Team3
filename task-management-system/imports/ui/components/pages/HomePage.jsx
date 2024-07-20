/**
 * File Description: Home page
 * File version: 1.0
 * Contributors:
 */

import React from 'react';
import WhiteBackground from "../../components/general/whiteBackground/WhiteBackground.jsx";
import PageLayout from "../../enums/PageLayout";

/**
 * Page of a list of Artist cards for users to see
 */
export const HomePage = () => {
    return (
        <WhiteBackground pageLayout={PageLayout.LARGE_CENTER}>
            <span>Home Page to be done!!</span>
        </WhiteBackground>
    );
};

export default HomePage;