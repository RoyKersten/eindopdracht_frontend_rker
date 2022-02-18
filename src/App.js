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
import DisplayServicePage from "./pages/service/DisplayServicePage";
import CreateServicePage from "./pages/service/CreateServicePage";
import DisplayServiceLinePage from "./pages/serviceline/DisplayServiceLinePage";
import CreateServiceLinePage from "./pages/serviceline/CreateServiceLinePage";
import ChangeServicePage from "./pages/service/ChangeServicePage";
import ChangeServiceLinePage from "./pages/serviceline/ChangeServiceLinePage";
import InvoicePage from "./pages/invoice/InvoicePage";
import DisplayInvoicePage from "./pages/invoice/DisplayInvoicePage";
import CreateInvoicePage from "./pages/invoice/CreateInvoicePage";
import ChangeInvoicePage from "./pages/invoice/ChangeInvoicePage";
import ReportingPage from "./pages/Reporting/ReportingPage";
import AdminPage from "./pages/admin/AdminPage";
import DisplayUserPage from "./pages/admin/DisplayUserPage";
import CreateUserPage from "./pages/admin/CreateUserPage";
import ChangeUserPage from "./pages/admin/ChangeUserPage";
import UserRolesPage from "./pages/admin/UserRolesPage";
import ChangeUserPasswordPage from "./pages/user/ChangeUserPasswordPage";
import {useAuthContext} from "./context/AuthContextProvider";

function App() {
    const location = useLocation();                                     /*rendering of page to ensure Header is displayed after login (all other pages) */
    const {adminRole} = useAuthContext();                               //some pages are only allowed when user has the admin_role

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
                <Route exact path="/services/display/:serviceType/:id">
                    <DisplayServicePage/>
                </Route>
                <Route exact path="/services/create">
                    <CreateServicePage/>
                </Route>
                <Route exact path="/services/change/:serviceType/:id">
                    <ChangeServicePage/>
                </Route>
                <Route exact path="/servicelines/display/:id">
                    <DisplayServiceLinePage/>
                </Route>
                <Route exact path="/servicelines/create/:serviceType/:id">
                    <CreateServiceLinePage/>
                </Route>
                <Route exact path="/servicelines/change/:id">
                    <ChangeServiceLinePage/>
                </Route>
                <Route exact path="/invoices">
                    <InvoicePage/>
                </Route>
                <Route exact path="/invoices/display/:invoiceType/:id">
                    <DisplayInvoicePage/>
                </Route>
                <Route exact path="/invoices/create">
                    <CreateInvoicePage/>
                </Route>
                <Route exact path="/invoices/change/:invoiceType/:id">
                    <ChangeInvoicePage/>
                </Route>
                <Route exact path="/reporting">
                    <ReportingPage/>
                </Route>
                {adminRole && <Route exact path="/admin">
                    <AdminPage/>
                </Route>}
                {adminRole && <Route exact path="/user/display/:username">
                    <DisplayUserPage/>
                </Route>}
                {adminRole && <Route exact path="/user/create">
                    <CreateUserPage/>
                </Route>}
                {adminRole && <Route exact path="/user/change/:username">
                    <ChangeUserPage/>
                </Route>}
                {adminRole && <Route exact path="/user/authorization/:username">
                    <UserRolesPage/>
                </Route>}
                <Route exact path="/user/password/:username">
                    <ChangeUserPasswordPage/>
                </Route>
            </Switch>
            {(location.pathname !== "/" && location.pathname !== "/home") ? <Footer/> : null}
        </div>

    );
}

export default App;
