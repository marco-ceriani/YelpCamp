import React, { useContext } from 'react';
import { Redirect, Route, useHistory } from 'react-router-dom';

import { LoginContext } from '../../context/login-context';

const PrivateRoute = ({ component: Component, ...rest }) => {
    const authContext = useContext(LoginContext);

    const { location } = useHistory();

    return <Route {...rest}
        render={(props) => {
            console.log(authContext)
            if (authContext && authContext.isAuthenticated()) {
                return <Component {...props} />
            }
            return <Redirect to={{
                pathname: "/login", state: { from: location }
            }} />
        }} />
}

export default PrivateRoute;
