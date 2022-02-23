import InputField from "../../components/inputfield/InputField";
import './ItemFormPage.css';
import {useParams} from "react-router-dom";
import Button from "../../components/button/Button";
import confirmIcon from "../../images/icons/confirm.png";
import React, {useEffect, useState} from "react";
import axios from "axios";

function CreateItemPage() {

    let {itemType} = useParams();
    let [idItem, setIdItem] = useState("");
    const [typeOfItem, setTypeOfItem] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [endpoint, setEndpoint] = useState(`http://localhost:8080/items/${itemType}`);
    const [formState, setFormState] = useState({
        '@type': '',
        itemCategory: '',
        itemName: '',
        brand: '',
        qty: 0,
        price: 0,
        status: ''
    });

    async function addItem() {
        try {
            const {data} = await axios.post(endpoint, formState, {
                headers: {
                    "Content-type": "application/json",
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                },
            });
            console.log(data);
            const indexOf = data.lastIndexOf("/") + 1;                           //determine new created idItem
            const id = (data.substring(indexOf,));                                     //capture idItem
            setIdItem(id);
            if (data !== null) {
                setErrorMessage("item successfully created!");
            }

        } catch (e) {
            if (e.response.status.toString() === "403") {
                setErrorMessage("item could not be created, you are not authorized!")
            } else if (e.response.status.toString() !== "403") {
                setErrorMessage("item could not be created!")
            }
        }
    }

    function handleChange(e) {
        let inputName = e.target.name;
        let inputValue = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

        if (inputValue === "parts") {
            itemType = e.target.value;
            inputValue = "part";
        } else if (inputValue === "activities") {
            itemType = e.target.value;
            inputValue = "activity"
        }
        //set http address to corresponding itemType
        window.history.replaceState(null, null, `/items/create/${itemType}`)

        setFormState({
            ...formState,
            [inputName]: inputValue,
        })
    }

    function handleSubmit(e) {
        e.preventDefault();
        addItem().then();
    }

    return (
        <div className="item-form-container">
            <form className="item-form">
                <div className="item-form-section1">
                    <section>
                        <InputField className="form-input-component-section1"
                                    name="@type"
                                    label="Item Type"
                                    inputType="text"
                                    readOnly={false}
                                    onSelection={handleChange}
                                    list="itemTypeList"
                        />
                        <datalist id="itemTypeList">
                            <option key={1} value="parts">parts</option>
                            <option key={2} value="activities">activities</option>
                        </datalist>

                    </section>


                </div>
                <div className="item-form-section2">
                    <section>

                        <InputField className="form-input-component-section2"
                                    name="idItem"
                                    label="Item ID"
                                    value={idItem}
                                    inputType="text"
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
                                    value={formState.brand}
                                    readOnly={typeOfItem}
                                    changeHandler={handleChange}
                        />
                    </section>
                </div>
                <div className="item-create-section3">
                    <section>
                        <InputField className="form-input-component-section3"
                                    name="qty"
                                    label="Stock"
                                    inputType="number"
                                    value={formState.qty < 0 ? 0 : formState.qty}
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
                                    list="itemStatusList"
                        />
                        <datalist id="itemStatusList">
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
            </form>
            <div className="messages">
                {errorMessage &&
                    <p className="message-error">{errorMessage}</p>}
            </div>
        </div>
    );
}

export default CreateItemPage;