import './CreateServicePage.css';
import axios from 'axios';
import React, {useState} from 'react';
import InputField from "../../components/inputfield/InputField";
import Button from "../../components/button/Button";
import displayIcon from "../../images/icons/display.png";
import createIcon from "../../images/icons/create.png";
import changeIcon from "../../images/icons/change.png";
import deleteIcon from "../../images/icons/delete.png";
import TransactionTable from "../../components/transactiontable/TransactionTable";
import {useParams} from "react-router-dom";
import confirmIcon from "../../images/icons/confirm.png";

function CreateServicePage() {

    let {serviceType} = useParams();
    let [idService, setIdService] = useState("");
    let [typeOfService, setTypeOfService] = useState(false);
    const serviceStatus = ["UITVOEREN", "NIET_UITVOEREN", "VOLTOOID"];
    const [endpoint, setEndpoint] = useState(`http://localhost:8080/services/${serviceType}`);
    const [serviceLine, setServiceLine] = useState([]);
    const [loading, toggleLoading] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [reload, setReload] = useState(false);
    const [selectedServiceLine, setSelectedServiceLine] = useState({idServiceLine: ''});
    const [formState, setFormState] = useState({
        serviceId: '',
        '@type': '',
        serviceStatus: '',
        serviceDate: '',
        customer: {idCustomer: ''},
        car: {idCar: ''},
        issuesFoundInspection: 'test 1',
        issuesToRepair: 'test 2',
    });


    //Get item data based on endpoint, get bearer token from local storage to validate authentication and authorization
    async function addService() {
        try {
            const {data} = await axios.post(endpoint, formState, {
                headers: {
                    "Content-type": "application/json",
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                },
            });
            console.log(data);
            const indexOf = data.lastIndexOf("/") + 1;                           //determine new created idItem => last numbers after last /
            const id = (data.substring(indexOf,));                                     //capture idItem
            setIdService(id);
            if (data !== null) {
                setErrorMessage("item successfully created!");
            }

        } catch (e) {
            console.error(e);
        }
    }

    function handleClick(e) {
        const inputName = e.target.name;
        const inputValue = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

        if (inputName === "idCustomer") {
            setFormState(formState.customer.idCustomer = inputValue);
        } else if (inputName === "idCar") {
            setFormState(formState.car.idCar = inputValue);
        }

        setFormState({
            ...formState,
            [inputName]: inputValue,
        })

    }


    //filter data based on serviceType part or activity selection
    function onSelection(e) {
        if (e.target.value === "") {
        } else {
            serviceType = e.target.value;
            // window.history.replaceState(null, null, `/services/create/${serviceType}`)
            setEndpoint(`http://localhost:8080/services/${serviceType}`);
            if (serviceType === "inspections") {
                formState["@type"] = "inspection"
                setTypeOfService(false);
            } else {
                formState["@type"] = "repair"
                setTypeOfService(true);
            }
        }
    }

    return (
        <div className="service-create-container">
            <div className="service-create-filter">
                <section>
                    <InputField className="service-create-input-component-idService"
                                name="serviceId"
                                label="Service ID"
                                inputType="text"
                                value={idService}
                                readOnly={true}

                    />
                </section>
                <section>
                    <InputField className="service-create-input-component"
                                name="@type"
                                label="Service Type"
                                inputType="text"
                                list="itemTypeList"
                                placeholder="please select"
                                // value={formState['@type']}
                                readOnly={false}
                                changeHandler={onSelection}
                    />
                    <datalist id="itemTypeList">
                        <option value="inspections">inspections</option>
                        <option value="repairs">repairs</option>
                    </datalist>
                </section>
                <section>
                    <InputField
                        className="service-create-input-component"
                        name="serviceStatus"
                        label="Service Status"
                        inputType="text"
                        list="serviceStatusList"
                        placeholder="please select"
                        value={formState.serviceStatus}
                        readOnly={false}
                        changeHandler={handleClick}
                    />
                    <datalist id="serviceStatusList">
                        {serviceStatus.map((status, i) => (
                            <option key={i} value={status}/>                                                                //generate ServiceStatusList
                        ))}

                    </datalist>
                </section>

                <section>
                    <InputField
                        className="service-create-input-component"
                        name="serviceDate"
                        label="Service Date"
                        inputType="text"
                        value={formState.serviceDate}
                        readOnly={false}
                        changeHandler={handleClick}
                    />
                </section>

                <section>
                    <InputField
                        className="service-create-input-component"
                        name="idCustomer"
                        label="Customer ID"
                        inputType="text"
                        value={formState.customer.idCustomer}
                        readOnly={false}
                        changeHandler={handleClick}
                    />
                </section>

                <section>
                    <InputField
                        className="service-create-input-component"
                        name="idCar"
                        label="Car ID"
                        inputType="text"
                        value={formState.car.idCar}
                        readOnly={false}
                        changeHandler={handleClick}
                    />
                </section>

            </div>
            <div className="create-text-field-issues">
                {typeOfService === false ?
                    <textarea
                        name="issuesFoundInspection"
                        cols="50"
                        rows="5"
                        value={formState.issuesFoundInspection}
                        readOnly={typeOfService}
                        onChange={handleClick}

                    >
                    </textarea>
                    :
                    <textarea
                        name="issuesToRepair"
                        cols="50"
                        rows="5"
                        value={formState.issuesToRepair}
                        readOnly={!typeOfService}
                        onChange={handleClick}
                    >
                    </textarea>
                }
                <div className="confirm-button-service-container">
                    <Button
                        buttonName="confirm-button-service"
                        buttonDescription="CONFIRM"
                        pathName=""
                        disabled={false}
                        buttonIcon={confirmIcon}
                        onClick={addService}
                    />
                </div>
            </div>


            <div className="serviceline-create-transaction-container">
                <div className="serviceline-create-display-container">
                    <TransactionTable
                        selectObject={(selectedServiceLine) => setSelectedServiceLine(selectedServiceLine)}                             //2 Retrieve data from child/component TransactionTable
                        tableContainerClassName="service-home-container-table"
                        headerContainerClassName="service-home-table-header"
                        headerClassName="service-home-table-header"
                        dataInput={serviceLine}
                    />
                </div>

                <div className="serviceline-create-buttons">
                    <Button
                        buttonName="transaction-serviceline-button"
                        buttonDescription="DISPLAY"
                        buttonType="button"
                        pathName={"/servicelines/display/" + selectedServiceLine.idServiceLine}
                        disabled={selectedServiceLine.idServiceLine === ''}
                        buttonIcon={displayIcon}
                    />
                    <Button
                        buttonName="transaction-serviceline-button"
                        buttonDescription="CREATE"
                        buttonType="button"
                        pathName={"/servicelines/create/" + formState['@type'] + "s/" + idService}
                        disabled={false}
                        buttonIcon={createIcon}
                    />
                    <Button
                        buttonName="transaction-serviceline-button"
                        buttonDescription="CHANGE"
                        buttonType="button"
                        pathName={"/services/change/" + serviceType + "/" + selectedServiceLine.idServiceLine}
                        disabled={selectedServiceLine.idServiceLine === ''}
                        buttonIcon={changeIcon}
                    />
                    <Button
                        buttonName="transaction-serviceline-button"
                        buttonDescription="DELETE"
                        buttonType="button"
                        pathName=""
                        disabled={selectedServiceLine.idServiceLine === ''}
                        buttonIcon={deleteIcon}
                    />
                </div>
            </div>
            <div className="messages">
                {loading && <p className="message-home">Data Loading, please wait...</p>}
                {error && <p className="message-home">Error occurred</p>}
                {errorMessage && <p className="message-home">{errorMessage}</p>}
                {!selectedServiceLine.idServiceLine && !loading &&
                    <p className="message-home">please select service or select Service Type to switch between repairs
                        and inspections</p>}
            </div>
        </div>
    );
};

export default CreateServicePage