import InputField from "../../components/inputfield/InputField";
import './UserFormPage.css';
import {useParams} from "react-router-dom";
import Button from "../../components/button/Button";
import confirmIcon from "../../images/icons/confirm.png";
import React, {useEffect, useState} from "react";
import axios from "axios";


function DisplayUserPage() {

    const {username} = useParams()
    const [endpoint, setEndpoint] = useState(`http://localhost:8080/users/${username}`);
    const [object, setObject] = useState({username: '', password: '', enabled: ''});

    useEffect(() => {
        async function getUserByUsername() {
            try {
                const {data} = await axios.get(endpoint, {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: 'Bearer ' + localStorage.getItem('token'),
                    },
                });
                setObject(data);
            } catch (e) {
                console.error(e);
            }
        }

        getUserByUsername();
    }, [endpoint]);

    return (
        <div className="user-form-container">
            <form className="user-form-form">
                <section>
                    <InputField className="user-input-component"
                                name="username"
                                label="Username"
                                inputType="text"
                                value={object.username}
                                readOnly={true}
                    />
                </section>
                <section>
                    <InputField className="user-input-component"
                                ame="password"
                                label="Encrypted Password"
                                inputType="text"
                                value={object.password}
                                readOnly={true}
                    />
                </section>
                <section>
                    <InputField className="user-input-component"
                                name="enabled"
                                label="Enabled"
                                inputType="text"
                                value={object.enabled}
                                readOnly={true}
                    />
                </section>
            </form>

            <Button
                buttonName="confirm-button"
                buttonDescription="CONFIRM"
                pathName="/home"
                disabled={true}
                buttonIcon={confirmIcon}
            />
        </div>

    );
}

export default DisplayUserPage;