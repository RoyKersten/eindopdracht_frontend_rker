import InputField from "../../components/inputfield/InputField";
import './ItemFormPage.css';
import {useParams} from "react-router-dom";
import Button from "../../components/button/Button";
import confirmIcon from "../../images/icons/confirm.png";
import React, {useEffect, useState} from "react";
import axios from "axios";


function ChangeItemPage() {

    const {id} = useParams()
    let {itemType} = useParams();
    const [errorMessage, setErrorMessage] = useState("");
    const [formState, setFormState] = useState({
        '@type': '',
        idItem: '',
        itemCategory: '',
        itemName: '',
        brand: '',
        qty: 0,
        price: 0,
        status: ''
    });

    useEffect(() => {
        async function getItemById() {
            try {
                const {data} = await axios.get(`http://localhost:8080/items/${itemType}/${id}`, {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: 'Bearer ' + localStorage.getItem('token'),
                    },
                });
                setFormState(data);
            } catch (e) {
                if (e.response.status.toString() === "403") {
                    setErrorMessage("item details could not be retrieved, you are not authorized!")
                } else if (e.response.status.toString() !== "403") {
                    setErrorMessage("item details could not be retrieved!")
                }
            }
        }

        getItemById();
    }, [itemType, id]);


    async function changeItem() {
        try {
            await axios.put(`http://localhost:8080/items/${itemType}/${id}`, formState, {
                headers: {
                    "Content-type": "application/json",
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                },
            });
            setErrorMessage("item successfully updated!");
        } catch (e) {
            if (e.response.status.toString() === "403") {
                setErrorMessage("item could not be updated, you are not authorized!")
            } else if (e.response.status.toString() !== "403") {
                setErrorMessage("item could not be updated!")
            }
        }
    }

    function handleChange(e) {
        const inputName = e.target.name;
        const inputValue = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

        setFormState({
            ...formState,
            [inputName]: inputValue,
        })
    }

    function handleSubmit(e) {
        e.preventDefault();
        changeItem().then();
    }

    return (
        <div className="item-form-container">
            <form className="item-form">
                <div className="item-form-section1">
                    <section>
                        <InputField className="form-input-component-section1"
                                    name="itemType"
                                    label="Item Type"
                                    inputType="text"
                                    value={itemType}                                                                          //retrieve itemType from Param itemType
                                    readOnly={true}
                        />
                    </section>
                </div>
                <div className="item-form-section2">
                    <section>
                        <InputField className="form-input-component-section2"
                                    name="idItem"
                                    label="Item ID"
                                    inputType="text"
                                    value={formState.idItem}
                                    readOnly={true}
                        />
                    </section>
                    <section>
                        <InputField className="form-input-component-section2"
                                    name="itemCategory"
                                    label="Item Category"
                                    inputType="text"
                                    value={formState.itemCategory}
                                    readOnly={false}
                                    changeHandler={handleChange}
                        />
                    </section>
                    <section>
                        <InputField className="form-input-component-section2"
                                    name="itemName"
                                    label="Item Name"
                                    inputType="text"
                                    value={formState.itemName}
                                    readOnly={false}
                                    changeHandler={handleChange}
                        />
                    </section>
                    <section>
                        <InputField className="form-input-component-section2-brand"
                                    name="brand"
                                    label="Brand"
                                    inputType="text"
                                    readOnly={itemType === "activities"}
                                    value={itemType === "activities" ? "" : formState.brand}
                                    changeHandler={handleChange}
                        />
                    </section>
                </div>
                <div className="item-form-section3">
                    <section>
                        <InputField className="form-input-component-section3"
                                    name="qty"
                                    label="Stock"
                                    inputType="number"
                                    value={formState.qty}                            //Allowed to go below zero to ensure stock correction can be made in case physical inventory is lower than administrative inventory
                                    readOnly={false}
                                    changeHandler={handleChange}
                        />
                    </section>
                    <section>
                        <InputField className="form-input-component-section3"
                                    name="price"
                                    label="Price"
                                    inputType="number"
                                    value={parseFloat(formState.price).toFixed(2).replace(',', '.')}
                                    readOnly={false}
                                    changeHandler={handleChange}
                        />
                    </section>
                    <section>
                        <InputField className="form-input-component-section3"
                                    name="status"
                                    label="Status"
                                    inputType="text"
                                    value={formState.status}
                                    readOnly={false}
                                    changeHandler={handleChange}
                                    list="itemTypeList"
                        />
                        <datalist id="itemTypeList">
                            <option key={1} value="LOCKED">LOCKED</option>
                            <option key={2} value="OPEN">OPEN</option>
                        </datalist>
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
                <div className="messages">
                    {errorMessage && <p className="message-error">{errorMessage}</p>}
                </div>
            </form>
        </div>
    );
}

export default ChangeItemPage;