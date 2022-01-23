import InputField from "../../components/inputfield/InputField";
import './CreateServiceLinePage.css';
import {useParams} from "react-router-dom";
import Button from "../../components/button/Button";
import confirmIcon from "../../images/icons/confirm.png";
import React, {useEffect, useState} from "react";
import axios from "axios";


function CreateServiceLinePage() {

    const {id} = useParams()
    const {serviceType} = useParams();
    const [errorMessage, setErrorMessage] = useState("");
    const [endpoint, setEndpoint] = useState(`http://localhost:8080/services/${serviceType}/${id}`);
    const [endpointServiceLinePost, setEndpointServiceLinePost] = useState(`http://localhost:8080/servicelines`);
    const [objectService, setObjectService] = useState({
        idService: '',
        '@type': '',
        serviceStatus: '',
        serviceDate: '',
        customer: {idCustomer: ''},
        car: {idCar: ''},
        issuesFoundInspection: '',
        issuesToRepair: ''
    });


    const [postServiceLine, setPostServiceLine] = useState({
        service: {idService: '', '@type': ''},
        item: {idItem: '', '@type': ''},
        qty: '',
    });


    const [objectServiceLine, setObjectServiceLine] = useState({
        idServiceLine: '',
        service: {idService: '', '@type': ''},
        invoice: {idInvoice: ''},
        serviceLineNumber: '',
        item: {idItem: '', '@type': ''},
        itemName: '',
        qty: '',
        price: '',
        lineSubTotal: '',
        vatAmount: '',
        lineTotal: '',
        vatRate:''
    });


    useEffect(() => {
        async function getServiceById() {
            try {
                const {data} = await axios.get(endpoint, {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: 'Bearer ' + localStorage.getItem('token'),
                    },
                });
                setObjectService(data);
            } catch (e) {
                console.error(e);
            }
        }


        getServiceById();
    }, [endpoint]);


    //add serviceLine
    async function addServiceLine() {
        setPostServiceLine(postServiceLine.service.idService = objectService.idService);                            //Set idService in ServiceLine
        setPostServiceLine(postServiceLine.service['@type'] = objectService['@type']);                              //Set serviceType in Serviceline

        try {
            console.log(postServiceLine);
            const {data} = await axios.post(endpointServiceLinePost, postServiceLine, {
                headers: {
                    "Content-type": "application/json",
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                },
            });
            console.log(data);
            const indexOf = data.lastIndexOf("/") + 1;                           //determine new created idCar => last numbers after last /
            const id = (data.substring(indexOf,));                                     //capture idItem
            console.log(id);
            if (data !== null) {
                setErrorMessage("serviceline successfully created!");
            }

            await getServiceLineById(id);

        } catch (e) {
            console.error(e);
        }
    }

    //Get serviceLineById
    async function getServiceLineById(idServiceLine) {
        try {
            const {data} = await axios.get(`http://localhost:8080/servicelines/${idServiceLine}`, {
                headers: {
                    "Content-type": "application/json",
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                },
            });
            setObjectServiceLine(data);
        } catch (e) {
            console.error(e);
        }
    }


    //filter data based on itemType part or activity selection
    function onSelection(e) {
        const inputName = e.target.name;
        const inputValue = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

        if (inputName === "idItem") {
            postServiceLine.item.idItem = inputValue;
        } else if (inputName === "@type") {
           postServiceLine.item['@type'] = inputValue;
        } else if (inputName === "qty") {
            postServiceLine.qty = inputValue;
        }
    }


    function handleSubmit(e) {
        e.preventDefault();
        addServiceLine().then();
    }

    return (
        <div className="serviceline-create-container">
            <form className="serviceline-create-form" onSubmit={handleSubmit}>
                <div className="serviceline-create-section1">
                    <section>
                        <InputField className="create-serviceline-input-component-section1"
                                    name="idService"
                                    label="Service ID"
                                    inputType="text"
                                    value={objectService.idService}
                                    readOnly={true}
                        />
                    </section>
                    <section>
                        <InputField className="create-serviceline-input-component-section1"
                                    name="@type"
                                    label="Service Type"
                                    inputType="text"
                                    value={objectService['@type']}
                                    readOnly={true}
                        />
                    </section>
                    <section>
                        <InputField className="create-serviceline-input-component-section1"
                                    name="idServiceLine"
                                    label="ServiceLine ID"
                                    inputType="text"
                                    value={objectServiceLine.idServiceLine}
                                    readOnly={true}
                        />
                    </section>
                    <section>
                        <InputField className="create-serviceline-input-component-section1"
                                    name="serviceLineNumber"
                                    label="Service Line Number"
                                    inputType="text"
                                    value={objectServiceLine.serviceLineNumber}
                                    readOnly={true}
                        />
                    </section>
                    <section>
                        <InputField className="create-serviceline-input-component-section1"
                                    name="idInvoice"
                                    label="Invoice ID"
                                    inputType="text"
                                    value={objectServiceLine.invoice?.idInvoice === undefined ? '' : objectServiceLine.invoice.idInvoice}                     //When serviceline is not invoiced, invoice will be null and leads to error, by first checking error will be avoided                                                                 //retrieve from Param itemtype
                                    readOnly={true}
                        />
                    </section>


                </div>
                <div className="serviceline-create-section2">
                    <div className="serviceline-create-input-section2">
                        <div className="serviceline-create-div2">
                            <section>
                                <InputField className="create-serviceline-input-component"
                                            name="idItem"
                                            label="Item ID"
                                            inputType="text"
                                            readOnly={false}
                                            placeholder="please enter"
                                            changeHandler={onSelection}

                                />
                            </section>
                        </div>

                        <div className="serviceline-create-div3">
                            <section>
                                <InputField className="create-serviceline-input-component"
                                            name="@type"
                                            label="Item Type"
                                            inputType="text"
                                            list="itemTypeList"
                                            readOnly={false}
                                            placeholder="please select"
                                            onSelection={onSelection}

                                />
                            </section>

                            <datalist id="itemTypeList">
                                <option value="part">part</option>
                                <option value="activity">activity</option>
                            </datalist>

                        </div>
                    </div>

                    <section>
                        <InputField className="create-serviceline-input-component-section2"
                                    name="itemName"
                                    label="Item Name"
                                    inputType="text"
                                    value={objectServiceLine.itemName}
                                    readOnly={true}
                        />
                    </section>
                    <section>
                        <InputField className="create-serviceline-input-component-section2"
                                    name="qty"
                                    label="Item Qty."
                                    inputType="text"
                                    readOnly={false}
                                    changeHandler={onSelection}
                        />
                    </section>
                    <section>
                        <InputField className="create-serviceline-input-component-section2"
                                    name="price"
                                    label="Item Price"
                                    inputType="text"
                                    value={objectServiceLine.price}
                                    readOnly={true}
                        />
                    </section>
                    <section>
                        <InputField className="create-serviceline-input-component-section2"
                                    name="lineSubTotal"
                                    label="Subtotal"
                                    inputType="text"
                                    value={objectServiceLine.lineSubTotal}
                                    readOnly={true}
                        />
                    </section>
                    <section>
                        <InputField className="create-serviceline-input-component-section2"
                                    name="vatAmount"
                                    label="VAT Amount"
                                    inputType="text"
                                    value={objectServiceLine.vatAmount}
                                    readOnly={true}
                        />
                    </section>
                    <section>
                        <InputField className="create-serviceline-input-component-section2"
                                    name="lineTotal"
                                    label="Total Amount"
                                    inputType="text"
                                    value={objectServiceLine.lineTotal}
                                    readOnly={true}
                        />
                    </section>
                </div>
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
    );
}

export default CreateServiceLinePage;