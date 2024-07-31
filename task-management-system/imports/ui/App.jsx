import React from 'react';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import "../../client/main.css"

// import Button from 'react-bootstrap/Button';
import ExamplesPage from './components/pages/examples/Examples';
import TeamCreationPage from './components/pages/team/TeamCreationPage';
import HomePage from './components/pages/HomePage';

export const App = () => (
    <div className={""}>
        <Router>
            <Routes>
                <Route path="/examples" element={<ExamplesPage/>}/>
                <Route path="/team-creation" element={<TeamCreationPage/>}/>
                <Route path='/dashboard' element={<HomePage/>}/>  
            </Routes>
        </Router>

    </div>
);