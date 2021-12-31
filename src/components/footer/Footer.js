import React from 'react';
import "./Footer.css";
import Button from "../button/Button";
import backIcon from "../../images/icons/back.png";
import {useHistory} from "react-router-dom";

function Footer() {

    const history = useHistory();

    function pageBack() {
        history.goBack();
    }

    return (
        <footer className="footer-container">
            <Button
                buttonName="footer-back-button"
                buttonDescription="BACK"
                pathName=""
                onClick={() => pageBack()}
                disabled={false}
                buttonIcon={backIcon}
            />
        </footer>
    );
}

export default Footer;