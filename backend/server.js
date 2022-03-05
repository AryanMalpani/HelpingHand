var express = require("express");
var app = express();
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var cors = require('cors');
var multer = require('multer'),
  bodyParser = require('body-parser'),
  path = require('path');
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/SEDB");
var fs = require('fs');
var request = require("./model/request.js");
var user = require("./model/user.js");
const { getMaxListeners } = require("process");

var dir = './uploads';
var upload = multer({
  storage: multer.diskStorage({

    destination: function (req, file, callback) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      callback(null, './uploads');
    },
    filename: function (req, file, callback) { callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); }

  }),

  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname)
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
      return callback(/*res.end('Only images are allowed')*/ null, false)
    }
    callback(null, true)
  }
});
app.use(cors());
app.use(express.static('uploads'));
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: false
}));

// const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('./swagger.json');

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/", (req, res, next) => {
  try {
    if (req.path == "/login" || req.path == "/register" || req.path == "/") {
      next();
    } else {
      /* decode jwt token if authorized*/
      jwt.verify(req.headers.token, 'shhhhh11111', function (err, decoded) {
        if (decoded && decoded.user) {
          req.user = decoded;
          next();
        } else {
          return res.status(401).json({
            errorMessage: 'User unauthorized!',
            status: false
          });
        }
      })
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }
})

app.get("/", (req, res) => {
  res.status(200).json({
    status: true,
    title: 'Apis'
  });
});

/* login api */
app.post("/login", (req, res) => {
  try {
    if (req.body && req.body.username && req.body.password) {
      user.find({ username: req.body.username }, (err, data) => {
        if (data.length > 0) {

          // console.log(data);
          // console.log(data.password);
          // console.log(data[0]);
          console.log(data[0].role);

          if (bcrypt.compareSync(data[0].password, req.body.password)) {
            checkUserAndGenerateToken(data[0], req, res);
          } else {

            res.status(400).json({
              errorMessage: 'Username or password is incorrect!',
              status: false
            });
          }

        } else {
          res.status(400).json({
            errorMessage: 'Username or password is incorrect!',
            status: false
          });
        }
      })
    } else {
      res.status(400).json({
        errorMessage: 'Add proper parameter first!',
        status: false
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }

});

/* register api */
app.post("/register", (req, res) => {
  try {
    console.log(req.body)
    if (req.body && req.body.username && req.body.password && req.body.role && req.body.fname && req.body.lname && req.body.age && req.body.email && req.body.phoneno) {

      user.find({ username: req.body.username }, (err, data) => {

        if (data.length == 0) {

          let User = new user({
            username: req.body.username,
            password: req.body.password,
            role: req.body.role,
            fname: req.body.fname,
            lname: req.body.lname,
            age: req.body.age,
            email: req.body.email,
            phoneno: req.body.phoneno
          });
          User.save((err, data) => {
            if (err) {
              res.status(400).json({
                errorMessage: err,
                status: false
              });
            } else {
              res.status(200).json({
                status: true,
                title: 'Registered Successfully.'
              });
            }
          });

        } else {
          res.status(400).json({
            errorMessage: `UserName ${req.body.username} Already Exist!`,
            status: false
          });
        }

      });

    } else {
      res.status(400).json({
        errorMessage: 'Add proper parameter first!',
        status: false
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }
});

function checkUserAndGenerateToken(data, req, res) {
  jwt.sign({ user: data.username, id: data._id }, 'shhhhh11111', { expiresIn: '1d' }, (err, token) => {
    if (err) {
      res.status(400).json({
        status: false,
        errorMessage: err,
      });
    } else {
      res.json({
        message: 'Login Successfully.',
        token: token,
        role: data.role,
        status: true
      });
    }
  });
}

/* Api to add Request */
app.post("/add-request", upload.any(), (req, res) => {
  try {
    if (req.files && req.body && req.body.title && req.body.desc && req.body.type &&
      req.body.starttime) {

      let new_request = new request();
      new_request.title = req.body.title;
      new_request.desc = req.body.desc;
      new_request.type = req.body.type;
      // new_request.image = req.files[0].filename;
      new_request.starttime = req.body.starttime;
      new_request.seeker_id = req.user.id;
      new_request.save((err, data) => {
        if (err) {
          res.status(400).json({
            errorMessage: err,
            status: false
          });
        } else {
          res.status(200).json({
            status: true,
            title: 'Request Added successfully.'
          });
        }
      });

    } else {
      res.status(400).json({
        errorMessage: 'Add proper parameter first!',
        status: false
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }
});

/* Api to update Request */
app.post("/update-request", upload.any(), (req, res) => {
  try {
    if (req.files && req.body && req.body.title && req.body.desc && req.body.type &&
      req.body.id && req.body.starttime) {

      request.findById(req.body.id, (err, new_request) => {

        // if file already exist than remove it
        if (req.files && req.files[0] && req.files[0].filename && new_request.image) {
          var path = `./uploads/${new_request.image}`;
          fs.unlinkSync(path);
        }

        if (req.files && req.files[0] && req.files[0].filename) {
          new_request.image = req.files[0].filename;
        }
        if (req.body.title) {
          new_request.title = req.body.title;
        }
        if (req.body.desc) {
          new_request.desc = req.body.desc;
        }
        if (req.body.type) {
          new_request.type = req.body.type;
        }
        if (req.body.starttime) {
          new_request.starttime = req.body.starttime;
        }

        new_request.save((err, data) => {
          if (err) {
            res.status(400).json({
              errorMessage: err,
              status: false
            });
          } else {
            res.status(200).json({
              status: true,
              title: 'Request updated.'
            });
          }
        });

      });

    } else {
      res.status(400).json({
        errorMessage: 'Add proper parameter first!',
        status: false
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }
});

/* Api to delete Request */
app.post("/delete-request", (req, res) => {
  try {
    if (req.body && req.body.id) {
      request.findByIdAndUpdate(req.body.id, { is_delete: true }, { new: true }, (err, data) => {
        if (data.is_delete) {
          res.status(200).json({
            status: true,
            title: 'Request deleted.'
          });
        } else {
          res.status(400).json({
            errorMessage: err,
            status: false
          });
        }
      });
    } else {
      res.status(400).json({
        errorMessage: 'Add proper parameter first!',
        status: false
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }
});

/* Api to revive Request */
app.post("/revive-request", (req, res) => {
  try {
    if (req.body && req.body.id) {
      request.findByIdAndUpdate(req.body.id, { is_delete: false }, { new: true }, (err, data) => {
        if (data.is_delete) {
          res.status(400).json({
            errorMessage: err,
            status: false
          });
        } else {
          res.status(200).json({
            status: true,
            title: 'Request revived.'
          });
          
        }
      });
    } else {
      res.status(400).json({
        errorMessage: 'Add proper parameter first!',
        status: false
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }
});

/*Api to get and search request with pagination and search by title for seeker*/
app.get("/seeker-get-unaccepted-request", (req, res) => {
  try {
    var query = {};
    query["$and"] = [];
    query["$and"].push({
      is_delete: false,
      seeker_id: req.user.id,
      volunteer_id: null,
      is_complete: false,
    });
    if (req.query && req.query.search) {
      query["$and"].push({
        title: { $regex: req.query.search }
      });
    }
    var perPage = 5;
    var page = req.query.page || 1;
    request.find(query, { date: 1, title: 1, id: 1, desc: 1, type: 1, starttime: 1, image: 1 })
      .skip((perPage * page) - perPage).limit(perPage)
      .then((data) => {
        request.find(query).count()
          .then((count) => {

            if (data && data.length > 0) {
              console.log(data)
              res.status(200).json({
                status: true,
                title: 'Request retrived.',
                requests: data,
                current_page: page,
                total: count,
                pages: Math.ceil(count / perPage),
              });
            } else {
              res.status(400).json({
                errorMessage: 'There is no request!',
                status: false
              });
            }

          });

      }).catch(err => {
        res.status(400).json({
          errorMessage: err.message || err,
          status: false
        });
      });
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }

});

/*Api to get and search accepted request with pagination and search by title for seeker*/
app.get("/seeker-get-accepted-request", (req, res) => {
  try {
    var query = {};
    query["$and"] = [];
    query["$and"].push({
      is_delete: false,
      seeker_id: req.user.id,
      volunteer_id: { $ne: null },
      is_complete: false
    });
    if (req.query && req.query.search) {
      query["$and"].push({
        title: { $regex: req.query.search }
      });
    }
    var perPage = 5;
    var page = req.query.page || 1;
    request.find(query, { date: 1, title: 1, id: 1, desc: 1, type: 1, starttime: 1, image: 1 })
      .skip((perPage * page) - perPage).limit(perPage)
      .then((data) => {
        request.find(query).count()
          .then((count) => {

            if (data && data.length > 0) {
              res.status(200).json({
                status: true,
                title: 'Request retrived.',
                requests: data,
                current_page: page,
                total: count,
                pages: Math.ceil(count / perPage),
              });
            } else {
              res.status(400).json({
                errorMessage: 'There is no request!',
                status: false
              });
            }

          });

      }).catch(err => {
        res.status(400).json({
          errorMessage: err.message || err,
          status: false
        });
      });
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }

});

/*Api to get and search deleted request with pagination and search by title for seeker*/
app.get("/seeker-get-deleted-request", (req, res) => {
  try {
    var query = {};
    query["$and"] = [];
    query["$and"].push({
      is_delete: true,
      seeker_id: req.user.id,
      // volunteer_id: { $ne: null },
      // is_complete: false
    });
    if (req.query && req.query.search) {
      query["$and"].push({
        title: { $regex: req.query.search }
      });
    }
    var perPage = 5;
    var page = req.query.page || 1;
    request.find(query, {})
      .skip((perPage * page) - perPage).limit(perPage).populate('seeker_id').populate('volunteer_id')
      .then((data) => {
        request.find(query).count()
          .then((count) => {

            if (data && data.length > 0) {
              console.log(data)
              res.status(200).json({
                status: true,
                title: 'Request retrived.',
                requests: data,
                current_page: page,
                total: count,
                pages: Math.ceil(count / perPage),
              });
            } else {
              res.status(400).json({
                errorMessage: 'There is no request!',
                status: false
              });
            }

          });

      }).catch(err => {
        res.status(400).json({
          errorMessage: err.message || err,
          status: false
        });
      });
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }

});


/*Api to get and search request with pagination and search by title for volunteer*/
app.get("/volunteer-get-request", (req, res) => {
  try {
    var query = {};
    query["$and"] = [];
    query["$and"].push({
      is_delete: false,
      is_complete: false,
      volunteer_id: null
      // seeker_id: req.user.id
    });
    if (req.query && req.query.search) {
      query["$and"].push({
        title: { $regex: req.query.search }
      });
    }
    var perPage = 5;
    var page = req.query.page || 1;
    request.find(query, { date: 1, title: 1, id: 1, desc: 1, type: 1, starttime: 1, seeker_id: 1 })
      .skip((perPage * page) - perPage).limit(perPage).populate('seeker_id').sort({starttime: 1})
      .then((data) => {
        request.find(query).count()
          .then((count) => {

            if (data && data.length > 0) {
              console.log(data)
              res.status(200).json({
                status: true,
                title: 'Request retrived.',
                requests: data,
                current_page: page,
                total: count,
                pages: Math.ceil(count / perPage),
              });
            } else {
              res.status(400).json({
                errorMessage: 'There is no request!',
                status: false
              });
            }

          });

      }).catch(err => {
        res.status(400).json({
          errorMessage: err.message || err,
          status: false
        });
      });
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }

});

/*Api to get and search upcoming requests for that volunteers with pagination and search by title for volunteer*/
app.get("/volunteer-get-my-upcoming-request", (req, res) => {
  try {
    var query = {};
    query["$and"] = [];
    query["$and"].push({
      is_delete: false,
      is_complete: false,
      volunteer_id: req.user.id,
      starttime: { $gte: Date.now()}

      // seeker_id: req.user.id
    });
    if (req.query && req.query.search) {
      query["$and"].push({
        title: { $regex: req.query.search }
      });
    }
    var perPage = 5;
    var page = req.query.page || 1;
    request.find(query, { date: 1, title: 1, id: 1, desc: 1, type: 1, starttime: 1, seeker_id: 1 })
      .skip((perPage * page) - perPage).limit(perPage).populate('seeker_id').sort({starttime: 1})
      .then((data) => {
        request.find(query).count()
          .then((count) => {

            if (data && data.length > 0) {
              console.log(data)
              res.status(200).json({
                status: true,
                title: 'Request retrived.',
                requests: data,
                current_page: page,
                total: count,
                pages: Math.ceil(count / perPage),
              });
            } else {
              res.status(400).json({
                errorMessage: 'There is no request!',
                status: false
              });
            }

          });

      }).catch(err => {
        res.status(400).json({
          errorMessage: err.message || err,
          status: false
        });
      });
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }

});

/*Api to get and search request with pagination and search by title for admin*/
app.get("/admin-get-request", (req, res) => {
  try {
    var query = {};
    query["$and"] = [];
    query["$and"].push({
      is_delete: false,
      // seeker_id: req.user.id
    });
    if (req.query && req.query.search) {
      query["$and"].push({
        title: { $regex: req.query.search }
      });
    }
    var perPage = 5;
    var page = req.query.page || 1;
    request.find(query, { date: 1, title: 1, id: 1, desc: 1, type: 1, starttime: 1, image: 1 })
      .skip((perPage * page) - perPage).limit(perPage).populate('seeker_id').populate('volunteer_id')
      .then((data) => {
        request.find(query).count()
          .then((count) => {

            if (data && data.length > 0) {
              console.log(data)
              res.status(200).json({
                status: true,
                title: 'Request retrived.',
                requests: data,
                current_page: page,
                total: count,
                pages: Math.ceil(count / perPage),
              });
            } else {
              res.status(400).json({
                errorMessage: 'There is no request!',
                status: false
              });
            }

          });

      }).catch(err => {
        res.status(400).json({
          errorMessage: err.message || err,
          status: false
        });
      });
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }

});

/*Api to get and search users with pagination and search by title for admin*/
app.get("/admin-get-user", (req, res) => {
  try {
    var query = {};
    query["$and"] = [];
    query["$and"].push({
      // seeker_id: req.user.id
    });
    if (req.query && req.query.search) {
      query["$and"].push({
        title: { $regex: req.query.search }
      });
    }
    var perPage = 5;
    var page = req.query.page || 1;
    user.find(query, {})
      .skip((perPage * page) - perPage).limit(perPage)
      .then((data) => {
        user.find(query).count()
          .then((count) => {

            if (data && data.length > 0) {
              console.log(data)
              console.log(data[0])
              res.status(200).json({
                status: true,
                title: 'user retrived.',
                users: data,
                current_page: page,
                total: count,
                pages: Math.ceil(count / perPage),
              });
            } else {
              res.status(400).json({
                errorMessage: 'There is no user!',
                status: false
              });
            }

          });

      }).catch(err => {
        res.status(400).json({
          errorMessage: err.message || err,
          status: false
        });
      });
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }

});

app.listen(2000, () => {
  console.log("Server is Runing On port 2000");
});


/* Api to accept Request */
app.post("/accept-request", (req, res) => {
  try {
    if (req.body && req.body.id && req.user.id) {
      request.findByIdAndUpdate(req.body.id, { volunteer_id: req.user.id }, { new: true }, (err, data) => {
        if (data.volunteer_id != null) {
          res.status(200).json({
            status: true,
            title: 'Request accepted.'
          });
        } else {
          res.status(400).json({
            errorMessage: err,
            status: false
          });
        }
      });
    } else {
      res.status(400).json({
        errorMessage: 'Add proper parameter first!',
        status: false
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }
});

/* Api to remove a volunteer from a request he has accepted*/
app.post("/remove-volunteer-from-request", (req, res) => {
  try {
    if (req.body && req.body.id) {
      request.findByIdAndUpdate(req.body.id, { volunteer_id: null }, { new: true }, (err, data) => {
        if (data.volunteer_id === null) {
          res.status(200).json({
            status: true,
            title: 'Request deleted.'
          });
        } else {
          res.status(400).json({
            errorMessage: err,
            status: false
          });
        }
      });
    } else {
      res.status(400).json({
        errorMessage: 'Add proper parameter first!',
        status: false
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }
});