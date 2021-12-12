import './App.css';
import {Route, Switch, useLocation} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";


function App() {
    const location = useLocation();                                     /*rendering of page to ensure Header is displayed after login (all other pages) */

    return (
        /*in case login page is displayed Header should not be shown*/
        <div>
            {location.pathname !== "/" ? <Header/> : null}
            {location.pathname !== "/" ? <Footer/> : null}
            <Switch>
                <Route exact path="/">
                    <LoginPage/>
                </Route>
                <Route exact path="/home">
                    <HomePage/>
                </Route>
            </Switch>
        </div>

    );
}

export default App;
