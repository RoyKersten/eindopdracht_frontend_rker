import React from 'react';
import "./HomePage.css";
import Button from "../../components/button/Button";
import "../../components/button/Button.css";
import account_box from "../../images/icons/account_box.png";
import car_box from "../../images/icons/car_repair.png";
import list_box from "../../images/icons/list.png";
import directions_box from "../../images/icons/directions_car.png";
import euro_box from "../../images/icons/euro_symbol.png";
import miscellaneous_box from "../../images/icons/miscellaneous_services.png";

function HomePage() {
    return (
        <div className="homepage-container">
            <div className="homepage-content-container">
                <div>
                    <Button
                        buttonName="homepage-button"
                        buttonDescription="CUSTOMERS"
                        buttonMessage="/customers"
                        disabled={false}
                        buttonIcon={account_box}
                    />
                    <Button
                        buttonName="homepage-button"
                        buttonDescription="CARS"
                        buttonMessage="car-button-clicked"
                        disabled={false}
                        buttonIcon={directions_box}
                    />
                    <Button
                        buttonName="homepage-button"
                        buttonDescription="ITEMS"
                        buttonMessage="item-button-clicked"
                        disabled={false}
                        buttonIcon={miscellaneous_box}
                    />
                </div>
                <div>
                    <Button
                        buttonName="homepage-button"
                        buttonDescription="SERVICE"
                        buttonMessage="service-button-clicked"
                        disabled={false}
                        buttonIcon={car_box}
                    />
                    <Button
                        buttonName="homepage-button"
                        buttonDescription="INVOICE"
                        buttonMessage="invoice-button-clicked"
                        disabled={false}
                        buttonIcon={euro_box}
                    />
                    <Button
                        buttonName="homepage-button"
                        buttonDescription="REPORTING"
                        buttonMessage="reporting-button-clicked"
                        disabled={false}
                        buttonIcon={list_box}
                    />
                </div>
            </div>
        </div>
    );
}

export default HomePage;