import React, { Component } from 'react';
import {
  Button, TextField, Dialog, DialogActions, LinearProgress,
  DialogTitle, DialogContent, TableBody, Table,
  TableContainer, TableHead, TableRow, TableCell
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import swal from 'sweetalert';
import validator from 'validator' 
const axios = require('axios');

export default class AdminDash extends Component {
  constructor() {
    super();
    this.state = {
      token: '',
      openRequestModal: false,
      openRequestEditModal: false,
      id: '',
      fname:'',
      lname:'',
      age:'',
      email:'',
      username: '',
      password: '',
      phoneno:'',
      role:'',
      file: '',
      fileName: '',
      page: 1,
      search: '',
      users: [],
      pages: 0,
      loading: false
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
  
  componentDidMount = () => {
    let token = localStorage.getItem('token');
    if (!token) {
      this.props.history.push('/login');
    } else {
      this.setState({ token: token }, () => {
        this.getUser();
      });
    }
  }
  
  getUser = () => {
    
    this.setState({ loading: true });
    
    let data = '?';
    data = `${data}page=${this.state.page}`;
    if (this.state.search) {
      data = `${data}&search=${this.state.search}`;
    }
    axios.get(`http://localhost:2000/admin-get-user${data}`, {
    headers: {
      'token': this.state.token
    }
  }).then((res) => {
    this.setState({ loading: false, users: res.data.users, pages: res.data.pages });
  }).catch((err) => {
    swal({
      text: err.response.data.errorMessage,
      icon: "error",
      type: "error"
    });
    this.setState({ loading: false, users: [], pages: 0 },()=>{});
  });
}

deleteRequest = (id) => {
  axios.post('http://localhost:2000/delete-request', {
  id: id
}, {
  headers: {
    'Content-Type': 'application/json',
    'token': this.state.token
  }
}).then((res) => {
  
  swal({
    text: res.data.title,
    icon: "success",
    type: "success"
  });
  
  this.setState({ page: 1 }, () => {
    this.pageChange(null, 1);
  });
}).catch((err) => {
  swal({
    text: err.response.data.errorMessage,
    icon: "error",
    type: "error"
  });
});
}

pageChange = (e, page) => {
  this.setState({ page: page }, () => {
    this.getUser();
  });
}

logOut = () => {
  localStorage.setItem('token', null);
  this.props.history.push('/');
}

onChange = (e) => {
  if (e.target.files && e.target.files[0] && e.target.files[0].name) {
    this.setState({ fileName: e.target.files[0].name }, () => { });
  }
  this.setState({ [e.target.name]: e.target.value }, () => { });
  if (e.target.name == 'search') {
    this.setState({ page: 1 }, () => {
      this.getUser();
    });
  }
};

// addUser = () => {
//   // const fileInput = document.querySelector("#fileInput");
//   const file = new FormData();
//   file.append('fname', this.state.fanme);
//   file.append('lname', this.state.lname);
//   file.append('age', this.state.age);
//   file.append('email', this.state.email);
//   file.append('username', this.state.username);
//   file.append('password', this.state.password);
//   file.append('phoneno', this.state.phoneno);
//   // file.append('city', this.state.city);
//   file.append('role', this.state.role);

//   axios.post('http://localhost:2000/register', file, {
//     headers: {
//       'content-type': 'multipart/form-data',
//       'token': this.state.token
//     }
//   }).then((res) => {

//     swal({
//       text: res.data.username,
//       icon: "success",
//       type: "success"
//     });

//     this.handleRequestClose();
//     this.setState({ fname: '', lname: '', age: '', email: '', username: '', password: '', phoneno: '', /*city: '',*/ role: '', page: 1 }, () => {
//       this.getUser();
//     });
//   }).catch((err) => {
//     swal({
//       text: err.response.data.errorMessage,
//       icon: "error",
//       type: "error"
//     });
//     this.handleRequestClose();
//   });

// }

addUser = () => {
  if(this.validatePhoneNumber(this.state.phoneno) && this.validateEmail(this.state.email)){
    
    // && this.validateAge(this.state.age)
    axios.post('http://localhost:2000/register', {
    fname:this.state.fname,
    lname:this.state.lname,
    age:this.state.age,
    email:this.state.email,
    username: this.state.username,
    password: this.state.password,
    phoneno:this.state.phoneno,
    role: this.state.role
  }).then((res) => {
    swal({
      text: res.data.title,
      icon: "success",
      type: "success"
    });
    this.handleRequestClose();
    this.setState({ fname: '', lname: '', age: '', email: '', username: '', password: '', phoneno: '', /*city: '', */role: '', page: 1 }, () => {
      this.getUser();
    });
  }).catch((err) => {
    swal({
      text: err.response.data.errorMessage,
      icon: "error",
      type: "error"
    });
    this.handleRequestClose();
  });
}
else{
  if(!this.validatePhoneNumber(this.state.phoneno)){
    alert("Enter correct phone number")
  }
  if(!this.validateEmail(this.state.email)){
    alert("Enter correct email")
  }
  // if(this.validateAge(this.state.age)===false){
  //   alert("Age entered is not valid")
  // }
}
}

updateRequest = () => {
  // const fileInput = document.querySelector("#fileInput");
  const file = new FormData();
  file.append('id', this.state.id);
  // file.append('file', fileInput.files[0]);
  file.append('title', this.state.title);
  file.append('desc', this.state.desc);
  file.append('starttime', this.state.starttime);
  file.append('type', this.state.type);
  
  axios.post('http://localhost:2000/update-request', file, {
  headers: {
    'content-type': 'multipart/form-data',
    'token': this.state.token
  }
}).then((res) => {
  
  swal({
    text: res.data.title,
    icon: "success",
    type: "success"
  });
  
  this.handleRequestEditClose();
  this.setState({ title: '', desc: '', starttime: '', type: '', file: null }, () => {
    this.getUser();
  });
}).catch((err) => {
  swal({
    text: err.response.data.errorMessage,
    icon: "error",
    type: "error"
  });
  this.handleRequestEditClose();
});

}

handleRequestOpen = () => {
  this.setState({
    openRequestModal: true,
    id: '',
    title: '',
    desc: '',
    type: '',
    starttime: ''
  });
};

handleRequestClose = () => {
  this.setState({ openRequestModal: false });
};

handleRequestEditOpen = (data) => {
  this.setState({
    openRequestEditModal: true,
    id: data._id,
    title: data.title,
    desc: data.desc,
    type: data.type,
    starttime: data.starttime,
    // fileName: data.image
  });
};

handleRequestEditClose = () => {
  this.setState({ openRequestEditModal: false });
};

render() {
  return (
    <div>
    {this.state.loading && <LinearProgress size={40} />}
    <div>
    <h2>Users</h2>
    <Button
    className="button_style"
    variant="contained"
    color="primary"
    size="small"
    onClick={this.handleRequestOpen}
    >
    Add User
    </Button>
    <Button
    className="button_style"
    variant="contained"
    size="small"
    onClick={this.logOut}
    >
    Log Out
    </Button>
    </div>
    
    {/* Edit User */}
    <Dialog
    open={this.state.openRequestEditModal}
    onClose={this.handleRequestClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
    >
    <DialogTitle id="alert-dialog-title">Edit User</DialogTitle>
    <DialogContent>
    <TextField
    id="standard-basic"
    type="text"
    autoComplete="off"
    name="fname"
    value={this.state.fname}
    onChange={this.onChange}
    placeholder="First Name"
    // required
    /><br />
    <TextField
    id="standard-basic"
    type="text"
    autoComplete="off"
    name="lname"
    value={this.state.lname}
    onChange={this.onChange}
    placeholder="Last Name"
    // required
    /><br />
    <TextField
    id="standard-basic"
    type="number"
    autoComplete="off"
    name="age"
    value={this.state.age}
    onChange={this.onChange}
    placeholder="Age"
    // required
    /><br />
    <TextField
    id="standard-basic"
    type="text" // Type email kuch hota h kya?
    autoComplete="off"
    name="email"
    value={this.state.email}
    onChange={this.onChange}
    placeholder="Email"
    // required
    /><br />
    <TextField
    id="standard-basic"
    type="text"
    autoComplete="off"
    name="username"
    value={this.state.username}
    onChange={this.onChange}
    placeholder="Username"
    // required
    /><br />
    <TextField
    id="standard-basic"
    type="text" // text ya password type
    autoComplete="off"
    name="password"
    value={this.state.password}
    onChange={this.onChange}
    placeholder="Password"
    // required
    /><br />
    <TextField
    id="standard-basic"
    type="text"
    autoComplete="off"
    name="phoneno"
    value={this.state.phoneno}
    onChange={this.onChange}
    placeholder="Phone Number"
    // required
    /><br />
    <TextField
    id="standard-basic"
    type="text"
    autoComplete="off"
    name="city"
    value={this.state.city}
    onChange={this.onChange}
    placeholder="City"
    // required
    /><br />
    <TextField
    id="standard-basic"
    type="number"
    autoComplete="off"
    name="role"
    value={this.state.role}
    onChange={this.onChange}
    placeholder="Role"
    // required
    /><br /><br />
    </DialogContent>
    
    <DialogActions>
    <Button onClick={this.handleRequestEditClose} color="primary">
    Cancel
    </Button>
    <Button
    disabled={this.state.title == '' || this.state.desc == '' || this.state.starttime == '' || this.state.type == ''}
    onClick={(e) => this.updateRequest()} color="primary" autoFocus>
    Edit User
    </Button>
    </DialogActions>
    </Dialog>
    
    {/* Add User */}
    <Dialog
    open={this.state.openRequestModal}
    onClose={this.handleRequestClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
    >
    <DialogTitle id="alert-dialog-title">Add User</DialogTitle>
    <DialogContent>
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
    <br />
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
    <br />
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
    <br />
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
    <br />
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
    <br />
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
    <br />
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
    <select required name='role' id='selectList'
    onChange={this.onChange}
    type="number">
    <option value="" disabled selected hidden>
    Select role
    </option>
    <option value = "0">
    Admin
    </option>
    <option value = "1">
    Seeker
    </option>
    <option value = "2">
    Helper
    </option>
    </select>
    <br />
    {/* <Button
    variant="contained"
    component="label"
    > Upload
    <input
    id="standard-basic"
    type="file"
    accept="image/*"
    inputProps={{
      accept: "image/*"
    }}
    name="file"
    value={this.state.file}
    onChange={this.onChange}
    id="fileInput"
    placeholder="File"
    hidden
    required
    />
    </Button>&nbsp;
  {this.state.fileName} */}
  </DialogContent>
  
  <DialogActions>
  <Button onClick={this.handleRequestClose} color="primary">
  Cancel
  </Button>
  <Button
  disabled={this.state.fname == '' || this.state.lname == '' || this.state.age == '' || this.state.email == '' || this.state.username == '' || this.state.password == '' || this.state.phoneno == '' || this.state.role == ''}
  onClick={(e) => this.addUser()} color="primary" autoFocus>
  Add User
  </Button>
  </DialogActions>
  </Dialog>
  
  <br />
  
  <TableContainer>
  <TextField
  id="standard-basic"
  type="search"
  autoComplete="off"
  name="search"
  value={this.state.search}
  onChange={this.onChange}
  placeholder="Search by title"
  required
  />
  <Table aria-label="simple table">
  <TableHead>
  <TableRow>
  <TableCell align="center">Username</TableCell>
  <TableCell align="center">First Name</TableCell>
  <TableCell align="center">Last Name</TableCell>
  <TableCell align="center">Age</TableCell>
  <TableCell align="center">Email</TableCell>
  <TableCell align="center">Phone Number</TableCell>
  <TableCell align="center">City</TableCell>
  <TableCell align="center">Role</TableCell>
  <TableCell align="center">Action</TableCell>
  </TableRow>
  </TableHead>
  <TableBody>
  {this.state.users.map((row) => (
    <TableRow key={row.username}>
    {/* <TableCell align="center" component="th" scope="row">
    {row.title}
  </TableCell> */}
  {/* <TableCell align="center"><img src={`http://localhost:2000/${row.image}`} width="70" height="70" /></TableCell> */}
  <TableCell align="center">{row.username}</TableCell>
  <TableCell align="center">{row.fname}</TableCell>
  <TableCell align="center">{row.lname}</TableCell>
  <TableCell align="center">{row.age}</TableCell>
  <TableCell align="center">{row.email}</TableCell>
  <TableCell align="center">{row.phoneno}</TableCell>
  <TableCell align="center">{row.city}</TableCell>
  <TableCell align="center">{row.role}</TableCell>
  <TableCell align="center">
  <Button
  className="button_style"
  variant="outlined"
  color="primary"
  size="small"
  onClick={(e) => this.handleRequestEditOpen(row)}
  >
  Edit
  </Button>
  <Button
  className="button_style"
  variant="outlined"
  color="secondary"
  size="small"
  onClick={(e) => this.deleteRequest(row._id)}
  >
  Delete
  </Button>
  </TableCell>
  </TableRow>
  ))}
  </TableBody>
  </Table>
  <br />
  <Pagination count={this.state.pages} page={this.state.page} onChange={this.pageChange} color="primary" />
  </TableContainer>
  
  </div>
  );
}
}