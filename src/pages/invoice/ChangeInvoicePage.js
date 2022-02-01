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
    const [endpoint, setEndpoint] = useState(`http://localhost:8080/invoices/${invoiceType}/${id}`);
    const [postInvoice, setPostInvoice] = useState({
        '@type': '',
        service: {idService: '', '@type': ''},
        pathName: '',
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
                const {data} = await axios.get(endpoint, {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: 'Bearer ' + localStorage.getItem('token'),
                    },
                });
                setFormState(data);
            } catch (e) {
                console.error(e);
            }
        }

        getInvoiceById();
    }, [endpoint]);


    async function updateInvoice() {
        console.log(postInvoice);
        try {
            const {data} = await axios.put(endpoint, formState, {
                headers: {
                    "Content-type": "application/json",
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                },
            });
            setFormState(data);
            setErrorMessage("invoice successfully updated!");
        } catch (e) {
            setErrorMessage(e.response.data)
        }
    }


    function handleChange(e) {
        const inputName = e.target.name;
        const inputValue = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

        if (inputName === "idService") {
            setFormState(formState.service.idService = inputValue);
        } else if (inputName === '@type') {
            setFormState(formState.service['@type'] = inputValue);
            setFormState(formState['@type'] = inputValue + "_invoice");
        }

        setFormState({
            ...formState,
            [inputName]: inputValue,
        })
    }

    function handleSubmit(e) {
        e.preventDefault();
        updateInvoice().then();
    }

    console.log(formState);

    return (
        <div className="invoice-form-container">
            <form className="invoice-form" onSubmit={handleSubmit}>
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
                                    readOnly={false}
                                    placeholder="please select"
                                    changeHandler={handleChange}
                        />

                        <datalist id="invoiceTypeList">
                            <option value="inspection">inspection</option>
                            <option value="repair">repair</option>
                        </datalist>
                    </section>
                    <section>
                        <InputField className="invoice-form-input-component-section2"
                                    name="idService"
                                    label="Service ID"
                                    inputType="text"
                                    value={formState.service?.idService === undefined ? '' : formState.service.idService}
                                    readOnly={false}
                                    placeholder="please enter"
                                    changeHandler={handleChange}
                        />
                    </section>
                    <section>
                        <InputField className="invoice-form-input-component-section2"
                                    name="invoiceStatus"
                                    label="Invoice Status"
                                    inputType="text"
                                    value={formState.invoiceStatus}
                                    readOnly={true}
                        />
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
                                    value={formState.pathName}
                                    readOnly={false}
                                    changeHandler={handleChange}

                        />
                    </section>
                </div>
                <Button
                    buttonName="confirm-button"
                    buttonDescription="CONFIRM"
                    pathName=""
                    buttonType="submit"
                    disabled={false}
                    buttonIcon={confirmIcon}
                />
            </form>
            <div className="messages">
                {errorMessage &&
                    <p className="message-error">{errorMessage}</p>}
            </div>
        </div>
    );
}

export default ChangeInvoicePage;