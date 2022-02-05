import './ReportingPage.css';
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import InputField from "../../components/inputfield/InputField";
import TransactionTable from "../../components/transactiontable/TransactionTable";
import {useParams} from "react-router-dom";


function ReportingPage() {

    let serviceType = "inspections";
    const [callList, setCallList] = useState([]);
    const [loading, toggleLoading] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [reload, setReload] = useState(false);

    const [formState, setFormState] = useState({
        callList: 'inspections',
    });

    const [endpoint, setEndpoint] = useState(`http://localhost:8080/services/${serviceType}/calllist`);    //initial endpoint used to fetch all customers from database

    //Get customer data based on endpoint, get bearer token from local storage to validate authentication and authorization
    useEffect(() => {
         async function getServiceByStatus() {
            toggleLoading(true);
            setError(false);

            try {
                const {data} = await axios.get(endpoint, {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: 'Bearer ' + localStorage.getItem('token'),
                    },
                });
                setCallList(data);

            } catch (error) {
                setError(true);
                setErrorMessage(error.data);
                console.error(error.status);       //logt HTTP status code e.g. 400
                console.error(error.data);         //logt de message die vanuit de backend wordt gegeven
            }
            toggleLoading(false);
        }

        getServiceByStatus().then();
    }, [endpoint]);


    //set formChange after enter key, this will trigger useEffect and data will be reloaded.
    function onKeyPress(e) {
        const inputName = e.target.name;
        const inputValue = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

       setFormState({
            ...formState,
            [inputName]: inputValue,
        })
        if (inputValue!=="") {
            serviceType = inputValue;
            setEndpoint(`http://localhost:8080/services/${serviceType}/calllist`);
        }
    }

    return (
        <div className="reporting-home-container">
            <div className="reporting-home-filter">
                <section>
                    <InputField name="callList"
                                label="Calllist Selection"
                                inputType="text"
                                value={formState.callList}
                                onKeyPress={onKeyPress}
                                changeHandler={onKeyPress}
                                list="callList"
                    />
                </section>
                <datalist id="callList">
                    <option value="inspections">inspections</option>
                    <option value="repairs">repairs</option>
                </datalist>
            </div>
            <div className="reporting-home-transaction-container">
                <div className="reporting-home-display-container">
                    <TransactionTable
                        tableContainerClassName="reporting-home-container-table"
                        headerContainerClassName="reporting-home-table-header"
                        headerClassName="reporting-home-table-header"
                        dataInput={callList}
                    />
                </div>
            </div>
            <div className="messages">
                {loading && <p className="message-home">Data Loading, please wait...</p>}
                {error && <p className="message-home">Error occurred</p>}
                {errorMessage && <p className="message-home">{errorMessage}</p>}
            </div>

        </div>
    );
};

export default ReportingPage;