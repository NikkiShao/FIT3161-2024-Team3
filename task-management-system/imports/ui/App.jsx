import React from 'react';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import "../../client/main.css"

// import Button from 'react-bootstrap/Button';
import ExamplesPage from "./components/pages/examples/Examples";

import EmptyPage from "./components/pages/EmptyPage";
import LandingPage from "./components/pages/LandingPage";

import SignInPage from "./components/pages/SignInPage";
import RegistrationPage from "./components/pages/registration/RegistrationPage";
import AccountCreatedPage from "./components/pages/registration/AccountCreatedPage";
import EmailVerificationPage from "./components/pages/registration/EmailVerificationPage";

import DashboardPage from "./components/pages/DashboardPage";
import TeamCreationModal from './components/general/modal/TeamCreationModal';
import TeamsListPage from './components/pages/team/TeamsListPage';

import NavigationBar from "./components/general/navigation/NavigationBar";
import ProtectedRoute from "./components/general/navigation/ProtectedRoute";
import RoutingAccess from "./enums/RoutingAccess";
import BaseUrlPath from "./enums/BaseUrlPath";


/**
 * Main application component
 */
export const App = () => (
    <div className={""}>

        <Router>
            <NavigationBar/>
            <main>
                <Routes>

                    {/* todo: remove examples page after development */}
                    <Route path="/examples" element={<ExamplesPage/>}/>

                    {/* base & home routes */}
                    <Route path="/" element={<LandingPage/>}/>
                    <Route path="*" element={<EmptyPage/>}/>

                    {/* Register/Sign in related pages */}
                    <Route path={'/' + BaseUrlPath.LOGIN} element={
                        <ProtectedRoute accessReq={RoutingAccess.SIGNED_OUT_ONLY}>
                            <SignInPage/>
                        </ProtectedRoute>
                    }/>

                    <Route path={'/' + BaseUrlPath.REGISTER} element={
                        <ProtectedRoute accessReq={RoutingAccess.SIGNED_OUT_ONLY}>
                            <RegistrationPage/>
                        </ProtectedRoute>
                    }/>

                    <Route path={'/' + BaseUrlPath.REGISTER + "/account-created"} element={
                        <AccountCreatedPage/>
                    }/>

                    <Route path="/verify-email/:token" element={
                        <EmailVerificationPage/>
                    }/>

                    {/* Account related pages  */}
                    <Route path={'/' + BaseUrlPath.DASHBOARD} element={
                        <ProtectedRoute accessReq={RoutingAccess.SIGNED_IN_ONLY}>
                            <DashboardPage/>
                        </ProtectedRoute>
                    }/>

                    {/* Teams related routes */}
                    <Route path={'/' + BaseUrlPath.TEAMS} element={
                        <ProtectedRoute accessReq={RoutingAccess.SIGNED_IN_ONLY}>
                            <TeamsListPage/>
                        </ProtectedRoute>
                    }/>

                    {/* Boards related routes */}


                </Routes>
            </main>
        </Router>
    </div>
);