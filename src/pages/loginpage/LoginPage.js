import './LoginPage.css';
import React from 'react';
import loginPicture from '../../images/login-page.jpg';
import {useHistory} from "react-router-dom";
import axios from "axios";

function LoginPage() {

    const history = useHistory();

    //SignIn: get bearer token from backend based-on username and password
    async function signIn() {
            try {
                const bearer = await axios.post("http://localhost:8080/authenticate",
                    {
                        "username": "admin_clerk",
                        "password": "password"
                    })
                localStorage.setItem('token', bearer.data.jwt);                         //local storage to store bearer token
                const token = localStorage.getItem('token');
                console.log(token);
            } catch (e) {
                console.error(e);
            }
        history.push('/home');
        }

    return (
        <div className="login-container">
            <img src={loginPicture} alt="car"/>
            <button className="login-button" onClick={signIn}>inloggen</button>
        </div>
    );
};

export default LoginPage;