import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import PrivateRoute from './hoc/PrivateRoute/PrivateRoute';

import Toolbar from './components/Navigation/Toolbar/Toolbar';
import LandingPage from './components/LandingPage/LandingPage';
import Campgrounds from './containers/Campgrounds/Campgrounds';
import Campground from './containers/Campground/Campground';
import CampgroundEditor from './containers/Campground/CampgroundEditor/CampgroundEditor';
import LoginPage from './components/Auth/LoginPage/LoginPage';
import SignUpPage from './components/Auth/SignUpPage/SignUpPage';
import LogoutPage from './components/Auth/LogoutPage/LogoutPage';
import Profile from './containers/Profile/Profile';

function App() {
  return (
    <>
      <Toolbar />
      <Switch>
        <Route path="/campgrounds" exact component={Campgrounds} />
        <Route path="/campgrounds/:id" exact component={Campground} />
        <PrivateRoute path="/campgrounds/:id/edit" exact component={CampgroundEditor} />
        <Route path="/login" component={LoginPage} />
        <Route path="/register" component={SignUpPage} />
        <Route path="/logout" component={LogoutPage} />
        <PrivateRoute path="/profile" component={Profile} />
        <Route path="/users/:user" component={Profile} />
        <Route path="/" exact component={LandingPage} />
        <Route><div style={{textAlign: 'center', fontSize: '4rem', paddingTop: '30vh'}}>Page Not found</div></Route>
      </Switch>
    </>
  );
}

export default withRouter(App);
