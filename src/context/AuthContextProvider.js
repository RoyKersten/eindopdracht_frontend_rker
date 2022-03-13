import React, {createContext, useContext, useEffect, useState} from 'react';
import {useHistory} from "react-router-dom";
import jwt_decode from "jwt-decode";
import axios from "axios";

export const AuthContext = createContext({});

export function useAuthContext() {
    return useContext(AuthContext)
}

function AuthContextProvider({children}) {

    const [authState, setAuthState] = useState({
        username: "",
        adminRole: false,
        status: "loading",
    });

    const history = useHistory();


    useEffect(() => {
        const token = localStorage.getItem('token');

        //1. is there a token available ? if not, open loginPage
        if (!token) {
            setAuthState({
                username: "",
                status: "login required"
            });
            history.push('/');
        }
        //2. if token available: check if the available token valid ? if yes open homePage
        else if (isTokenValid(token)) {
            const decodedToken = jwt_decode(token);
            setAuthState({
                username: decodedToken.sub,
                status: "token is valid"
            });
            getUserRolesByUsername(decodedToken.sub)              //check if user has admin role, if yes, access to admin environment via dropdown menu should be active
            history.push("/home");                          //open homepage
        }
        //3. in case token is not valid open loginPage, new login required.
        else if (!isTokenValid(token)) {
            setAuthState({
                username: "",
                status: "token is expired, new login required"
            });
            history.push('/')
        }
    }, [history]);

    function isTokenValid(token) {
        const decodedToken = jwt_decode(token)
        const expirationUnix = decodedToken.exp;
        const now = new Date().getTime();
        const currentUnix = Math.round(now / 1000);
        return expirationUnix - currentUnix > 0;
    }


    function login() {
        const token = localStorage.getItem('token');              //get token from local storage
        const decodedToken = jwt_decode(token);                        //decode bearer token to get username
        setAuthState({
            username: decodedToken.sub,
            adminRole: authState.adminRole,
            status: "user has access"
        });
        getUserRolesByUsername(decodedToken.sub);                     //check if user has admin_role, if yes, access to admin environment via dropdown menu should be active
        history.push("/home");                                  //open homepage
    }

    function logout(path) {
        localStorage.removeItem('token');                          //remove bearer token after logout to ensure that access is blocked and a new login needs to take place first
        setAuthState({
            username: "",
            adminRole: false,
            status: "login required"
        });
        history.push(path);                                             //return to login page
    }


    //get user roles and check if user has admin_role => only admin role should have access to admin environment via dropdown menu header
    async function getUserRolesByUsername(username) {
        try {
            const {data} = await axios.get(`http://localhost:8080/users/${username}/authorities`, {
                headers: {
                    "Content-type": "application/json",
                    Authorization: 'Bearer '
                        + localStorage.getItem('token'),
                },
            });
            for (let i = 0; i < data.length; i++) {
                if (data[i].authority === "ROLE_ADMIN") {
                    setAuthState({
                        username: username,
                        adminRole: true,
                        status: "user has admin_role"
                    });
                }
            }
        } catch (e) {
            if (e.response.status.toString() === "403") {
                console.error("message 403: user has no admin_role, no access to admin environment");
            }
        }
    }

    const dataContext = {
        ...authState,
        login: login,
        logout: logout,
        isTokenValid: isTokenValid,
    };

    return (
        <AuthContext.Provider value={dataContext}>
            {authState.status === 'loading'
                ? <p>Loading...</p>
                : children
            }
        </AuthContext.Provider>
    );
}

export default AuthContextProvider;
