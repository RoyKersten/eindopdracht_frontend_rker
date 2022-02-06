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

    console.log(checked);
    return (
        <>
            <div>
                <label htmlFor={`${name}-field`}>{label}</label>
                <input
                    className={className}
                    name={name}
                    id={id}
                    // id={`${name}-field`}         //initially used for carpaper upload, not used at the moment remove at final check when not needed
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