import React, { Component } from 'react';
import {
  Button, TextField, Dialog, DialogActions, LinearProgress,
  DialogTitle, DialogContent, TableBody, Table,
  TableContainer, TableHead, TableRow, TableCell
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import swal from 'sweetalert';
const axios = require('axios');

export default class SeekerDash extends Component {
  constructor() {
    super();
    this.state = {
      token: '',
      openRequestModal: false,
      openRequestEditModal: false,
      id: '',
      title: '',
      desc: '',
      type: '',
      type_id: '',
      starttime: '',
      file: '',
      fileName: '',
      page: 1,
      search: '',
      requests: [],
      types: [],
      pages: 0,
      loading: false
    };
  }

  componentDidMount = () => {
    let token = localStorage.getItem('token');
    if (!token) {
      this.props.history.push('/login');
    } else {
      this.setState({ token: token }, () => {
        this.getRequest();
      });
    }
  }

  getRequest = () => {
    
    this.setState({ loading: true });

    

    let data = '?';
    data = `${data}page=${this.state.page}`;
    if (this.state.search) {
      data = `${data}&search=${this.state.search}`;
    }
    axios.get(`http://localhost:2000/seeker-get-unaccepted-request${data}`, {
      headers: {
        'token': this.state.token
      }
    }).then((res) => {
      // console.log(res.data.types[0].typename)
      this.setState({ loading: false, requests: res.data.requests, types: res.data.types, pages: res.data.pages });
      // console.log(this.state.types[0]._id)
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
      this.setState({ loading: false, requests: [], pages: 0 },()=>{});
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
      this.getRequest();
    });
  }

  logOut = () => {
    localStorage.setItem('token', null);
    this.props.history.push('/');
  }

  onChange = (e) => {
    
    // if (e.target.files && e.target.files[0] && e.target.files[0].name) {
    //   this.setState({ fileName: e.target.files[0].name }, () => { });
    // }
    this.setState({ [e.target.name]: e.target.value }, () => { });
    console.log(this.state.type_id)
    if (e.target.name == 'search') {
      this.setState({ page: 1 }, () => {
        this.getRequest();
      });
    }
  };

  addRequest = () => {
    // const fileInput = document.querySelector("#fileInput");
    const file = new FormData();
    // file.append('file', fileInput.files[0]);
    file.append('title', this.state.title);
    file.append('desc', this.state.desc);
    file.append('starttime', this.state.starttime);
    file.append('type_id', this.state.type_id);

    axios.post('http://localhost:2000/add-request', file, {
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

      this.handleRequestClose();
      this.setState({ title: '', desc: '', starttime: '', type_id: '', page: 1 }, () => {
        this.getRequest();
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

  updateRequest = () => {
    // const fileInput = document.querySelector("#fileInput");
    const file = new FormData();
    file.append('id', this.state.id);
    // file.append('file', fileInput.files[0]);
    file.append('title', this.state.title);
    file.append('desc', this.state.desc);
    file.append('starttime', this.state.starttime);
    file.append('type_id', this.state.type_id);

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
      this.setState({ title: '', desc: '', starttime: '', type_id: ''}, () => {
        this.getRequest();
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
      type_id: '',
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
      type_id: data.type_id._id,
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
          <h2>Seeker Dashboard</h2>
          <Button
            className="button_style"
            variant="contained"
            color="primary"
            size="small"
            onClick={this.handleRequestOpen}
          >
            Add Request
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

        {/* Edit Request */}
        <Dialog
          open={this.state.openRequestEditModal}
          onClose={this.handleRequestClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Edit Request</DialogTitle>
          <DialogContent>
            <TextField
              id="standard-basic"
              type="text"
              autoComplete="off"
              name="title"
              value={this.state.title}
              onChange={this.onChange}
              placeholder="Request title"
              required
            /><br />
            <TextField
              id="standard-basic"
              type="text"
              autoComplete="off"
              name="desc"
              value={this.state.desc}
              onChange={this.onChange}
              placeholder="Description"
              required
            /><br />
            {/* <TextField
              id="standard-basic"
              type="number"
              autoComplete="off"
              name="price"
              value={this.state.price}
              onChange={this.onChange}
              placeholder="Price"
              required
            /><br /> */}
            {/* <TextField
              id="standard-basic"
              type="text"
              autoComplete="off"
              name="type"
              value={this.state.type}
              onChange={this.onChange}
              placeholder="Type"
              required
            /><br /> */}



<select required name='type_id' id='selectList'
          onChange={this.onChange}
          type="text"
          // value = {this.state.type_id}
          >

<option value={this.state.type_id._id} hidden>
              Select type
            </option>

{this.state.types.map((type) => (
            
            <option value = {type._id}>
            {type.typename}
            </option>
            ))}

          </select><br></br>





            <TextField
              id="standard-basic"
              type="datetime-local"
              autoComplete="off"
              name="starttime"
              value={this.state.starttime}
              onChange={this.onChange}
              placeholder="Start Time"
              required
            /><br /><br />
            
          </DialogContent>

          <DialogActions>
            <Button onClick={this.handleRequestEditClose} color="primary">
              Cancel
            </Button>
            <Button
              disabled={this.state.title == '' || this.state.desc == '' || this.state.starttime == '' || this.state.type_id == ''}
              onClick={(e) => this.updateRequest()} color="primary" autoFocus>
              Edit Request
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Request */}
        <Dialog
          open={this.state.openRequestModal}
          onClose={this.handleRequestClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Add Request</DialogTitle>
          <DialogContent>
            <TextField
              id="standard-basic"
              type="text"
              autoComplete="off"
              name="title"
              value={this.state.title}
              onChange={this.onChange}
              placeholder="Request title"
              required
            /><br />
            <TextField
              id="standard-basic"
              type="text"
              autoComplete="off"
              name="desc"
              value={this.state.desc}
              onChange={this.onChange}
              placeholder="Description"
              required
            /><br />
            {/* <TextField
              id="standard-basic"
              type="number"
              autoComplete="off"
              name="price"
              value={this.state.price}
              onChange={this.onChange}
              placeholder="Price"
              required
            /><br /> */}
            {/* <TextField
              id="standard-basic"
              type="text"
              autoComplete="off"
              name="type"
              value={this.state.type}
              onChange={this.onChange}
              placeholder="Type"
              required
            /><br /> */}


<select required name='type_id' id='selectList'
          onChange={this.onChange}
          type="text"
          // value = {this.state.type_id}
          >

<option value="" disabled selected hidden>
              Select type
            </option>

{this.state.types.map((type) => (
            
            <option value = {type._id}>
            {type.typename}
            </option>
            ))}

          </select>


            <TextField
              id="standard-basic"
              type="datetime-local"
              autoComplete="off"
              name="starttime"
              value={this.state.starttime}
              onChange={this.onChange}
              placeholder="Start Time"
              required
            /><br /><br />
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
              disabled={this.state.title == '' || this.state.desc == '' || this.state.starttime == '' || this.state.type_id == ''}
              onClick={(e) => this.addRequest()} color="primary" autoFocus>
              Add Request
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
                <TableCell align="center">Title</TableCell>
                {/* <TableCell align="center">Image</TableCell> */}
                <TableCell align="center">Description</TableCell>
                <TableCell align="center">Type</TableCell>
                <TableCell align="center">Start Time</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.requests.map((row) => (
                <TableRow key={row.title}>
                  <TableCell align="center" component="th" scope="row">
                    {row.title}
                  </TableCell>
                  {/* <TableCell align="center"><img src={`http://localhost:2000/${row.image}`} width="70" height="70" /></TableCell> */}
                  <TableCell align="center">{row.desc}</TableCell>
                  <TableCell align="center">{row.type_id.typename}</TableCell>
                  <TableCell align="center">{row.starttime}</TableCell>
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