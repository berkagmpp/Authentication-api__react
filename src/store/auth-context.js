import React, { useState, useEffect, useCallback } from "react";

let logoutTimer;

const AuthContext = React.createContext({
    token: '',
    isLoggedIn: false,
    login: (token) => {},
    logout: () => {},

});

const calculateRemainingTime = (expirationTime) => {
    const currentTime = new Date().getTime();       // timestamp milliseconds
    const adjExpirationTime = new Date(expirationTime).getTime();     // convert passed expirationTime to a date obj (timestamp milliseconds)

    const remainingDuration = adjExpirationTime - currentTime;

    return remainingDuration;
};

const retrieveStoredToken = () => {
    const storedToken = localStorage.getItem('token');
    const storedExpirationDate = localStorage.getItem('expirationTime');

    const remainingTime = calculateRemainingTime(storedExpirationDate);

    if (remainingTime <= 60000) {   // if remainingTime is less then 60 seconds
        localStorage.removeItem('token');
        localStorage.removeItem('expirationTime');
        return null;
    };

    return {
        token: storedToken,
        duration: remainingTime
    };
};

export const AuthContextProvider = (props) => {
    const tokenData = retrieveStoredToken();
    let initialToken;
    if (tokenData) {
        initialToken = tokenData.token;
    };

    const [token, setToken] = useState(initialToken);

    const userIsLoggedIn = !!token;     // simply converts this truthy or falsy value
    // if token is true and string, return true

    const logoutHandler = useCallback(() => {
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('expirationTime');

        if (logoutTimer) {
            clearTimeout(logoutTimer);
        };
    }, []);     // don't need to add dependency here because :
    // 1. localStorage, clearTimeout is browser built-in fn, not specific
    // 2. setToken is state updating fn, so never change 
    // 3. logoutTimer is a global variable (outside of React rendering flow)

    const loginHandler = (token, expirationTime) => {
        setToken(token);
        localStorage.setItem('token', token);
        localStorage.setItem('expirationTime', expirationTime);

        const remainingTime = calculateRemainingTime(expirationTime);
        logoutTimer = setTimeout(logoutHandler, remainingTime);
    };

    useEffect(() => {
        if (tokenData) {
            logoutTimer = setTimeout(logoutHandler, tokenData.duration);
        }
    }, [tokenData, logoutHandler]);

    const contextValue = {
        token: token,
        isLoggedIn: userIsLoggedIn,
        login: loginHandler,
        logout: logoutHandler
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContext;