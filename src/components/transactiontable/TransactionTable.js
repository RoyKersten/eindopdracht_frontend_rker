import React, {useEffect, useState} from "react";
import "./TransactionTable.css";


function TransactionTable({tableContainerClassName, headerContainerClassName, dataInput, selectObject}) {

    //1. SelectObject => after selection of row the data will be sent to parent / page CustomerPage
    let key = [];
    let value = [];

    const [header, setHeader] = useState(key);
    const [data, setData] = useState(value);
    const [index, setIndex] = useState(0);
    const [nestedObjectId, setNestedObjectId] = useState(["", ""]);                      //takes ID of the nested object to display in the transaction table
    const [hiddenHeaders, setHiddenHeaders] = useState(["", ""]);                        //set which headers should be hidden from original object

    useEffect(() => {
        async function headerData() {
            const keys = dataInput[0];
            const values = dataInput;
            // const values = dataInput.sort((a, b) => a.idService - b.idService);                                          //sort values based on customer id
            try {
                if (keys) {
                    setHeader(Object.keys(keys));
                }
                setData(Object.values(values));
                determineIdentifierObject(keys);
            } catch (e) {
                console.error(e);
            }
        }



        headerData().then();
    }, [dataInput]);


    function determineIdentifierObject(keys) {
        if (keys) {
            const identifier = Object.keys(keys)[0];                                                                    //determine id key
            const objectIdentified = identifier.substring(2,).toLowerCase();                                            //extracts object name from primary id key
            console.log(objectIdentified)

            switch (objectIdentified) {
                case "customer":
                    setHiddenHeaders(["", "", ""]);                           //no headers to hide for customer
                    setNestedObjectId(["", ""]);                         //no nestedObjects for customerObject
                    break;
                case "car" :
                    setHiddenHeaders(["carPaper", "", ""]);                  //carPaper to hide for car
                    setNestedObjectId(["idCustomer", ""]);               //customer is a nested object within Car => take idCustomer to display in transaction table
                    console.log(hiddenHeaders);
                    break;
                case "item" :
                    setHiddenHeaders(["", "", ""]);                        //no headers to hide for item
                    setNestedObjectId(["", ""]);                       //customer is a nested object within Car => take idCustomer to display in transaction table
                    console.log(hiddenHeaders);
                    break;
                case "service" :
                    setHiddenHeaders(["", "", ""]);                           //no headers to hide for service
                    setNestedObjectId(["idCustomer", "idCar"]);           //customer and car are nested objects within service => take idCustomer and idCar to display in transaction table
                    console.log(hiddenHeaders);
                    break;
                case "serviceline" :
                    setHiddenHeaders(["idServiceLine", "vatAmount", "service"]);        //hide headers: idServiceLine, vatAmount and service for serviceline transaction table
                    setNestedObjectId(["idItem", "idService", "idInvoice"]);           //item, service and invoice are nested objects within serviceline => take idItem, idService and idInvoice to display in transaction table
                    console.log(hiddenHeaders);
                    break;

                default:
            }
        }
    }


    //tabIndex (line 49) to ensure row can be highligthed after selection with focus in CSS
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
                            hidden={(header[j] === hiddenHeaders[0] || header[j] === hiddenHeaders[1] || header[j] === hiddenHeaders[2])}>{Object.values(object)[j]?.[nestedObjectId[0]] === undefined && Object.values(object)[j]?.[nestedObjectId[1]] === undefined && Object.values(object)[j]?.[nestedObjectId[2]] === undefined ? Object.values(object)[j] : Object.values(object)[j]?.[nestedObjectId[0]] || Object.values(object)[j]?.[nestedObjectId[1]] || Object.values(object)[j]?.[nestedObjectId[2]]}</td>
                    ))}
                </tr>
            ))}
            </tbody>
        </table>
    );
}

export default TransactionTable;