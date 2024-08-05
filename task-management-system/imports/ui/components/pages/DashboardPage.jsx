/**
 * File Description: Dashboard page
 * File version: 1.0
 * Contributors:
 */

import React from 'react';
import WhiteBackground from "../../components/general/whiteBackground/WhiteBackground.jsx";
import PageLayout from "../../enums/PageLayout";

/**
 * Page for user dashbaord
 */
export const DashboardPage = () => {
    return (
        <WhiteBackground pageLayout={PageLayout.LARGE_CENTER}>
            <span>Dashboard Page to be done!!</span>
        </WhiteBackground>
    );
};

export default DashboardPage;