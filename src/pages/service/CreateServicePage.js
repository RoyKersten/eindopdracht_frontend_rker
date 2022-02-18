import './ServiceFormPage.css';
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
        idService: '',
        '@type': '',
        serviceStatus: '',
        serviceDate: '',
        customer: {idCustomer: ''},
        car: {idCar: ''},
        issuesFoundInspection: '',
        issuesToRepair: '',
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
                setErrorMessage("service successfully created!, please select create to add serviceline");
            }

        } catch (e) {
            console.error(e);
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

    //handle change for nested object properties
    function handleChangeNestedObject(e) {
        const inputName = e.target.name;
        const inputValue = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

        const objectName = inputName.substring(2,).toLowerCase();

        setFormState({
            ...formState,
            [objectName]: {[inputName]: inputValue},
        });
    }

    //setFormState with correct @type: inspection or repair (endpoint is based on inspections and repairs)
    function onSelection(e) {
        if (e.target.value === "") {
        } else {
            serviceType = e.target.value;
            setEndpoint(`http://localhost:8080/services/${serviceType}`);
            if (serviceType === "inspections") {
               setFormState({...formState, '@type': "inspection"});
               setTypeOfService(false);
            } else {
                setFormState({...formState, '@type': "repair"});
                setTypeOfService(true);
            }
        }
    }

    return (
        <div className="service-form-container">
            <div className="service-form-filter">
                <section>
                    <InputField className="service-form-input-component"
                                name="idService"
                                label="Service ID"
                                inputType="text"
                                value={idService}
                                readOnly={true}

                    />
                </section>
                <section>
                    <InputField className="service-form-input-component"
                                name="@type"
                                label="Service Type"
                                inputType="text"
                                list="itemTypeList"
                                placeholder="please select"
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
                        className="service-form-input-component"
                        name="serviceStatus"
                        label="Service Status"
                        inputType="text"
                        list="serviceStatusList"
                        placeholder="please select"
                        readOnly={false}
                        onSelection={handleChange}
                    />
                    <datalist id="serviceStatusList">
                        {serviceStatus.map((status, i) => (
                            <option key={i} value={status}/>                                                                //generate ServiceStatusList
                        ))}

                    </datalist>
                </section>

                <section>
                    <InputField
                        className="service-form-input-component"
                        name="serviceDate"
                        label="Service Date"
                        inputType="text"
                        value={formState.serviceDate}
                        readOnly={false}
                        changeHandler={handleChange}
                    />
                </section>

                <section>
                    <InputField
                        className="service-form-input-component"
                        name="idCustomer"
                        label="Customer ID"
                        inputType="text"
                        value={formState.customer.idCustomer}
                        readOnly={false}
                        changeHandler={handleChangeNestedObject}
                    />
                </section>

                <section>
                    <InputField
                        className="service-form-input-component"
                        name="idCar"
                        label="Car ID"
                        inputType="text"
                        value={formState.car.idCar}
                        readOnly={false}
                        changeHandler={handleChangeNestedObject}
                    />
                </section>

            </div>
            <div className="text-field-issues-form">
                {typeOfService === false ?
                    <textarea
                        name="issuesFoundInspection"
                        cols="50"
                        rows="5"
                        value={formState.issuesFoundInspection}
                        readOnly={typeOfService}
                        placeholder="please enter issues found during inspection"
                        onChange={handleChange}

                    >
                    </textarea>
                    :
                    <textarea
                        name="issuesToRepair"
                        cols="50"
                        rows="5"
                        value={formState.issuesToRepair}
                        readOnly={!typeOfService}
                        placeholder="please enter issues to repair"
                        onChange={handleChange}
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


            <div className="serviceline-form-transaction-container">
                <div className="serviceline-form-display-container">
                    <TransactionTable
                        selectObject={(selectedServiceLine) => setSelectedServiceLine(selectedServiceLine)}                             //2 Retrieve data from child/component TransactionTable
                        tableContainerClassName="service-home-container-table"
                        headerContainerClassName="service-home-table-header"
                        headerClassName="service-home-table-header"
                        dataInput={serviceLine}
                    />
                </div>

                <div className="serviceline-form-buttons">
                    <Button
                        buttonName="transaction-home-small-button"
                        buttonDescription="DISPLAY"
                        buttonType="button"
                        pathName={"/servicelines/display/" + selectedServiceLine.idServiceLine}
                        disabled={selectedServiceLine.idServiceLine === ''}
                        buttonIcon={displayIcon}
                    />
                    <Button
                        buttonName="transaction-home-small-button"
                        buttonDescription="CREATE"
                        buttonType="button"
                        pathName={"/servicelines/create/" + formState['@type'] + "s/" + idService}
                        disabled={!idService}
                        buttonIcon={createIcon}
                    />
                    <Button
                        buttonName="transaction-home-small-button"
                        buttonDescription="CHANGE"
                        buttonType="button"
                        pathName={"/services/change/" + serviceType + "/" + selectedServiceLine.idServiceLine}
                        disabled={selectedServiceLine.idServiceLine === ''}
                        buttonIcon={changeIcon}
                    />
                    <Button
                        buttonName="transaction-home-small-button"
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
                {!selectedServiceLine.idServiceLine && !loading && !errorMessage &&
                    <p className="message-home">please enter service details and press confirm to create a new
                        service</p>}
            </div>
        </div>
    );
};

export default CreateServicePage