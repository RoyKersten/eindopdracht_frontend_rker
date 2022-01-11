import './ItemPage.css';
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import InputField from "../../components/inputfield/InputField";
import Button from "../../components/button/Button";
import displayIcon from "../../images/icons/display.png";
import createIcon from "../../images/icons/create.png";
import changeIcon from "../../images/icons/change.png";
import deleteIcon from "../../images/icons/delete.png";
import TransactionTable from "../../components/transactiontable/TransactionTable";


function ItemPage() {

    const [item, setItem] = useState([]);
    const [itemType, setItemType] = useState("parts");
    const [sourceData, setSourceData] = useState([]);
    const [loading, toggleLoading] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [reload, setReload] = useState(false);
    const [selectedItem, setSelectedItem] = useState({idItem: ''});
    const [formState, setFormState] = useState({
        itemId: '',
        itemType: '',
        itemName: '',
        itemCategory: '',
    });


    //Get item data based on endpoint, get bearer token from local storage to validate authentication and authorization
    useEffect(() => {
        async function getItem() {
            toggleLoading(true);
            setError(false);
            console.log(itemType)

            try {
                const {data} = await axios.get(`http://localhost:8080/items/${itemType}`, {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: 'Bearer ' + localStorage.getItem('token'),
                    },
                });
                setSourceData(data);
                setItem(data);

            } catch (error) {
                setError(true);
                setErrorMessage(error.data);
                console.error(error.status);       //logt HTTP status code e.g. 400
                console.error(error.data);         //logt de message die vanuit de backend wordt gegeven
            }
            toggleLoading(false);
        }


        getItem().then();
    }, [reload, itemType]);


    async function deleteItemById() {
        let text = "item will be deleted permanently in case no inspection or repair is connected, are you sure?";
        if (window.confirm(text) === true) {
            setError(false);
            try {
                const {data} = await axios.delete("http://localhost:8080/items/" + selectedItem.idItem, {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: 'Bearer ' + localStorage.getItem('token'),
                    },
                });
                setErrorMessage(data);
                console.log(data);
                setReload(!reload);

            } catch (error) {
                setErrorMessage(error.response.data);
            }
            toggleLoading(false);
        }
    }


    //set formChange after enter key, this will trigger useEffect and data will be reloaded.
    function onKeyPress(e) {
        const inputName = e.target.name;
        const inputValue = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

        setFormState({
            ...formState,
            [inputName]: inputValue,
        })
        if (e.key === 'Enter') {
            filterData(sourceData);
        }
    }


    //filter data based on itemType part or activity selection
    function onSelection(e) {
        if (e.target.value === "") {
        } else {
            setItemType(e.target.value);
            filterData(sourceData);
        }
    }

//Filter data based customerId and lastname or show all customers when filters are empty
    function filterData(data) {
        setItem(sourceData);

        if (formState.itemId !== "") {
            setItem(data.filter(function (object) {
                return object.idItem.toString() === formState.itemId.toString();
            }))
        } else if (formState.itemType !== "") {
            setItem(data.filter(function (object) {
                return object.itemType === formState.itemType;
            }))
        } else if (formState.itemName !== "") {
            setItem(data.filter(function (object) {
                return object.itemName.toLowerCase() === formState.itemName.toLowerCase();
            }))
        }else if (formState.itemCategory !== "") {
                setItem(data.filter(function (object) {
                    return object.itemCategory === formState.itemCategory;
                }))
        } else {
            console.log("no entry");
        }
        ;
    }


    return (
        <div className="item-home-container">
            <div className="item-home-filter">
                <form>
                    <section>
                        <InputField name="itemId" label="Item ID" inputType="text"
                                    onKeyPress={onKeyPress} changeHandler={onKeyPress}
                        />
                    </section>
                    <section>
                        <InputField name="itemType" label="Item Type" inputType="text" list="itemTypeList"
                            // onChange={()=>setItemType() }
                                    onSelection={onSelection}

                        />
                        <datalist id="itemTypeList">
                            <option value="parts">parts</option>
                            <option value="activities">activities</option>
                        </datalist>

                    </section>

                    <section>
                        <InputField name="itemName" label="Item Name" inputType="text"
                                    onKeyPress={onKeyPress} changeHandler={onKeyPress}
                        />
                    </section>

                    <section>
                        <InputField name="itemCategory" label="Item Category" inputType="text"
                                    onKeyPress={onKeyPress} changeHandler={onKeyPress}
                        />
                    </section>

                </form>
            </div>
            <div className="item-home-transaction-container">
                <div className="item-home-display-container">
                    <TransactionTable
                        selectObject={(selectedItem) => setSelectedItem(selectedItem)}                             //2 Retrieve data from child/component TransactionTable
                        tableContainerClassName="item-home-container-table"
                        headerContainerClassName="item-home-table-header"
                        headerClassName="item-home-table-header"
                        dataInput={item}
                    />
                </div>

                <div className="item-home-buttons">
                    <Button
                        buttonName="transaction-home-button"
                        buttonDescription="DISPLAY"
                        buttonType="button"
                        pathName={"/items/display/" + (selectedItem.idItem)}
                        disabled={selectedItem.idItem === ''}
                        buttonIcon={displayIcon}
                    />
                    <Button
                        buttonName="transaction-home-button"
                        buttonDescription="CREATE"
                        buttonType="button"
                        pathName="/items/create"
                        disabled={false}
                        buttonIcon={createIcon}
                    />
                    <Button
                        buttonName="transaction-home-button"
                        buttonDescription="CHANGE"
                        buttonType="button"
                        pathName={"/items/change/" + (selectedItem.idItem)}
                        disabled={selectedItem.idItem === ''}
                        buttonIcon={changeIcon}
                    />
                    <Button
                        buttonName="transaction-home-button"
                        buttonDescription="DELETE"
                        buttonType="button"
                        onClick={() => deleteItemById()}
                        pathName=""
                        disabled={selectedItem.idItem === ''}
                        buttonIcon={deleteIcon}
                    />
                </div>
            </div>
            <div className="messages">
                {loading && <p className="message-home">Data Loading, please wait...</p>}
                {error && <p className="message-home">Error occurred</p>}
                {errorMessage && <p className="message-home">{errorMessage}</p>}
                {!selectedItem.idItem && !loading && <p className="message-home">Please select an item</p>}
            </div>

        </div>
    );
};

export default ItemPage;