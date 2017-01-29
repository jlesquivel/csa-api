var db = require('../models/consultas');
var path = require('path');

function http() {
    this.configurar = function (app) {


        app.get('/', function (sol, resp){
            resp.sendFile(path.join(__dirname, '/config.json'));
        });

        app.post('/authenticate',
            function (sol, resp) {
            //solicita el toke del usuario que solicita
            // sol.body.usuario
            db.respToken(sol.body.usuario, sol.body.clave, resp)
        });

        app.get('/materias/',
            function (soli, resp) {
            //devuelve las 
            db.seleccionar(resp);
        });

        app.get('/ListaClase/:ano/:nivel/:grupo',
            function (soli, resp) {
            db.ListaClase(soli.params.ano, soli.params.nivel, soli.params.grupo, resp);
        });

        app.get('/ListaClaseAusencias/:ano/:nivel/:grupo/:fecha/:leccion/',
            function (soli, resp) {
            db.ListaClaseAusencias(soli.params.ano, soli.params.nivel,
                soli.params.grupo, soli.params.fecha, soli.params.leccion, resp);
        });

        app.post('/cambiarEstadoAusencia/',
            function (soli, resp) {
            //console.log(soli.body);
            db.cambiarEstadoAusencia(
                soli.body.id,
                soli.body.carnet,
                soli.body.leccion,
                soli.body.tipo,
                resp);
        });

    }
}

module.exports = new http();