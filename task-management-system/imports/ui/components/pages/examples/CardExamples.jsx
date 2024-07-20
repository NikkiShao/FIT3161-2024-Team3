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

            <TaskCard>
                <div> This is a task card</div>
                <div> AAA</div>
                <div> BBB</div>
                <div> CCC</div>
            </TaskCard>
        </div>
    );
};

export default CardExamples;