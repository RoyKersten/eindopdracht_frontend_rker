import InputField from "../../components/inputfield/InputField";
import './ItemFormPage.css';
import {useParams} from "react-router-dom";
import Button from "../../components/button/Button";
import confirmIcon from "../../images/icons/confirm.png";
import React, {useEffect, useState} from "react";
import axios from "axios";


function DisplayItemPage() {

    const {id} = useParams()
    const {itemType} = useParams();
    const [errorMessage, setErrorMessage] = useState("");
    const [object, setObject] = useState({
        idItem: '',
        itemType: '',
        itemCategory: '',
        itemName: '',
        brand: '',
        qty: '',
        price: '',
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
                setObject(data);
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


    return (
        <div className="item-form-container">
            <form className="item-form">
                <div className="item-form-section1">
                    <section>
                        <InputField className="form-input-component-section1"
                                    name="itemType"
                                    label="Item Type"
                                    inputType="text"
                                    value={itemType}                                                                          //retrieve from Param itemtype
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
                                    value={object.idItem}
                                    readOnly={true}
                        />
                    </section>
                    <section>
                        <InputField className="form-input-component-section2"
                                    name="itemCategory"
                                    label="Item Category"
                                    inputType="text"
                                    value={object.itemCategory}
                                    readOnly={true}
                        />
                    </section>
                    <section>
                        <InputField className="form-input-component-section2"
                                    name="itemName"
                                    label="Item Name"
                                    inputType="text"
                                    value={object.itemName}
                                    readOnly={true}
                        />
                    </section>
                    <section>
                        <InputField className="form-input-component-section2"
                                    name="brand"
                                    label="Brand"
                                    inputType="text"
                                    value={object.brand}
                                    readOnly={true}
                        />
                    </section>
                </div>
                <div className="item-form-section3">
                    <section>
                        <InputField className="form-input-component-section3"
                                    name="stock"
                                    label="Stock"
                                    inputType="text"
                                    value={object.qty}
                                    readOnly={true}
                        />
                    </section>
                    <section>
                        <InputField className="form-input-component-section3"
                                    name="price"
                                    label="Price"
                                    inputType="text"
                                    value={object.price}
                                    readOnly={true}
                        />
                    </section>
                    <section>
                        <InputField className="form-input-component-section3"
                                    name="status"
                                    label="Status"
                                    inputType="text"
                                    value={object.status}
                                    readOnly={true}
                        />
                    </section>
                    <Button
                        buttonName="confirm-button"
                        buttonDescription="CONFIRM"
                        pathName="/home"
                        disabled={true}
                        buttonIcon={confirmIcon}
                    />
                </div>
                <div className="messages">
                    {errorMessage && <p className="message-error">{errorMessage}</p>}
                </div>
            </form>
        </div>

    );
}

export default DisplayItemPage;