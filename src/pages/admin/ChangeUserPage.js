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
                setFormState(data);
            } catch (e) {
                if (e.response.status.toString() === "403") {
                    setErrorMessage("user details could not be retrieved, you are not authorized!")
                } else if (e.response.status.toString() !== "403") {
                    setErrorMessage("user details could not be retrieved!")
                }
            }
        }

        getUserByUsername();
    }, [endpoint]);


    async function changeUser() {
        try {
            const {data} = await axios.put(endpoint, formState, {
                headers: {
                    "Content-type": "application/json",
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                },
            });
            setErrorMessage("user successfully updated!");
        } catch (e) {
            if (e.response.status.toString() === "403") {
                setErrorMessage("user could not be updated, you are not authorized!")
            } else if (e.response.status.toString() !== "403") {
                setErrorMessage("user could not be updated!")
            }
        }
    }

    function handleChange(e) {
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
            <form className="user-form-form">
                <section>
                    <InputField className="user-input-component"
                                name="username"
                                label="Username"
                                inputType="text"
                                value={formState.username}
                                readOnly={true}
                    />
                </section>
                <section>
                    <InputField className="user-input-component"
                                name="password"
                                label="Reset Password"
                                inputType="text"
                                readOnly={false}
                                value={formState.password}
                                changeHandler={handleChange}
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
                                changeHandler={handleChange}
                    />

                    <datalist id="userStatusList">
                        <option key={1} value="true">true</option>
                        <option key={2} value="false">false</option>
                    </datalist>

                </section>

                <Button
                    buttonName="confirm-button"
                    buttonDescription="CONFIRM"
                    buttonType="button"
                    onClick={(e) => {
                        handleSubmit(e)
                    }}
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