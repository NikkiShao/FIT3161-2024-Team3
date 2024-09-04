/**
 * File Description: Card examples
 * Updated Date: 20/07/2024
 * Contributors: Nikki
 * Version: 1.0
 */

import React from 'react';
import Card from "../../general/cards/Card";
import TaskCard from "../../general/cards/TaskCard";

const CardExamples = () => {

    return (
        <div className="center-spaced">
            <Card>
                <div> This is a normal card</div>
                <div> AAA</div>
                <div> BBB</div>
                <div> CCC</div>
            </Card>

            <span>
                This is a task card on the DASHBOARD: on click, takes you to the baord
            </span>
            <TaskCard
                taskId={"1"}
                taskName={"AAAA"}
                taskDeadlineDate={"2024-07-25T06:23:34.733Z"}
                statusName="To do"
                taskIsPinned={false}
                tagNames={["nom", "nom", "nom","nom"]}
                boardId={"AAA"}
                boardTags={[{tagName:"nom", tagColour:"#ffd9d9"}]}
                onDashboard={true}
            />

            <span>
            This is a task card on the BOARD: on click, it will open up the task popup
            </span>
            <TaskCard
                taskId={"1"}
                taskName={"AAAA"}
                taskDeadlineDate={"2024-07-25T06:23:34.733Z"}
                statusName="To do"
                taskIsPinned={false}
                tagNames={[]}
                boardId={"AAA"}
                boardTags={[]}
                onDashboard={false}
            />
            <TaskCard
                taskId={"1"}
                taskName={"AAAA"}
                taskDeadlineDate={"2024-07-25T06:23:34.733Z"}
                statusName="To do"
                taskIsPinned={false}
                tagNames={[]}
                boardId={"AAA"}
                boardTags={[]}
                onDashboard={false}
            />
        </div>
    );
};

export default CardExamples;