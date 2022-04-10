import React from 'react';
import ReactDOM from 'react-dom';
import { Switch, Redirect, Route } from 'react-router';
import { BrowserRouter, Link } from 'react-router-dom';

import Login from './Login';
import Register from './Register';
// import Dashboard from './SeekerDash';
import './Login.css';
import SeekerDash from './SeekerDash';
import SeekerAccepted from './SeekerAccepted';
import SeekerDeleted from './SeekerDeleted';
import SeekerHistory from './SeekerHistory';
import VolunteerDash from './VolunteerDash';
import AdminRequests from './AdminRequests';
import AdminDash from './AdminDash';
import VolunteerUpcoming from './VolunteerUpcoming';
import VolunteerCompleted from './VolunteerCompleted';
import VolunteerHistory from './VolunteerHistory';

ReactDOM.render(
    <BrowserRouter>
        <Switch>
            <Route exact path='/' component={Login} />
            <Route exact path='/login' component={Login} />
            <Route exact path='/register' component={Register} />
            <Route path='/seekerdash' component={SeekerDash} />
            <Route path='/seekeraccepted' component={SeekerAccepted} />
            <Route path='/seekerdeleted' component={SeekerDeleted} />
            <Route path='/seekerhistory' component={SeekerHistory} />
            <Route path='/volunteerdash' component={VolunteerDash} />
            <Route path='/volunteerupcoming' component={VolunteerUpcoming} />
            <Route path='/volunteercompleted' component={VolunteerCompleted} />
            <Route path='/volunteerhistory' component={VolunteerHistory} />
            <Route path='/adminrequests' component={AdminRequests} />
            <Route path='/admindash' component={AdminDash} />
            {/* <Route component={NotFound}/> */}
        </Switch>
    </BrowserRouter>,
    document.getElementById('root')
);