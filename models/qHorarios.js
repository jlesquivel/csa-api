var conexion = require('./connection');
var sql = require('mssql');
var service = require('../services/service');
var error01 = 'Error conexion servidor SQL';

function qHorarios() {

 this.qH_Materias = function (res) {
        conexion.obtener(function (err) {
            if (err) {
                res.send({estado: error01})
            } else {
                var request = new sql.Request(conexion);
                request.query('Select * from materia', function (err, resultado) {
                    res.send(resultado);
                })
            }
        });
    }; // ------------------------------------------------------------------




}

