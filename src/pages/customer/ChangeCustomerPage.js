import InputField from "../../components/inputfield/InputField";
import './CustomerFormPage.css';
import React, {useEffect, useState} from "react";
import Button from "../../components/button/Button";
import confirmIcon from "../../images/icons/confirm.png";
import axios from "axios";
import {useParams} from "react-router-dom";


function ChangeCustomerPage() {

    const {id} = useParams()
    const [errorMessage, setErrorMessage] = useState("");
    const [endpoint, setEndpoint] = useState(`http://localhost:8080/customers/${id}`);    //initial endpoint used to fetch all customers from database
    const [formState, setFormState] = useState({
        idCustomer: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
    });

    useEffect(() => {
        async function getCustomerById() {
            try {
                const {data} = await axios.get(endpoint, {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: 'Bearer ' + localStorage.getItem('token'),
                    },
                });
                setFormState(data);
            } catch (e) {
                console.error(e);
            }
        }

        getCustomerById();
    }, [endpoint]);


    async function changeCustomers() {
        try {
            const {data} = await axios.put(endpoint, formState, {
                headers: {
                    "Content-type": "application/json",
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                },
            });
            setErrorMessage("customer successfully updated!");
            console.log(formState);
        } catch (e) {
            console.error(e);
        }
    }

    function handleClick(e) {
        const inputName = e.target.name;
        const inputValue = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

        setFormState({
            ...formState,
            [inputName]: inputValue,
        })
    }

    function handleSubmit(e) {
        e.preventDefault();
        changeCustomers().then();
    }


    return (
        <div className="customer-form-container">
            <form onSubmit={handleSubmit} className="customer-form">
                <section>
                    <InputField className="form-input-component"
                                name="customerId"
                                label="Customer ID"
                                inputType="text"
                                value={formState.idCustomer}
                                readOnly={true}
                    />
                </section>
                <section>
                    <InputField className="form-input-component"
                                name="firstName"
                                label="Firstname"
                                inputType="text"
                                readOnly={false}
                                value={formState.firstName}
                                changeHandler={handleClick}
                    />
                </section>
                <section>
                    <InputField className="form-input-component"
                                name="lastName"
                                label="Lastname"
                                inputType="text"
                                readOnly={false}
                                value={formState.lastName}
                                changeHandler={handleClick}
                    />
                </section>
                <section>
                    <InputField className="form-input-component"
                                name="phoneNumber"
                                label="Telephone Number"
                                inputType="text"
                                readOnly={false}
                                value={formState.phoneNumber}
                                changeHandler={handleClick}
                    />
                </section>
                <section>
                    <InputField className="form-input-component"
                                name="email"
                                label="Email Address"
                                inputType="text"
                                readOnly={false}
                                value={formState.email}
                                changeHandler={handleClick}
                    />
                </section>
                <Button
                    buttonName="confirm-button"
                    buttonDescription="CONFIRM"
                    buttonType="submit"
                    pathName=""
                    disabled={false}
                    buttonIcon={confirmIcon}
                />
                <div className="messages">
                    {errorMessage && <p className="message-error">{errorMessage}</p>}
                </div>
            </form>

        </div>

    );
}

export default ChangeCustomerPage;