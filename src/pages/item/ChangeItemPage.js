import InputField from "../../components/inputfield/InputField";
import './ChangeItemPage.css';
import {useParams} from "react-router-dom";
import Button from "../../components/button/Button";
import confirmIcon from "../../images/icons/confirm.png";
import React, {useEffect, useState} from "react";
import axios from "axios";


function ChangeItemPage() {

    const {id} = useParams()
    let {itemType} = useParams();
    const [typeOfItem, setTypeOfItem] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [endpoint, setEndpoint] = useState(`http://localhost:8080/items/${itemType}/${id}`);
    const [formState, setFormState] = useState({
        '@type': '',
        idItem: '',
        itemCategory: '',
        itemName: '',
        brand: '',
        qty: '',
        price: 0,
        status: ''
    });

    useEffect(() => {
        async function getItemById() {
            try {
                const {data} = await axios.get(endpoint, {
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

        getItemById();
    }, [endpoint]);


    async function changeItem() {
        try {
            const {data} = await axios.put(endpoint, formState, {
                headers: {
                    "Content-type": "application/json",
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                },
            });
            setErrorMessage("item successfully updated!");
        } catch (e) {
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
        changeItem().then();
    }

    return (
        <div className="item-change-container">
            <form className="item-change-form" onSubmit={handleSubmit}>
                <div className="item-change-section1">
                    <section>
                        <InputField className="change-input-component-section1"
                                    name="itemType"
                                    label="Item Type"
                                    inputType="text"
                                    value={itemType}                                                                          //retrieve itemType from Param itemtype
                                    readOnly={true}
                        />
                    </section>
                </div>
                <div className="item-change-section2">
                    <section>

                        <InputField className="change-input-component-section2"
                                    name="idItem"
                                    label="Item ID"
                                    inputType="text"
                                    value={formState.idItem}
                                    readOnly={true}
                        />
                    </section>
                    <section>
                        <InputField className="change-input-component-section2"
                                    name="itemCategory"
                                    label="Item Category"
                                    inputType="text"
                                    value={formState.itemCategory}
                                    readOnly={false}
                                    changeHandler={handleClick}
                        />
                    </section>
                    <section>
                        <InputField className="change-input-component-section2"
                                    name="itemName"
                                    label="Item Name"
                                    inputType="text"
                                    value={formState.itemName}
                                    readOnly={false}
                                    changeHandler={handleClick}
                        />
                    </section>
                    <section>
                        <InputField className="change-input-component-section2-brand"
                                    name="brand"
                                    label="Brand"
                                    inputType="text"
                                    readOnly={itemType === "activities"}
                                    value={itemType=== "activities" ? "" : formState.brand}
                                    changeHandler={typeOfItem === true ? null : handleClick}
                        />
                    </section>
                </div>
                <div className="item-change-section3">
                    <section>
                        <InputField className="change-input-component-section3"
                                    name="qty"
                                    label="Stock"
                                    inputType="text"
                                    value={formState.qty}
                                    readOnly={false}
                                    changeHandler={handleClick}
                        />
                    </section>
                    <section>
                        <InputField className="change-input-component-section3"
                                    name="price"
                                    label="Price"
                                    inputType="text"
                                    value={parseFloat(formState.price).toFixed(2).replace(',', '.')}
                                    readOnly={false}
                                    changeHandler={handleClick}
                        />
                    </section>
                    <section>
                        <InputField className="change-input-component-section3"
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
                {errorMessage && <p className="message-error">{errorMessage}</p>}
            </div>
        </div>

    );
}

export default ChangeItemPage;