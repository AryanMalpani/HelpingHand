import React, { Component } from 'react';
import swal from 'sweetalert';
import { Button, TextField, Link } from '@material-ui/core';
import validator from 'validator' 
const axios = require('axios'); 



export default class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      confirm_password: '',
      role:'',
      fname:'',
      lname:'',
      age:'',
      email:'',
      phoneno:'' //tel

    };
  }
  validatePhoneNumber = (number) => {
    const isValidPhoneNumber = validator.isMobilePhone(number)
    return (isValidPhoneNumber)
  }
  validateEmail = (email) => {
    const isValidEmail = validator.isEmail(email)
    return (isValidEmail)
  }
  validatePass = (pass, cpass) => {
    const isValidPass = validator.equals(pass, cpass)
    return (isValidPass)
  }
  // validateAge = (Age) => {
  //   if(Age<0){
  //     return false
  //   }
  //   else if(typeof(Age)!== Number){
  //     return false
  //   }
  //   else{
  //     return true
  //   }
  // }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });
  
  register = () => {
    if(this.validatePhoneNumber(this.state.phoneno) && this.validateEmail(this.state.email) && this.validatePass(this.state.password, this.state.confirm_password)){
    
      // && this.validateAge(this.state.age)
    axios.post('http://localhost:2000/register', {
      username: this.state.username,
      password: this.state.password,
      role: this.state.role,
      fname:this.state.fname,
      lname:this.state.lname,
      age:this.state.age,
      email:this.state.email,
      phoneno:this.state.phoneno
    }).then((res) => {
      swal({
        text: res.data.title,
        icon: "success",
        type: "success"
      });
      this.props.history.push('/');
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
    });
  }
  else{
    if(!this.validatePhoneNumber(this.state.phoneno)){
      alert("Enter correct phone number")
    }
    if(!this.validateEmail(this.state.email)){
      alert("Enter correct email")
    }
    if(!this.validatePass(this.state.password, this.state.confirm_password)){
      alert("Password and Confirm password don't match")
    }
    // if(this.validateAge(this.state.age)===false){
    //   alert("Age entered is not valid")
    // }
    
  }
  }

  render() {
    return (
      <div style={{ marginTop: '200px' }}>
        <div>
          <h2>Register</h2>
        </div>

        <div>
          <TextField
            id="standard-basic"
            type="text"
            autoComplete="off"
            name="username"
            value={this.state.username}
            onChange={this.onChange}
            placeholder="User Name"
            required
          />
          <br /><br />
          <TextField
            id="standard-basic"
            type="text"
            autoComplete="off"
            name="fname"
            value={this.state.fname}
            onChange={this.onChange}
            placeholder="First Name"
            required
          />
          <br /><br />
          <TextField
            id="standard-basic"
            type="text"
            autoComplete="off"
            name="lname"
            value={this.state.lname}
            onChange={this.onChange}
            placeholder="Last Name"
            required
          />
          <TextField
            id="standard-basic"
            type="number"
            autoComplete="off"
            name="age"
            value={this.state.age}
            onChange={this.onChange}
            placeholder="Your Age"
            required
          />
          <br /><br />
          <TextField
            id="standard-basic"
            type="email"
            autoComplete="off"
            name="email"
            value={this.state.email}
            onChange={this.onChange}
            placeholder="Email"
            required
          />
          <br /><br />
          <TextField
            id="standard-basic"
            type="tel"
            autoComplete="off"
            name="phoneno"
            value={this.state.phoneno}
            onChange={this.onChange}
            placeholder="Phone Number"
            required
          />
          <br /><br />
          <TextField
            id="standard-basic"
            type="password"
            autoComplete="off"
            name="password"
            value={this.state.password}
            onChange={this.onChange}
            placeholder="Password"
            required
          />
          <br /><br />
          
          <TextField
            id="standard-basic"
            type="password"
            autoComplete="off"
            name="confirm_password"
            value={this.state.confirm_password}
            onChange={this.onChange}
            placeholder="Confirm Password"
            required
          />
          <select required name='role' id='selectList'
          onChange={this.onChange}
          type="number">
            <option value="" disabled selected hidden>
              Select role
            </option>
            <option value = "1">
              Seeker
            </option>
            <option value = "2">
              Helper
            </option>
          </select>
          <br /><br />
          <Button
            className="button_style"
            variant="contained"
            color="primary"
            size="small"
            disabled={this.state.username === '' && this.state.password === '' && this.state.role ===''}
            onClick={this.register}
          >
            Register
          </Button> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Link href="/">
            Login
          </Link>
        </div>
      </div>
    );
  }
}
