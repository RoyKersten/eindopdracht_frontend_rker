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

function DisplayServicePage() {

    const {id} = useParams()
    const {serviceType} = useParams();
    const [serviceLine, setServiceLine] = useState([]);
    const [loading, toggleLoading] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [selectedServiceLine, setSelectedServiceLine] = useState({idServiceLine: ''});
    const [formState, setFormState] = useState({
        idService: '',
        '@type': '',
        serviceStatus: '',
        serviceDate: '',
        customer: {idCustomer: ''},
        car: {idCar: ''},
        issuesFoundInspection: '',
        issuesToRepair: ''
    });


    //Get item data based on endpoint, get bearer token from local storage to validate authentication and authorization
    useEffect(() => {
        async function getService() {
            toggleLoading(true);
            setError(false);
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
    }, [serviceType]);


    useEffect(() => {
        async function getServiceLine() {
            toggleLoading(true);
            setError(false);
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
    }, [serviceType]);

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
                        readOnly={true}
                    />
                </section>
                <section>
                    <InputField
                        className="service-form-input-component"
                        name="serviceDate"
                        label="Service Date"
                        inputType="text"
                        value={formState.serviceDate}
                        readOnly={true}
                    />
                </section>
                <section>
                    <InputField
                        className="service-form-input-component"
                        name="idCustomer"
                        label="Customer ID"
                        inputType="text"
                        value={formState.customer.idCustomer}
                        readOnly={true}
                    />
                </section>
                <section>
                    <InputField
                        className="service-form-input-component"
                        name="idCar"
                        label="Car ID"
                        inputType="text"
                        value={formState.car.idCar}
                        readOnly={true}
                    />
                </section>

            </div>
            <div className="text-field-issues-form">
                {serviceType === "inspections" ?
                    <textarea className="issuesFoundInspection"
                              id="issuesFoundInspectionsId"
                              cols="50"
                              rows="5"
                              value={formState.issuesFoundInspection}
                              readOnly={true}
                    >issuesFoundInspection
                    </textarea>
                    :
                    <textarea className="issuesToRepair"
                              id="issuesToRepairId"
                              cols="50"
                              rows="5"
                              value={formState.issuesToRepair}
                              readOnly={true}
                    >issuesToRepair
                    </textarea>
                }
                <div className="confirm-button-service-container">
                    <Button
                        buttonName="confirm-button-service"
                        buttonDescription="CONFIRM"
                        pathName="/home"
                        disabled={true}
                        buttonIcon={confirmIcon}
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
                        pathName=""
                        disabled={true}
                        buttonIcon={createIcon}
                    />
                    <Button
                        buttonName="transaction-home-small-button"
                        buttonDescription="CHANGE"
                        buttonType="button"
                        pathName=""
                        disabled={true}
                        buttonIcon={changeIcon}
                    />
                    <Button
                        buttonName="transaction-home-small-button"
                        buttonDescription="DELETE"
                        buttonType="button"
                        pathName=""
                        disabled={true}
                        buttonIcon={deleteIcon}
                    />
                </div>
            </div>
            <div className="messages">
                {loading && <p className="message-home">Data Loading, please wait...</p>}
                {error && <p className="message-home">Error occurred</p>}
                {errorMessage && <p className="message-home">{errorMessage}</p>}
                {!selectedServiceLine.idServiceLine && !loading &&
                    <p className="message-home">please select serviceline to display details</p>}
            </div>
        </div>
    );
};

export default DisplayServicePage;