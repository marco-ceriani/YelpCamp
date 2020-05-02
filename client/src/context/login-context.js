import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const LoginContext = React.createContext({
    id: '',
    username: '',
    avatar: '',
    fullName: null,
    login: (username, password) => { },
    logout: () => { },
    isAuthenticated: () => { }
});

const LoginContextProvider = (props) => {

    const initialUser = localStorage.getItem('auth') || '{}';
    const [user, setUser] = useState(JSON.parse(initialUser));

    function setUserCached(userInfo) {
        if (userInfo && Object.keys(userInfo).length > 0) {
            setUser(userInfo);
            localStorage.setItem('auth', JSON.stringify(userInfo))
        } else {
            setUser({});
            localStorage.removeItem('auth');
        }
    }

    const loginHandler = useCallback(async ({ username, password }) => {
        const resp = await axios.post('/rest/auth/login', {
            username: username,
            password: password
        })
        setUserCached(resp.data)
        return resp.data;
    }, [setUser]);

    const registerHandler = useCallback(async (userInfo) => {
        const resp = await axios.post('/rest/auth/register', userInfo);
        setUserCached(resp.data)
    }, [setUser]);

    const logoutHandler = useCallback(async () => {
        await axios.get('/rest/auth/logout');
        setUserCached({})
    }, []);

    const isLogged = useCallback(() => {
        return user != null && Object.keys(user).length > 0;
    }, [user]);

    const isAuthenticated = useCallback(() => {
        return user != null && user.role === 'ADMIN';
    }, [user]);

    useEffect(() => {
        const doCheck = async () => {
            try {
                console.log('checking authentication state');
                const resp = await axios.get('/rest/auth/check');
                console.log('response:', resp);
                setUserCached(resp.data)
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    setUserCached({})
                } else {
                    console.log('error checking authentication state', error)
                }
            }
        }
        doCheck();
    }, [setUser]);

    return (
        <LoginContext.Provider value={{
            ...user,
            login: loginHandler,
            logout: logoutHandler,
            register: registerHandler,
            isAuthenticated: isLogged,
            isAdmin: isAuthenticated
        }}>
            {props.children}
        </LoginContext.Provider>
    );
}

export default LoginContextProvider;
