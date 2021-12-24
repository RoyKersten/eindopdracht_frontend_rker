import React from "react";
import {useHistory} from "react-router-dom";

function Button({buttonName, disabled, buttonMessage, buttonDescription, buttonIcon}) {

    const history = useHistory();

    function openPage() {
        history.push(buttonMessage);
    }

    return (
        // <button className={buttonName} disabled={disabled} type="button"
        //         onClick={() => console.log({buttonMessage})}><span>
        //     {buttonDescription} <p></p><img src={buttonIcon} alt="icon"/></span></button>
        <button className={buttonName} disabled={disabled} type="button"
                onClick={() => openPage()}><span>
            {buttonDescription} <p></p><img src={buttonIcon} alt="icon"/></span></button>

    );
}

export default Button;