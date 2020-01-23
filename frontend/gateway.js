const express = require('express');
const app = express();
var router = express.Router()
const rp = require('request-promise');
const request = require('request');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const fs = require('fs');
const fileUpload = require('express-fileupload');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart({ uploadDir: '/tmp' });
var multer = require('multer');
const ENV = process.env.ABATTERY_CLUSTER;
const args = process.argv;
//process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const HTTP_404 = 404;
const LABEL_ERROR = 'error';
const Webex = require(`webex`);

// Load environment variables from project .env file
require('node-env-file')(__dirname + '/.env');

app.use(bodyParser.json({
  limit: '50mb'
}));
app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true
}));
app.use(session({
  secret: 'PROVISION',
  resave: true,
  saveUninitialized: true
}));

let pubcookieUser = '';
let appStaticPath = '';

app.use((req, res, next) => {
  if (typeof req.headers['my-proxy-remote-user'] !== 'undefined') {
      pubcookieUser = req.headers['my-proxy-remote-user'];
      req.session.loggedUser = req.headers['my-proxy-remote-user'];
      if(pubcookieUser == 'testuser'){
        pubcookieUser = 'nanda';
    }
  } else {
    pubcookieUser = 'nanda';
  }
  req.session.loggedUser = pubcookieUser;
  if (args[args.length - 1] && (args[args.length - 1].indexOf('=') !== -1))
    req.session.verbose = Number(args[args.length - 1].split('=')[1]);
  else
    req.session.verbose = 0;

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  res.header("x-proxy-remote-user", pubcookieUser);
  res.header("X-PROXY-REMOTE-USER", req.session.loggedUser);
  next();
});

appStaticPath = path.join(__dirname, '../../static');
app.use(express.static(path.join(__dirname, '../../static')));

function prepare_url_param(request, method) {
  let uri = environment.API_URL + "/" + request.API
  if (typeof request.USER != 'undefined') {
    uri += "/" + pubcookieUser
  }
  if (method !== 'POST') {
    uri += '?';
    for (let key in request) {
      if (key !== 'API' && key !== 'USER') {
        uri += key + '=' + request[key] + '&';
      }
    }
  }
  return uri;
}

app.get(/api_(\w)+/i, function (req, res) {

  let options = {
    uri: prepare_url_param(req.query),
    headers: {
      'x-proxy-remote-user': req.session.loggedUser
    },
    json: true,
    cert: fs.readFileSync(environment.CERT_FILE),
    key: fs.readFileSync(environment.CERT_KEY),
  };
  console.log(options);
  console.log("\r\n")
  rp(options)
    .then(function (repos) {
      res.json(repos);
    }).catch(function (err) {
      console.log(err)
      console.log('Error Code: ', err.statusCode);
      return res.sendStatus(err.statusCode).json(err);
    });
});

app.delete('/profiledelete', function (req, res) {
  let options = {
    uri: environment.API_URL + "/" + endpoint.GET_PROFILE + "/" + req.session.loggedUser + "/",
    method: 'delete',
    headers: {
      'x-proxy-remote-user': req.session.loggedUser
    },
    cert : fs.readFileSync(environment.CERT_FILE),
    key : fs.readFileSync(environment.CERT_KEY),
  };
  rp(options)
    .then(function (repos) {
      res.json(repos);
    })
    .catch(function (err) {
      console.log('Error Status Code: ', err.statusCode);
      return res.sendStatus(err.statusCode).json(err);
    });
});

app.post('/requestupload', function (req, res) {
  req.body.user = pubcookieUser;
  let options = {
    uri:  environment.API_URL+"/"+endpoint.POST_REQUEST,
    method: 'post',
    headers: {
      'x-proxy-remote-user': req.session.loggedUser
    },
    body: req.body,
    json: true ,
    cert : fs.readFileSync(environment.CERT_FILE),
    key : fs.readFileSync(environment.CERT_KEY),
  };
  console.log(req.body)
  console.log(options);
  console.log("\r\n")
  rp(options)
    .then(function (repos) {
      res.json(repos);
    })
    .catch(function (err) {
      console.log(err)
      console.log('Error Status Code: ', err.statusCode);
      return res.sendStatus(err.statusCode).json(err);
    });
});

app.post('/visitor', function (req, res) {
  req.body.user = pubcookieUser;
  console.log(req.body)
  let options = {
    uri: environment.API_URL + "/" + endpoint.POST_VISITOR,
    method: 'post',
    headers: {
      'x-proxy-remote-user': req.session.loggedUser
    },
    body: req.body,
    json: true,
    cert: fs.readFileSync(environment.CERT_FILE),
    key: fs.readFileSync(environment.CERT_KEY),
  };
  console.log(req.body)
  console.log(options);
  console.log("\r\n")
  rp(options)
    .then(function (repos) {
      console.log(repos);
      res.json(repos);
    })
    .catch(function (err) {
      console.log(err)
      console.log('Error Status Code: ', err.statusCode);
      return res.sendStatus(err.statusCode).json(err);
    });
});


app.post('/file_upload', multipartMiddleware, (req, res) => {
  let options = {
    url: environment.NETSTORAGE_API+"/"+environment.NETSTORAGE_API_UPLOAD_API,
    method: 'POST',
    qs: environment.PARAMS,
    strictSSL: false,
    headers: {
      'x-proxy-remote-user': req.session.loggedUser
    },
    json: true,
    cert : fs.readFileSync(environment.CERT_FILE),
    key : fs.readFileSync(environment.CERT_KEY),
    formData: {
      file: fs.createReadStream(req.files.file.path),
    },
  };
  request(options, function (_err, _res, _body) {
    if (_err) {
      res.status(HTTP_404).send({
        status: LABEL_ERROR,
        errormsg: _err
      });
      console.log('[Error: ' + _err + ']');
    } else {
      fs.unlink(req.files.file.path, function (err) {
        if (err) throw err;
        console.log('File deleted from uploads directory!');
      });
      let results = _body;
      res.status(_res.statusCode).send(results);
    }
  });
});

app.put('/profileupdate', function (req, res) {
  let options = {
    uri: environment.API_URL + "/" + endpoint.GET_PROFILE + "/" + req.session.loggedUser + "/",
    method: 'put',
    headers: {
      'x-proxy-remote-user': req.session.loggedUser
    },
    body: req.body ,
    json: true ,// Automatically parses the JSON string in the response
    cert : fs.readFileSync(environment.CERT_FILE),
    key : fs.readFileSync(environment.CERT_KEY),
    
  };
  console.log(req.body)
  console.log("\r\n")
  rp(options)
    .then(function (repos) {
      res.json(repos);
    })
    .catch(function (err) {
      console.log(err)
      console.log('Error Status Code: ', err.statusCode);
      return res.sendStatus(err.statusCode).json(err);
    });
});

app.get('/gateway', function (req, res) {
  res.send('Hello there! This response does indicate that the node gateway is running and is responding to requests');
});
app.all('/*', function (req, res) {
  res.sendFile(appStaticPath + '/index.html');
});
app.listen(environment.appPort, function () {
  console.log('Gateway is listening on port ' + environment.appPort + ' on ' + environment.appEnvironment + ' : on Time : '+ Date.now());
});

