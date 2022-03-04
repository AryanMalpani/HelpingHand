import React, { Component } from 'react';
import swal from 'sweetalert';
import { Button, TextField, Link } from '@material-ui/core';
import "./rldesign.css";
import ScriptTag from 'react-script-tag';

const axios = require('axios');
const bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);

const Demo = props => (
  <ScriptTag type="text/javascript" src="rldesign.js" />
  )


export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  login = () => {

    const pwd = bcrypt.hashSync(this.state.password, salt);

    axios.post('http://localhost:2000/login', {
      username: this.state.username,
      password: pwd,
    }).then((res) => {
      localStorage.setItem('token', res.data.token);
      // localStorage.setItem('user_id', res.data.id);
      // localStorage.setItem('role', res.data.role);
      console.log(res.data);
      // console.log(res.data.role);

      if (res.data.role == 0)
      {
        this.props.history.push('/admindash');
      }
      if (res.data.role == 1)
      {
        this.props.history.push('/seekerdash');
      }
      if (res.data.role == 2)
      {
        this.props.history.push('/volunteerdash');
      }
    }).catch((err) => {
      if (err.response && err.response.data && err.response.data.errorMessage) {
        swal({
          text: err.response.data.errorMessage,
          icon: "error",
          type: "error"
        });
      }
    });
  }

  

  render() {
    return (<>
      <section id="formHolder">

      <div className="row">

         
         <div className="col-sm-6 brand">
            <a href="#" className="logo">MR <span>.</span></a>

            <div className="heading">
               <h2>Marina</h2>
               <p>Your Right Choice</p>
            </div>

            <div className="success-msg">
               <p>Great! You are one of our members now</p>
               <a href="#" className="profile">Your Profile</a>
            </div>
         </div>
        {/*form box*/}
         <div className="col-sm-6 form">

         {/*<!-- Login Form -->*/}
            <div className="login form-peice switched">
               <form className="login-form" action="#" method="post">
                  <div className="form-group">
                     <label for="username">Username</label>
                     <input type="text" name="username" id="username" value={this.state.username}
                        onChange={this.onChange}
                        placeholder="User Name" autoComplete="off" required/>
                     </div>

                  <div className="form-group">
                     <label for="loginPassword">Password</label>
                     <input type="password" id="loginPassword" autoComplete="off"
                      name="password"
                      value={this.state.password}
                      onChange={this.onChange}
                      placeholder="Password" required/>
                     
                  </div>

                  <div className="CTA">
                     <button type="submit" value="Login" disabled={this.state.username == '' && this.state.password == ''}
                      onClick={this.login}>login</button>
                     <a href="/register" className="switch">I'm New</a>
                  </div>
               </form>
            </div>
            

          </div>
          </div>
          </section>
          
          </>
          )
        }}



      
          
          
            
          
          
        
    