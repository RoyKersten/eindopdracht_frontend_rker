import InputField from "../../components/inputfield/InputField";
import './ChangeCustomerPage.css';
import React, {useState} from "react";
import Button from "../../components/button/Button";
import confirmIcon from "../../images/icons/confirm.png";
import axios from "axios";
import {useLocation} from "react-router-dom";


function ChangeCustomerPage() {

    const location = useLocation();
    let object = location.state;        //4. pick-up the selected object from location.state and show information in inputfields

    const [errorMessage, setErrorMessage] = useState( "");
    const [endpoint, setEndpoint] = useState("http://localhost:8080/customers/"+object.idCustomer);    //initial endpoint used to fetch all customers from database
    const [formState, setFormState] = useState({
        idCustomer: object.idCustomer,
        firstName: object.firstName,
        lastName: object.lastName,
        phoneNumber: object.phoneNumber,
        email: object.email,
    });

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
        <div className="customer-change-container">
            <div className="customer-change-filter">
                <form onSubmit={handleSubmit} className="customer-change-form">
                    <section>
                        <InputField className="change-input-component-customerId"
                                    name="customerId"
                                    label="Customer ID"
                                    inputType="text"
                                    value={formState.idCustomer}
                                    readOnly={true}
                        />
                    </section>
                    <section>
                        <InputField className="change-input-component"
                                    name="firstName"
                                    label="Firstname"
                                    inputType="text"
                                    readOnly={false}
                                    value={formState.firstName}
                                    changeHandler={handleClick}
                        />
                    </section>
                    <section>
                        <InputField className="change-input-component"
                                    name="lastName"
                                    label="Lastname"
                                    inputType="text"
                                    readOnly={false}
                                    value={formState.lastName}
                                    changeHandler={handleClick}
                        />
                    </section>
                    <section>
                        <InputField className="change-input-component"
                                    name="phoneNumber"
                                    label="Telephone Number"
                                    inputType="text"
                                    readOnly={false}
                                    value={formState.phoneNumber}
                                    changeHandler={handleClick}
                        />
                    </section>
                    <section>
                        <InputField className="change-input-component"
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
                {errorMessage && <p className="message-error">{errorMessage}</p>}
            </div>
        </div>

    );
}

export default ChangeCustomerPage;