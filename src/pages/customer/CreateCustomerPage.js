import InputField from "../../components/inputfield/InputField";
import './CustomerFormPage.css';
import React, {useState} from "react";
import Button from "../../components/button/Button";
import confirmIcon from "../../images/icons/confirm.png";
import axios from "axios";

function CreateCustomerPage() {

    const [errorMessage, setErrorMessage] = useState("");
    const [formState, setFormState] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
    });

    async function addCustomers() {
        try {
            const {data} = await axios.post(`http://localhost:8080/customers`, formState, {
                headers: {
                    "Content-type": "application/json",
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                },
            });
            if (data !== null) {
                setErrorMessage("customer successfully created!");
            }
            console.log(formState);
        } catch (e) {
            if (e.response.status.toString() === "403") {
                setErrorMessage("customer could not be created, you are not authorized!")
            } else if (e.response.status.toString() !== "403") {
                setErrorMessage("customer could not be created!")
            }
        }
    }

    function handleChange(e) {
        const inputName = e.target.name;
        const inputValue = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

        setFormState({
            ...formState,
            [inputName]: inputValue,
        })
    }

    function handleSubmit(e) {
        e.preventDefault();
        addCustomers().then();
    }

    return (
        <div className="customer-form-container">
            <div>
                <form className="customer-form">
                    <section>
                        <InputField className="customer-form-input-component"
                                    name="customerId"
                                    label="Customer ID"
                                    inputType="text"
                                    readOnly={true}
                        />
                    </section>
                    <section>
                        <InputField className="customer-form-input-component"
                                    name="firstName"
                                    label="Firstname"
                                    inputType="text"
                                    readOnly={false}
                                    value={formState.firstName}
                                    changeHandler={handleChange}
                        />
                    </section>
                    <section>
                        <InputField className="customer-form-input-component"
                                    name="lastName"
                                    label="Lastname"
                                    inputType="text"
                                    readOnly={false}
                                    value={formState.lastName}
                                    changeHandler={handleChange}
                        />
                    </section>
                    <section>
                        <InputField className="customer-form-input-component"
                                    name="phoneNumber"
                                    label="Telephone Number"
                                    inputType="text"
                                    readOnly={false}
                                    value={formState.phoneNumber}
                                    changeHandler={handleChange}
                        />
                    </section>
                    <section>
                        <InputField className="customer-form-input-component"
                                    name="email"
                                    label="Email Address"
                                    inputType="text"
                                    readOnly={false}
                                    value={formState.email}
                                    changeHandler={handleChange}
                        />
                    </section>
                    <Button
                        buttonName="confirm-button"
                        buttonDescription="CONFIRM"
                        buttonType="button"
                        onClick={(e) => {
                            handleSubmit(e)
                        }}
                        pathName=""
                        disabled={false}
                        buttonIcon={confirmIcon}
                    />
                    <div className="messages">
                        {errorMessage && <p className="message-error">{errorMessage}</p>}
                    </div>
                </form>
            </div>

        </div>
    );
}

export default CreateCustomerPage;