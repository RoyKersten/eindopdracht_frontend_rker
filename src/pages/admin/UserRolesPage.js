import InputField from "../../components/inputfield/InputField";
import './UserRolesPage.css';
import React, {useEffect, useState} from "react";
import axios from "axios";
import {useParams} from "react-router-dom";


function UserRolesPage() {

    const {username} = useParams()
    const [errorMessage, setErrorMessage] = useState("");
    const [reload, setReload] = useState(false);
    const [endpoint, setEndpoint] = useState(`http://localhost:8080/users/${username}/authorities`);    //initial endpoint used to fetch all customers from database
    const [formState, setFormState] = useState({
        username: '',
        role_mechanic: false,
        role_admin_clerk: false,
        role_backoffice: false,
        role_cashier: false,
        role_admin: false
    });

    const [addNewUserRole, setAddNewUserRole] =useState( {
        username: {username},
        authority: ''
    });

    useEffect(() => {
        console.log(endpoint)
        async function getUserRolesByUsername() {
            try {
                const {data} = await axios.get(endpoint, {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: 'Bearer ' + localStorage.getItem('token'),
                    },
                });
                getRoles(data)

            } catch (e) {
                console.error(e);
            }
        }

        getUserRolesByUsername();
    }, [endpoint]);


    function getRoles(data) {
        const roles = [];
        for (let i = 0; i < data.length; i++) {
            roles.push(data[i].authority)
        }
        console.log(roles);

        for (let i = 0; i < roles.length; i++) {
            switch (roles[i]) {
                case "ROLE_MECHANIC":
                    formState.role_mechanic = true;
                    break;
                case "ROLE_ADMIN_CLERK":
                    formState.role_admin_clerk = true;
                    break;
                case "ROLE_BACKOFFICE":
                    formState.role_backoffice = true;
                    break;
                case "ROLE_CASHIER":
                   formState.role_cashier = true;
                    break;
                case "ROLE_ADMIN":
                    formState.role_admin = true;
                    break;
                default:
            }
        }
        setReload(!reload);
        }


    async function addUserRole() {
        try {
            const {data} = await axios.post(endpoint, addNewUserRole, {
                headers: {
                    "Content-type": "application/json",
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                },
            });
            setErrorMessage("user role successfully added!");
            console.log(formState);
        } catch (e) {
            console.error(e);
        }
    }

    async function removeUserRole() {
        try {
            const {data} = await axios.delete(`http://localhost:8080/users/${username}/authorities/${addNewUserRole.authority}`, {
                headers: {
                    "Content-type": "application/json",
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                },
            });
            setErrorMessage("user role successfully removed!");
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

        if (e.target.checked === true) {
            addNewUserRole.authority='';
            addNewUserRole.authority = inputName.toUpperCase();
            addUserRole();
        } else if (e.target.checked === false) {
            addNewUserRole.authority='';
            addNewUserRole.authority = inputName;
            removeUserRole();
        }


    }

    function handleSubmit(e) {
        e.preventDefault();
        // addUserRoles().then();
    }


    return (
        <div className="user-roles-container">
            <form onSubmit={handleSubmit} className="user-roles-form">
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
                                changeHandler={handleClick}

                    />
                </section>
                    <section>
                        <InputField className="user-roles-input-checkbox"
                                    name="role_admin_clerk"
                                    label="ROLE_ADMIN_CLERK"
                                    inputType="checkbox"
                                    readOnly={false}
                                    checked={formState.role_admin_clerk}
                                    changeHandler={handleClick}
                        />
                    </section>
                    <section>
                        <InputField className="user-roles-input-checkbox"
                                    name="role_backoffice"
                                    label="ROLE_BACKOFFICE"
                                    inputType="checkbox"
                                    readOnly={false}
                                    checked={formState.role_backoffice}
                                    changeHandler={handleClick}
                        />
                    </section>
                    <section>
                        <InputField className="user-roles-input-checkbox"
                                    name="role_cashier"
                                    label="ROLE_CASHIER"
                                    inputType="checkbox"
                                    readOnly={false}
                                    checked={formState.role_cashier}
                                    changeHandler={handleClick}
                        />
                    </section>
                    <section>
                        <InputField className="user-roles-input-checkbox"
                                    name="role_admin"
                                    label="ROLE_ADMIN"
                                    inputType="checkbox"
                                    readOnly={false}
                                    checked={formState.role_admin}
                                    changeHandler={handleClick}
                        />
                    </section>
        </div>
                <div className="messages">
                    {errorMessage && <p className="message-error">{errorMessage}</p>}
                </div>
            </form>
        </div>
    );
}

export default UserRolesPage;