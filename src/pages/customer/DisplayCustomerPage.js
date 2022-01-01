import InputField from "../../components/inputfield/InputField";
import './DisplayCustomerPage.css';
import {useParams} from "react-router-dom";
import Button from "../../components/button/Button";
import confirmIcon from "../../images/icons/confirm.png";
import React, {useEffect, useState} from "react";
import axios from "axios";


function DisplayCustomerPage() {

    const {id} = useParams()
    const [endpoint, setEndpoint] = useState("http://localhost:8080/customers/" + id);
    const [object, setObject] = useState({idCustomer: '', firstName: '', lastName: '', phoneNumber: '', email: ''});

    useEffect(() => {
        async function getCustomerById() {
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

        getCustomerById();
    }, [endpoint]);

    return (
        <div className="customer-display-container">
            <div className="customer-display-filter">
                <form className="customer-display-form">
                    <section>
                        <InputField className="display-input-component"
                                    name="customer ID"
                                    label="Customer ID"
                                    inputType="text"
                                    value={object.idCustomer}
                                    readOnly={true}
                        />
                    </section>
                    <section>
                        <InputField className="display-input-component"
                                    ame="firstname"
                                    label="Firstname"
                                    inputType="text"
                                    value={object.firstName}
                                    readOnly={true}
                        />
                    </section>
                    <section>
                        <InputField className="display-input-component"
                                    name="lastname"
                                    label="Lastname"
                                    inputType="text"
                                    value={object.lastName}
                                    readOnly={true}
                        />
                    </section>
                    <section>
                        <InputField className="display-input-component"
                                    name="phonenumber"
                                    label="Telephone Number"
                                    inputType="text"
                                    value={object.phoneNumber}
                                    readOnly={true}
                        />
                    </section>
                    <section>
                        <InputField className="display-input-component"
                                    name="email"
                                    label="Email Address"
                                    inputType="text"
                                    value={object.email}
                                    readOnly={true}
                        />
                    </section>
                </form>

                <Button
                    buttonName="confirm-button"
                    buttonDescription="CONFIRM"
                    pathName="/home"
                    disabled={true}
                    buttonIcon={confirmIcon}
                />

            </div>
        </div>

    );
}

export default DisplayCustomerPage;