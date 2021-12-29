import React from 'react';

function InputField({name, inputType, label, value, changeHandler, onKeyPress}) {
    return (
        <>
            <label htmlFor={`${name}-field`}>{label}</label>
            <input
                name={name}
                id={`${name}-field`}
                type={inputType}
                value={value}
                onChange={onKeyPress}
                onKeyPress={onKeyPress}

            />
        </>
    );
}

export default InputField;