import React, { Component } from 'react';
import {
    Button, TextField, Dialog, DialogActions, LinearProgress,
    DialogTitle, DialogContent, TableBody, Table,
    TableContainer, TableHead, TableRow, TableCell
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import swal from 'sweetalert';
// import Navbar from './components/Header';
import Header from './components/Header_volunteer';
//import Sidebar from './components/Sidebar';
const axios = require('axios');

export default class VolunteerHistory extends Component {
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
        axios.get(`http://localhost:2000/volunteer-get-history${data}`, {
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
    return (<>
        
        <Header/>
        
        
        <div>
        {this.state.loading && <LinearProgress size={40} />}
        <div style={{marginTop: '4rem'}}>
        <h2 style={{marginBottom:'1rem'}}>History</h2>
        
        <Button
        className="button_style"
        variant="contained"
        size="small"
        onClick={this.logOut}
        >
        Log Out
        </Button>
        </div>
        
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
        <Table aria-label="simple table" style={{marginTop:'3rem'}}>
        <TableHead>
        <TableRow>
        <TableCell align="center">Title</TableCell>
        {/* <TableCell align="center">Image</TableCell> */}
        <TableCell align="center">Description</TableCell>
        <TableCell align="center">Type</TableCell>
        <TableCell align="center">Start Time</TableCell>
        <TableCell align="center">Seeker</TableCell>
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
            <TableCell align="center">{row.seeker_id.fname + " " + row.seeker_id.lname}</TableCell>
            
            </TableRow>
            ))}
            </TableBody>
            </Table>
            <br />
            <Pagination count={this.state.pages} page={this.state.page} onChange={this.pageChange} color="primary" style={{display: 'flex',justifyContent:'center'}} />
            </TableContainer>
            
            </div></>
            );
        }
    }