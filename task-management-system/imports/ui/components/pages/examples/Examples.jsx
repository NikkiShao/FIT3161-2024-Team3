/**
 * File Description: Examples page
 * Updated Date: 20/07/2024
 * Contributors: Nikki
 * Version: 1.0
 */

import React from 'react';
import WhiteBackground from "../../general/whiteBackground/WhiteBackground.jsx";
import PageLayout from "../../../enums/PageLayout";
import ButtonExamples from "./ButtonExamples";
import CardExamples from "./CardExamples";
import ModalExamples from "./ModalExamples";
import InputExamples from "./InputExamples";
import TableExample from "./TableExample";

/**
 * Examples page component
 */
export const ExamplesPage = () => {
    return (
        <WhiteBackground pageLayout={PageLayout.LARGE_CENTER}>

            <h1>Examples Page</h1>

            <h2>Table Example</h2>
            <TableExample/>

            <h2>Card Examples</h2>
            <CardExamples/>

            <h2>Input Examples</h2>
            <InputExamples/>

            <h2>Button Examples</h2>
            <ButtonExamples/>

            <h2>Modal (popup) Example</h2>
            <ModalExamples/>

        </WhiteBackground>
    );
};

export default ExamplesPage;