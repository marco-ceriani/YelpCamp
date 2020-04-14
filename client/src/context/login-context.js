import React, { useState } from 'react';

export const LoginContext = React.createContext({
    userId: '',
    username: '',
    login: (id, name) => { },
    logout: () => { },
});

const LoginContextProvider = (props) => {

    const [user, setUser] = useState(null);

    const loginHandler = (id, name) => {
        setUser({ id, name });
    }
    
    const logoutHandler = () => {
        setUser(null);
    }

    return (
        <LoginContext.Provider value={{
            userId: user ? user.id : '',
            name: user ? user.name : '',
            login: loginHandler,
            logout: logoutHandler
        }}>
            {props.children}
        </LoginContext.Provider>
    );
}

export default LoginContextProvider;
