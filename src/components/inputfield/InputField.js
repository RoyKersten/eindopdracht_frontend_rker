import React from 'react';

function InputField({className, name, inputType, label, value, changeHandler, onKeyPress, readOnly}) {
    return (
        <>
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
        </>
    );
}

export default InputField;