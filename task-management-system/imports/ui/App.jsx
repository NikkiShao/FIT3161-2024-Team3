import React from 'react';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import "../../client/main.css"

// import Button from 'react-bootstrap/Button';
import ExamplesPage from "./components/pages/examples/Examples";

import EmptyPage from "./components/pages/EmptyPage";

import SignInPage from "./components/pages/SignInPage";
import RegistrationPage from "./components/pages/registration/RegistrationPage";
import AccountCreatedPage from "./components/pages/registration/AccountCreatedPage";
import EmailVerificationPage from "./components/pages/registration/EmailVerificationPage";

import DashboardPage from "./components/pages/DashboardPage";
import TeamsListPage from './components/pages/team/TeamsListPage';
import TeamLobbyPage from "./components/pages/team/TeamLobbyPage";
import ViewBoardPage from "./components/pages/board/ViewBoard"
import AccountSettingPage from '../ui/components/pages/AccountSettingPage';

import NavigationBar from "./components/general/navigation/NavigationBar";
import ProtectedRoute from "./components/general/navigation/ProtectedRoute";
import RoutingAccess from "./enums/RoutingAccess";
import BaseUrlPath from "./enums/BaseUrlPath";
import TeamSettingsPage from './components/pages/team/TeamSettingsPage';import BoardSettings from "./components/pages/board/BoardSettings";
import DraftPage from './components/pages/draft';
import DeleteAccountModal from './components/general/modal/DeleteAccountModal';


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
                    <Route path={'/'} element={
                        <ProtectedRoute accessReq={RoutingAccess.SIGNED_OUT_ONLY}>
                            <SignInPage/>
                        </ProtectedRoute>
                    }/>
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
                    
                    <Route path={'/' + BaseUrlPath.TEAMS + '/:teamId' +'/settings'} element={
                        <ProtectedRoute accessReq={RoutingAccess.SIGNED_IN_ONLY}>
                            <TeamSettingsPage/>
                        </ProtectedRoute>
                    
                        // onClick={() => navigate('/' + baseUrlPath.TEAMS + '/' + team._id + '/settings')}
                    }/>
                    

                    <Route path={'/' + BaseUrlPath.TEAMS + '/:teamId'} element={
                        <ProtectedRoute accessReq={RoutingAccess.SIGNED_IN_ONLY}>
                            <TeamLobbyPage/>
                        </ProtectedRoute>
                    }/>

                    {/* Boards related routes */}
                    <Route path={'/' + BaseUrlPath.TEAMS + '/:teamId/boards/:boardId/settings'} element={
                        <ProtectedRoute accessReq={RoutingAccess.SIGNED_IN_ONLY}>
                            <BoardSettings />
                        </ProtectedRoute>
                    }/>

                     <Route path={'/' + BaseUrlPath.TEAMS + '/:teamId/boards/:boardId'} element={
                            <ProtectedRoute accessReq={RoutingAccess.SIGNED_IN_ONLY}>
                                <ViewBoardPage/>
                            </ProtectedRoute>
                     }/>

                    {/* Account setting related routes */}
                    <Route path={'/' + BaseUrlPath.SETTINGS} element={
                        <ProtectedRoute accessReq={RoutingAccess.SIGNED_IN_ONLY}>
                            <AccountSettingPage/>
                        </ProtectedRoute>
                    }/>



                    {/* {Testing routers} */}
                    <Route path={'/' + BaseUrlPath.PREVIEW} element={
                        <ProtectedRoute accessReq={RoutingAccess.SIGNED_IN_ONLY}>
                            <DraftPage/>
                        </ProtectedRoute>
                    }/>


                    
                </Routes>
                </main>
        </Router>
    </div>
);

