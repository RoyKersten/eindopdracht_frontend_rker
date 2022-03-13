import './InvoicePage.css';
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import InputField from "../../components/inputfield/InputField";
import Button from "../../components/button/Button";
import displayIcon from "../../images/icons/display.png";
import createIcon from "../../images/icons/create.png";
import changeIcon from "../../images/icons/change.png";
import deleteIcon from "../../images/icons/delete.png";
import TransactionTable from "../../components/transactiontable/TransactionTable";

function InvoicePage() {

    const invoiceStatus = ["BETAALD", "OPEN"];
    const [invoice, setInvoice] = useState([]);
    const [invoiceType, setInvoiceType] = useState("inspections");
    const [sourceData, setSourceData] = useState([]);
    const [loading, toggleLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [reload, setReload] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState({idInvoice: ''});
    const [formState, setFormState] = useState({
        invoiceId: '',
        invoiceType: '',
        invoiceStatus: '',
        customerId: '',
        serviceId: '',
    });


    //Get service data based on endpoint, get bearer token from local storage to validate authentication and authorization
    useEffect(() => {
        async function getInvoice() {
            toggleLoading(true);
            try {
                const {data} = await axios.get(`http://localhost:8080/invoices/${invoiceType}`, {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: 'Bearer ' + localStorage.getItem('token'),
                    },
                });
                setSourceData(data);
                setInvoice(data);

            } catch (error) {
                if (error.response.status.toString() === "403") {
                    setErrorMessage("invoices could not be loaded, you are not authorized!")
                } else if (error.response.status.toString() !== "403") {
                    setErrorMessage(error.response.data);
                }
            }
            toggleLoading(false);
        }


        getInvoice().then();
    }, [reload, invoiceType]);


    async function deleteInvoiceById() {
        let text = "invoice will be deleted permanently in case invoice status is OPEN, are you sure?";
        if (window.confirm(text) === true) {
            try {
                const {data} = await axios.delete(`http://localhost:8080/invoices/${invoiceType}/${selectedInvoice.idInvoice}`, {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: 'Bearer ' + localStorage.getItem('token'),
                    },
                });
                setErrorMessage(data);
                setReload(!reload);

            } catch (error) {
                if (error.response.status.toString() === "403") {
                    setErrorMessage("invoice could not be deleted, you are not authorized!")
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


    //filter data based on itemType part or activity selection
    function onSelectionInvoiceType(e) {
        if (e.target.value === "") {
        } else {
            setInvoiceType(e.target.value);
        }
        filterData(sourceData);
        formState.invoiceType = '';
    }

    //filter data based on itemType part or activity selection
    function onSelectionInvoiceStatus(e) {
        if (e.target.value === "") {
        } else {
            formState.invoiceStatus = e.target.value
        }
        filterData(sourceData);
        formState.invoiceStatus = '';       //Reset filter invoiceStatus to reload available repairs or inspections
    }


//Filter data based customerId and lastname or show all customers when filters are empty
    function filterData(data) {
        setInvoice(sourceData);

        if (formState.invoiceId !== "") {
            setInvoice(data.filter(function (object) {
                return object.idInvoice.toString() === formState.invoiceId.toString();
            }))
        } else if (formState.invoiceType !== "") {
            setInvoice(data.filter(function (object) {
                return object.invoiceType === formState.invoiceType;
            }))
        } else if (formState.invoiceStatus !== "") {
            setInvoice(data.filter(function (object) {
                return object.invoiceStatus.toString() === formState.invoiceStatus.toString();
            }))
        } else if (formState.customerId !== "") {
            setInvoice(data.filter(function (object) {
                return object.customer.idCustomer.toString() === formState.customerId.toString();
            }))
        } else if (formState.serviceId !== "") {
            setInvoice(data.filter(function (object) {
                return object.service.idService.toString() === formState.serviceId.toString();
            }))
        } else {
            console.log("no entry");
        }
        ;
    }

    return (
        <div className="invoice-home-container">
            <div className="invoice-home-filter">

                <section>
                    <InputField name="invoiceId"
                                label="Invoice ID"
                                inputType="text"
                                onKeyPress={onKeyPress}
                                changeHandler={onKeyPress}
                    />
                </section>
                <section spellCheck="false">
                    <InputField name="invoiceType"
                                label="Invoice Type"
                                inputType="text"
                                list="invoiceTypeList"
                                placeholder="please select"
                                onSelection={onSelectionInvoiceType}

                    />
                    <datalist id="invoiceTypeList">
                        <option key={1} value="inspections">inspections</option>
                        <option key={2} value="repairs">repairs</option>
                    </datalist>
                </section>
                <section>
                    <InputField name="invoiceStatus"
                                label="Invoice Status"
                                inputType="text"
                                list="invoiceStatusList"
                                placeholder="please select"
                                onSelection={onSelectionInvoiceStatus}
                    />
                    <datalist id="invoiceStatusList">
                        {invoiceStatus.map((serviceStat, i) => (
                            <option key={i} value={serviceStat}/>
                        ))}

                    </datalist>
                </section>
                <section>
                    <InputField name="customerId"
                                label="Customer ID"
                                inputType="text"
                                onKeyPress={onKeyPress}
                                changeHandler={onKeyPress}
                    />
                </section>
                <section>
                    <InputField name="serviceId"
                                label="Service ID"
                                inputType="text"
                                onKeyPress={onKeyPress}
                                changeHandler={onKeyPress}
                    />
                </section>

            </div>
            <div className="invoice-home-transaction-container">
                <div className="invoice-home-display-container">
                    <div className="transaction-table">
                        <TransactionTable
                            selectObject={(selectedInvoice) => setSelectedInvoice(selectedInvoice)}                             //2 Retrieve data from child/component TransactionTable
                            tableContainerClassName="invoice-home-container-table"
                            headerContainerClassName="invoice-home-table-header"
                            headerClassName="invoice-home-table-header"
                            dataInput={invoice}
                        />
                        <div className="messages">
                            {loading && <p className="message-home">Data Loading, please wait...</p>}
                            {errorMessage && <p className="message-home">{errorMessage}</p>}
                            {!selectedInvoice.idInvoice && !loading && !errorMessage &&
                                <p className="message-home">please select invoice or select Invoice Type to switch
                                    between repair
                                    invoices and inspection invoices</p>}
                        </div>

                    </div>

                </div>
                <div className="invoice-home-buttons">
                    <Button
                        buttonName="transaction-home-button"
                        buttonDescription="DISPLAY"
                        buttonType="button"
                        pathName={"/invoices/display/" + invoiceType + "/" + selectedInvoice.idInvoice}
                        disabled={selectedInvoice.idInvoice === ''}
                        buttonIcon={displayIcon}
                    />
                    <Button
                        buttonName="transaction-home-button"
                        buttonDescription="CREATE"
                        buttonType="button"
                        pathName={"/invoices/create/"}
                        disabled={false}
                        buttonIcon={createIcon}
                    />
                    <Button
                        buttonName="transaction-home-button"
                        buttonDescription="CHANGE"
                        buttonType="button"
                        pathName={"/invoices/change/" + invoiceType + "/" + selectedInvoice.idInvoice}
                        disabled={selectedInvoice.idInvoice === ''}
                        buttonIcon={changeIcon}
                    />
                    <Button
                        buttonName="transaction-home-button"
                        buttonDescription="DELETE"
                        buttonType="button"
                        onClick={() => deleteInvoiceById()}
                        pathName=""
                        disabled={selectedInvoice.idInvoice === ''}
                        buttonIcon={deleteIcon}
                    />
                </div>
            </div>
        </div>
    );
};

export default InvoicePage;