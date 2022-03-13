import React, {useEffect, useState} from "react";
import "./TransactionTable.css";


function TransactionTable({tableContainerClassName, headerContainerClassName, dataInput, selectObject}) {

    //1. SelectObject => after selection of row the data will be sent to parent / page CustomerPage
    let key = [];
    let value = [];
    const [header, setHeader] = useState(key);
    const [data, setData] = useState(value);
    const [nestedObjectId, setNestedObjectId] = useState(["", ""]);                      //takes ID of the nested object to display in the transaction table
    const [hiddenHeaders, setHiddenHeaders] = useState(["", ""]);                        //set which headers should be hidden from original object

    useEffect(() => {
        let id = '';
        let values = '';

        async function headerData() {
            const keys = dataInput[0];

            //Sort object on id number
            if (keys) {
                id = Object.keys(keys)[0]
                values = dataInput.sort((a, b) => a[id] - b[id]);                                          //sort values based on id
            }

            //In case user authorities information requested, delete authorities from values
            for (let i = 0; i < values.length; i++) {
                delete values[i].authorities;
            }

            try {
                if (keys) {
                    setHeader(Object.keys(keys));                       //in case of all other objects
                }
                setData(Object.values(values));
                determineIdentifierObject(keys);
            } catch (e) {
                console.error(e);
            }
        }

        headerData().then();
    }, [dataInput]);


    //TransactionTable Component works for all objects in this application.
    //Per object can be determined if certain information needs to be hidden (hiddenHeaders).
    //Per object needs to be defined if the object contains nested objects (nestedObjectId).
    //Settings can be done below.
    function determineIdentifierObject(keys) {
        if (keys) {
            const identifier = Object.keys(keys)[0];                                                                    //determine id key
            const objectIdentified = identifier.substring(2,).toLowerCase();                                            //extracts object name from primary id key

            switch (objectIdentified) {
                case "customer":
                    setHiddenHeaders(["", "", ""]);                           //no headers to hide for customer in transaction table
                    setNestedObjectId(["", ""]);                              //no nestedObjects for customerObject
                    break;
                case "car" :
                    setHiddenHeaders(["carPaper", "", ""]);                  //carPaper to hide for car in transaction table
                    setNestedObjectId(["idCustomer", ""]);                   //customer is a nested object within Car => take idCustomer to display in transaction table
                    break;
                case "item" :
                    setHiddenHeaders(["", "", ""]);                          //no headers to hide for item in transaction table
                    setNestedObjectId(["", ""]);                             //customer is a nested object within Car => take idCustomer to display in transaction table
                    break;
                case "service" :
                    setHiddenHeaders(["", "", ""]);                              //no headers to hide for service in transaction table
                    setNestedObjectId(["idCustomer", "idCar"]);                  //customer and car are nested objects within service => take idCustomer and idCar to display in transaction table
                    break;
                case "serviceline" :
                    setHiddenHeaders(["idServiceLine", "vatAmount", "service"]);        //hide headers: idServiceLine, vatAmount and service for serviceline in transaction table
                    setNestedObjectId(["idItem", "idService", "idInvoice"]);           //item, service and invoice are nested objects within serviceline => take idItem, idService and idInvoice to display in transaction table
                    break;
                case "invoice" :
                    setHiddenHeaders(["pathName", "", ""]);                            //hide header: pathName for invoice in transaction table
                    setNestedObjectId(["idCustomer", "idService"]);                    //customer and service are nested objects within invoice => take idCustomer and idService to display in transaction table
                    break;
                default:
            }
        }
    }

    //tabIndex={k} in line 100 ensures row will be highlighted after selection with focus in CSS
    return (
        <table className={tableContainerClassName}>
            <thead className={headerContainerClassName}>
            <tr>
                {header.map((loop, i) => (
                    <th key={i}
                        hidden={(header[i] === hiddenHeaders[0] || header[i] === hiddenHeaders[1] || header[i] === hiddenHeaders[2])}> {header[i]}</th>
                ))}
            </tr>
            </thead>
            <tbody>
            {data.map((object, k) => (
                <tr key={k} tabIndex={k} onClick={() => selectObject(object)}>
                    {header.map((loop, j) => (
                        <td key={j}
                            hidden={(header[j] === hiddenHeaders[0] || header[j] === hiddenHeaders[1] || header[j] === hiddenHeaders[2])}>{Object.values(object)[j]?.[nestedObjectId[0]] === undefined && Object.values(object)[j]?.[nestedObjectId[1]] === undefined && Object.values(object)[j]?.[nestedObjectId[2]] === undefined ? Object.values(object)[j]?.toString() : Object.values(object)[j]?.[nestedObjectId[0]] || Object.values(object)[j]?.[nestedObjectId[1]] || Object.values(object)[j]?.[nestedObjectId[2]]}</td>
                    ))}
                </tr>
            ))}
            </tbody>
        </table>
    );
}

export default TransactionTable;