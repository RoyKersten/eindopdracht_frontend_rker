import InputField from "../../components/inputfield/InputField";
import './ServiceLineFormPage.css';
import {useParams} from "react-router-dom";
import Button from "../../components/button/Button";
import confirmIcon from "../../images/icons/confirm.png";
import React, {useEffect, useState} from "react";
import axios from "axios";


function ChangeServiceLinePage() {

    const {id} = useParams()
    const [errorMessage, setErrorMessage] = useState("");

    //Only a few properties are required to post a serviceLine, backend will create rest of properties automatically which you will find back in formState
    const [postServiceLine, setPostServiceLine] = useState({
        service: {idService: '', '@type': ''},
        item: {idItem: '', '@type': ''},
        qty: '',
    });

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
        //Get serviceLineById
        async function getServiceLineById() {
            try {
                const {data} = await axios.get(`http://localhost:8080/servicelines/${id}`, {
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
    }, [id]);


    //When one of the properties of formState changes, postServiceLine properties need to be updated.
    useEffect(() => {
        function setPostProperties() {
            setPostServiceLine({
                service: {idService: formState.service.idService, '@type': formState.service["@type"]},
                item: {idItem: formState.item.idItem, '@type': formState.item["@type"]},
                qty: formState.qty
            });
        }

        setPostProperties();
    }, [formState]);


    async function updateServiceLineById() {
        try {
            await axios.put(`http://localhost:8080/servicelines/${id}`, postServiceLine, {
                headers: {
                    "Content-type": "application/json",
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                },
            });
            setErrorMessage("serviceline successfully updated!");
        } catch (e) {
            if (e.response.status.toString() === "403") {
                setErrorMessage("serviceLine could not be updated, you are not authorized!")
            } else if (e.response.status.toString() !== "403") {
                setErrorMessage("serviceLine could not be updated!")
            }
        }
    }


    //set formChange after enter key, this will trigger useEffect and data will be reloaded.
    function handleChange(e) {
        const inputName = e.target.name;
        const inputValue = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

        setFormState({
            ...formState,
            [inputName]: inputValue,
        })
    }

    //handle change for nested object properties
    function handleChangeNestedObject(e) {
        const inputName1 = e.target.name;
        const inputValue1 = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        let inputName2 = '';
        let inputValue2 = '';

        //nestedObject Item exists of two properties: determine which nestedObject property is updated, the other also needs to be updated to avoid error message
        //handleChangeNestedObject function is only invoked via two properties item.idItem and item['@type']
        if (inputName1 === "idItem") {
            inputName2 = "@type";
            inputValue2 = formState.item["@type"];
        } else {
            inputName2 = "idItem"
            inputValue2 = formState.item.idItem;
        }
        setFormState({
            ...formState,
            item: {[inputName1]: inputValue1, [inputName2]: inputValue2},
        });
    }

    function handleSubmit(e) {
        e.preventDefault();
        updateServiceLineById().then();
    }


    return (
        <div className="serviceline-form-container">
            <form className="serviceline-form">
                <div className="serviceline-form-section1">
                    <section>
                        <InputField className="form-serviceline-input-component-section1"
                                    name="idService"
                                    label="Service ID"
                                    inputType="text"
                                    value={formState.service?.idService === undefined ? '' : formState.service.idService}
                                    readOnly={true}
                        />
                    </section>
                    <section>
                        <InputField className="form-serviceline-input-component-section1"
                                    name="@type"
                                    label="Service Type"
                                    inputType="text"
                                    value={formState.service?.['@type'] === undefined ? '' : formState.service['@type']}
                                    readOnly={true}
                        />
                    </section>
                    <section>
                        <InputField className="form-serviceline-input-component-section1"
                                    name="idServiceLine"
                                    label="ServiceLine ID"
                                    inputType="text"
                                    value={formState.idServiceLine}
                                    readOnly={true}
                        />
                    </section>
                    <section>
                        <InputField className="form-serviceline-input-component-section1"
                                    name="serviceLineNumber"
                                    label="Service Line Number"
                                    inputType="text"
                                    value={formState.serviceLineNumber}
                                    readOnly={true}
                        />
                    </section>
                    <section>
                        <InputField className="form-serviceline-input-component-section1"
                                    name="idInvoice"
                                    label="Invoice ID"
                                    inputType="text"
                                    value={formState.invoice?.idInvoice === undefined ? '' : formState.invoice.idInvoice}                     //When serviceline is not invoiced, invoice will be null and leads to error, by first checking error will be avoided                                                                 //retrieve from Param itemtype
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
                                            value={formState.item.idItem}
                                            placeholder="please enter"
                                            changeHandler={handleChangeNestedObject}
                                />
                            </section>
                        </div>

                        <div className="serviceline-form-div3">
                            <section>
                                <InputField className="form-serviceline-input-component"
                                            name='@type'
                                            label="Item Type"
                                            inputType="text"
                                            list="itemTypeList"
                                            readOnly={false}
                                            value={formState.item['@type']}
                                            placeholder="please select"
                                            changeHandler={handleChangeNestedObject}
                                />
                            </section>

                            <datalist id="itemTypeList">
                                <option key={1} value="part">part</option>
                                <option key={2} value="activity">activity</option>
                            </datalist>

                        </div>
                    </div>

                    <section>
                        <InputField className="form-serviceline-input-component-section2"
                                    name="itemName"
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
                                    readOnly={false}
                                    changeHandler={handleChange}
                        />
                    </section>
                    <section>
                        <InputField className="form-serviceline-input-component-section2"
                                    name="price"
                                    label="Item Price"
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
                    buttonType="button"
                    onClick={(e) => {
                        handleSubmit(e)
                    }}
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