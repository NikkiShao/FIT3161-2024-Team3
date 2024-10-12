/**
 * File Description: Sign in/login page
 * Updated Date: 02/08/2024
 * Contributors: Nikki
 * Version: 1.1
 */

import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useNavigate } from "react-router-dom";

import WhiteBackground from "../general/whiteBackground/WhiteBackground";
import PageLayout from "../../enums/PageLayout";
import Input from "../general/inputs/Input";
import Button from "../general/buttons/Button";
import BaseUrlPath from "../../enums/BaseUrlPath";

/**
 * Sign in page component
 */
export const SignInPage = () => {
    const navigate = useNavigate();

    // variables to hold inputs
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    // error string variables
    const [errors, setErrors] = useState({
        username: "",
        password: ""
    })

    // get whether it errored before in the URL
    const urlParams = new URLSearchParams(window.location.search);

    // if checks that display error is updated, prevents infinite loop
    if (urlParams.get("error") === "true" && !errors.password) {
        // don't explicitly say username or password incorrect for good security practice
        let newErrors = {}
        newErrors.password = "Username or password is incorrect";
        setErrors(newErrors)
    }

    const handleSignIn = (event) => {
        // Prevents the page from re-rendering after the sign-in button is pressed
        event.preventDefault();

        let newErrors = {}
        let isError = false;

        // inputs
        if (!username) {
            newErrors.username = "Please fill in your username";
            isError = true;
        }
        if (!password) {
            newErrors.password = "Please fill in your password";
            isError = true;
        }

        setErrors(newErrors)

        if (!isError) {
            // Using a built-in Meteor method to attempt to sign the user in.
            Meteor.loginWithPassword(username, password, (error) => {
                if (error) {
                    // could not log in ()
                    window.location.replace("?error=true")
                } else {
                    // logged in, navigate to own dashboard page
                    navigate("/" + BaseUrlPath.DASHBOARD);
                }
            });
        }
    };

    return (
        <div>
            <WhiteBackground pageLayout={PageLayout.SMALL_CENTER}>
                <div>
                    <h2 className={"text-center text-grey"}>Welcome to</h2>
                    <h1 className={"text-center"} style={{color: "var(--navy)"}}>University Task Management System</h1>
                </div>

                <hr className={"teams__hr"} />

                <h1 className={"default__heading1"}>Sign In</h1>

                <form className={"default__form"}>

                    <div className={"input-error-div"}>
                        <Input type={"text"}
                               label={<label className={"main-text"}>Username</label>}
                               onChange={(e) => setUsername(e.target.value)}
                        />
                        {errors.username && <span className="text-red small-text">{errors.username}</span>}
                    </div>

                    <div className={"input-error-div"}>
                        <Input type={"password"}
                               label={<label className={"main-text"}>Password</label>}
                               onChange={(e) => setPassword(e.target.value)}/>
                        {errors.password && <span className="text-red small-text">{errors.password}</span>}
                    </div>

                    <div className={"button-group-col"}>
                        <Button type={"submit"}
                                className={"btn-brown"}
                                onClick={handleSignIn}>
                            Login
                        </Button>
                        <Button className={"btn-grey"}
                                onClick={() => {
                                    navigate('/' + BaseUrlPath.REGISTER)
                                }}>
                            Register
                        </Button>

                    </div>
                </form>
            </WhiteBackground>

        </div>
    )
}

export default SignInPage;