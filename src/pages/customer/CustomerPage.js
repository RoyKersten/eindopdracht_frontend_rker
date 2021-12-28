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
    const [endpoint, setEndpoint] = useState("http://localhost:8080/customers");    //endpoint used to fetch all customers from database

    const [formState, setFormState] = useState({
        customerId: '',
        lastname: '',
    })

    //Get customer data based on endpoint, get bearer token from local storage to validate authentication and authorization
    useEffect(() => {
        async function getCustomers() {
            try {
                const {data} = await axios.get(endpoint, {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: 'Bearer ' + localStorage.getItem('token'),
                    },
                });
                setCustomers(data);
                console.log(customer);

            } catch (e) {
                console.error(e);
            }
        }

        getCustomers();
    }, []);


    function handleFormChange(e) {
        const inputName = e.target.name;
        const inputValue = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

        setFormState({
            ...formState,
            [inputName]: inputValue,
        })
    }

    function handleSubmit(e) {
        e.preventDefault();
        console.log(formState);
    }


    return (
        <div className="customer-home-container">
            <div className="customer-home-filter">
                <form onSubmit={handleSubmit}>
                    <section>
                        <InputField name="customerId" label="Customer ID" inputType="text" value={formState.customerId}
                                    changeHandler={handleFormChange}/>
                    </section>
                    <section>
                        <InputField name="lastname" label="Lastname" inputType="text" value={formState.lastname}
                                    changeHandler={handleFormChange}/>
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