import './App.css';
import {Route, Switch, useLocation} from "react-router-dom";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import LoginPage from "./pages/loginpage/LoginPage";
import HomePage from "./pages/homepage/HomePage";
import CustomerPage from "./pages/customer/CustomerPage";
import DisplayCustomerPage from "./pages/customer/DisplayCustomerPage";
import CreateCustomerPage from "./pages/customer/CreateCustomerPage";
import ChangeCustomerPage from "./pages/customer/ChangeCustomerPage";
import CarPage from "./pages/car/CarPage";
import DisplayCarPage from "./pages/car/DisplayCarPage";
import CreateCarPage from "./pages/car/CreateCarPage";
import ChangeCarPage from "./pages/car/ChangeCarPage";
import ItemPage from "./pages/item/ItemPage";
import DisplayItemPage from "./pages/item/DisplayItemPage";
import CreateItemPage from "./pages/item/CreateItemPage";
import ChangeItemPage from "./pages/item/ChangeItemPage";
import ServicePage from "./pages/service/ServicePage";

function App() {
    const location = useLocation();                                     /*rendering of page to ensure Header is displayed after login (all other pages) */

    return (
        /*in case login page is displayed Header should not be shown*/
        <div className="page">
            {location.pathname !== "/" ? <Header/> : null}
            <Switch>
                <Route exact path="/">
                    <LoginPage/>
                </Route>
                <Route exact path="/home">
                    <HomePage/>
                </Route>
                <Route exact path="/customers">
                    <CustomerPage/>
                </Route>
                <Route exact path="/customers/display/:id">
                    <DisplayCustomerPage/>
                </Route>
                <Route exact path="/customers/create/">
                    <CreateCustomerPage/>
                </Route>
                <Route exact path="/customers/change/:id">
                    <ChangeCustomerPage/>
                </Route>

                <Route exact path="/cars">
                    <CarPage/>
                </Route>
                <Route exact path="/cars/display/:id">
                    <DisplayCarPage/>
                </Route>
                <Route exact path="/cars/create/">
                    <CreateCarPage/>
                </Route>
                <Route exact path="/cars/change/:id">
                    <ChangeCarPage/>
                </Route>
                <Route exact path="/items">
                    <ItemPage/>
                </Route>
                <Route exact path="/items/display/:itemType/:id">
                    <DisplayItemPage/>
                </Route>
                <Route exact path="/items/create/:itemType">
                    <CreateItemPage/>
                </Route>
                <Route exact path="/items/change/:itemType/:id">
                    <ChangeItemPage/>
                </Route>
                <Route exact path="/services">
                    <ServicePage/>
                </Route>
            </Switch>
            {(location.pathname !== "/" && location.pathname !== "/home") ? <Footer/> : null}
        </div>

    );
}

export default App;
