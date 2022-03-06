import InputField from "../../components/inputfield/InputField";
import './CarFormPage.css';
import {useParams} from "react-router-dom";
import Button from "../../components/button/Button";
import confirmIcon from "../../images/icons/confirm.png";
import openAttachmentIcon from "../../images/icons/attachment.png";
import uploadIcon from "../../images/icons/file_upload.png";
import React, {useEffect, useState} from "react";
import axios from "axios";
import FormData from 'form-data';


function ChangeCarPage() {

    let {id} = useParams()
    const [errorMessage, setErrorMessage] = useState("");
    const [message, setMessage] = useState("");
    const [endpointCarPaper, setEndpointCarPaper] = useState(`http://localhost:8080/cars/${id}/carpaper`);
    const [pdfAvailable, setPdfAvailable] = useState(false);
    const [pdfReadyForUpload, setPdfReadyForUpload] = useState(false);
    const [formState, setFormState] = useState({
        idCar: '',
        licensePlateNumber: '',
        brand: '',
        model: '',
        yearOfConstruction: '',
        customer: {idCustomer: ''},
        experiationDateInspection: '',
    });


    useEffect(() => {
        async function getCarById() {
            try {
                const {data} = await axios.get(`http://localhost:8080/cars/${id}`, {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: 'Bearer ' + localStorage.getItem('token'),
                    },
                });
                setFormState(data);
            } catch (e) {
                if (e.response.status.toString() === "403") {
                    setErrorMessage("car details could not be retrieved, you are not authorized!")
                } else if (e.response.status.toString() !== "403") {
                    setErrorMessage("car details could not be retrieved!")
                }
            }
        }

        getCarById();
    }, [id]);


    //Add a car to the database
    async function changeCar() {
        try {
            const {data} = await axios.put(`http://localhost:8080/cars/${id}`, formState, {
                headers: {
                    "Content-type": "application/json",
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                },
            });
            if (data !== null) {
                setMessage("car successfully updated");
            }
            console.log(data);
            const indexOf = data.lastIndexOf("/") + 1;                           //determine new created idCar => last numbers after last /
            id = (data.substring(indexOf,));                                          //capture idCar
            setEndpointCarPaper(`http://localhost:8080/cars/${id}/carpaper`)    //setEndPointCarPaper to ensure upload for carpaper takes last idCar

        } catch (e) {
            if (e.response.status.toString() === "403") {
                setErrorMessage("car could not be updated, you are not authorized!")
            } else if (e.response.status.toString() !== "403") {
                setErrorMessage("car could not be updated!")
            }
        }
    }

    //Get CarPaper from database
    async function getCarPaper() {
        try {
            await axios.get(endpointCarPaper, {
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
            setMessage("carPaper not available, please first upload carpaper")
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
                setMessage("carPaper successfully added, you can open the uploaded file")
                setPdfAvailable(true);
            }
        } catch (e) {
            if (e.response.status.toString() === "403") {
                setErrorMessage("carPaper could not be added, you are not authorized!")
            } else if (e.response.status.toString() !== "403") {
                setErrorMessage("carPaper could not be added!")
            }
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
            setFormState({
                brand: carLicensePlate.data[0].merk,
                model: carLicensePlate.data[0].handelsbenaming,
                yearOfConstruction: carLicensePlate.data[0].datum_eerste_toelating.substring(0, 4),
                licensePlateNumber: carLicensePlate.data[0].kenteken,
                experiationDateInspection: carLicensePlate.data[0].vervaldatum_apk,
                idCar: formState.idCar,
                customer: {idCustomer: formState.customer.idCustomer}
            });

        } catch (e) {
            if (e.response.status.toString() === "403") {
                setErrorMessage("car details could not be retrieved from RDW, you are not authorized!")
            } else if (e.response.status.toString() !== "403") {
                setErrorMessage("car details could not be retrieved from RDW!")
            }
        }
    }

    //handle change for formState properties
    function handleChange(e) {
        const inputName = e.target.name;
        const inputValue = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

        setFormState({
            ...formState,
            [inputName]: inputValue,
        });

        if (e.key === 'Enter' && inputName === "licensePlateNumber" && inputValue !== '') {
            getCarByLicensePlate();
            e.preventDefault();
        }
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

    function handleSubmit(e) {
        changeCar();
        e.preventDefault();
    }

    return (
        <div className="car-form-container">
            <form className="car-form">
                <div className="car-form-div-box">
                    <section className="car-form-input-section1">
                        <div className="car-form-div1">
                            <section>
                                <InputField className="form-car-input-component"
                                            name="idCustomer"
                                            label="Customer ID"
                                            inputType="text"
                                            value={formState.customer.idCustomer}
                                            readOnly={false}
                                            changeHandler={handleChangeNestedObject}
                                />
                            </section>
                            {!formState.customer.idCustomer &&
                                <p className="field-message">please enter customer ID</p>}
                        </div>
                    </section>
                    <section className="car-form-input-section2">
                        <div className="car-form-div2">
                            <section>
                                <InputField className="form-car-input-component"
                                            name="idCar"
                                            label="Car ID"
                                            value={formState.idCar}
                                            inputType="text"
                                            readOnly={true}
                                />
                            </section>
                        </div>

                        <div className="car-form-div3">
                            <section>
                                <InputField className="form-car-input-component"
                                            name="licensePlateNumber"
                                            label="License Plate Number"
                                            inputType="text"
                                            value={formState.licensePlateNumber}
                                            readOnly={false}
                                            placeholder="J-071-FT  or  J071FT"
                                            changeHandler={handleChange}
                                            onKeyPress={handleChange}
                                />
                            </section>
                            {!formState.licensePlateNumber &&
                                <p className="field-message">please enter license plate number </p>}
                        </div>
                    </section>
                </div>


                <section className="car-form-input-section3">
                    <section>
                        <InputField className="car-form-input-component"
                                    name="brand"
                                    label="Brand"
                                    inputType="text"
                                    value={formState.brand}
                                    readOnly={false}
                                    changeHandler={handleChange}

                        />
                    </section>
                    <section>
                        <InputField className="car-form-input-component"
                                    name="model"
                                    label="Model"
                                    inputType="text"
                                    value={formState.model}
                                    readOnly={false}
                                    changeHandler={handleChange}
                        />
                    </section>
                    <section>
                        <InputField className="car-form-input-component"
                                    name="yearOfConstruction"
                                    label="Year Of Construction"
                                    inputType="text"
                                    value={formState.yearOfConstruction}
                                    readOnly={false}
                                    changeHandler={handleChange}
                        />
                    </section>
                    <section>
                        <InputField className="car-form-input-component"
                                    name="experiationDateInspection"
                                    label="APK experiation Date"
                                    inputType="text"
                                    value={formState.experiationDateInspection}
                                    readOnly={false}
                                    changeHandler={handleChange}
                        />
                    </section>
                    <section>
                        <InputField className="car-form-input-component"
                                    id="file-field"
                                    name="file"
                                    label="Select carpaper file for Upload"
                                    inputType="file"
                                    readOnly={false}
                                    changeHandler={() => setPdfReadyForUpload(true)}

                        />
                    </section>
                </section>
                <div className="car-form-carpaper-buttons-box">
                    <section className="car-form-carpaper-buttons">
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
                                disabled={!pdfReadyForUpload}
                                buttonIcon={uploadIcon}
                            />
                        </div>
                    </section>
                    <Button
                        buttonName="confirm-button"
                        buttonDescription="CONFIRM"
                        pathName=""
                        buttonType="button"
                        onClick={(e) => {
                            handleSubmit(e)
                        }}
                        disabled={false}
                        buttonIcon={confirmIcon}
                    />
                </div>
                <div className="messages">
                    {errorMessage && !message && <p className="message-error">{errorMessage}</p>}
                    {message && !errorMessage && <p className="message-error">{message}</p>}
                    {!pdfReadyForUpload && !message && !errorMessage &&
                        <p className="message-error">please update car details and press confirm or choose carpaper
                            file and press upload </p>}
                </div>
            </form>
        </div>
    );
}

export default ChangeCarPage;