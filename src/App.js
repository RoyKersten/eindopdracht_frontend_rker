import './App.css';
import {Route, Switch, useLocation} from "react-router-dom";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import LoginPage from "./pages/loginpage/LoginPage";
import HomePage from "./pages/homepage/HomePage";


function App() {
    const location = useLocation();                                     /*rendering of page to ensure Header is displayed after login (all other pages) */

    return (
        /*in case login page is displayed Header should not be shown*/
        <div className="page-container">
            {location.pathname !== "/" ? <Header/> : null}
            <div className="content">
                <Switch>
                    <Route exact path="/">
                        <LoginPage/>
                    </Route>
                    <Route exact path="/home">
                        <HomePage/>
                    </Route>
                </Switch>
            </div>
            {(location.pathname !== "/" && location.pathname !== "/home") ? <Footer/> : null}
        </div>

    );
}

export default App;
