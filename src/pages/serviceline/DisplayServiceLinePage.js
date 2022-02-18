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
    const [object, setObject] = useState({
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
        vatRate:''
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
                setObject(data);
            } catch (e) {
                console.error(e);
            }
        }


        getServiceLineById();
    }, [endpoint]);

    console.log(object);

    return (
        <div className="serviceline-form-container">
            <form className="serviceline-form">
                <div className="serviceline-form-section1">
                    <section>
                        <InputField className="form-serviceline-input-component-section1"
                                    name="idService"
                                    label="Service ID"
                                    inputType="text"
                                    value={object.service.idService}                                                                          //retrieve from Param itemtype
                                    readOnly={true}
                        />
                    </section>
                    <section>
                        <InputField className="form-serviceline-input-component-section1"
                                    name="serviceType"
                                    label="Service Type"
                                    inputType="text"
                                    value={object.service['@type']}                                                                          //retrieve from Param itemtype
                                    readOnly={true}
                        />
                    </section>
                    <section>
                        <InputField className="form-serviceline-input-component-section1"
                                    name="idServiceLine"
                                    label="ServiceLine ID"
                                    inputType="text"
                                    value={object.idServiceLine}                                                                          //retrieve from Param itemtype
                                    readOnly={true}
                        />
                    </section>
                    <section>
                        <InputField className="form-serviceline-input-component-section1"
                                    name="serviceLineNumber"
                                    label="Service Line Number"
                                    inputType="text"
                                    value={object.serviceLineNumber}                                                                          //retrieve from Param itemtype
                                    readOnly={true}
                        />
                    </section>
                    <section>
                        <InputField className="form-serviceline-input-component-section1"
                                    name="idInvoice"
                                    label="Invoice ID"
                                    inputType="text"
                                    value={object.invoice?.idInvoice === undefined ? '' : object.invoice?.idInvoice}                                          //When serviceline is not invoiced, invoice will be null and leads to error, by first checking error will be avoided
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
                                            value={object.item.idItem}
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
                                            value={object.item['@type']}
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
                                    value={object.itemName}
                                    readOnly={true}
                        />
                    </section>
                    <section>
                        <InputField className="form-serviceline-input-component-section2"
                                    name="qty"
                                    label="Item Qty."
                                    inputType="text"
                                    value={object.qty}
                                    readOnly={true}
                        />
                    </section>
                    <section>
                        <InputField className="form-serviceline-input-component-section2"
                                    name="price"
                                    label="item Price"
                                    inputType="text"
                                    value={object.price}
                                    readOnly={true}
                        />
                    </section>
                    <section>
                        <InputField className="form-serviceline-input-component-section2"
                                    name="lineSubTotal"
                                    label="Subtotal"
                                    inputType="text"
                                    value={object.lineSubTotal}
                                    readOnly={true}
                        />
                    </section>
                    <section>
                        <InputField className="form-serviceline-input-component-section2"
                                    name="vatAmount"
                                    label="VAT Amount"
                                    inputType="text"
                                    value={object.vatAmount}
                                    readOnly={true}
                        />
                    </section>
                    <section>
                        <InputField className="form-serviceline-input-component-section2"
                                    name="lineTotal"
                                    label="Total Amount"
                                    inputType="text"
                                    value={object.lineTotal}
                                    readOnly={true}
                        />
                    </section>
                </div>
            </form>


            <Button
                buttonName="confirm-button"
                buttonDescription="CONFIRM"
                pathName="/home"
                disabled={true}
                buttonIcon={confirmIcon}
            />
        </div>

    );
}

export default DisplayServiceLinePage;