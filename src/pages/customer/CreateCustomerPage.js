import InputField from "../../components/inputfield/InputField";
import './CreateCustomerPage.css';
import React, {useState} from "react";
import Button from "../../components/button/Button";
import confirmIcon from "../../images/icons/confirm.png";
import axios from "axios";

function CreateCustomerPage() {

    const [errorMessage, setErrorMessage] = useState("");
    const [endpoint, setEndpoint] = useState("http://localhost:8080/customers");    //initial endpoint used to fetch all customers from database
    const [formState, setFormState] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
    });

    async function addCustomers() {
        try {
            const {data} = await axios.post(endpoint, formState, {
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
        addCustomers().then();
    }

    return (
        <div className="customer-create-container">
            <div>
            <form onSubmit={handleSubmit} className="customer-create-form">
                <section>
                    <InputField className="create-input-component-customerId"
                                name="customerId"
                                label="Customer ID"
                                inputType="text"
                                readOnly={true}
                    />
                </section>
                <section>
                    <InputField className="create-input-component"
                                name="firstName"
                                label="Firstname"
                                inputType="text"
                                readOnly={false}
                                value={formState.firstName}
                                changeHandler={handleClick}
                    />
                </section>
                <section>
                    <InputField className="create-input-component"
                                name="lastName"
                                label="Lastname"
                                inputType="text"
                                readOnly={false}
                                value={formState.lastName}
                                changeHandler={handleClick}
                    />
                </section>
                <section>
                    <InputField className="create-input-component"
                                name="phoneNumber"
                                label="Telephone Number"
                                inputType="text"
                                readOnly={false}
                                value={formState.phoneNumber}
                                changeHandler={handleClick}
                    />
                </section>
                <section>
                    <InputField className="create-input-component"
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
            </form>
            </div>
           <div className="messages">
            {errorMessage && <p className="message-error">{errorMessage}</p>}
           </div>
        </div>
    );
}

export default CreateCustomerPage;