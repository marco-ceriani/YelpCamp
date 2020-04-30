import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const LoginContext = React.createContext({
    userId: '',
    username: '',
    avatar: '',
    fullname: null,
    login: (username, password) => { },
    logout: () => { },
    isAuthenticated: () => {}
});

const LoginContextProvider = (props) => {

    const [user, setUser] = useState(null);

    const setCurrentUserHandler = useCallback((newInfo) => {
        setUser({
            id: newInfo.id,
            username: newInfo.username,
            fullname: newInfo.fullname,
            avatar: newInfo.avatar
        });
    }, [setUser]);

    const loginHandler = useCallback(async ({username, password}) => {
        const resp = await axios.post('/rest/auth/login', {
            username: username,
            password: password
        })        
        const newInfo = resp.data;
        setUser({
            id: newInfo.id,
            username: newInfo.username,
            fullname: newInfo.fullname,
            avatar: newInfo.avatar
        })
        return newInfo;
    }, [setUser]);

    const logoutHandler = useCallback(() => {
        axios.get('/rest/auth/logout')
            .then(setUser(null));
    }, []);

    const isLogged = useCallback(() => {
        return user != null;
    }, [user]);

    useEffect(() => {
        axios.get('/rest/auth/check')
            .then(resp => {
                setCurrentUserHandler(resp.data);
            })
            .catch(err => {
                // ignore it
            })
    }, [setCurrentUserHandler]);

    return (
        <LoginContext.Provider value={{
            userId: user ? user.id : '',
            username: user ? user.username : '',
            avatar: user && user.avatar,
            fullname: user && user.fullname,
            setUser: setCurrentUserHandler,
            login: loginHandler,
            logout: logoutHandler,
            isAuthenticated: isLogged
        }}>
            {props.children}
        </LoginContext.Provider>
    );
}

export default LoginContextProvider;
