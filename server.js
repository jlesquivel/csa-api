
const https = require("https"),
fs = require("fs");


var express = require('express');
var bodyparser = require('body-parser');
var config = require('./config');

var app = express();
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

var connection = require('./models/connection');
var routes = require('./router/routes');
var cors = require('./controllers/cors');

const options = {
    key: fs.readFileSync("/xampp/apache/conf/ssl.key/server.key"),
    cert: fs.readFileSync("/xampp/apache/conf/ssl.crt/server.crt")
  };

// Middlewares

app.use(cors.permisos);
app.set('superSecret', config.secret);

connection.inicia();
routes.configurar(app);

connection.obtener(function (err) {
  if (err) {
    console.log('|||Servidor base datos no encontrado...');
  }
  connection.cerrar();
  // carga el servidor
  app.listen(8000);
  https.createServer(options, app).listen(1010);
});

