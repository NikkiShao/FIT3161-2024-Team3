/**
 * File Description: Registration form page
 * Updated Date: 28/07/2024
 * Contributors: Nikki
 * Version: 1.0
 */

import React, {useState} from 'react';
import {Accounts} from 'meteor/accounts-base';
import {useNavigate} from "react-router-dom";
import {passwordStrength} from "check-password-strength";

import WhiteBackground from "../../general/whiteBackground/WhiteBackground";
import PageLayout from "../../../enums/PageLayout";
import Input from "../../general/inputs/Input";
import Button from "../../general/buttons/Button";

import './registration.css'
import {ChevronLeftIcon} from "@heroicons/react/24/outline";

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

    const [displayError, setDisplayError] = useState(false)
    const [errorString, setErrorString] = useState("")

    const handleRegister = (event) => {
        event.preventDefault();

        if (!name || !username || !email || !password || !password2) {
            setErrorString("Please fill in all required fields");
            setDisplayError(true);
            return;
        }

        // Password validation
        console.log(passwordStrength(password))
        if (passwordStrength(password).contains.length < 4 || passwordStrength(password).length < 8) {
            setErrorString("Password does not match requirements");
            setDisplayError(true);
            return;
        }

        // Check if retypePassword matches password
        if (password !== password2) {
            setErrorString("Passwords do not match");
            setDisplayError(true);
            return;
        }

        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        // Validate email using Meteor's built-in function
        if (!emailRegex.test(email)) {
            setErrorString("Email is not valid");
            setDisplayError(true);
            return;
        }

        const newUser = {
            username: username,
            email: email,
            password: password,
            profile: {
                name: name
            }
        };

        Accounts.createUser(newUser, (error) => {
            if (error) {
                alert(`Account creation failed: ${error.message}`);
            } else {
                // TODO send activation code via inputted email
                console.log('User created successfully!');
                console.log(Meteor.userId());
                console.log(Meteor.user());
                Meteor.logout()
                // After successful activation, navigate to account created page
                navigate('/account-created/' + username)
            }
        });
    };

    return (
        <WhiteBackground pageLayout={PageLayout.SMALL_CENTER}>
            <Button id={"reg1__back"}
                    className={"flex flex-row gap-2 btn-back"}
                    onClick={() => {
                        navigate('/login')
                    }}>
                <ChevronLeftIcon strokeWidth={2} viewBox="0 0 23 23" width={20} height={20}/>
                Back
            </Button>

            <h1 className={"default__heading1"}>Create an Account</h1>

            <form className={"default__form"}>
            <Input type={"text"}
                       label={<label className={"main-text"}>Username</label>}
                       onChange={(e) => setUsername(e.target.value.trim())}/>

                <Input type={"text"}
                       label={<label className={"main-text"}>Name</label>}
                       onChange={(e) => setName(e.target.value.trim())}/>

                <Input type={"email"}
                       label={<label className={"main-text"}>Email</label>}
                       onChange={(e) => setEmail(e.target.value.trim())}
                />

                <Input type={"password"}
                       label={<label className={"main-text"}>Password</label>}
                       onChange={(e) => setPassword(e.target.value.trim())}/>

                <Input type={"password"}
                       label={<label className={"main-text"}>Retype Password</label>}
                       onChange={(e) => setPassword2(e.target.value.trim())}/>

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

                {
                    displayError ?
                        (<div className={"error-box main-text"}>
                            {errorString}
                        </div>) :
                        null
                }

                <Button type={"submit"}
                        className={"btn-brown"}
                        onClick={handleRegister}>
                    Register
                </Button>
            </form>
        </WhiteBackground>
    )
}

export default RegistrationPage;