import React from "react";
import {useHistory} from "react-router-dom";

function Button({buttonName, disabled, pathName, buttonDescription, buttonIcon, onClick, buttonType}) {

    const history = useHistory();

    function openPage() {
        history.push({
            pathname: pathName,
       });
    }

    return (
        pathName==="" ?
        <button className={buttonName} disabled={disabled} type={buttonType}
             onClick={onClick} ><span>
            {buttonDescription} <p></p><img src={buttonIcon} alt="icon"/></span></button>
        :
        <button className={buttonName} disabled={disabled} type={buttonType}
                onClick={() => openPage()} ><span>
            {buttonDescription} <p></p><img src={buttonIcon} alt="icon"/></span></button>

    );
}

export default Button;