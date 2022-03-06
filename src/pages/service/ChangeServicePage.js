import './ServiceFormPage.css';
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
    useEffect(() => {
        async function getService() {
            toggleLoading(true);

            //Set TypeOfService true/false required for textarea IssuesFoundInspection (false) / IssuesToRepair (false)
            if (serviceType === "inspections") {
                setTypeOfService(false);
            } else {
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

            } catch (e) {
                if (e.response.status.toString() === "403") {
                    setErrorMessage("service details could not be retrieved, you are not authorized!")
                } else if (e.response.status.toString() !== "403") {
                    setErrorMessage("service details could not be retrieved!")
                }
            }
            toggleLoading(false);
        }


        getService().then();
    }, [reload, serviceType, id]);


    useEffect(() => {
        async function getServiceLine() {
            toggleLoading(true);
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

            } catch (e) {
                if (e.response.status.toString() === "403") {
                    setErrorMessage("serviceLine details could not be retrieved, you are not authorized!")
                } else if (e.response.status.toString() !== "403") {
                    setErrorMessage("serviceLine details could not be retrieved!")
                }
            }
            toggleLoading(false);
        }

        getServiceLine().then();
    }, [reload, serviceType, id]);


    async function deleteServiceLineById() {
        let text = "serviceline will be deleted permanently in case no invoice is connected, are you sure?";
        if (window.confirm(text) === true) {
            try {
                const {data} = await axios.delete(`http://localhost:8080/servicelines/${selectedServiceLine.idServiceLine}`, {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: 'Bearer ' + localStorage.getItem('token'),
                    },
                });
                setErrorMessage(data);
                setReload(!reload);

            } catch (error) {
                if (error.response.status.toString() === "403") {
                    setErrorMessage("serviceLine could not be deleted, you are not authorized!")
                } else if (error.response.status.toString() !== "403") {
                    setErrorMessage(error.response.data);
                }
            }
            toggleLoading(false);
        }
    }

    async function updateServiceById() {
        try {
            await axios.put(`http://localhost:8080/services/${serviceType}/${id}`, formState, {
                headers: {
                    "Content-type": "application/json",
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                },
            });
            setErrorMessage("service successfully updated!");
        } catch (e) {
            if (e.response.status.toString() === "403") {
                setErrorMessage("service could not be updated, you are not authorized!")
            } else if (e.response.status.toString() !== "403") {
                setErrorMessage("service could not be updated!")
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

    return (
        <div className="service-form-container">
            <div className="service-form-filter">
                <section>
                    <InputField className="service-form-input-component"
                                name="idService"
                                label="Service ID"
                                inputType="text"
                                value={formState.idService}
                                readOnly={true}
                    />
                </section>
                <section>
                    <InputField className="service-form-input-component"
                                name="@type"
                                label="Service Type"
                                inputType="text"
                                value={formState['@type']}
                                readOnly={true}
                    />
                </section>
                <section>
                    <InputField
                        className="service-form-input-component"
                        name="serviceStatus"
                        label="Service Status"
                        inputType="text"
                        placeholder="please select"
                        value={formState.serviceStatus}
                        readOnly={false}
                        changeHandler={handleChange}
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
                        className="service-form-input-component"
                        name="serviceDate"
                        label="Service Date"
                        inputType="date"
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
                        onChange={handleChange}                  //onChange because textarea id not component inputField

                    >
                    </textarea>
                    :
                    <textarea
                        name="issuesToRepair"
                        cols="50"
                        rows="5"
                        value={formState.issuesToRepair}
                        readOnly={!typeOfService}
                        onChange={handleChange}                  //onChange because textarea id not component inputField
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


            <div className="serviceline-form-transaction-container">
                <div className="serviceline-form-display-container">
                    <div className="transaction-table">
                    <TransactionTable
                        selectObject={(selectedServiceLine) => setSelectedServiceLine(selectedServiceLine)}                             //2 Retrieve data from child/component TransactionTable
                        tableContainerClassName="service-home-container-table"
                        headerContainerClassName="service-home-table-header"
                        headerClassName="service-home-table-header"
                        dataInput={serviceLine}
                    />
                    <div className="messages">
                        {loading && <p className="message-home">Data Loading, please wait...</p>}
                        {errorMessage && <p className="message-home">{errorMessage}</p>}
                        {!selectedServiceLine.idServiceLine && !loading && !errorMessage &&
                            <p className="message-home">please change service and press confirm or create, delete or change a
                                serviceline</p>}
                    </div>
                </div>
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
        </div>
    );
};

export default ChangeServicePage;