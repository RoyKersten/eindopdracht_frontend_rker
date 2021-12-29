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

    const [formState, setFormState] = useState({
        customerId: '',
        lastname: '',
    })

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

            } catch (e) {
                console.error(e);
                setError(true);
            }
            toggleLoading(false);
        }

        getCustomers();
    }, [endpoint]);

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
                                    onKeyPress={onKeyPress}

                        />
                    </section>
                    <section>
                        <InputField name="lastname" label="Lastname" inputType="text"
                                    onKeyPress={onKeyPress}
                        />
                    </section>
                </form>
            </div>
            <div className="customer-home-transaction-container">
                <div className="customer-home-display-container">

                    <TransactionTable
                        tableContainerClassName="customer-home-container-table"
                        headerContainerClassName="customer-home-table-header"
                        headerClassName="customer-home-table-header"
                        dataInput={customer}
                    />
                    {loading && <p>Data Loading, please wait...</p>}
                    {error && <p>Error occured while loading data...</p>}
                </div>

                <div className="customer-home-buttons">
                    <Button
                        buttonName="customer-home-button"
                        buttonDescription="DISPLAY"
                        buttonMessage="/customers/display"
                        disabled={false}
                        buttonIcon={displayIcon}
                    />
                    <Button
                        buttonName="customer-home-button"
                        buttonDescription="CREATE"
                        buttonMessage="/customers/create"
                        disabled={false}
                        buttonIcon={createIcon}
                    />
                    <Button
                        buttonName="customer-home-button"
                        buttonDescription="CHANGE"
                        buttonMessage="/customers/change"
                        disabled={false}
                        buttonIcon={changeIcon}
                    />
                    <Button
                        buttonName="customer-home-button"
                        buttonDescription="DELETE"
                        buttonMessage="/customers/delete"
                        disabled={false}
                        buttonIcon={deleteIcon}
                    />
                </div>
            </div>
        </div>
    );
};

export default CustomerPage;