import InputField from "../../components/inputfield/InputField";
import './ServiceLineFormPage.css';
import {useParams} from "react-router-dom";
import Button from "../../components/button/Button";
import confirmIcon from "../../images/icons/confirm.png";
import React, {useEffect, useState} from "react";
import axios from "axios";


function DisplayServiceLinePage() {

    const {id} = useParams()
    const [endpoint, setEndpoint] = useState(`http://localhost:8080/servicelines/${id}`);
    const [errorMessage, setErrorMessage] = useState("");
    const [formState, setFormState] = useState({
        idServiceLine: '',
        service: {idService: '', '@type': ''},
        invoice: {idInvoice: ''},
        serviceLineNumber: '',
        item: {idItem: '', '@type': ''},
        itemName: '',
        qty: '',
        price: '',
        lineSubTotal: '',
        vatAmount: '',
        lineTotal: '',
        vatRate: ''
    });

    useEffect(() => {
        async function getServiceLineById() {
            try {
                const {data} = await axios.get(endpoint, {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: 'Bearer ' + localStorage.getItem('token'),
                    },
                });
                setFormState(data);
            } catch (e) {
                if (e.response.status.toString() === "403") {
                    setErrorMessage("serviceLine details could not be retrieved, you are not authorized!")
                } else if (e.response.status.toString() !== "403") {
                    setErrorMessage("serviceLine details could not be retrieved!")
                }
            }
        }


        getServiceLineById();
    }, [endpoint]);

    return (
        <div className="serviceline-form-container">
            <form className="serviceline-form">
                <div className="serviceline-form-section1">
                    <section>
                        <InputField className="form-serviceline-input-component-section1"
                                    name="idService"
                                    label="Service ID"
                                    inputType="text"
                                    value={formState.service.idService}                                                                          //retrieve from Param itemtype
                                    readOnly={true}
                        />
                    </section>
                    <section>
                        <InputField className="form-serviceline-input-component-section1"
                                    name="serviceType"
                                    label="Service Type"
                                    inputType="text"
                                    value={formState.service['@type']}                                                                          //retrieve from Param itemtype
                                    readOnly={true}
                        />
                    </section>
                    <section>
                        <InputField className="form-serviceline-input-component-section1"
                                    name="idServiceLine"
                                    label="ServiceLine ID"
                                    inputType="text"
                                    value={formState.idServiceLine}                                                                          //retrieve from Param itemtype
                                    readOnly={true}
                        />
                    </section>
                    <section>
                        <InputField className="form-serviceline-input-component-section1"
                                    name="serviceLineNumber"
                                    label="Service Line Number"
                                    inputType="text"
                                    value={formState.serviceLineNumber}                                                                          //retrieve from Param itemtype
                                    readOnly={true}
                        />
                    </section>
                    <section>
                        <InputField className="form-serviceline-input-component-section1"
                                    name="idInvoice"
                                    label="Invoice ID"
                                    inputType="text"
                                    value={formState.invoice?.idInvoice === undefined ? '' : formState.invoice?.idInvoice}                                          //When serviceline is not invoiced, invoice will be null and leads to error, by first checking error will be avoided
                                    readOnly={true}
                        />
                    </section>


                </div>
                <div className="serviceline-form-section2">
                    <div className="serviceline-form-input-section2">
                        <div className="serviceline-form-div2">
                            <section>
                                <InputField className="form-serviceline-input-component"
                                            name="idItem"
                                            label="Item ID"
                                            inputType="text"
                                            value={formState.item.idItem}
                                            readOnly={true}
                                />
                            </section>
                        </div>

                        <div className="serviceline-form-div3">
                            <section>
                                <InputField className="form-serviceline-input-component"
                                            name="@type"
                                            label="Item Type"
                                            inputType="text"
                                            value={formState.item['@type']}
                                            readOnly={true}
                                />
                            </section>
                        </div>
                    </div>

                    <section>
                        <InputField className="form-serviceline-input-component-section2"
                                    ame="itemName"
                                    label="Item Name"
                                    inputType="text"
                                    value={formState.itemName}
                                    readOnly={true}
                        />
                    </section>
                    <section>
                        <InputField className="form-serviceline-input-component-section2"
                                    name="qty"
                                    label="Item Qty."
                                    inputType="text"
                                    value={formState.qty}
                                    readOnly={true}
                        />
                    </section>
                    <section>
                        <InputField className="form-serviceline-input-component-section2"
                                    name="price"
                                    label="item Price"
                                    inputType="text"
                                    value={formState.price}
                                    readOnly={true}
                        />
                    </section>
                    <section>
                        <InputField className="form-serviceline-input-component-section2"
                                    name="lineSubTotal"
                                    label="Subtotal"
                                    inputType="text"
                                    value={formState.lineSubTotal}
                                    readOnly={true}
                        />
                    </section>
                    <section>
                        <InputField className="form-serviceline-input-component-section2"
                                    name="vatAmount"
                                    label="VAT Amount"
                                    inputType="text"
                                    value={formState.vatAmount}
                                    readOnly={true}
                        />
                    </section>
                    <section>
                        <InputField className="form-serviceline-input-component-section2"
                                    name="lineTotal"
                                    label="Total Amount"
                                    inputType="text"
                                    value={formState.lineTotal}
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
                {errorMessage &&
                    <p className="message-error">{errorMessage}</p>}
            </div>

        </div>
    );
}

export default DisplayServiceLinePage;