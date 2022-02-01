import InputField from "../../components/inputfield/InputField";
import './InvoiceFormPage.css';
import {useParams} from "react-router-dom";
import Button from "../../components/button/Button";
import confirmIcon from "../../images/icons/confirm.png";
import React, {useEffect, useState} from "react";
import axios from "axios";


function CreateInvoicePage() {

    let {invoiceType} = useParams();
    const [errorMessage, setErrorMessage] = useState("");
    const [endpoint, setEndpoint] = useState(`http://localhost:8080/invoices/${invoiceType}/`);
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
        pathName: ''
    });


    async function addInvoice() {
        setPostInvoice(postInvoice['@type'] = formState['@type']);
        setPostInvoice(postInvoice.service.idService = formState.service.idService);
        setPostInvoice(postInvoice.service['@type'] = formState.service['@type']);
        setPostInvoice(postInvoice.pathName = formState.pathName);
        try {
            const {data} = await axios.post(endpoint, postInvoice, {
                headers: {
                    "Content-type": "application/json",
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                },
            });
            console.log(data);
            const indexOf = data.lastIndexOf("/") + 1;                           //determine new created idCar => last numbers after last /
            const id = (data.substring(indexOf,));                                     //capture idItem
            console.log(id);
            if (data !== null) {
                setErrorMessage("invoice successfully created!");
            }
            const serviceType = postInvoice.service['@type'] + "s";
            await getInvoiceById(id, serviceType);

        } catch (e) {
            console.error(e);
        }
    }


    //Get invoiceById
    async function getInvoiceById(idInvoice, serviceType) {
        try {
            const {data} = await axios.get(`http://localhost:8080/invoices/${serviceType}/${idInvoice}`, {
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


    function handleChange(e) {
        const inputName = e.target.name;
        const inputValue = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        const inputId = e.target.id;
        console.log(inputId);
        console.log(inputName);

        if (inputName === "idService") {
            formState.service.idService = inputValue;
        } else if (inputName === '@type' && inputId === "serviceType") {
            formState.service['@type'] = inputValue;
            invoiceType = formState.service['@type'] + "s";
            setEndpoint(`http://localhost:8080/invoices/${invoiceType}`);
        } else if ((inputName === '@type' && inputId === "invoiceType") || inputName === "pathName")
            setFormState({
                ...formState,
                [inputName]: inputValue,
            })
    }

    function handleSubmit(e) {
        e.preventDefault();
        addInvoice().then();
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
                                    id="invoiceType"
                                    label="Invoice Type"
                                    list="invoiceTypeList"
                                    inputType="text"
                                    placeholder="please select"
                                    readOnly={false}
                                    changeHandler={handleChange}
                        />
                        <datalist id="invoiceTypeList">
                            <option value="inspection_invoice">inspection_invoice</option>
                            <option value="repair_invoice">repair_invoice</option>
                        </datalist>

                    </section>
                    <section>
                        <InputField className="invoice-form-input-component-section2"
                                    name='@type'
                                    id="serviceType"
                                    label="Service Type"
                                    inputType="text"
                                    list="serviceTypeList"
                                    readOnly={false}
                                    placeholder="please select"
                                    changeHandler={handleChange}
                        />
                        <datalist id="serviceTypeList">
                            <option value="inspection">inspection</option>
                            <option value="repair">repair</option>
                        </datalist>
                    </section>
                    <section>
                        <InputField className="invoice-form-input-component-section2"
                                    name="idService"
                                    label="Service ID"
                                    inputType="text"
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

export default CreateInvoicePage;