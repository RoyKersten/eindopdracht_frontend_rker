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
        try {
            const {data} = await axios.post(endpoint, postInvoice, {
                headers: {
                    "Content-type": "application/json",
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                },
            });
            const indexOf = data.lastIndexOf("/") + 1;                           //determine new created idCar => last numbers after last /
            const id = (data.substring(indexOf,));                                     //capture idItem
            if (data !== null) {
                setErrorMessage("invoice successfully created!");
            }
            const serviceType = postInvoice.service['@type'] + "s";
            await getInvoiceById(id, serviceType);

        } catch (e) {
            if (e.response.status.toString() === "403") {
                setErrorMessage("invoice could not be created, you are not authorized!")
            } else if (e.response.status.toString() !== "403") {
                setErrorMessage("invoice could not be created!")
            }
        }
    }


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


    //Get invoiceById
    async function getInvoiceById(idInvoice, serviceType) {
        try {
            const {data} = await axios.get(`http://localhost:8080/invoices/${serviceType}/${idInvoice}`, {
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


    //handle change for formState properties
    function handleChange(e) {
        const inputName = e.target.name;
        const inputValue = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

        setFormState({
            ...formState,
            [inputName]: inputValue,
        });
    }

    //handle change for nested object properties
    function handleChangeNestedObject(e) {
        const inputName1 = e.target.name;
        const inputValue1 = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        let inputName2 = '';
        let inputValue2 = '';

        //nestedObject Item exists of two properties: determine which nestedObject property is updated, the other also needs to be updated to avoid error message
        //handleChangeNestedObject function is only invoked via two properties item.idItem and item['@type']
        if (inputName1 === "idService") {
            inputName2 = "@type";
            inputValue2 = formState.service["@type"];
            invoiceType = formState.service['@type'] + "s";
            setEndpoint(`http://localhost:8080/invoices/${invoiceType}`);
        } else {
            inputName2 = "idService"
            inputValue2 = formState.service.idService;
        }
        setFormState({
            ...formState,
            service: {[inputName1]: inputValue1, [inputName2]: inputValue2},
        });
    }

    function handleSubmit(e) {
        e.preventDefault();
        addInvoice().then();
    }

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
                                    changeHandler={handleChangeNestedObject}
                        />
                        <datalist id="serviceTypeList">
                            <option key={1} value="inspection">inspection</option>
                            <option key={2} value="repair">repair</option>
                        </datalist>
                    </section>
                    <section>
                        <InputField className="invoice-form-input-component-section2"
                                    name="idService"
                                    label="Service ID"
                                    inputType="text"
                                    readOnly={false}
                                    placeholder="please enter"
                                    changeHandler={handleChangeNestedObject}
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