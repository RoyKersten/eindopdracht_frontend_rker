import InputField from "../../components/inputfield/InputField";
import './CreateCarPage.css';
import {useParams} from "react-router-dom";
import Button from "../../components/button/Button";
import confirmIcon from "../../images/icons/confirm.png";
import openAttachmentIcon from "../../images/icons/attachment.png";
import uploadIcon from "../../images/icons/file_upload.png";
import React, {useEffect, useState} from "react";
import axios from "axios";
import FormData from 'form-data';


function CreateCarPage() {

    let {id} = useParams()
    let [idCar, setIdCar] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [message, setMessage] = useState("");
    const [endpointCarPaper, setEndpointCarPaper] = useState(`http://localhost:8080/cars/${id}/carpaper`);
    const [endpoint, setEndpoint] = useState("http://localhost:8080/cars");    //initial endpoint used to fetch all customers from database
    const [pdfAvailable, setPdfAvailable] = useState(false);
    const [formState, setFormState] = useState({
        licensePlateNumber: '',
        brand: '',
        model: '',
        yearOfConstruction: '',
        customer: {idCustomer: ''},
        experiationDateInspection: '',
    });


    //Add a car to the database
    async function addCar() {
        try {
            const {data} = await axios.post(endpoint, formState, {
                headers: {
                    "Content-type": "application/json",
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                },
            });
            if (data !== null) {
                setMessage("car successfully created, please select carpaper and press upload");
            }
            console.log(data);
            const indexOf = data.lastIndexOf("/") + 1;                           //determine new created idCar => last numbers after last /
            id = (data.substring(indexOf,));                                          //capture idCar
            setIdCar(id);                                                             //setIdCar to show in inputfield
            setEndpointCarPaper(`http://localhost:8080/cars/${id}/carpaper`)    //setEndPointCarPaper to ensure upload for carpaper takes last idCar

        } catch (e) {
            console.error(e);
        }
    }

    // console.log(formState.fileLocation);

    //Get CarPaper from database
    async function getCarPaper() {
        try {
            const carPaper = await axios.get(endpointCarPaper, {
                responseType: 'blob',
                headers: {
                    "Content-type": "multipart/form-data",
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                }
            })
                .then((response) => {
                    const url = window.URL.createObjectURL(new Blob([response.data], {type: 'application/pdf'}));
                    const link = document.createElement('a');
                    link.href = url;
                    link.target = '_blank'              //Open pdf file in a new tab
                    link.click();
                    window.URL.revokeObjectURL(url);    //let the browser know not to keep the reference to the file any longer.
                });

        } catch (e) {
            console.error(e);
            setMessage("carpaper not available, please first upload carpaper")
        }
    }

    //post CarPaper in database
    async function addCarPaper(e) {
        const formData = new FormData();
        const pdfFile = document.querySelector('#file-field');
        formData.append("file", pdfFile.files[0]);
        try {
            const carPaper = await axios.post(endpointCarPaper, formData, {
                headers: {
                    "Content-type": "multipart/form-data",
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                }
            });
            if (carPaper.status === 200) {
                setMessage("carpaper successfully added, you can open the uploaded file")
                setPdfAvailable(true);
            }
        } catch (e) {
            console.log(e)
        }
    }


    //Get Car Information by LicensePlate External API RDW
    async function getCarByLicensePlate() {
        let licensePlateNumber = formState.licensePlateNumber.toUpperCase();
        if (licensePlateNumber.includes("-")) {
            licensePlateNumber = licensePlateNumber.replaceAll("-", "")
                }

        try {
            let carLicensePlate = await axios.get(`https://opendata.rdw.nl/resource/m9d7-ebf2.json?kenteken=${licensePlateNumber}`); //API RDW op basis van kenteken
            formState.brand = carLicensePlate.data[0].merk;
            formState.model = carLicensePlate.data[0].handelsbenaming;
            formState.yearOfConstruction = carLicensePlate.data[0].datum_eerste_toelating.substring(0, 4);
            formState.licensePlateNumber = carLicensePlate.data[0].kenteken;
            formState.experiationDateInspection = carLicensePlate.data[0].vervaldatum_apk;
            setFormState(formState);
        } catch (e) {
            console.error(e);
        }
    }

    function handleClick(e) {
        const inputName = e.target.name;
        const inputValue = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

        if (inputName === "idCustomer") {
            setFormState(formState.customer.idCustomer = inputValue);
        }

        setFormState({
            ...formState,
            [inputName]: inputValue,
        })
        if (e.key === 'Enter') {
            console.log("test");
            getCarByLicensePlate();
            e.preventDefault();
        }
    }

    function handleSubmit(e) {
        addCar();
        e.preventDefault();
    }

    return (
        <div className="car-create-container">

            <form className="car-create-form" onSubmit={handleSubmit}>
                <div className="car-create-div-box">
                    <section className="car-create-input-section1">
                        <div className="car-create-div1">
                            <section>
                                <InputField className="create-car-input-component"
                                            name="idCustomer"
                                            label="Customer ID"
                                            inputType="text"
                                            value={formState.customer.idCustomer}
                                            readOnly={false}
                                            changeHandler={handleClick}
                                />
                            </section>
                            {!formState.customer.idCustomer && <p className="field-message">please enter customer ID</p>}
                        </div>
                    </section>
                    <section className="car-create-input-section2">
                        <div className="car-create-div2">
                            <section>
                                <InputField className="create-car-input-component-carId"
                                            name="idCar"
                                            label="Car ID"
                                            value={idCar}
                                            inputType="text"
                                            readOnly={true}
                                />
                            </section>
                        </div>

                        <div className="car-create-div3">
                            <section>
                                <InputField className="create-car-input-component"
                                            name="licensePlateNumber"
                                            label="License Plate Number"
                                            inputType="text"
                                            value={formState.licensePlateNumber}
                                            readOnly={false}
                                            placeholder="J-071-FT  or  J071FT"
                                            changeHandler={handleClick}
                                            onKeyPress={handleClick}
                                />
                            </section>
                            {!formState.licensePlateNumber && <p className="field-message">please enter license plate number </p>}
                        </div>
                    </section>
                </div>


                <section className="car-create-input-section3">
                    <section>
                        <InputField className="create-input-component"
                                    name="brand"
                                    label="Brand"
                                    inputType="text"
                                    value={formState.brand}
                                    readOnly={false}
                                    changeHandler={handleClick}
                        />
                    </section>
                    <section>
                        <InputField className="create-input-component"
                                    name="model"
                                    label="Model"
                                    inputType="text"
                                    value={formState.model}
                                    readOnly={false}
                                    changeHandler={handleClick}
                        />
                    </section>
                    <section>
                        <InputField className="create-input-component"
                                    name="yearOfConstruction"
                                    label="Year Of Construction"
                                    inputType="text"
                                    value={formState.yearOfConstruction}
                                    readOnly={false}
                                    changeHandler={handleClick}
                        />
                    </section>
                    <section>
                        <InputField className="create-input-component"
                                    name="experiationDateInspection"
                                    label="APK experiation Date"
                                    inputType="text"
                                    value={formState.experiationDateInspection}
                                    readOnly={false}
                                    changeHandler={handleClick}
                        />
                    </section>
                    <section>
                        <InputField className="create-input-component"
                                    name="file"
                                    label="Select carpaper file for Upload"
                                    inputType="file"
                                    // onClick={(e) => addCarPaper(e)}
                                    readOnly={false}
                                    changeHandler={handleClick}
                        />
                    </section>
                </section>
                <div className="car-create-carpaper-buttons-box">
                    <section className="car-create-carpaper-buttons">
                        <div className="open-button-div1">
                            <Button
                                buttonName="car-button"
                                buttonDescription="OPEN"
                                buttonType="button"
                                pathName=""
                                onClick={() => getCarPaper()}
                                disabled={!pdfAvailable}
                                buttonIcon={openAttachmentIcon}
                            />
                        </div>
                        <div className="upload-button-div2">
                            <Button
                                buttonName="car-button"
                                buttonDescription="UPLOAD"
                                buttonType="button"
                                pathName=""
                                onClick={(e) => addCarPaper(e)}
                                disabled={!idCar}
                                buttonIcon={uploadIcon}
                            />
                        </div>
                    </section>
                    <div className="messages">
                        {message && <p className="message-error">{message}</p>}
                        {!idCar &&
                            <p className="message-error">carpaper can be uploaded once car has been created, please
                                enter details and press confirm</p>}
                    </div>
                    <Button
                        buttonName="confirm-button"
                        buttonDescription="CONFIRM"
                        pathName=""
                        buttonType="submit"
                        disabled={false}
                        buttonIcon={confirmIcon}
                    />
                </div>
            </form>
        </div>
    );
}

export default CreateCarPage;