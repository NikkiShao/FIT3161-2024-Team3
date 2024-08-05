/**
 * File Description: Registration form page
 * Updated Date: 28/07/2024
 * Contributors: Nikki
 * Version: 1.0
 */

import React, {useState} from 'react';
import {Accounts} from 'meteor/accounts-base';
import {useNavigate, useParams} from "react-router-dom";
import {passwordStrength} from "check-password-strength";

import WhiteBackground from "../../general/whiteBackground/WhiteBackground";
import PageLayout from "../../../enums/PageLayout";
import Input from "../../general/inputs/Input";
import Button from "../../general/buttons/Button";

import './registration.css'
import {ChevronLeftIcon} from "@heroicons/react/24/outline";
import BaseUrlPath from "../../../enums/BaseUrlPath";

/**
 * Registration page component
 */
export const RegistrationPage = () => {
    const navigate = useNavigate();

    // variables to hold inputs
    const [username, setUsername] = useState('')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')

    // error string variables
    const [errors, setErrors] = useState({
        username: "",
        name: "",
        email: "",
        password: "",
        password2: ""
    })

    // get whether it errored before in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const isErrorEmail = urlParams.get("error") === "email";
    const isErrorUsername = urlParams.get("error") === "username";

    // if checks that display error is updated, prevents infinite loop
    if (!errors.email && isErrorEmail) {
        let newErrors = {}
        newErrors.email = "Email already has an account";
        setErrors(newErrors)

    } else if (!errors.username && isErrorUsername) {
        let newErrors = {}
        newErrors.username = "Username taken";
        setErrors(newErrors)

    } else if (!errors.password2 && urlParams.get("error") && !isErrorUsername && !isErrorEmail) {
        let newErrors = {}
        newErrors.password2 = "Account creation failed";
        setErrors(newErrors)
    }

    const handleRegister = (event) => {
        event.preventDefault();

        let newError = {}
        let isError = false;

        // Validate name
        const alphanumericSpaceRegex = /^[A-Za-z0-9 ]+$/i;
        if (!name) {
            newError.name = "Please fill in your displayed name";
            isError = true;

        } else if (!alphanumericSpaceRegex.test(name)) {
            newError.name = "Name can only consist of alphabet, numbers or spaces";
            isError = true;

        } else if (name.length > 30) {
            newError.name = "Name can not exceed 30 characters";
            isError = true;
        }

        // validate username
        const alphanumericRegex = /^[A-Za-z0-9]+$/i;
        if (!username) {
            newError.username = "Please fill in your unique username";
            isError = true;

        } else if (!alphanumericRegex.test(username)) {
            newError.username = "Username can only consist of alphabet characters and numbers";
            isError = true;

        } else if (username.length > 20) {
            newError.username = "Username can not exceed 20 characters";
            isError = true;
        }

        // validate email
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        if (!email) {
            newError.email = "Please fill in your email address";
            isError = true;

        } else if (!emailRegex.test(email)) {
            newError.email = "Please fill in a valid email address";
            isError = true;
        }

        // Password validation
        if (!password) {
            newError.password = "Please fill in your password";
            isError = true;

        } else if (passwordStrength(password).contains.length < 4 || passwordStrength(password).length < 8) {
            newError.password = "Password does not match requirements";
            isError = true;
        }

        // Check if retypePassword matches password
        if (!password2) {
            newError.password2 = "Please retype your password";
            isError = true;

        } else if (password !== password2) {
            newError.password2 = "Passwords do not match";
            isError = true;
        }

        setErrors(newError)

        if (!isError) {
            const newUser = {
                username: username,
                email: email,
                password: password,
                profile: {
                    name: name,
                    notificationOn: true,
                    teamIds: []
                }
            };

            Accounts.createUser(newUser, (error) => {
                if (error) {
                    if (error.reason.toLowerCase().includes("email")) {
                        // email is already taken
                        window.location.replace("?error=email")

                    } else if (error.reason.toLowerCase().includes("username")) {
                        // username is already taken
                        window.location.replace("?error=username")

                    } else {
                        // other reason
                        window.location.replace("?error=true")
                    }

                } else {
                    // method called to email user verification email
                    Meteor.call("send_verify_email", Meteor.userId());
                    Meteor.logout()
                    // After successful activation, navigate to account created page
                    navigate('/' + BaseUrlPath.REGISTER + '/account-created/')
                }
            });
        }
    };

    return (
        <WhiteBackground pageLayout={PageLayout.SMALL_CENTER}>
            <Button id={"reg1__back"}
                    className={"flex flex-row gap-2 btn-back"}
                    onClick={() => {
                        navigate('/' + BaseUrlPath.LOGIN)
                    }}>
                <ChevronLeftIcon strokeWidth={2} viewBox="0 0 23 23" width={20} height={20}/>
                Back
            </Button>

            <h1 className={"default__heading1"}>Create an Account</h1>

            <form className={"default__form"} onSubmit={handleRegister}>
                <div className={"input-error-div"}>
                    <Input type={"text"}
                           label={<label className={"main-text"}>Username</label>}
                           onChange={(e) => setUsername(e.target.value.trim())}/>
                    {errors.username && <span className="text-red small-text">{errors.username}</span>}
                </div>

                <div className={"input-error-div"}>
                    <Input type={"text"}
                           label={<label className={"main-text"}>Name</label>}
                           onChange={(e) => setName(e.target.value.trim())}/>
                    {errors.name && <span className="text-red small-text">{errors.name}</span>}
                </div>

                <div className={"input-error-div"}>
                    <Input type={"email"}
                           label={<label className={"main-text"}>Email</label>}
                           onChange={(e) => setEmail(e.target.value.trim())}/>
                    {errors.email && <span className="text-red small-text">{errors.email}</span>}
                </div>

                <div className={"input-error-div"}>
                    <Input type={"password"}
                           label={<label className={"main-text"}>Password</label>}
                           onChange={(e) => setPassword(e.target.value.trim())}/>
                    {errors.password && <span className="text-red small-text">{errors.password}</span>}
                </div>

                <div className={"input-error-div"}>
                    <Input type={"password"}
                           label={<label className={"main-text"}>Retype Password</label>}
                           onChange={(e) => setPassword2(e.target.value.trim())}/>
                    {errors.password2 && <span className="text-red small-text">{errors.password2}</span>}
                </div>

                {/* Password requirements message */}
                <div id={"reg1-req__div"} className="small-text">
                    Please ensure your password has at least:
                    <ul id={"reg1-req__ul"}>
                        <li className={"small-text"}>a number (0-9)</li>
                        <li className={"small-text"}>a special character (e.g. % & ! )</li>
                        <li className={"small-text"}>a lowercase letter (a-z)</li>
                        <li className={"small-text"}>an uppercase letter (A-Z)</li>
                        <li className={"small-text"}>minimum 8 characters</li>
                    </ul>
                </div>

                <Button type={"submit"} className={"btn-brown"}>
                    Register
                </Button>
            </form>
        </WhiteBackground>
    )
}

export default RegistrationPage;