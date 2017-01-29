var express = require('express');
var bodyparser = require('body-parser');
var config = require('./config');

var app = express();
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());

var connection = require('./connection');
var routes = require('./routes');
var cors = require('./controllers/cors');

// Middlewares

app.use(cors.permisos);

app.set('superSecret', config.secret);

connection.inicia();
routes.configurar(app);

connection.obtener(function (err) {
    if (err) {
        console.log('|||Servidor base datos no encontrado');
        
        
    } else {
        // carga el servidor
        var server = app.listen(8000, '0.0.0.0', function () {
            console.log('\n RESTf [servidor-bd] en el puerto,', server.address().port);
        });
    }
});
