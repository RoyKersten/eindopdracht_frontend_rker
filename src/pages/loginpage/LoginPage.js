import './LoginPage.css';
import React from 'react';
import loginPicture from '../../images/login-page.jpg';
import {useHistory} from "react-router-dom";

function LoginPage() {

    const history = useHistory();

    function signIn() {
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