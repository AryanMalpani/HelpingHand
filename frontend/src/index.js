import React from 'react';
import ReactDOM from 'react-dom';
import { Switch, Redirect, Route } from 'react-router';
import { BrowserRouter, Link } from 'react-router-dom';

import Login from './Login';
import Register from './Register';
// import Dashboard from './SeekerDash';
import './Login.css';
import SeekerDash from './SeekerDash';
import VolunteerDash from './VolunteerDash';
import AdminDash from './AdminDash';

ReactDOM.render(
    <BrowserRouter>
        <Switch>
            <Route exact path='/' component={Login} />
            <Route exact path='/login' component={Login} />
            <Route exact path='/register' component={Register} />
            <Route path='/seekerdash' component={SeekerDash} />
            <Route path='/volunteerdash' component={VolunteerDash} />
            <Route path='/admindash' component={AdminDash} />
            {/* <Route component={NotFound}/> */}
        </Switch>
    </BrowserRouter>,
    document.getElementById('root')
);