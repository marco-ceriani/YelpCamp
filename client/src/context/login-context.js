import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const LoginContext = React.createContext({
    userId: '',
    username: '',
    avatar: '',
    fullname: null,
    login: (id, name) => { },
    logout: () => { },
});

const LoginContextProvider = (props) => {

    const [user, setUser] = useState(null);

    const loginHandler = useCallback((newInfo) => {
        setUser({
            id: newInfo.id,
            username: newInfo.username,
            fullname: newInfo.fullname,
            avatar: newInfo.avatar
        });
    }, [setUser]);

    const logoutHandler = useCallback(() => {
        axios.get('/rest/auth/logout')
            .then(setUser(null));
    }, []);

    const authCheck = useCallback(() => {
        return user != null;
    }, [user]);

    useEffect(() => {
        axios.get('/rest/auth/check')
            .then(resp => {
                loginHandler(resp.data);
            })
            .catch(err => {
                // ignore it
            })
    }, [loginHandler]);

    return (
        <LoginContext.Provider value={{
            userId: user ? user.id : '',
            username: user ? user.username : '',
            avatar: user && user.avatar,
            fullname: user && user.fullname,
            login: loginHandler,
            logout: logoutHandler,
            isAuthenticated: authCheck
        }}>
            {props.children}
        </LoginContext.Provider>
    );
}

export default LoginContextProvider;
