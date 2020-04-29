import React, { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';

import { LoginContext } from '../../context/login-context';

const PrivateRoute = ({ component: Component, ...rest }) => {
    const authContext = useContext(LoginContext);

    return <Route {...rest}
        render={(props) => (
            (authContext && authContext.userId)
                ? <Component {...props} />
                : <Redirect to="/campgrounds" />
        )} />
}

export default PrivateRoute;
