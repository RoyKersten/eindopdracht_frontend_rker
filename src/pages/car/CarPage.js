import './CarPage.css';
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import InputField from "../../components/inputfield/InputField";
import Button from "../../components/button/Button";
import displayIcon from "../../images/icons/display.png";
import createIcon from "../../images/icons/create.png";
import changeIcon from "../../images/icons/change.png";
import deleteIcon from "../../images/icons/delete.png";
import TransactionTable from "../../components/transactiontable/TransactionTable";


function CarPage() {

    const [car, setCars] = useState([]);
    const [sourceData, setSourceData] = useState([]);
    const [endpoint, setEndpoint] = useState(`http://localhost:8080/cars`);    //initial endpoint used to fetch all cars from database
    const [loading, toggleLoading] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [reload, setReload] = useState(false);
    const [selectedCar, setSelectedCar] = useState({idCar: ''});

    const [formState, setFormState] = useState({
        carId: '',
        licensePlateNumber: '',
    });

    //Get customer data based on endpoint, get bearer token from local storage to validate authentication and authorization
    useEffect(() => {
        async function getCars() {
            toggleLoading(true);
            setError(false);

            try {
                const {data} = await axios.get(endpoint, {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: 'Bearer ' + localStorage.getItem('token'),
                    },
                });
                setSourceData(data);
                setCars(data);

            } catch (error) {
                setError(true);
            }
            toggleLoading(false);
        }

        getCars().then();
    }, [endpoint, reload]);


    async function deleteCarById() {
        let text = "car will be deleted permanently in case no inspection or repair is connected, are you sure?";
        if (window.confirm(text) === true) {
            setError(false);
            try {
                const {data} = await axios.delete("http://localhost:8080/cars/" + selectedCar.idCar, {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: 'Bearer ' + localStorage.getItem('token'),
                    },
                });
                setErrorMessage(data);
                setReload(!reload);

            } catch (error) {
                if (error.response.status.toString() === "403") {
                    setErrorMessage("car could not be deleted, you are not authorized!")
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

    //Filter data based customerId and lastname or show all customers when filters are empty
    function filterData(data) {
        setCars(sourceData);

        if (formState.carId !== "") {
            setCars(data.filter(function (object) {
                return object.idCar.toString() === formState.carId.toString();
            }))
        } else if (formState.licensePlateNumber !== "") {
            setCars(data.filter(function (object) {
                return object.licensePlateNumber.toLowerCase() === formState.licensePlateNumber.toLowerCase();
            }))
        } else {
            console.log("no entry");
        }
        ;
    }

    return (
        <div className="car-home-container">
            <div className="car-home-filter">
                <section>
                    <InputField name="carId" label="Car ID" inputType="text"
                                onKeyPress={onKeyPress} changeHandler={onKeyPress}
                    />
                </section>
                <section>
                    <InputField name="licensePlateNumber" label="LicensePlateNumber" inputType="text"
                                onKeyPress={onKeyPress} changeHandler={onKeyPress}
                    />
                </section>
            </div>
            <div className="car-home-transaction-container">
                <div className="car-home-display-container">
                    <TransactionTable
                        selectObject={(selectedCar) => setSelectedCar(selectedCar)}                             //2 Retrieve data from child/component TransactionTable
                        tableContainerClassName="car-home-container-table"
                        headerContainerClassName="car-home-table-header"
                        headerClassName="car-home-table-header"
                        dataInput={car}
                    />
                </div>

                <div className="car-home-buttons">
                    <Button
                        buttonName="transaction-home-button"
                        buttonDescription="DISPLAY"
                        buttonType="button"
                        pathName={"/cars/display/" + (selectedCar.idCar)}
                        disabled={selectedCar.idCar === ''}
                        buttonIcon={displayIcon}
                    />
                    <Button
                        buttonName="transaction-home-button"
                        buttonDescription="CREATE"
                        buttonType="button"
                        pathName="/cars/create"
                        disabled={false}
                        buttonIcon={createIcon}
                    />
                    <Button
                        buttonName="transaction-home-button"
                        buttonDescription="CHANGE"
                        buttonType="button"
                        pathName={"/cars/change/" + (selectedCar.idCar)}
                        disabled={selectedCar.idCar === ''}
                        buttonIcon={changeIcon}
                    />
                    <Button
                        buttonName="transaction-home-button"
                        buttonDescription="DELETE"
                        buttonType="button"
                        onClick={() => deleteCarById()}
                        pathName=""
                        disabled={selectedCar.idCar === ''}
                        buttonIcon={deleteIcon}
                    />
                </div>
            </div>
            <div className="messages">
                {loading && <p className="message-home">Data Loading, please wait...</p>}
                {error && <p className="message-home">Error occurred</p>}
                {errorMessage && <p className="message-home">{errorMessage}</p>}
                {!selectedCar.idCar && !loading && !errorMessage && !error &&
                    <p className="message-home">Please select a car</p>}
            </div>

        </div>
    );
};

export default CarPage;