import './CustomerPage.css';
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import InputField from "../../components/inputfield/InputField";
import Button from "../../components/button/Button";
import displayIcon from "../../images/icons/display.png";
import createIcon from "../../images/icons/create.png";
import changeIcon from "../../images/icons/change.png";
import deleteIcon from "../../images/icons/delete.png";
import TransactionTable from "../../components/transactiontable/TransactionTable";


function CustomerPage() {

    const [customer, setCustomers] = useState([]);
    const [sourceData, setSourceData] = useState([]);
    const [endpoint, setEndpoint] = useState("http://localhost:8080/customers");    //initial endpoint used to fetch all customers from database
    const [loading, toggleLoading] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState( "");
    const [reload, setReload] = useState(false);
    const [childData, setChildData] = useState({idCustomer: 0});

    const [formState, setFormState] = useState({
        customerId: '',
        lastname: '',
    });

    //Get customer data based on endpoint, get bearer token from local storage to validate authentication and authorization
    useEffect(() => {
        async function getCustomers() {
            toggleLoading(true);
            setError(false);

            try {
                const {data} = await axios.get(endpoint, {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: 'Bearer ' + localStorage.getItem('token'),
                    },
                });
                setSourceData(data);
                setCustomers(data);

            } catch (error) {
                setError(true);
                setErrorMessage(error.data);
                console.error(error.status);       //logt HTTP status code e.g. 400
                console.error(error.data);         //logt de message die vanuit de backend wordt gegeven
            }
            toggleLoading(false);
        }

        getCustomers().then();
    }, [endpoint, reload]);


    async function deleteCustomerById() {
        setError(false);
        try {
            const {data} = await axios.delete("http://localhost:8080/customers/" + childData.idCustomer, {
                headers: {
                    "Content-type": "application/json",
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                },
            });
            setErrorMessage(data);
            console.log(data);
            setReload(!reload);

        } catch (error) {
            setErrorMessage(error.response.data+ ", please select a valid id");
        }
        toggleLoading(false);
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

    //Filter data based customerId, lastname or show all customers when filters are empty
    //Choosen for filter in frontend as backend has no endpoint to get data based on lastname
    function filterData(data) {
        setCustomers(sourceData);

        if (formState.customerId !== "") {
            setCustomers(data.filter(function (object) {
                return object.idCustomer.toString() === formState.customerId.toString();
            }))
        } else if (formState.lastname !== "") {
            setCustomers(data.filter(function (object) {
                return object.lastName.toLowerCase() === formState.lastname.toLowerCase();
            }))
        } else {
            console.log("no entry");
        }
        ;
    }

    return (
        <div className="customer-home-container">
            <div className="customer-home-filter">
                <form>
                    <section>
                        <InputField name="customerId" label="Customer ID" inputType="text"
                                    onKeyPress={onKeyPress} changeHandler={onKeyPress}
                        />
                    </section>
                    <section>
                        <InputField name="lastname" label="Lastname" inputType="text"
                                    onKeyPress={onKeyPress} changeHandler={onKeyPress}
                        />
                    </section>
                </form>
            </div>
            <div className="customer-home-transaction-container">
                <div className="customer-home-display-container">
                    <TransactionTable
                        selectObject={(childData) => setChildData(childData)}                             //2 Retrieve data from child/component TransactionTable
                        tableContainerClassName="customer-home-container-table"
                        headerContainerClassName="customer-home-table-header"
                        headerClassName="customer-home-table-header"
                        dataInput={customer}
                    />
                </div>

                <div className="customer-home-buttons">
                    <Button
                        buttonName="customer-home-button"
                        buttonDescription="DISPLAY"
                        buttonType="button"
                        pathName="/customers/display"
                        object={childData}
                        disabled={false}
                        buttonIcon={displayIcon}

                    />
                    <Button
                        buttonName="customer-home-button"
                        buttonDescription="CREATE"
                        buttonType="button"
                        pathName="/customers/create"
                        disabled={false}
                        buttonIcon={createIcon}
                    />
                    <Button
                        buttonName="customer-home-button"
                        buttonDescription="CHANGE"
                        buttonType="button"
                        pathName="/customers/change"
                        object={childData}
                        disabled={false}
                        buttonIcon={changeIcon}
                    />
                    <Button
                        buttonName="customer-home-button"
                        buttonDescription="DELETE"
                        buttonType="button"
                        onClick={() => deleteCustomerById()}
                        pathName=""
                        disabled={false}
                        buttonIcon={deleteIcon}
                    />
                </div>
            </div>
            {loading && <p className="message-loading">Data Loading, please wait...</p>}
            {error && <p className="message-error">Error occurred</p>}
            {errorMessage && <p className="message-error">{errorMessage}</p>}
        </div>
    );
};

export default CustomerPage;