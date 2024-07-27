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
import Spinner from "react-bootstrap/Spinner";

/**
 * Examples page component
 */
export const ExamplesPage = () => {
    return (
        <WhiteBackground pageLayout={PageLayout.LARGE_CENTER}>

            <h1>Examples Page</h1>

            <h2>Text Examples</h2>

            <h1> Heading 1 </h1>
            <h2> Heading 2 </h2>
            <span className={"main-text"}>Main text</span>
            <span className={"large-text"}>Large text</span>
            <span className={"small-text"}>Small text</span>
            <span className={"menu-text"}>Menu text</span>
            <span className={"username-text"}>Username text</span>
            <span className={"urgent-text"}>Urgent text</span>

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
            <h2>Loading Spinner</h2>
            <Spinner animation="border" variant="secondary" role="status"/>

        </WhiteBackground>
    );
};

export default ExamplesPage;