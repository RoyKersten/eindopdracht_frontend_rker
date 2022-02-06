import './ChangeServicePage.css';
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import InputField from "../../components/inputfield/InputField";
import Button from "../../components/button/Button";
import displayIcon from "../../images/icons/display.png";
import createIcon from "../../images/icons/create.png";
import changeIcon from "../../images/icons/change.png";
import deleteIcon from "../../images/icons/delete.png";
import TransactionTable from "../../components/transactiontable/TransactionTable";
import {useParams} from "react-router-dom";
import confirmIcon from "../../images/icons/confirm.png";

function ChangeServicePage() {

    const {id} = useParams()
    let {serviceType} = useParams();
    const serviceStatus = ["UITVOEREN", "NIET_UITVOEREN", "VOLTOOID"];
    let [typeOfService, setTypeOfService] = useState(false);
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
        issuesFoundInspection: '',
        issuesToRepair: '',
    });


    //Get item data based on endpoint, get bearer token from local storage to validate authentication and authorization
    useEffect(() => {
        async function getService() {
            toggleLoading(true);
            setError(false);

            //Set type Of Service required for textarea IssuesFoundInspection / IssuesToRepair
            if (serviceType === "inspections") {
                formState["@type"] = "inspection"
                setTypeOfService(false);
            } else {
                formState["@type"] = "repair"
                setTypeOfService(true);
            }


            try {
                const {data} = await axios.get(`http://localhost:8080/services/${serviceType}/${id}`, {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: 'Bearer ' + localStorage.getItem('token'),
                    },
                });
                setFormState(data);
            } catch (error) {
                setError(true);
                setErrorMessage(error.data);
                console.error(error.status);       //logt HTTP status code e.g. 400
                console.error(error.data);         //logt de message die vanuit de backend wordt gegeven
            }
            toggleLoading(false);
        }


        getService().then();
    }, [reload, serviceType]);


    useEffect(() => {
        async function getServiceLine() {
            toggleLoading(true);
            setError(false);
            console.log(serviceType)
            try {
                const {data} = await axios.get(`http://localhost:8080/servicelines/`, {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: 'Bearer ' + localStorage.getItem('token'),
                    },
                });
                const serviceLinesByServiceId = data.filter((serviceLineByServiceID) => {
                    return serviceLineByServiceID.service.idService.toString() === id;
                });
                setServiceLine(serviceLinesByServiceId);

            } catch (error) {
                setError(true);
                setErrorMessage(error.data);
                console.error(error.status);       //logt HTTP status code e.g. 400
                console.error(error.data);         //logt de message die vanuit de backend wordt gegeven
            }
            toggleLoading(false);
        }

        getServiceLine().then();
    }, [reload, serviceType]);


    async function deleteServiceLineById() {
        console.log(serviceType)
        console.log(selectedServiceLine.idServiceLine)
        let text = "serviceline will be deleted permanently in case no invoice is connected, are you sure?";
        if (window.confirm(text) === true) {
            setError(false);
            try {
                const {data} = await axios.delete(`http://localhost:8080/servicelines/${selectedServiceLine.idServiceLine}`, {
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

    async function updateServiceById() {
        try {
            const {data} = await axios.put(`http://localhost:8080/services/${serviceType}/${id}`, formState, {
                headers: {
                    "Content-type": "application/json",
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                },
            });
            setErrorMessage("service successfully updated!");
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

    return (
        <div className="service-change-container">
            <div className="service-change-filter">
                <section>
                    <InputField className="service-change-input-component"
                                name="idService"
                                label="Service ID"
                                inputType="text"
                                value={formState.idService}
                                readOnly={true}
                    />
                </section>
                <section>
                    <InputField className="service-change-input-component"
                                name="@type"
                                label="Service Type"
                                inputType="text"
                                list="itemTypeList"
                                value={formState['@type']}
                                readOnly={true}
                    />
                    <datalist id="itemTypeList">
                        <option value="inspections">inspections</option>
                        <option value="repairs">repairs</option>
                    </datalist>
                </section>
                <section>
                    <InputField
                        className="service-change-input-component"
                        name="serviceStatus"
                        label="Service Status"
                        inputType="text"
                        placeholder="please select"
                        value={formState.serviceStatus}
                        readOnly={false}
                        changeHandler={handleClick}
                        list="serviceStatusList"
                    />
                    <datalist id="serviceStatusList">
                        {serviceStatus.map((status, i) => (
                            <option key={i} value={status}/>
                        ))}

                    </datalist>
                </section>
                <section>
                    <InputField
                        className="service-change-input-component"
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
                        className="service-change-input-component"
                        name="idCustomer"
                        label="Customer ID"
                        inputType="text"
                        value={formState.customer?.idCustomer === undefined ? '' : formState.customer.idCustomer}
                        readOnly={false}
                        changeHandler={handleClick}
                    />
                </section>
                <section>
                    <InputField
                        className="service-change-input-component"
                        name="idCar"
                        label="Car ID"
                        inputType="text"
                        value={formState.car?.idCar === undefined ? '' : formState.car.idCar}
                        readOnly={false}
                        changeHandler={handleClick}
                    />
                </section>

            </div>
            <div className="text-field-issues-change">
                {typeOfService === false ?
                    <textarea
                        name="issuesFoundInspection"
                        cols="50"
                        rows="5"
                        value={formState.issuesFoundInspection}
                        readOnly={typeOfService}
                        onChange={handleClick}                  //onChange because textarea id not component inputField

                    >
                    </textarea>
                    :
                    <textarea
                        name="issuesToRepair"
                        cols="50"
                        rows="5"
                        value={formState.issuesToRepair}
                        readOnly={!typeOfService}
                        onChange={handleClick}                  //onChange because textarea id not component inputField
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
                        onClick={updateServiceById}
                    />
                </div>
            </div>


            <div className="serviceline-change-transaction-container">
                <div className="serviceline-change-display-container">
                    <TransactionTable
                        selectObject={(selectedServiceLine) => setSelectedServiceLine(selectedServiceLine)}                             //2 Retrieve data from child/component TransactionTable
                        tableContainerClassName="service-home-container-table"
                        headerContainerClassName="service-home-table-header"
                        headerClassName="service-home-table-header"
                        dataInput={serviceLine}
                    />
                </div>

                <div className="serviceline-change-buttons">
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
                        pathName={"/servicelines/create/" + formState['@type'] + "s/" + id}
                        disabled={false}
                        buttonIcon={createIcon}
                    />
                    <Button
                        buttonName="transaction-home-small-button"
                        buttonDescription="CHANGE"
                        buttonType="button"
                        pathName={"/servicelines/change/" + selectedServiceLine.idServiceLine}
                        disabled={selectedServiceLine.idServiceLine === ''}
                        buttonIcon={changeIcon}
                    />
                    <Button
                        buttonName="transaction-home-small-button"
                        buttonDescription="DELETE"
                        buttonType="button"
                        onClick={() => deleteServiceLineById()}
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
                    <p className="message-home">please change service and press confirm or create, delete or change a
                        serviceline</p>}
            </div>
        </div>
    );
};

export default ChangeServicePage;