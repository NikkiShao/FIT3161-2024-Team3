import React from 'react';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import "../../client/main.css"

// import Button from 'react-bootstrap/Button';
import ExamplesPage from "./components/pages/examples/Examples";
import RegistrationPage from "./components/pages/registration/RegistrationPage";
import AccountCreatedPage from "./components/pages/registration/AccountCreatedPage";
import EmailVerificationPage from "./components/pages/registration/EmailVerificationPage";
import HomePage from "./components/pages/HomePage";
import TeamCreationPage from './components/pages/team/TeamCreationPage';

export const App = () => (
    <div className={""}>
        <Router>
            <Routes>
                <Route path="/examples" element={<ExamplesPage/>}/>

                <Route path="/dashboard" element={<HomePage/>}/>

                <Route path="/register" element={<RegistrationPage/>}/>
                <Route path="/account-created/:username" element={<AccountCreatedPage/>}/>
                <Route path="/verify-email/:token" element={<EmailVerificationPage/>}/>

                <Route path="/team-creation" element={<TeamCreationPage/>}/>
            </Routes>
        </Router>

    </div>
);