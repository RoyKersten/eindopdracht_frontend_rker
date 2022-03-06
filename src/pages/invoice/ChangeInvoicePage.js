import InputField from "../../components/inputfield/InputField";
import './InvoiceFormPage.css';
import {useParams} from "react-router-dom";
import Button from "../../components/button/Button";
import confirmIcon from "../../images/icons/confirm.png";
import React, {useEffect, useState} from "react";
import axios from "axios";


function ChangeInvoicePage() {

    const {id} = useParams()
    let {invoiceType} = useParams();
    const [errorMessage, setErrorMessage] = useState("");
    const [statusUpdated, setStatusUpdated] = useState(false);

    const [postInvoice, setPostInvoice] = useState({
        '@type': '',
        service: {idService: '', '@type': ''},
        invoiceStatus: '',
        pathName: '',
    });

    const [updateStatus, setUpdateStatus] = useState({
        idInvoice: '',
        '@type': '',
        invoiceStatus: '',
    });


    const [formState, setFormState] = useState({
        idInvoice: '',
        '@type': '',
        service: {idService: '', '@type': ''},
        customer: {idCustomer: ''},
        invoiceStatus: '',
        invoiceSubtotal: '',
        invoiceTotal: '',
        vatAmount: '',
        vatRate: '',
        pathName: '',
    });


    useEffect(() => {
        async function getInvoiceById() {
            try {
                const {data} = await axios.get(`http://localhost:8080/invoices/${invoiceType}/${id}`, {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: 'Bearer ' + localStorage.getItem('token'),
                    },
                });
                data.pathName = "";   //initial value of pathName should be an empty String before setFormState
                setFormState(data);
            } catch (e) {
                if (e.response.status.toString() === "403") {
                    setErrorMessage("invoice details could not be retrieved, you are not authorized!")
                } else if (e.response.status.toString() !== "403") {
                    setErrorMessage("invoice details could not be retrieved!")
                }
            }
        }

        getInvoiceById();
    }, [id, invoiceType]);


    useEffect(() => {
        function setPostProperties() {
            setPostInvoice({
                '@type': formState["@type"],
                service: {idService: formState.service.idService, '@type': formState.service["@type"]},
                pathName: formState.pathName,
            });
        }

        setPostProperties();
    }, [formState]);


    useEffect(() => {
        function setUpdateInvoiceStatus() {
            setUpdateStatus({
                idInvoice: formState.idInvoice,
                '@type': formState["@type"],
                invoiceStatus: formState.invoiceStatus,
            });
        }

        setUpdateInvoiceStatus();
    }, [formState]);


    async function updateInvoice() {
        try {
            //If invoiceStatus not Updated use PUT
            if (!statusUpdated) {
                await axios.put(`http://localhost:8080/invoices/${invoiceType}/${id}`, postInvoice, {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: 'Bearer ' + localStorage.getItem('token'),
                    },
                });

            }
            //If invoiceStatus updated use PATCH
            await axios.patch(`http://localhost:8080/invoices/${invoiceType}/status/${id}`, updateStatus, {
                headers: {
                    "Content-type": "application/json",
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                },
            });
            if (statusUpdated) {
                setErrorMessage("invoice status successfully updated!");
            } else if (!statusUpdated) {
                setErrorMessage("invoice successfully updated and stored on file location!");
            }

        } catch (e) {
            if (e.response.status.toString() === "403") {
                setErrorMessage("invoice could not be updated, you are not authorized!")
            } else if (e.response.status.toString() !== "403") {
                setErrorMessage("invoice could not be updated!")
            }
        }
    }

    //handle change for formState properties
    function handleChange(e) {
        const inputName = e.target.name;
        const inputValue = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

        if (inputName === "invoiceStatus" && inputValue !== "") {
            setStatusUpdated(true);     //in case status of invoice is updated PATCH should be used instead of PUT
        }

        setFormState({
            ...formState,
            [inputName]: inputValue,
        });
    }


    function handleSubmit(e) {
        e.preventDefault();
        updateInvoice().then();
    }

    return (
        <div className="invoice-form-container">
            <form className="invoice-form">
                <div className="invoice-form-section1">
                    <section>
                        <InputField className="invoice-form-input-component-section1"
                                    name="idInvoice"
                                    label="Invoice ID"
                                    inputType="text"
                                    value={formState.idInvoice}                                                                          //retrieve from Param itemtype
                                    readOnly={true}
                        />
                    </section>
                    <section>
                        <InputField className="invoice-form-input-component-section1"
                                    name="idCustomer"
                                    label="Customer ID"
                                    inputType="text"
                                    value={formState.customer?.idCustomer === undefined ? '' : formState.customer.idCustomer}                                                                          //retrieve from Param itemtype
                                    readOnly={true}
                        />
                    </section>
                </div>
                <div className="invoice-form-section2">
                    <section>
                        <InputField className="invoice-form-input-component-section2"
                                    name='@type'
                                    label="Invoice Type"
                                    inputType="text"
                                    value={formState['@type']}
                                    readOnly={true}
                        />
                    </section>
                    <section>
                        <InputField className="invoice-form-input-component-section2"
                                    name='@type'
                                    label="Service Type"
                                    inputType="text"
                                    list="invoiceTypeList"
                                    value={formState.service?.['@type'] === undefined ? '' : formState.service['@type']}
                                    readOnly={true}
                                    placeholder="please select"
                        />
                    </section>
                    <section>
                        <InputField className="invoice-form-input-component-section2"
                                    name="idService"
                                    label="Service ID"
                                    inputType="text"
                                    value={formState.service?.idService === undefined ? '' : formState.service.idService}
                                    readOnly={true}
                                    placeholder="please enter"
                        />
                    </section>
                    <section>
                        <InputField className="invoice-form-input-component-section2"
                                    name="invoiceStatus"
                                    label="Invoice Status"
                                    inputType="text"
                                    list="invoiceStatusList"
                                    value={formState.invoiceStatus}
                                    readOnly={formState.pathName !== ""}
                                    changeHandler={handleChange}
                        />

                        <datalist id="invoiceStatusList">
                            <option key={1} value="OPEN">OPEN</option>
                            <option key={2} value="BETAALD">BETAALD</option>
                        </datalist>
                    </section>
                    <section>
                        <InputField className="invoice-form-input-component-section2"
                                    name="invoiceSubtotal"
                                    label="Subtotal"
                                    inputType="text"
                                    value={formState.invoiceSubtotal}
                                    readOnly={true}
                        />
                    </section>
                    <section>
                        <InputField className="invoice-form-input-component-section2"
                                    name="vatAmount"
                                    label="Vat Amount"
                                    inputType="text"
                                    value={formState.vatAmount}
                                    readOnly={true}
                        />
                    </section>
                    <section>
                        <InputField className="invoice-form-input-component-section2"
                                    name="invoiceTotal"
                                    label="Invoice Total"
                                    inputType="text"
                                    value={formState.invoiceTotal}
                                    readOnly={true}
                        />
                    </section>
                </div>
                <div className="invoice-form-section3">
                    <section>
                        <InputField className="invoice-form-input-component-section3"
                                    name="pathName"
                                    label="File Location To Store Invoice"
                                    inputType="text"
                                    placeholder="please enter path: /users/roykersten/documents/invoices/invoice service 4"
                                    value={statusUpdated ? "" : formState.pathName}
                                    readOnly={statusUpdated}
                                    changeHandler={handleChange}
                        />
                    </section>
                </div>
                <Button
                    buttonName="confirm-button"
                    buttonDescription="CONFIRM"
                    pathName=""
                    buttonType="button"
                    onClick={(e) => {
                        handleSubmit(e)
                    }}
                    disabled={false}
                    buttonIcon={confirmIcon}
                />
            </form>
            <div className="messages">
                {errorMessage &&
                    <p className="message-error">{errorMessage}</p>}
                {!errorMessage &&
                    <p className="message-error">please enter file location in case invoice should be recalculated and
                        printed OR change Invoice Status </p>}
            </div>
        </div>
    );
}

export default ChangeInvoicePage;