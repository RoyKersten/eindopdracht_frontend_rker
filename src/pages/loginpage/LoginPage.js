import './LoginPage.css';
import React, {useState} from 'react';
import loginPicture from '../../images/login-page.jpg';
import {useHistory} from "react-router-dom";
import axios from "axios";
import InputField from "../../components/inputfield/InputField";

function LoginPage() {

    const history = useHistory();
    const [formState, setFormState] = useState({username: '', password: ''});
    const [errorMessage, setErrorMessage] = useState("");

    //SignIn: get bearer token from backend based-on username and password
    async function signIn() {
        console.log(formState)
        try {
            const bearer = await axios.post("http://localhost:8080/authenticate",
                {
                    "username": formState.username,
                    "password": formState.password
                })
            localStorage.setItem('token', bearer.data.jwt);                         //local storage to store bearer token
            const token = localStorage.getItem('token');
            console.log(token);
            history.push('/home');
        } catch (e) {
            setErrorMessage("username/password not correct !")
            console.error(e);
        }
    }


    //set formChange after enter key, this will trigger useEffect and data will be reloaded.
    function handleChange(e) {
        const inputName = e.target.name;
        const inputValue = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

        setFormState({
            ...formState,
            [inputName]: inputValue,
        })
    }

    function handleSubmit(e) {
        e.preventDefault();
        signIn().then();
    }

    return (
        <div className="login-container">
            <img src={loginPicture} alt="car"/>

            <form className="login-form" onSubmit={handleSubmit}>
                <section>
                    <InputField className="login-fields"
                                name="username"
                                label="Username"
                                inputType="text"
                                value={formState.username}
                                readOnly={false}
                                changeHandler={handleChange}
                    />
                </section>
                <section>
                    <InputField className="login-fields"
                                name="password"
                                label="Password"
                                inputType="password"                   //encrypt password when typing
                                value={formState.password}
                                readOnly={false}
                                changeHandler={handleChange}
                    />
                </section>
                <button className="login-fields">login</button>
                {errorMessage && <p className="message-login">{errorMessage}</p>}
            </form>

        </div>
    );
};

export default LoginPage;