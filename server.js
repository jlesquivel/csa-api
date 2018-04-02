'use strict';

function approveDomains(opts, certs, cb) {
  console.log('opts are', opts);
  if (certs) {
    opts.domains = certs.altnames;
  }
  else {
    opts.domains = ['csalib.ddns.net'];
    opts.email = 'jlesquivel@hotmail.com';
    opts.agreeTos = true;
  }
  cb(null, { options: opts, certs: certs });
}

var lex = require('greenlock-express').create({
  // server: 'staging',
  server: 'https://acme-v01.api.letsencrypt.org/directory',
  debug: true,
  configDir: 'certs/etc',
  approveDomains: approveDomains
});


// handles acme-challenge and redirects to https
require('http')
  .createServer(lex.middleware(require('redirect-https')()))
  .listen(8000, function () {    console.log('Listening for ACME http-01 challenges on', this.address());
  });

var express = require('express');
var bodyparser = require('body-parser');
var config = require('./config');

var app = express();
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

var connection = require('./models/connection');
var routes = require('./router/routes');
var cors = require('./controllers/cors');

// Middlewares

app.use(cors.permisos);
app.set('superSecret', config.secret);

connection.inicia();
routes.configurar(app);

// handles your app
require('https')
  .createServer(lex.httpsOptions, lex.middleware(app))
  .listen(8443, function () {
    console.log('Listening for ACME tls-sni-01 and serve app on', this.address());
  });
