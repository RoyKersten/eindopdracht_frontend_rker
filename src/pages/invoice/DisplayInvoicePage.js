import InputField from "../../components/inputfield/InputField";
import './InvoiceFormPage.css';
import {useParams} from "react-router-dom";
import Button from "../../components/button/Button";
import confirmIcon from "../../images/icons/confirm.png";
import React, {useEffect, useState} from "react";
import axios from "axios";


function DisplayInvoicePage() {

    const {id} = useParams()
    const {invoiceType} = useParams();
    const [error, setError] = useState(false);
    const [formState, setFormState] = useState({
        idInvoice: '',
        '@type': '',
        service: {idService: '', '@type': ''},
        invoiceStatus: '',
        invoiceSubtotal: '',
        invoiceTotal: '',
        vatAmount: '',
        vatRate: '',
        pathName: ''
    });

    useEffect(() => {
        async function getInvoiceById() {
            setError(false);
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
                setError(true);
            }
        }

        getInvoiceById();
    }, [id, invoiceType]);

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
                                    value={formState.service['@type']}
                                    readOnly={true}
                        />
                    </section>
                    <section>
                        <InputField className="invoice-form-input-component-section2"
                                    name="idService"
                                    label="Service ID"
                                    inputType="text"
                                    value={formState.service.idService}
                                    readOnly={true}
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
                                    name="invoiceSubTotal"
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
                                    value={formState.pathName}
                                    readOnly={true}
                        />
                    </section>

                </div>

                <Button
                    buttonName="confirm-button"
                    buttonDescription="CONFIRM"
                    pathName="/home"
                    disabled={true}
                    buttonIcon={confirmIcon}
                />
            </form>
            <div className="messages">
                {error &&
                    <p className="message-error">Error occurred</p>}
            </div>
        </div>
    );
}

export default DisplayInvoicePage;