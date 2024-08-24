/**
 * File Description: Dashboard page
 * File version: 1.1
 * Contributors: Samuel
 */

import React from 'react';
import { getUserInfo } from "/imports/ui/components/util";
import PinnedTasks from "/imports/ui/components/pages/dashboard/PinnedTasks";

export const DashboardPage = () => {
    const userInfo = getUserInfo();

    return (
        <div className="dashboard-pinned-container">
            <PinnedTasks userInfo={userInfo} />
            {/* You can add more components here if needed */}
        </div>
    );
};

export default DashboardPage;
