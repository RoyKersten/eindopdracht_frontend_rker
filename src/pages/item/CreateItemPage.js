import InputField from "../../components/inputfield/InputField";
import './CreateItemPage.css';
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
        qty: '',
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
            const indexOf = data.lastIndexOf("/") + 1;                           //determine new created idCar => last numbers after last /
            const id = (data.substring(indexOf,));                                     //capture idItem
            setIdItem(id);
            if (data !== null) {
                setErrorMessage("item successfully created!");
            }

        } catch (e) {
            // setErrorMessage(e.response.data)
            console.error(e);
        }
    }

    function handleClick(e) {
        const inputName = e.target.name;
        const inputValue = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

        setFormState({
            ...formState,
            [inputName]: inputValue,
        })
    }

    function handleSubmit(e) {
        e.preventDefault();
        addItem().then();
    }

    //filter data based on itemType part or activity selection
    function onSelection(e) {
        if (e.target.value === "") {
        } else {
            itemType = e.target.value;
            window.history.replaceState(null, null, `/items/create/${itemType}`)
            if (itemType === "parts") {
                formState["@type"] = "part"
                setTypeOfItem(false);
            } else {
                formState["@type"] = "activity"
                setTypeOfItem(true);
            }
        }
    }



    return (
        <div className="item-create-container">
            <form className="item-create-form" onSubmit={handleSubmit}>
                <div className="item-create-section1">
                    <section>
                        <InputField className="create-input-component-section1"
                                    name="@type"
                                    label="Item Type"
                                    inputType="text"
                                    readOnly={false}
                                    onSelection={onSelection}
                                    list="itemTypeList"
                        />
                        <datalist id="itemTypeList">
                            <option value="parts">parts</option>
                            <option value="activities">activities</option>
                        </datalist>

                    </section>


                </div>
                <div className="item-create-section2">
                    <section>

                        <InputField className="create-input-component-section2-idItem"
                                    name="idItem"
                                    label="Item ID"
                                    value={idItem}
                                    inputType="text"
                                    readOnly={true}
                        />
                    </section>
                    <section>
                        <InputField className="create-input-component-section2"
                                    name="itemCategory"
                                    label="Item Category"
                                    inputType="text"
                                    value={formState.itemCategory}
                                    readOnly={false}
                                    changeHandler={handleClick}
                        />
                    </section>
                    <section>
                        <InputField className="create-input-component-section2"
                                    name="itemName"
                                    label="Item Name"
                                    inputType="text"
                                    value={formState.itemName}
                                    readOnly={false}
                                    changeHandler={handleClick}
                        />
                    </section>
                    <section>
                        <InputField className="create-input-component-section2-brand"
                                    name="brand"
                                    label="Brand"
                                    inputType="text"
                                    value={formState.brand}
                                    readOnly={typeOfItem}
                                    changeHandler={handleClick}
                        />
                    </section>
                </div>
                <div className="item-create-section3">
                    <section>
                        <InputField className="create-input-component-section3"
                                    name="qty"
                                    label="Stock"
                                    inputType="number"
                                    value={formState.qty}
                                    readOnly={false}
                                    changeHandler={handleClick}
                        />
                    </section>

                    <section>
                        <InputField className="create-input-component-section3"
                                    name="price"
                                    label="Price"
                                    inputType="number"
                                    value={parseFloat(formState.price).toFixed(2).replace(',', '.')}
                                    readOnly={false}
                                    changeHandler={handleClick}
                        />
                    </section>

                    <section>
                        <InputField className="create-input-component-section3"
                                    name="status"
                                    label="Status"
                                    inputType="text"
                                    value={formState.status}
                                    readOnly={false}
                                    changeHandler={handleClick}
                                    list="itemTypeList"
                        />
                        <datalist id="itemTypeList">
                            <option value="LOCKED">LOCKED</option>
                            <option value="OPEN">OPEN</option>
                        </datalist>
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

export default CreateItemPage;