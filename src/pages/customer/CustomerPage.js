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
    const [loading, toggleLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [reload, setReload] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState({idCustomer: ''});

    const [formState, setFormState] = useState({
        customerId: '',
        lastname: '',
    });

    //Get customer data based on endpoint, get bearer token from local storage to validate authentication and authorization
    useEffect(() => {
        async function getCustomers() {
            toggleLoading(true);
            try {
                const {data} = await axios.get(`http://localhost:8080/customers`, {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: 'Bearer ' + localStorage.getItem('token'),
                    },
                });
                setSourceData(data);
                setCustomers(data);

            } catch (error) {
                if (error.response.status.toString() === "403") {
                    setErrorMessage("customers could not be loaded, you are not authorized!")
                } else if (error.response.status.toString() !== "403") {
                    setErrorMessage(error.response.data);
                }
            }
            toggleLoading(false);
        }

        getCustomers().then();
    }, [reload]);


    async function deleteCustomerById() {
        let text = "customer (and connected cars) will be deleted permanently in case no inspection or repair is connected, are you sure?";
        if (window.confirm(text) === true) {
            try {
                const {data} = await axios.delete("http://localhost:8080/customers/" + selectedCustomer.idCustomer, {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: 'Bearer ' + localStorage.getItem('token'),
                    },
                });
                setErrorMessage(data);
                setReload(!reload);
            } catch (error) {
                if (error.response.status.toString() === "403") {
                    setErrorMessage("customer could not be deleted, you are not authorized!")
                } else if (error.response.status.toString() !== "403") {
                    setErrorMessage(error.response.data);
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
                <section>
                    <InputField name="customerId"
                                label="Customer ID"
                                inputType="text"
                                onKeyPress={onKeyPress}
                                changeHandler={onKeyPress}
                    />
                </section>
                <section>
                    <InputField name="lastname"
                                label="Lastname"
                                inputType="text"
                                onKeyPress={onKeyPress}
                                changeHandler={onKeyPress}
                    />
                </section>
            </div>
            <div className="customer-home-transaction-container">
                <div className="customer-home-display-container">
                    <div className="transaction-table">
                        <TransactionTable
                            selectObject={(selectedCustomer) => setSelectedCustomer(selectedCustomer)}                             //2 Retrieve data from child/component TransactionTable
                            tableContainerClassName="customer-home-container-table"
                            headerContainerClassName="customer-home-table-header"
                            headerClassName="customer-home-table-header"
                            dataInput={customer}
                        />
                        <div className="messages">
                            {loading && <p className="message-home">Data Loading, please wait...</p>}
                            {errorMessage && <p className="message-home">{errorMessage}</p>}
                            {!selectedCustomer.idCustomer && !loading && !errorMessage &&
                                <p className="message-home">Please select a customer</p>}
                        </div>
                    </div>
                </div>
                <div className="customer-home-buttons">
                    <Button
                        buttonName="transaction-home-button"
                        buttonDescription="DISPLAY"
                        buttonType="button"
                        pathName={"/customers/display/" + (selectedCustomer.idCustomer)}
                        disabled={selectedCustomer.idCustomer === ''}
                        buttonIcon={displayIcon}
                    />
                    <Button
                        buttonName="transaction-home-button"
                        buttonDescription="CREATE"
                        buttonType="button"
                        pathName="/customers/create"
                        disabled={false}
                        buttonIcon={createIcon}
                    />
                    <Button
                        buttonName="transaction-home-button"
                        buttonDescription="CHANGE"
                        buttonType="button"
                        pathName={"/customers/change/" + (selectedCustomer.idCustomer)}
                        disabled={selectedCustomer.idCustomer === ''}
                        buttonIcon={changeIcon}
                    />
                    <Button
                        buttonName="transaction-home-button"
                        buttonDescription="DELETE"
                        buttonType="button"
                        onClick={() => deleteCustomerById()}
                        pathName=""
                        disabled={selectedCustomer.idCustomer === ''}
                        buttonIcon={deleteIcon}
                    />
                </div>
            </div>
        </div>

    );
};

export default CustomerPage;

