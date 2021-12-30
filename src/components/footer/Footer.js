import React from 'react';
import "./Footer.css";
import Button from "../button/Button";
import backIcon from "../../images/icons/back.png";

function Footer() {

    return (
        <footer className="footer-container">
            <Button
                buttonName="footer-back-button"
                buttonDescription="BACK"
                pathName="/home"
                disabled={false}
                buttonIcon={backIcon}
            />
        </footer>
    );
}

export default Footer;