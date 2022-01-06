import React from 'react';
import "./InputField.css";

function InputField({className, name, inputType, label, value, changeHandler, onKeyPress, readOnly}) {
    return (
        <>
         <div>
            <label htmlFor={`${name}-field`}>{label}</label>
            <input
                className={className}
                name={name}
                id={`${name}-field`}
                type={inputType}
                value={value}
                onChange={changeHandler}        //used for form
                onKeyPress={onKeyPress}         //used for filters
                readOnly={readOnly}
            />
         </div>
        </>
    );
}

export default InputField;