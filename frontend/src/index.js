import React from "react";
import ReactDOM from "react-dom";
import { Switch, Redirect, Route } from "react-router";
import { BrowserRouter, Link } from "react-router-dom";

import Login from "./Login";
import Register from "./Register";
// import Dashboard from './SeekerDash';
import "./Login.css";
import SeekerDash from "./SeekerDash";
import SeekerAccepted from "./SeekerAccepted";
import SeekerDeleted from "./SeekerDeleted";
import SeekerHistory from "./SeekerHistory";
import VolunteerDash from "./VolunteerDash";
import AdminRequests from "./AdminRequests";
import AdminDash from "./AdminDash";
import VolunteerUpcoming from "./VolunteerUpcoming";
import VolunteerHistory from "./VolunteerHistory";
import Home from "./Home";

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/register" component={Register} />
      <Route exact path="/seekerdash" component={SeekerDash} />
      <Route exact path="/seekeraccepted" component={SeekerAccepted} />
      <Route exact path="/seekerdeleted" component={SeekerDeleted} />
      <Route exact path="/seekerhistory" component={SeekerHistory} />
      <Route exact path="/volunteerdash" component={VolunteerDash} />
      <Route exact path="/volunteerupcoming" component={VolunteerUpcoming} />
      <Route exact path="/volunteerhistory" component={VolunteerHistory} />
      <Route exact path="/adminrequests" component={AdminRequests} />
      <Route exact path="/admindash" component={AdminDash} />
      {/* <Route component={NotFound}/> */}
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);
