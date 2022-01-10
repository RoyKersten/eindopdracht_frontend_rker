import React from 'react';
import "./InputField.css";

function InputField({className, name, inputType, label, value, changeHandler, onKeyPress, readOnly, placeholder}) {
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
                placeholder={placeholder}
                onChange={changeHandler}        //used for form
                onKeyPress={onKeyPress}         //used for filters
                readOnly={readOnly}
            />
         </div>
        </>
    );
}

export default InputField;