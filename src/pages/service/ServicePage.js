import './ServicePage.css';
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import InputField from "../../components/inputfield/InputField";
import Button from "../../components/button/Button";
import displayIcon from "../../images/icons/display.png";
import createIcon from "../../images/icons/create.png";
import changeIcon from "../../images/icons/change.png";
import deleteIcon from "../../images/icons/delete.png";
import TransactionTable from "../../components/transactiontable/TransactionTable";

function ServicePage() {

    const serviceStatus = ["UITVOEREN", "NIET_UITVOEREN", "VOLTOOID"];
    const [service, setService] = useState([]);
    const [serviceType, setServiceType] = useState("inspections");
    const [sourceData, setSourceData] = useState([]);
    const [loading, toggleLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [reload, setReload] = useState(false);
    const [selectedService, setSelectedService] = useState({idService: ''});
    const [formState, setFormState] = useState({
        serviceId: '',
        serviceType: '',
        serviceStatus: '',
        customerId: '',
    });


    //Get service data based on endpoint, get bearer token from local storage to validate authentication and authorization
    useEffect(() => {
        async function getService() {
            toggleLoading(true);

            try {
                const {data} = await axios.get(`http://localhost:8080/services/${serviceType}`, {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: 'Bearer ' + localStorage.getItem('token'),
                    },
                });
                setSourceData(data);
                setService(data);

            } catch (error) {
                if (error.response.status.toString() === "403") {
                    setErrorMessage("services could not be loaded, you are not authorized!")
                } else if (error.response.status.toString() !== "403") {
                    setErrorMessage(error.response.data);
                }
            }
            toggleLoading(false);
        }


        getService().then();
    }, [reload, serviceType]);


    async function deleteServiceById() {
        let text = "service will be deleted permanently in case no invoice is connected, are you sure?";
        if (window.confirm(text) === true) {

            try {
                const {data} = await axios.delete(`http://localhost:8080/services/${serviceType}/${selectedService.idService}`, {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: 'Bearer ' + localStorage.getItem('token'),
                    },
                });
                setErrorMessage(data);
                setReload(!reload);

            } catch (error) {
                console.log(error.response.status.toString());
                if (error.response.status.toString() === "403") {
                    setErrorMessage("service could not be deleted, you are not authorized!")
                } else if (error.response.status.toString() !== "403") {
                    setErrorMessage(error.response.data);
                }
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
    function onSelectionServiceType(e) {
        if (e.target.value === "") {
        } else {
            setServiceType(e.target.value);
        }
        filterData(sourceData);
        formState.serviceType = '';
    }

    //filter data based on itemType part or activity selection
    function onSelectionServiceStatus(e) {
        if (e.target.value === "") {
        } else {
            formState.serviceStatus = e.target.value;
        }
        filterData(sourceData);
        formState.serviceStatus = '';       //Reset filter serviceStatus to reload available repairs or inspections
    }


//Filter data based customerId and lastname or show all customers when filters are empty
    function filterData(data) {
        setService(sourceData);

        if (formState.serviceId !== "") {
            setService(data.filter(function (object) {
                return object.idService.toString() === formState.serviceId.toString();
            }))
        } else if (formState.serviceType !== "") {
            setService(data.filter(function (object) {
                return object.serviceType === formState.serviceType;
            }))
        } else if (formState.serviceStatus !== "") {
            setService(data.filter(function (object) {
                return object.serviceStatus.toString() === formState.serviceStatus.toString();
            }))
        } else if (formState.customerId !== "") {
            setService(data.filter(function (object) {
                return object.customer.idCustomer.toString() === formState.customerId.toString();
            }))
        } else {
            console.log("no entry");
        }
        ;
    }

    return (
        <div className="service-home-container">
            <div className="service-home-filter">

                <section>
                    <InputField name="serviceId"
                                label="Service ID"
                                inputType="text"
                                onKeyPress={onKeyPress}
                                changeHandler={onKeyPress}
                    />
                </section>
                <section spellCheck="false">
                    <InputField name="serviceType"
                                label="Service Type"
                                inputType="text"
                                list="serviceTypeList"
                                placeholder="please select"
                                onSelection={onSelectionServiceType}

                    />
                    <datalist id="serviceTypeList">
                        <option key={1} value="inspections">inspections</option>
                        <option key={2} value="repairs">repairs</option>
                    </datalist>
                </section>
                <section>
                    <InputField name="serviceStatus" label="Service Status" inputType="text" list="serviceStatusList"
                                placeholder="please select"
                                onSelection={onSelectionServiceStatus}
                    />
                    <datalist id="serviceStatusList">
                        {serviceStatus.map((serviceStat, i) => (
                            <option key={i} value={serviceStat}/>
                        ))}

                    </datalist>
                </section>
                <section>
                    <InputField name="customerId"
                                label="Customer ID"
                                inputType="text"
                                onKeyPress={onKeyPress}
                                changeHandler={onKeyPress}
                    />
                </section>
            </div>
            <div className="service-home-transaction-container">
                <div className="service-home-display-container">
                    <div className="transaction-table">
                        <TransactionTable
                            selectObject={(selectedService) => setSelectedService(selectedService)}                             //2 Retrieve data from child/component TransactionTable
                            tableContainerClassName="service-home-container-table"
                            headerContainerClassName="service-home-table-header"
                            headerClassName="service-home-table-header"
                            dataInput={service}
                        />
                        <div className="messages">
                            {loading && <p className="message-home">Data Loading, please wait...</p>}
                            {errorMessage && <p className="message-home">{errorMessage}</p>}
                            {!selectedService.idService && !loading && !errorMessage &&
                                <p className="message-home">please select service or select Service Type to switch
                                    between repairs
                                    and inspections</p>}
                        </div>
                    </div>
                </div>
                <div className="service-home-buttons">
                    <Button
                        buttonName="transaction-home-button"
                        buttonDescription="DISPLAY"
                        buttonType="button"
                        pathName={"/services/display/" + serviceType + "/" + selectedService.idService}
                        disabled={selectedService.idService === ''}
                        buttonIcon={displayIcon}
                    />
                    <Button
                        buttonName="transaction-home-button"
                        buttonDescription="CREATE"
                        buttonType="button"
                        pathName={"/services/create"}
                        disabled={false}
                        buttonIcon={createIcon}
                    />
                    <Button
                        buttonName="transaction-home-button"
                        buttonDescription="CHANGE"
                        buttonType="button"
                        pathName={"/services/change/" + serviceType + "/" + selectedService.idService}
                        disabled={selectedService.idService === ''}
                        buttonIcon={changeIcon}
                    />
                    <Button
                        buttonName="transaction-home-button"
                        buttonDescription="DELETE"
                        buttonType="button"
                        onClick={() => deleteServiceById()}
                        pathName=""
                        disabled={selectedService.idService === ''}
                        buttonIcon={deleteIcon}
                    />
                </div>
            </div>
        </div>
    );
};

export default ServicePage;