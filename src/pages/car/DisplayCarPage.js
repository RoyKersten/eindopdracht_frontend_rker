import InputField from "../../components/inputfield/InputField";
import './CarFormPage.css';
import {useParams} from "react-router-dom";
import Button from "../../components/button/Button";
import confirmIcon from "../../images/icons/confirm.png";
import openAttachmentIcon from "../../images/icons/attachment.png";
import uploadIcon from "../../images/icons/file_upload.png";
import React, {useEffect, useState} from "react";
import axios from "axios";

function DisplayCarPage() {

    const {id} = useParams()
    const [errorMessage, setErrorMessage] = useState("");
    const [message, setMessage] = useState("");

    const [object, setObject] = useState({
        idCar: '',
        licensePlateNumber: '',
        brand: '',
        model: '',
        yearOfConstruction: '',
        customer: {idCustomer: ''},
        experiationDateInspection: '',
        fileLocation: ''
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
                setObject(data);
            } catch (e) {
                if (e.response.status.toString() === "403") {
                    setErrorMessage("car details could not be retrieved, you are not authorized!")
                } else if (e.response.status.toString() !== "403") {
                    setErrorMessage("car details could not be retrieved!")
                }
            }
        }

        getCarById().then();
    }, [id]);


    async function getCarPaper() {
        try {
            await axios.get(`http://localhost:8080/cars/${id}/carpaper`, {
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
            console.log(e);
            setMessage("something went wrong, carPaper could not be loaded, please try again")
        }
    }

    return (
        <div className="car-form-container">
            <form className="car-form">
                <div className="car-form-div-box">
                    <section className="car-form-input-section1">
                        <div className="car-form-div1">
                            <section>
                                <InputField className="form-car-input-component"
                                            name="customer ID"
                                            label="Customer ID"
                                            inputType="text"
                                            value={object.customer.idCustomer}
                                            readOnly={true}
                                />
                            </section>
                        </div>
                    </section>
                    <section className="car-form-input-section2">
                        <div className="car-form-div2">
                            <section>
                                <InputField className="form-car-input-component"
                                            name="Car ID"
                                            label="Car ID"
                                            inputType="text"
                                            value={object.idCar}
                                            readOnly={true}
                                />
                            </section>
                        </div>

                        <div className="car-form-div3">
                            <section>
                                <InputField className="form-car-input-component"
                                            name="license-plate-number"
                                            label="License Plate Number"
                                            inputType="text"
                                            value={object.licensePlateNumber}
                                            readOnly={true}
                                />
                            </section>
                        </div>
                    </section>
                </div>
                <section className="car-form-input-section3">
                    <section>
                        <InputField className="car-form-input-component"
                                    name="brand"
                                    label="Brand"
                                    inputType="text"
                                    value={object.brand}
                                    readOnly={true}
                        />
                    </section>
                    <section>
                        <InputField className="car-form-input-component"
                                    name="model"
                                    label="Model"
                                    inputType="text"
                                    value={object.model}
                                    readOnly={true}
                        />
                    </section>
                    <section>
                        <InputField className="car-form-input-component"
                                    name="year-of-construction"
                                    label="yearOfConstruction"
                                    inputType="text"
                                    value={object.yearOfConstruction}
                                    readOnly={true}
                        />
                    </section>
                    <section>
                        <InputField className="car-form-input-component"
                                    name="apk-experiation-date"
                                    label="APK experiation Date"
                                    inputType="text"
                                    value={object.experiationDateInspection}
                                    readOnly={true}
                        />
                    </section>
                    <section>
                        <InputField className="car-form-input-component"
                                    name="car-paper-check"
                                    label="Car paper available ?"
                                    inputType="text"
                                    value={object.carPaper === null ? "NO" : "YES"}
                                    readOnly={true}
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
                                disabled={object.carPaper === null}
                                buttonIcon={openAttachmentIcon}
                            />
                        </div>
                        <div className="upload-button-div2">
                            <Button
                                buttonName="car-button"
                                buttonDescription="UPLOAD"
                                buttonType="button"
                                pathName="/home"
                                disabled={true}
                                buttonIcon={uploadIcon}
                            />
                        </div>
                    </section>
                    <div className="messages">
                        {errorMessage && !message && <p className="message-error">{errorMessage}</p>}
                        {message && !errorMessage && <p className="message-error">{message}</p>}
                    </div>
                    <Button
                        buttonName="confirm-button"
                        buttonDescription="CONFIRM"
                        pathName="/home"
                        disabled={true}
                        buttonIcon={confirmIcon}
                    />
                </div>
            </form>
        </div>
    );
}

export default DisplayCarPage;