/**
 * File Description: Empty page
 * Updated Date: 02/08/2024
 * Contributors: Nikki
 * Version: 1.0
 */

import React from 'react';
import WhiteBackground from "../general/whiteBackground/WhiteBackground";
import PageLayout from "../../enums/PageLayout";


/**
 * Non-existent page component
 */
export const EmptyPage = () => {

    return (
        <WhiteBackground pageLayout={PageLayout.SMALL_CENTER}>
            This is an empty page. There shouldn't be anything here. If you are looking for a page then your page
            has not been routed properly, check your routes.
        </WhiteBackground>
    )
}

export default EmptyPage;