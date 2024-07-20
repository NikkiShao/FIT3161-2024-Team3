import React from 'react';
import {BrowserRouter as Router, Navigate, Route, Routes} from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import "../../client/main.css"

// import Button from 'react-bootstrap/Button';
import ExamplesPage from "./components/pages/examples/Examples";


export const App = () => (
    <div className={""}>
        <Router>
            <Routes>

                <Route path="/examples" element={<ExamplesPage/>}/>


            </Routes>
        </Router>


        {/*<h1>Welcome to Meteor!</h1>*/}

        {/*<Hello/>*/}
        {/*<Info/>*/}

        {/*<Button variant="brown">*/}
        {/*    brown button*/}
        {/*</Button>*/}

        {/*<Button variant="grey">*/}
        {/*    grey button*/}
        {/*</Button>*/}

        {/*<Button variant="red">*/}
        {/*    red button*/}
        {/*</Button>*/}

        {/*<Button variant="light-grey">*/}
        {/*    light grey button*/}
        {/*</Button>*/}

        {/*<Button variant="navy-outline">*/}
        {/*    navy outline button*/}
        {/*</Button>*/}

        {/*<Form>*/}
        {/*    <Form.Group controlId="formBasicEmail">*/}

        {/*        <Form.Label>Email address</Form.Label>*/}

        {/*        <Form.Control type="email" placeholder="Enter email" />*/}

        {/*        <Form.Text className="">*/}
        {/*            We'll never share your email with anyone else.*/}
        {/*        </Form.Text>*/}

        {/*    </Form.Group>*/}
        {/*</Form>*/}

    </div>
);
