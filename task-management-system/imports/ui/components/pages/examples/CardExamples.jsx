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
                taskName={"Task 1 aaaaaaaaa aaaaaa aaaaaaaaaa aa aaaaaaaaaaaaa  aaaaa aaa aaaaaaaaa"}
                taskDeadline={"2024-07-31T06:23:34.733Z"}
                isPinned={false}
                onDashboard={true}
                tags={[{
                    tagName: "tag1",
                    tagColour: "#fcd6ab",
                }, {
                    tagName: "tagtag2",
                    tagColour: "#b3d9ae",
                }, {
                    tagName: "tagtagtag3",
                    tagColour: "#ced0dc",
                }, {
                    tagName: "tagtagtag4",
                    tagColour: "#aaacbd",
                }
                ]}
                boardId={"11111"}>
            </TaskCard>

            <span>
            This is a task card on the BOARD: on click, it will open up the task popup
            </span>
            <TaskCard
                taskName={"BBB"}
                taskDeadline={"2024-07-25T06:23:34.733Z"}
                isPinned={true}
                onDashboard={false}
                tags={[{
                    tagName: "a",
                    tagColour: "#f5f0d7",
                }, {
                    tagName: "b",
                    tagColour: "#ccb7e3",
                }, {
                    tagName: "c",
                    tagColour: "#e7adc0",
                }
                ]}
                boardId={"222222"}>
            </TaskCard>
            <TaskCard
                taskName={"BBB"}
                taskDeadline={"2024-08-12T06:23:34.733Z"}
                isPinned={true}
                onDashboard={false}
                tags={[{
                    tagName: "a",
                    tagColour: "#f5f0d7",
                }, {
                    tagName: "b",
                    tagColour: "#ccb7e3",
                }, {
                    tagName: "c",
                    tagColour: "#e7adc0",
                }
                ]}
                boardId={"222222"}>
            </TaskCard>

        </div>
    );
};

export default CardExamples;