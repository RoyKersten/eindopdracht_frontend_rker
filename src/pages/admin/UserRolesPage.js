import InputField from "../../components/inputfield/InputField";
import './UserRolesPage.css';
import React, {useEffect, useState} from "react";
import axios from "axios";
import {useParams} from "react-router-dom";


function UserRolesPage() {
    const {username} = useParams();
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [endpoint, setEndpoint] = useState(`http://localhost:8080/users/${username}/authorities`);    //initial endpoint used to fetch all customers from database
    const [formState, setFormState] = useState({
        username: '',
        role_mechanic: false,
        role_admin_clerk: false,
        role_backoffice: false,
        role_cashier: false,
        role_admin: false
    });

    const [addNewUserRole, setAddNewUserRole] = useState({
        username: {username},
        authority: ''
    });

    const [removeExistingUserRole, setRemoveExistingNewUserRole] = useState({
        username: {username},
        authority: ''
    });


    useEffect(() => {
        setError(false);

        async function getUserRolesByUsername() {
            try {
                const {data} = await axios.get(endpoint, {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: 'Bearer ' + localStorage.getItem('token'),
                    },
                });
                getRoles(data);
            } catch (e) {
                setError(true);
            }
        }

        getUserRolesByUsername();
    }, [endpoint]);


    //Set granted roles in formState
    function getRoles(data) {
        const roles = [];
        for (let i = 0; i < data.length; i++) {
            roles.push(data[i].authority)
        }
        console.log(roles)
        for (let i = 0; i < roles.length; i++) {
            switch (roles[i]) {
                case "ROLE_MECHANIC":
                    setFormState(prevState => ({...prevState, role_mechanic: true}));
                    break;
                case "ROLE_ADMIN_CLERK":
                    setFormState(prevState => ({...prevState, role_admin_clerk: true}));
                    break;
                case "ROLE_BACKOFFICE":
                    setFormState(prevState => ({...prevState, role_backoffice: true}));
                    break;
                case "ROLE_CASHIER":
                    setFormState(prevState => ({...prevState, role_cashier: true}));
                    break;
                case "ROLE_ADMIN":
                    setFormState(prevState => ({...prevState, role_admin: true}));
                    break;
                default:
            }
        }
    }

    useEffect(() => {
        if (addNewUserRole.authority !== "") {

            async function addUserRole() {
                console.log(addNewUserRole);
                try {
                    const {data} = await axios.post(endpoint, addNewUserRole, {
                        headers: {
                            "Content-type": "application/json",
                            Authorization: 'Bearer ' + localStorage.getItem('token'),
                        },
                    });
                    setErrorMessage("user role successfully added!");
                } catch (e) {
                    if (e.response.status.toString() === "403") {
                        setErrorMessage("user role could not be created, you are not authorized!")
                    } else if (e.response.status.toString() !== "403") {
                        setErrorMessage("user role could not be created!")
                    }
                }
            }

            addUserRole();
        }
    }, [addNewUserRole]);


    useEffect(() => {
        if (removeExistingUserRole.authority !== "") {
            async function removeUserRole() {
                try {
                    const {data} = await axios.delete(`http://localhost:8080/users/${username}/authorities/${removeExistingUserRole.authority}`, {
                        headers: {
                            "Content-type": "application/json",
                            Authorization: 'Bearer ' + localStorage.getItem('token'),
                        },
                    });
                    setErrorMessage("user role successfully removed!");
                } catch (e) {
                    if (e.response.status.toString() === "403") {
                        setErrorMessage("user role could not be removed, you are not authorized!")
                    } else if (e.response.status.toString() !== "403") {
                        setErrorMessage("role could not be removed!")
                    }
                }
            }

            removeUserRole();
        }
    }, [removeExistingUserRole]);


    function handleChange(e) {
        const inputName = e.target.name;
        let inputValue = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

        setFormState({
            ...formState,
            [inputName]: inputValue,
        })

        if (e.target.checked === true) {
            setAddNewUserRole(prevState => ({...prevState, authority: inputName.toUpperCase()}));
        } else if (e.target.checked === false) {
            setRemoveExistingNewUserRole(prevState => ({...prevState, authority: inputName.toLowerCase()}));
        }
    }

    return (
        <div className="user-roles-container">
            <form className="user-roles-form">
                <section>
                    <InputField className="user-roles-input-component"
                                name="username"
                                label="Username"
                                inputType="text"
                                readOnly={true}
                                value={username}
                    />
                </section>
                <div className="user-roles-checkbox">
                    <section>
                        <InputField className="user-roles-input-checkbox"
                                    name="role_mechanic"
                                    label="ROLE_MECHANIC"
                                    inputType="checkbox"
                                    readOnly={false}
                                    checked={formState.role_mechanic}
                                    changeHandler={handleChange}
                        />
                    </section>
                    <section>
                        <InputField className="user-roles-input-checkbox"
                                    name="role_admin_clerk"
                                    label="ROLE_ADMIN_CLERK"
                                    inputType="checkbox"
                                    readOnly={false}
                                    checked={formState.role_admin_clerk}
                                    changeHandler={handleChange}
                        />
                    </section>
                    <section>
                        <InputField className="user-roles-input-checkbox"
                                    name="role_backoffice"
                                    label="ROLE_BACKOFFICE"
                                    inputType="checkbox"
                                    readOnly={false}
                                    checked={formState.role_backoffice}
                                    changeHandler={handleChange}
                        />
                    </section>
                    <section>
                        <InputField className="user-roles-input-checkbox"
                                    name="role_cashier"
                                    label="ROLE_CASHIER"
                                    inputType="checkbox"
                                    readOnly={false}
                                    checked={formState.role_cashier}
                                    changeHandler={handleChange}
                        />
                    </section>
                    <section>
                        <InputField className="user-roles-input-checkbox"
                                    name="role_admin"
                                    label="ROLE_ADMIN"
                                    inputType="checkbox"
                                    readOnly={false}
                                    checked={formState.role_admin}
                                    changeHandler={handleChange}
                        />
                    </section>
                </div>
                <div className="messages">
                    {error && !errorMessage && <p className="message-home">Error occurred</p>}
                    {errorMessage && !error && <p className="message-error">{errorMessage}</p>}
                </div>
            </form>
        </div>
    );
}

export default UserRolesPage;