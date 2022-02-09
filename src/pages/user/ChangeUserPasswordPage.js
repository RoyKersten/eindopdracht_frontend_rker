import InputField from "../../components/inputfield/InputField";
import './ChangeUserPasswordPage.css';
import React, {useEffect, useState} from "react";
import Button from "../../components/button/Button";
import confirmIcon from "../../images/icons/confirm.png";
import axios from "axios";
import {useParams} from "react-router-dom";


function ChangeUserPasswordPage() {

    const {username} = useParams()
    const [errorMessage, setErrorMessage] = useState("");
    const [endpoint, setEndpoint] = useState(`http://localhost:8080/users/${username}`);
    const [password, setPassword] = useState({passwordCheck: ''});
    const [formState, setFormState] = useState({
        username: '',
        password: '',
        enabled: 'true',
    });

    async function changeUser() {

        try {
            const {data} = await axios.put(endpoint, formState, {
                headers: {
                    "Content-type": "application/json",
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                },
            });
            setErrorMessage("user successfully updated!");
            console.log(formState);
        } catch (e) {
            console.error(e);
        }
    }

    function handleClick(e) {
        const inputName = e.target.name;
        let inputValue = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

        if (e.target.name === "passwordCheck") {
            password.passwordCheck = e.target.value;
        }

        setFormState({
            ...formState,
            [inputName]: inputValue,
        })
    }

    function handleSubmit(e) {
        e.preventDefault();
        console.log(formState.password)
        console.log(password.passwordCheck)
        if (formState.password === password.passwordCheck) {
            changeUser().then();
        }
        setErrorMessage("entered passwords are not equally!")
    }


    return (
        <div className="user-form-container">
            <form onSubmit={handleSubmit} className="user-form-form">
                <section>
                    <InputField className="user-input-component"
                                name="username"
                                label="UserName"
                                inputType="text"
                                value={username}
                                readOnly={true}
                    />
                </section>
                <section>
                    <InputField className="user-input-component"
                                name="password"
                                label="Password"
                                inputType="password"
                                readOnly={false}
                                placeholder="enter new password"
                                value={formState.password}
                                changeHandler={handleClick}
                    />
                </section>
                <section>
                    <InputField className="user-input-component"
                                name="passwordCheck"
                                label="Password Check"
                                inputType="password"
                                readOnly={false}
                                placeholder="repeat new password"
                                value={password.passwordCheck}
                                changeHandler={handleClick}
                    />
                </section>
                <Button
                    buttonName="confirm-button"
                    buttonDescription="CONFIRM"
                    buttonType="submit"
                    pathName=""
                    disabled={false}
                    buttonIcon={confirmIcon}
                />
                <div className="messages">
                    {errorMessage && <p className="message-error">{errorMessage}</p>}
                </div>
            </form>
        </div>

    );
}

export default ChangeUserPasswordPage;