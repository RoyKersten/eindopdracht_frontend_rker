import "./Header.css";
import headerLogo from "../../images/logo_car.png"
import menu from "../../images/icons/menu.png"
import home from "../../images/icons/home.png"
import {useHistory, useLocation} from "react-router-dom";
import {useAuthContext} from "../../context/AuthContextProvider";

function Header() {

    const {pathname} = useLocation();
    const history = useHistory();
    let headerTitle = pathname.split("/");
    const {logout} = useAuthContext();
    const {username} = useAuthContext();
    const {adminRole} = useAuthContext();


    function openPage(path) {
        if (path === "/") {
            logout(path);
        }
        history.push(path);
    }

    return (
        <header className="header-container" style={{background: pathname === "/home" ? '#5D779E' : '#98AFD3'}}>

            <div className="header-logo">
                <img src={headerLogo} className="logo" alt="car-logo"/>
                <h4 id="header-logo-text" style={{color: pathname === "/home" ? '#FFFFFF' : '#000000'}}>AUTOGARAGE
                    KERSTEN</h4>
            </div>

            <div className="page-name">
                {(headerTitle[1] + (headerTitle[2] === undefined ? '' : "-" + headerTitle[2])).toUpperCase()}
            </div>


            <div className="header-nav">
                {pathname !== "/home" ?
                    <input className="home-button" type="image" alt="home" src={home}
                           onClick={() => openPage("/home")}/> : null}

                <div className="dropdown">
                    <input className="menu-button" type="image" alt="menu" src={menu}
                           style={{filter: pathname === "/home" ? "invert(100%)" : "none"}}
                           onClick={() => ""}/>
                    <div className="dropdown-content">
                        <li onClick={() => openPage(`/user/password/${username}`)}>Change Password</li>
                        <li onClick={() => openPage("/")}>Logout</li>
                        {adminRole && <li onClick={() => openPage("/admin")}>Admin</li>}
                    </div>
                </div>
            </div>
        </header>
    )
        ;
}

export default Header;