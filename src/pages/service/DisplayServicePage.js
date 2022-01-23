import './DisplayServicePage.css';
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
    const serviceStatus = ["UITVOEREN", "NIET_UITVOEREN", "VOLTOOID"];
    const [object, setObject] = useState({
        idService: '',
        '@type': '',
        serviceStatus: '',
        serviceDate: '',
        customer: {idCustomer: ''},
        car: {idCar: ''},
        issuesFoundInspection: '',
        issuesToRepair: ''
    });

    const [serviceLine, setServiceLine] = useState([]);
    const [sourceData, setSourceData] = useState([]);
    const [loading, toggleLoading] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [reload, setReload] = useState(false);
    const [selectedServiceLine, setSelectedServiceLine] = useState({idServiceLine: ''});
    const [formState, setFormState] = useState({
        serviceId: '',
        serviceType: '',
        serviceStatus: '',
        serviceDate: '',
        customerId: '',
        carId: '',
        issuesService: 'test',
    });


    //Get item data based on endpoint, get bearer token from local storage to validate authentication and authorization
    useEffect(() => {
        async function getService() {
            toggleLoading(true);
            setError(false);
            console.log(serviceType)
            try {
                const {data} = await axios.get(`http://localhost:8080/services/${serviceType}/${id}`, {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: 'Bearer ' + localStorage.getItem('token'),
                    },
                });
                setSourceData(data);
                setObject(data);
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
        let text = "service will be deleted permanently in case no invoice is connected, are you sure?";
        if (window.confirm(text) === true) {
            setError(false);
            try {
                const {data} = await axios.delete(`http://localhost:8080/services/${serviceType}/${selectedServiceLine.idServiceLine}`, {
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
    // function onKeyPress(e) {
    //     const inputName = e.target.name;
    //     const inputValue = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    //
    //     setFormState({
    //         ...formState,
    //         [inputName]: inputValue,
    //     })
    //     if (e.key === 'Enter') {
    //         filterData(sourceData);
    //     }
    // }


    // //filter data based on itemType part or activity selection
    // function onSelectionServiceType(e) {
    //     if (e.target.value === "") {
    //     } else {
    //         setServiceType(e.target.value);
    //     }
    //     filterData(sourceData);
    //     formState.serviceType = '';
    // }
    //
    // //filter data based on itemType part or activity selection
    // function onSelectionServiceStatus(e) {
    //     if (e.target.value === "") {
    //     } else {
    //         formState.serviceStatus = e.target.value
    //     }
    //     filterData(sourceData);
    //     formState.serviceStatus = '';       //Reset filter serviceStatus to reload available repairs or inspections
    // }


//Filter data based customerId and lastname or show all customers when filters are empty
//     function filterData(data) {
//         setService(sourceData);
//
//         if (formState.serviceId !== "") {
//             setService(data.filter(function (object) {
//                 return object.idService.toString() === formState.serviceId.toString();
//             }))
//         } else if (formState.serviceType !== "") {
//             setService(data.filter(function (object) {
//                 return object.serviceType === formState.serviceType;
//             }))
//         } else if (formState.serviceStatus !== "") {
//             setService(data.filter(function (object) {
//                 return object.serviceStatus.toString() === formState.serviceStatus.toString();
//             }))
//         } else if (formState.customerId !== "") {
//             setService(data.filter(function (object) {
//                 return object.customer.idCustomer.toString() === formState.customerId.toString();
//             }))
//         } else {
//             console.log("no entry");
//         };
//     }

    return (
        <div className="service-display-container">
            <div className="service-display-filter">
                <section>
                    <InputField className="service-display-input-component"
                                name="idService"
                                label="Service ID"
                                inputType="text"
                                value={object.idService}
                                readOnly={true}
                        // onKeyPress={onKeyPress}
                        // changeHandler={onKeyPress}
                    />
                </section>
                <section>
                    <InputField className="service-display-input-component"
                                name="@type"
                                label="Service Type"
                                inputType="text"
                                list="itemTypeList"
                                value={object['@type']}
                                readOnly={true}
                        // placeholder="please select"
                        // onSelection={onSelectionServiceType}

                    />
                    <datalist id="itemTypeList">
                        <option value="inspections">inspections</option>
                        <option value="repairs">repairs</option>
                    </datalist>
                </section>
                <section>
                    <InputField
                        className="service-display-input-component"
                        name="serviceStatus" label="Service Status" inputType="text"
                        // list="serviceStatusList"
                        placeholder="please select"
                        // onSelection={onSelectionServiceStatus}
                        value={object.serviceStatus}
                        readOnly={true}
                    />
                    {/*<datalist id="serviceStatusList">*/}
                    {/*    {serviceStatus.map((status, i) => (*/}
                    {/*        <option key={i} value={status}/>*/}
                    {/*    ))}*/}

                    {/*</datalist>*/}
                </section>

                <section>
                    <InputField
                        className="service-display-input-component"
                        name="serviceDate"
                        label="Service Date"
                        inputType="text"
                        // onKeyPress={onKeyPress}
                        // changeHandler={onKeyPress}
                        value={object.serviceDate}
                        readOnly={true}
                    />
                </section>

                <section>
                    <InputField
                        className="service-display-input-component"
                        name="idCustomer"
                        label="Customer ID"
                        inputType="text"
                        // onKeyPress={onKeyPress}
                        // changeHandler={onKeyPress}
                        value={object.customer?.idCustomer === undefined ? '' : object.customer.idCustomer}
                        readOnly={true}
                    />
                </section>


                <section>
                    <InputField
                        className="service-display-input-component"
                        name="idCar"
                        label="Car ID"
                        inputType="text"
                        //             onKeyPress={onKeyPress}
                        //             changeHandler={onKeyPress}
                        value={object.car?.idCar === undefined ? '' : object.car.idCar}
                        readOnly={true}
                    />
                </section>

            </div>
            <div className="text-field-issues">
                {serviceType === "inspections" ?
                    <textarea className="issuesFoundInspection"
                              id="issuesFoundInspectionsId"
                              cols="50"
                              rows="5"
                              value={object.issuesFoundInspection}
                              readOnly={true}
                    >issuesFoundInspection
                    </textarea>
                    :
                    <textarea className="issuesToRepair"
                              id="issuesToRepairId"
                              cols="50"
                              rows="5"
                              value={object.issuesToRepair}
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


            <div className="serviceline-display-transaction-container">
                <div className="serviceline-display-display-container">
                    <TransactionTable
                        selectObject={(selectedServiceLine) => setSelectedServiceLine(selectedServiceLine)}                             //2 Retrieve data from child/component TransactionTable
                        tableContainerClassName="service-home-container-table"
                        headerContainerClassName="service-home-table-header"
                        headerClassName="service-home-table-header"
                        dataInput={serviceLine}
                    />
                </div>

                <div className="serviceline-display-buttons">
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
                        pathName={"/services/create/" + serviceType}
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
                {!selectedServiceLine.idServiceLine && !loading &&
                    <p className="message-home">please select service or select Service Type to switch between repairs
                        and inspections</p>}
            </div>
        </div>
    );
};

export default DisplayServicePage;