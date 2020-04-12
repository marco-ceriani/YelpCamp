import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';

import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Toolbar from './components/Navigation/Toolbar/Toolbar';
import LandingPage from './components/LandingPage/LandingPage';
import Campgrounds from './containers/Campgrounds/Campgrounds';

function App() {
  return (
    <>
      <Toolbar />
      <Switch>
        <Route path="/campgrounds" component={Campgrounds} />
        <Route path="/" exact component={LandingPage} />
        <Route><div style={{textAlign: 'center', fontSize: '4rem', paddingTop: '30vh'}}>Page Not found</div></Route>
      </Switch>
    </>
  );
}

export default withRouter(App);
