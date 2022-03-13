import React from 'react';
import "./InputField.css";

function InputField({
                        className,
                        name,
                        id,
                        inputType,
                        label,
                        value,
                        changeHandler,
                        onKeyPress,
                        readOnly,
                        placeholder,
                        list,
                        onSelection,
                        checked
                    }) {
    return (
        <>
            <div>
                <label htmlFor={`${name}-field`}>{label}</label>
                <input
                    className={className}
                    name={name}
                    id={id}
                    type={inputType}
                    value={value}
                    placeholder={placeholder}
                    onChange={changeHandler}        //used for form
                    onSelect={onSelection}
                    onKeyPress={onKeyPress}         //used for filters
                    readOnly={readOnly}
                    list={list}
                    checked={checked}
                />
            </div>
        </>
    );
}

export default InputField;