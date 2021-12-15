import React from 'react';
import "./Header.css";
import headerLogo from "../../images/logo_car.png"

function Header() {

    return (
        <div className="header-container">
            <img src={headerLogo} className="logo" alt="car-logo"/>
            <h4 id="header-logo-text">AUTOGARAGE KERSTEN</h4>
        </div>

    );
}

export default Header;