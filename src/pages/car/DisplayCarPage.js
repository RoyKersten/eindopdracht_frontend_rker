import InputField from "../../components/inputfield/InputField";
import './DisplayCarPage.css';
import {useParams} from "react-router-dom";
import Button from "../../components/button/Button";
import confirmIcon from "../../images/icons/confirm.png";
import openAttachmentIcon from "../../images/icons/attachment.png";
import uploadIcon from "../../images/icons/file_upload.png";
import React, {useEffect, useState} from "react";
import axios from "axios";


function DisplayCarPage() {

    const {id} = useParams()
    const [endpoint, setEndpoint] = useState(`http://localhost:8080/cars/${id}`);
    const [endpointCarPaper, setEndpointCarPaper] = useState(`http://localhost:8080/cars/${id}/carpaper`);
    const [message, setMessage] = useState("");
    const [carPaper, setCarPaper] = useState(false);
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
                const {data} = await axios.get(endpoint, {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: 'Bearer ' + localStorage.getItem('token'),
                    },
                });
                setObject(data);
            } catch (e) {
                console.error(e);
            }
        }

        getCarById();
    }, [endpoint]);


    async function getCarPaper() {
        try {
        const carPaper = await axios.get(endpointCarPaper, {
            responseType: 'blob',
            headers: {
                // "Content-type": "multipart/form-data",
                "Accept": "application/pdf",
                Authorization: 'Bearer ' + localStorage.getItem('token'),
            },
        }).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'carpaper.pdf');
                document.body.appendChild(link);
                link.click();
            });
            // setMessage("loading car papers, please wait...");
            setCarPaper(true);
           console.log(carPaper);
            // setObject(carPaper);
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <div className="car-display-container">
            <form className="car-display-form">
                <div className="car-display-div-box">
                    <section className="car-display-input-section1">
                        <div className="car-display-div1">
                            <section>
                                <InputField className="display-car-input-component"
                                            name="customer ID"
                                            label="Customer ID"
                                            inputType="text"
                                            value={object.customer.idCustomer}
                                            readOnly={true}
                                />
                            </section>
                        </div>
                    </section>
                    <section className="car-display-input-section2">
                        <div className="car-display-div2">
                            <section>
                                <InputField className="display-car-input-component"
                                            name="Car ID"
                                            label="Car ID"
                                            inputType="text"
                                            value={object.idCar}
                                            readOnly={true}
                                />
                            </section>
                        </div>

                        <div className="car-display-div3">
                            <section>
                                <InputField className="display-car-input-component"
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


                <section className="car-display-input-section3">
                    <section>
                        <InputField className="display-input-component"
                                    name="brand"
                                    label="Brand"
                                    inputType="text"
                                    value={object.brand}
                                    readOnly={true}
                        />
                    </section>
                    <section>
                        <InputField className="display-input-component"
                                    name="model"
                                    label="Model"
                                    inputType="text"
                                    value={object.model}
                                    readOnly={true}
                        />
                    </section>
                    <section>
                        <InputField className="display-input-component"
                                    name="year-of-construction"
                                    label="yearOfConstruction"
                                    inputType="text"
                                    value={object.yearOfConstruction}
                                    readOnly={true}
                        />
                    </section>
                    <section>
                        <InputField className="display-input-component"
                                    name="apk-experiation-date"
                                    label="APK experiation Date"
                                    inputType="text"
                                    value={object.experiationDateInspection}
                                    readOnly={true}
                        />
                    </section>
                    <section>
                        <InputField className="display-input-component"
                                    name="file location"
                                    label="File Location"
                                    inputType="text"
                                    value="/Users/roykersten/Documents/invoices"
                                    readOnly={true}
                        />
                    </section>
                </section>

                <div className="car-display-carpaper-buttons-box">
                    <section className="car-display-carpaper-buttons">
                        <div className="open-button-div1">
                            <Button
                                buttonName="car-button"
                                buttonDescription="OPEN"
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
                                pathName="/home"
                                disabled={true}
                                buttonIcon={uploadIcon}
                            />
                        </div>
                    </section>
                </div>
                <div className="messages">
                {message && <p className="message-error">{message}</p>}
                </div>
            </form>

            <Button
                buttonName="confirm-button"
                buttonDescription="CONFIRM"
                pathName="/home"
                disabled={true}
                buttonIcon={confirmIcon}
            />
        </div>
    );
}

export default DisplayCarPage;