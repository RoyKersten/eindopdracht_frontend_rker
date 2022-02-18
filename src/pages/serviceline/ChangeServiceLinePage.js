import InputField from "../../components/inputfield/InputField";
import './ServiceLineFormPage.css';
import {useParams} from "react-router-dom";
import Button from "../../components/button/Button";
import confirmIcon from "../../images/icons/confirm.png";
import React, {useEffect, useState} from "react";
import axios from "axios";


function ChangeServiceLinePage() {

    const {id} = useParams()
    const {serviceType} = useParams();
    const [errorMessage, setErrorMessage] = useState("");
    const [endpoint, setEndpoint] = useState(`http://localhost:8080/services/${serviceType}/${id}`);
    const [objectServiceLine, setObjectServiceLine] = useState({
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
        //Get serviceLineById
        async function getServiceLineById() {
            try {
                const {data} = await axios.get(`http://localhost:8080/servicelines/${id}`, {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: 'Bearer ' + localStorage.getItem('token'),
                    },
                });
                setObjectServiceLine(data);
            } catch (e) {
                console.error(e);
            }
        }

        getServiceLineById();
    }, [endpoint]);


    async function updateServiceLineById() {
        try {
            const {data} = await axios.put(`http://localhost:8080/servicelines/${id}`, objectServiceLine, {
                headers: {
                    "Content-type": "application/json",
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                },
            });
            setErrorMessage("serviceline successfully updated!");
        } catch (e) {
            setErrorMessage(e.response.data)
        }
    }


    //set formChange after enter key, this will trigger useEffect and data will be reloaded.
    function changeHandler(e) {
        const inputName = e.target.name;
        const inputValue = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

        if (inputName === "idItem") {
            setObjectServiceLine(objectServiceLine.item.idItem = inputValue)
        } else if (inputName === '@type') {
            setObjectServiceLine(objectServiceLine.item['@type'] = inputValue)
        }

        setObjectServiceLine({
            ...objectServiceLine,
            [inputName]: inputValue,
        })
    }

    function handleSubmit(e) {
        e.preventDefault();
        updateServiceLineById().then();
    }

    return (
        <div className="serviceline-form-container">
            <form className="serviceline-form" onSubmit={handleSubmit}>
                <div className="serviceline-form-section1">
                    <section>
                        <InputField className="form-serviceline-input-component-section1"
                                    name="idService"
                                    label="Service ID"
                                    inputType="text"
                                    value={objectServiceLine.service?.idService === undefined ? '' : objectServiceLine.service.idService}
                                    readOnly={true}
                        />
                    </section>
                    <section>
                        <InputField className="form-serviceline-input-component-section1"
                                    name="@type"
                                    label="Service Type"
                                    inputType="text"
                                    value={objectServiceLine.service?.['@type'] === undefined ? '' : objectServiceLine.service['@type']}
                                    readOnly={true}
                        />
                    </section>
                    <section>
                        <InputField className="form-serviceline-input-component-section1"
                                    name="idServiceLine"
                                    label="ServiceLine ID"
                                    inputType="text"
                                    value={objectServiceLine.idServiceLine}
                                    readOnly={true}
                        />
                    </section>
                    <section>
                        <InputField className="form-serviceline-input-component-section1"
                                    name="serviceLineNumber"
                                    label="Service Line Number"
                                    inputType="text"
                                    value={objectServiceLine.serviceLineNumber}
                                    readOnly={true}
                        />
                    </section>
                    <section>
                        <InputField className="form-serviceline-input-component-section1"
                                    name="idInvoice"
                                    label="Invoice ID"
                                    inputType="text"
                                    value={objectServiceLine.invoice?.idInvoice === undefined ? '' : objectServiceLine.invoice.idInvoice}                     //When serviceline is not invoiced, invoice will be null and leads to error, by first checking error will be avoided                                                                 //retrieve from Param itemtype
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
                                            readOnly={false}
                                            value={objectServiceLine.item?.idItem === undefined ? '' : objectServiceLine.item.idItem}
                                            placeholder="please enter"
                                            changeHandler={changeHandler}

                                />
                            </section>
                        </div>

                        <div className="serviceline-form-div3">
                            <section>
                                <InputField className="form-serviceline-input-component"
                                            name="@type"
                                            label="Item Type"
                                            inputType="text"
                                            list="itemTypeList"
                                            readOnly={false}
                                            value={objectServiceLine.item?.['@type'] === undefined ? '' : objectServiceLine.item['@type']}
                                            placeholder="please select"
                                            changeHandler={changeHandler}

                                />
                            </section>

                            <datalist id="itemTypeList">
                                <option value="part">part</option>
                                <option value="activity">activity</option>
                            </datalist>

                        </div>
                    </div>

                    <section>
                        <InputField className="form-serviceline-input-component-section2"
                                    name="itemName"
                                    label="Item Name"
                                    inputType="text"
                                    value={objectServiceLine.itemName}
                                    readOnly={true}
                        />
                    </section>
                    <section>
                        <InputField className="form-serviceline-input-component-section2"
                                    name="qty"
                                    label="Item Qty."
                                    inputType="text"
                                    value={objectServiceLine.qty}
                                    readOnly={false}
                                    changeHandler={changeHandler}
                        />
                    </section>
                    <section>
                        <InputField className="form-serviceline-input-component-section2"
                                    name="price"
                                    label="Item Price"
                                    inputType="text"
                                    value={objectServiceLine.price}
                                    readOnly={true}
                        />
                    </section>
                    <section>
                        <InputField className="form-serviceline-input-component-section2"
                                    name="lineSubTotal"
                                    label="Subtotal"
                                    inputType="text"
                                    value={objectServiceLine.lineSubTotal}
                                    readOnly={true}
                        />
                    </section>
                    <section>
                        <InputField className="form-serviceline-input-component-section2"
                                    name="vatAmount"
                                    label="VAT Amount"
                                    inputType="text"
                                    value={objectServiceLine.vatAmount}
                                    readOnly={true}
                        />
                    </section>
                    <section>
                        <InputField className="form-serviceline-input-component-section2"
                                    name="lineTotal"
                                    label="Total Amount"
                                    inputType="text"
                                    value={objectServiceLine.lineTotal}
                                    readOnly={true}
                        />
                    </section>
                </div>
                <Button
                    buttonName="confirm-button"
                    buttonDescription="CONFIRM"
                    buttonType="submit"
                    pathName=""
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

export default ChangeServiceLinePage;