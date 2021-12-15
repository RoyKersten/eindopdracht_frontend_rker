import React from "react";

function Button({buttonName, disabled, buttonMessage, buttonDescription, buttonIcon}) {
    return (
        <button className={buttonName} disabled={disabled} type="button"
                onClick={() => console.log({buttonMessage})}><span>
            {buttonDescription} <p></p><img src={buttonIcon} alt="icon"/></span></button>
    );
}

export default Button;