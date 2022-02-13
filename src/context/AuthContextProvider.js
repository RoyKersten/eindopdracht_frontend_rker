import React, {createContext, useContext, useEffect, useState} from 'react';
import {useHistory} from "react-router-dom";
import jwt_decode from "jwt-decode";

export const AuthContext = createContext({});

export function useAuthContext() {
    return useContext(AuthContext)
}

function AuthContextProvider({children}) {

    const [authState, setAuthState] = useState({
        username: "",
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
            console.log(isTokenValid(token))
            const decodedToken = jwt_decode(token);
            setAuthState({
                username: decodedToken.sub,
                status: "token is valid"
            });
            history.push('/home')
        }
        //3. in case token is not valid open loginPage, new login required.
        else if (!isTokenValid(token)) {
            setAuthState({
                username: "",
                status: "token is expired, new login required"
            });
            history.push('/')
        }
    }, []);


    function isTokenValid(token) {
        const decodedToken = jwt_decode(token)
        const expirationUnix = decodedToken.exp;
        const now = new Date().getTime();
        const currentUnix = Math.round(now / 1000);
        return expirationUnix - currentUnix > 0;
    }


    function login(bearer) {
        localStorage.setItem('token', bearer);                         //local storage to store bearer token
        const token = localStorage.getItem('token');              //get token from local storage
        const decodedToken = jwt_decode(token);                        //decode bearer token to get username
        setAuthState({
            username: decodedToken.sub,
            status: "user has access"
        });
        history.push('/home');                                  //open homepage
    }


    function logout(path) {
        localStorage.removeItem('token');                          //remove bearer token after logout to ensure that access is blocked and a new login needs to take place first
         setAuthState({
            username: "",
            status: "login required"
        });
        history.push(path);                                             //return to login page
    }

    const dataContext = {
        ...authState,
        login: login,
        logout: logout,
        isTokenValid: isTokenValid
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
