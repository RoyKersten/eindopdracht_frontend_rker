import React, {useEffect, useState} from "react";
import "./TransactionTable.css";


function TransactionTable({tableContainerClassName, headerContainerClassName, dataInput, selectObject}) {

    //1. SelectObject => after selection of row the data will be sent to parent / page CustomerPage
    let key = [];
    let value = [];
    let hiddenHeaders = ["carPaper", "customer"]
    let hidden = false;

    const [header, setHeader] = useState(key);
    const [data, setData] = useState(value);
    const nestedObjectId = "idCustomer";

    useEffect(() => {
        async function headerData() {
            const keys = dataInput[0];
            const values = dataInput.sort((a, b) => a.idCar - b.idCar);                                          //sort values based on customer id
            try {
                if (keys) {
                    setHeader(Object.keys(keys));


                }
                setData(Object.values(values));

            } catch (e) {
                console.error(e);
            }
        }

        headerData().then();
    }, [dataInput]);

    //tabIndex (line 49) to ensure row can be highligthed after selection with focus in CSS
    return (
        <table className={tableContainerClassName}>
            <thead className={headerContainerClassName}>
            <tr >
                {header.map((loop, i) => (
                    <th key={i} > {header[i]}</th>
                ))}
            </tr>
            </thead>
            <tbody>
            {data.map((object, k) => (
                <tr key={k}  tabIndex={k} onClick={() => selectObject(object)}>
                    {header.map((loop, j) => (
                        <td key={j}>{Object.values(object)[j]?.[nestedObjectId] === undefined ? Object.values(object)[j] : Object.values(object)[j]?.[nestedObjectId]}</td>
                    ))}
                </tr>
            ))}

            </tbody>
        </table>
    );
}

export default TransactionTable;