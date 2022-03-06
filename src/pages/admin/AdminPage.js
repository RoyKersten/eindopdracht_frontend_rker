import './AdminPage.css';
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import InputField from "../../components/inputfield/InputField";
import Button from "../../components/button/Button";
import displayIcon from "../../images/icons/display.png";
import createIcon from "../../images/icons/create.png";
import changeIcon from "../../images/icons/change.png";
import deleteIcon from "../../images/icons/delete.png";
import authorizationIcon from "../../images/icons/authorization.png";
import TransactionTable from "../../components/transactiontable/TransactionTable";


function AdminPage() {

    const [user, setUser] = useState([]);
    const [sourceData, setSourceData] = useState([]);
    const [loading, toggleLoading] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [reload, setReload] = useState(false);
    const [selectedUser, setSelectedUser] = useState({username: ''});

    const [formState, setFormState] = useState({
        username: '',
    });

    //Get user data based on endpoint, get bearer token from local storage to validate authentication and authorization
    useEffect(() => {
        async function getUsers() {
            toggleLoading(true);
            setError(false);

            try {
                const {data} = await axios.get(`http://localhost:8080/users`, {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: 'Bearer ' + localStorage.getItem('token'),
                    },
                });
                setSourceData(data);
                setUser(data);

            } catch (error) {
                setError(true);
            }
            toggleLoading(false);
        }

        getUsers().then();
    }, [reload]);


    async function deleteUserByUserName() {
        let text = "user will be deleted permanently, are you sure?";
        if (window.confirm(text) === true) {
            setError(false);
            try {
                const {data} = await axios.delete("http://localhost:8080/users/" + selectedUser.username, {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: 'Bearer ' + localStorage.getItem('token'),
                    },
                });
                setErrorMessage(data);
                setReload(!reload);

            } catch (e) {
                if (e.response.status.toString() === "403") {
                    setErrorMessage("user could not be deleted, you are not authorized!")
                } else if (e.response.status.toString() !== "403") {
                    setErrorMessage("user could not be deleted!")
                }
            }
            toggleLoading(false);
        }
    }


    //set formChange after enter key, this will trigger useEffect and data will be reloaded.
    function onKeyPress(e) {
        const inputName = e.target.name;
        const inputValue = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

        setFormState({
            ...formState,
            [inputName]: inputValue,
        })

        if (e.key === 'Enter') {
            filterData(sourceData);
        }
    }

    //Filter data based customerId and lastname or show all customers when filters are empty
    function filterData(data) {
        setUser(sourceData);

        if (formState.username !== "") {
            setUser(data.filter(function (object) {
                return object.username === formState.username;
            }))
        } else {
            console.log("no entry");
        }
        ;
    }

    return (
        <div className="admin-home-container">
            <div className="admin-home-filter">
                <section>
                    <InputField name="username" label="User Name" inputType="text"
                                onKeyPress={onKeyPress} changeHandler={onKeyPress}
                    />
                </section>
            </div>
            <div className="admin-home-transaction-container">
                <div className="admin-home-display-container">
                    <div className="transaction-table">
                        <TransactionTable
                            selectObject={(selectedUser) => setSelectedUser(selectedUser)}                             //2 Retrieve data from child/component TransactionTable
                            tableContainerClassName="admin-home-container-table"
                            headerContainerClassName="admin-home-table-header"
                            headerClassName="admin-home-table-header"
                            dataInput={user}
                        />
                        <div className="messages">
                            {loading && <p className="message-home">Data Loading, please wait...</p>}
                            {error && <p className="message-home">Error occurred</p>}
                            {errorMessage && <p className="message-home">{errorMessage}</p>}
                            {!selectedUser.username && !loading && !errorMessage && !error &&
                                <p className="message-home">Please select a user</p>}
                        </div>
                    </div>
                </div>
                <div className="admin-home-buttons">
                    <Button
                        buttonName="transaction-home-small-button"
                        buttonDescription="DISPLAY"
                        buttonType="button"
                        pathName={"/user/display/" + (selectedUser.username)}
                        disabled={selectedUser.username === ''}
                        buttonIcon={displayIcon}
                    />
                    <Button
                        buttonName="transaction-home-small-button"
                        buttonDescription="CREATE"
                        buttonType="button"
                        pathName="/user/create"
                        disabled={false}
                        buttonIcon={createIcon}
                    />
                    <Button
                        buttonName="transaction-home-small-button"
                        buttonDescription="CHANGE"
                        buttonType="button"
                        pathName={"/user/change/" + (selectedUser.username)}
                        disabled={selectedUser.username === ''}
                        buttonIcon={changeIcon}
                    />
                    <Button
                        buttonName="transaction-home-small-button"
                        buttonDescription="DELETE"
                        buttonType="button"
                        onClick={() => deleteUserByUserName()}
                        pathName=""
                        disabled={selectedUser.username === ''}
                        buttonIcon={deleteIcon}
                    />
                    <Button
                        buttonName="transaction-home-small-button"
                        buttonDescription="Authorization"
                        buttonType="button"
                        pathName={"/user/authorization/" + (selectedUser.username)}
                        disabled={selectedUser.username === ''}
                        buttonIcon={authorizationIcon}
                    />
                </div>
            </div>
        </div>
    );
};

export default AdminPage;