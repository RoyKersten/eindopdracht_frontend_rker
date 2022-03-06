import InputField from "../../components/inputfield/InputField";
import './UserFormPage.css';
import React, {useState} from "react";
import Button from "../../components/button/Button";
import confirmIcon from "../../images/icons/confirm.png";
import axios from "axios";

function CreateUserPage() {

    const [errorMessage, setErrorMessage] = useState("");
    const [formState, setFormState] = useState({
        username: '',
        password: '',
        enabled: 'true',
    });

    async function addUser() {
        try {
            const {data} = await axios.post(`http://localhost:8080/users`, formState, {
                headers: {
                    "Content-type": "application/json",
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                },
            });
            if (data !== null) {
                setErrorMessage("user successfully created!");
            }
        } catch (e) {
            if (e.response.status.toString() === "403") {
                setErrorMessage("user could not be created, you are not authorized!")
            } else if (e.response.status.toString() !== "403") {
                setErrorMessage("user could not be created!")
            }
        }
    }

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
        addUser().then();
    }

    return (
        <div className="user-form-container">
            <div>
                <form className="user-form-form">
                    <section>
                        <InputField className="user-input-component"
                                    name="username"
                                    label="Username"
                                    inputType="text"
                                    readOnly={false}
                                    value={formState.username}
                                    changeHandler={handleChange}
                        />
                    </section>
                    <section>
                        <InputField className="user-input-component"
                                    name="password"
                                    label="Encrypted password"
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
                                    readOnly={true}
                                    value={formState.enabled}
                                    changeHandler={handleChange}
                        />
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
                </form>
            </div>
            <div className="messages">
                {errorMessage && <p className="message-error">{errorMessage}</p>}
            </div>
        </div>
    );
}

export default CreateUserPage;