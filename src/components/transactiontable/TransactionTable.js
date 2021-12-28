import React, {useEffect, useState} from "react";

function TransactionTable({tableContainerClassName, headerContainerClassName, dataInput}) {

    let key = [];
    let value = [];

    const [header, setHeader] = useState(key);
    const [data, setData] = useState(value);

    useEffect(() => {
        async function headerData() {
            const keys = dataInput[0];
            const values = dataInput;
            try {
                if (keys) {
                    setHeader(Object.keys(keys));
                    console.log(keys);
                }
                setData(Object.values(values));
                console.log(values);

            } catch (e) {
                console.error(e);
            }
        }

        headerData().then();
    }, [dataInput]);


    return (
        <table className={tableContainerClassName}>
            <thead className={headerContainerClassName}>
            <tr>
                {header.map((loop, i) => (
                    <th key={i}>{header[i]}</th>
                ))}
            </tr>
            </thead>
            <tbody>
            {data.map((object, k) => (
                <tr key={k}>
                    {header.map((loop, j) => (
                        <td key={j}>{(Object.values(object)[j])}</td>
                    ))}
                </tr>
            ))}
            </tbody>
        </table>
    );
}

export default TransactionTable;