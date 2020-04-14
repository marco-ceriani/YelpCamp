import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const LoginContext = React.createContext({
    userId: '',
    username: '',
    avatar: '',
    login: (id, name) => { },
    logout: () => { },
});

const LoginContextProvider = (props) => {

    const [user, setUser] = useState(null);

    const loginHandler = (id, name, avatar) => {
        setUser({ id, name, avatar });
    }

    const logoutHandler = useCallback(() => {
        axios.get('/rest/auth/logout')
            .then(setUser(null));
    }, []);

    useEffect(() => {
        axios.get('/rest/auth/check')
            .then(resp => {
                const { id, fullname, avatar } = resp.data;
                loginHandler(id, fullname, avatar);
            })
            .catch(err => {
                // ignore it
            })
    }, []);

    return (
        <LoginContext.Provider value={{
            userId: user ? user.id : '',
            name: user ? user.name : '',
            avatar: user && user.avatar,
            login: loginHandler,
            logout: logoutHandler
        }}>
            {props.children}
        </LoginContext.Provider>
    );
}

export default LoginContextProvider;
