import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import "../../client/main.css"
import "../../client/text.css"

import EmptyPage from "./components/pages/EmptyPage";

import SignInPage from "./components/pages/SignInPage";
import RegistrationPage from "./components/pages/registration/RegistrationPage";
import AccountCreatedPage from "./components/pages/registration/AccountCreatedPage";
import EmailVerificationPage from "./components/pages/registration/EmailVerificationPage";

import DashboardPage from "./components/pages/dashboard/DashboardPage";
import AccountSettingPage from '../ui/components/pages/AccountSettingPage';
import InvitationResponsePage from "./components/pages/team/InvitationResponsePage";

import TeamsListPage from './components/pages/team/TeamsListPage';
import TeamLobbyPage from "./components/pages/team/TeamLobbyPage";
import TeamSettingsPage from './components/pages/team/TeamSettingsPage';

import ViewBoardPage from "./components/pages/board/ViewBoard"
import BoardSettings from "./components/pages/board/BoardSettings";
import BoardLogsMenu from "./components/pages/board/BoardLogsMenu";
import BoardLog from "./components/pages/board/BoardLog";

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

                    {/* base & home routes */}
                    <Route path="*" element={<EmptyPage/>}/>

                    <Route path={'/'} element={
                        <ProtectedRoute accessReq={RoutingAccess.SIGNED_OUT_ONLY}>
                            <SignInPage/>
                        </ProtectedRoute>
                    }/>

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

                    <Route path={'/' + BaseUrlPath.SETTINGS} element={
                        <ProtectedRoute accessReq={RoutingAccess.SIGNED_IN_ONLY}>
                            <AccountSettingPage/>
                        </ProtectedRoute>
                    }/>

                    {/* Teams related routes */}
                    <Route path={'/' + BaseUrlPath.TEAMS} element={
                        <ProtectedRoute accessReq={RoutingAccess.SIGNED_IN_ONLY}>
                            <TeamsListPage/>
                        </ProtectedRoute>
                    }/>

                    <Route path={'/' + BaseUrlPath.TEAMS + '/:teamId' + '/settings'} element={
                        <ProtectedRoute accessReq={RoutingAccess.SIGNED_IN_ONLY}>
                            <TeamSettingsPage/>
                        </ProtectedRoute>
                    }/>

                    <Route path={'/' + BaseUrlPath.TEAMS + '/:teamId'} element={
                        <ProtectedRoute accessReq={RoutingAccess.SIGNED_IN_ONLY}>
                            <TeamLobbyPage/>
                        </ProtectedRoute>
                    }/>

                    <Route path={'/accept-invite/:teamId/:token'} element={
                        <InvitationResponsePage/>
                    }/>

                    <Route path={'/decline-invite/:teamId/:token'} element={
                        <InvitationResponsePage/>
                    }/>

                    {/* Boards related routes */}
                    <Route path={'/' + BaseUrlPath.TEAMS + '/:teamId/boards/:boardId/settings'} element={
                        <ProtectedRoute accessReq={RoutingAccess.SIGNED_IN_ONLY}>
                            <BoardSettings/>
                        </ProtectedRoute>
                    }/>

                    <Route path={'/' + BaseUrlPath.TEAMS + '/:teamId/boards/:boardId'} element={
                        <ProtectedRoute accessReq={RoutingAccess.SIGNED_IN_ONLY}>
                            <ViewBoardPage/>
                        </ProtectedRoute>
                    }/>

                    <Route path={'/' + BaseUrlPath.TEAMS + '/:teamId/logs'} element={
                        <ProtectedRoute accessReq={RoutingAccess.SIGNED_IN_ONLY}>
                            <BoardLogsMenu/>
                        </ProtectedRoute>
                    }/>

                    <Route path={'/' + BaseUrlPath.TEAMS + '/:teamId/logs/:boardId'} element={
                        <ProtectedRoute accessReq={RoutingAccess.SIGNED_IN_ONLY}>
                            <BoardLog/>
                        </ProtectedRoute>
                    }/>

                </Routes>
            </main>
        </Router>
    </div>
);

