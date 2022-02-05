import InputField from "../../components/inputfield/InputField";
import './UserFormPage.css';
import React, {useEffect, useState} from "react";
import Button from "../../components/button/Button";
import confirmIcon from "../../images/icons/confirm.png";
import axios from "axios";
import {useParams} from "react-router-dom";


function ChangeUserPage() {

    const {username} = useParams()
    const [errorMessage, setErrorMessage] = useState("");
    const [endpoint, setEndpoint] = useState(`http://localhost:8080/users/${username}`);    //initial endpoint used to fetch all customers from database
    const [formState, setFormState] = useState({
        username: '',
        password: '',
        enabled: '',
    });

    useEffect(() => {
        async function getUserByUsername() {
            try {
                const {data} = await axios.get(endpoint, {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: 'Bearer ' + localStorage.getItem('token'),
                    },
                });
                console.log(data)
                setFormState(data);
            } catch (e) {
                console.error(e);
            }
        }

        getUserByUsername();
    }, [endpoint]);


    async function changeUser() {

        console.log(formState)

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

        setFormState({
            ...formState,
            [inputName]: inputValue,
        })
    }

    function handleSubmit(e) {
        e.preventDefault();
        changeUser().then();
    }


    return (
        <div className="user-form-container">
            <form onSubmit={handleSubmit} className="user-form-form">
                <section>
                    <InputField className="user-input-component"
                                name="username"
                                label="Customer ID"
                                inputType="text"
                                value={formState.username}
                                readOnly={true}
                    />
                </section>
                <section>
                    <InputField className="user-input-component"
                                name="password"
                                label="Password"
                                inputType="text"
                                readOnly={false}
                                value={formState.password}
                                changeHandler={handleClick}
                    />
                </section>
                <section>
                    <InputField className="user-input-component"
                                name="enabled"
                                label="Enabled"
                                inputType="text"
                                readOnly={false}
                                list="userStatusList"
                                value={formState.enabled}
                                changeHandler={handleClick}
                    />

                    <datalist id="userStatusList">
                        <option value="true">true</option>
                        <option value="false">false</option>
                    </datalist>

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

export default ChangeUserPage;