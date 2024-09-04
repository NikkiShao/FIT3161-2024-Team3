/**
 * File Description: Dashboard page
 * File version: 1.1
 * Contributors: Samuel
 */

import React from 'react';
import { getUserInfo } from "/imports/ui/components/util";
import PinnedTasks from "/imports/ui/components/pages/dashboard/PinnedTasks";
import UpcomingDeadlines from './dashboard/UpcomingDeadlines.jsx';
import UnvotedPolls from './dashboard/UnvotedPolls.jsx';

export const DashboardPage = () => {
    const userInfo = getUserInfo();

    return (
        <div className="dashboard-container">
            <div className='dashboard-wrap-container'>
                <UpcomingDeadlines />
                <UnvotedPolls/>
            </div>
            <PinnedTasks userInfo={userInfo} />
        </div>
    );
};

export default DashboardPage;
