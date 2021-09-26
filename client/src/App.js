import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import PrivateRoute from './hoc/PrivateRoute/PrivateRoute';

import Toolbar from './components/Navigation/Toolbar/Toolbar';
import Campgrounds from './containers/Campgrounds/Campgrounds';
import Campground from './containers/Campground/Campground';
import CampgroundEditor from './containers/Campground/CampgroundEditor/CampgroundEditor';
import LoginPage from './components/Auth/LoginPage/LoginPage';
import SignUpPage from './components/Auth/SignUpPage/SignUpPage';
import LogoutPage from './components/Auth/LogoutPage/LogoutPage';
import Account from './containers/Account/Account';
import Profile from './containers/Profile/Profile';
import Users from './containers/Users/Users';
import Page404 from './components/Navigation/Page404/Page404';

function App() {
  return (
    <>
      <Toolbar />
      <Switch>
        <Route path={["/", "/campgrounds"]} exact component={Campgrounds} />
        <Route path="/campgrounds/:id" exact component={Campground} />
        <PrivateRoute path="/campgrounds/:id/edit" exact component={CampgroundEditor} />
        <Route path="/login" component={LoginPage} />
        <Route path="/register" component={SignUpPage} />
        <Route path="/logout" component={LogoutPage} />
        <PrivateRoute path="/account" component={Account} />
        <Route path="/users/:user" component={Profile} />
        <PrivateRoute path="/users" exact component={Users} />
        <Route><Page404 /></Route>
      </Switch>
    </>
  );
}

export default withRouter(App);
