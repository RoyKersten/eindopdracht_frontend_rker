import './CustomerPage.css';
import React, {useState} from 'react';
import InputField from "../../components/inputfield/InputField";
import Button from "../../components/button/Button";
import displayIcon from "../../images/icons/display.png";
import createIcon from "../../images/icons/create.png";
import changeIcon from "../../images/icons/change.png";
import deleteIcon from "../../images/icons/delete.png";

function CustomerPage() {

    const [formState, setFormState] = useState({
        customerId: '',
        lastname: '',
    })

    function handleFormChange(e) {
        const inputName = e.target.name;
        const inputValue = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

        setFormState({
            ...formState,
            [inputName]: inputValue,
        })
    }

    function handleSubmit(e) {
        e.preventDefault();
        console.log(formState);
    }

    return (
        <div className="customer-home-container">
            <div className="customer-home-filter">
                <form onSubmit={handleSubmit}>
                    <section>
                        <InputField name="customerId" label="Customer ID" inputType="text" value={formState.customerId}
                                    changeHandler={handleFormChange}/>
                    </section>
                    <section>
                        <InputField name="lastname" label="Lastname" inputType="text" value={formState.lastname}
                                    changeHandler={handleFormChange}/>
                    </section>
                </form>
            </div>
            <div className="customer-home-transaction-container">
                <div className="customer-home-display-container">
                    <table className="customer-home-header-table">
                        <thead className="customer-home-header-table">
                        <tr>
                            <th className="customer-home-table-header">ID</th>
                            <th className="customer-home-table-header">Firstname</th>
                            <th className="customer-home-table-header">Lastname</th>
                            <th className="customer-home-table-header">Email Address</th>
                            <th className="customer-home-table-header">Phone Number</th>
                        </tr>
                        </thead>
                        <tbody>
                        {/*// <!-- Hier komen de body-kolommen-->*/}
                        </tbody>
                    </table>


                </div>
                <div className="customer-home-buttons">
                    <Button
                        buttonName="customer-home-button"
                        buttonDescription="DISPLAY"
                        buttonMessage="/customers/display"
                        disabled={false}
                        buttonIcon={displayIcon}
                    />
                    <Button
                        buttonName="customer-home-button"
                        buttonDescription="CREATE"
                        buttonMessage="/customers/create"
                        disabled={false}
                        buttonIcon={createIcon}
                    />
                    <Button
                        buttonName="customer-home-button"
                        buttonDescription="CHANGE"
                        buttonMessage="/customers/change"
                        disabled={false}
                        buttonIcon={changeIcon}
                    />
                    <Button
                        buttonName="customer-home-button"
                        buttonDescription="DELETE"
                        buttonMessage="/customers/delete"
                        disabled={false}
                        buttonIcon={deleteIcon}
                    />
                </div>
            </div>
        </div>
    );
};

export default CustomerPage;