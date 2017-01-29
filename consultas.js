var conexion = require('./connection');
var sql = require('mssql');
var service = require('./service');
var error01 = 'Error conexion servidor SQL';

function MetodosDB() {
    // aqui se implementa todas las operaciones con la base de datos


    //respToekn :: Devuelve un JWT (json web token) s
    // si el usuario existe en la base de datos usuarios
    //
    this.respToken = function (usuario, clave, res) {
        conexion.obtener(function (err) {
            if (err) {
                res.send({estado: error01})
            } else {
                var request = new sql.Request(conexion);
               // console.log('< petición ingreso :', usuario);
                request.input('usuario', usuario);
                request.query('Select * from usuarios where correo=@usuario', function (err, resultado) {
                    if (err)
                        res.send({estado: 'error'});
                    else {
                        //console.log(resultado[0]);
                        if (resultado[0] == undefined) {
                            res.status(200).send({  success: false, message: 'Usuario No Existe. '});
                        } else {

                            if (resultado[0].clave != clave) {
                                res.send({ success: false, message: 'Clave incorrecta.'});
                            } else {
                                // return the information including token as JSON
                                res.json({
                                    success: true,
                                    message: 'Ingreso satisfactorio!!!',
                                    token: service.createToken(resultado[0])
                                });
                            }
                        }
                    }
                })
            }
        })
    };// ==================================================================


    this.seleccionar = function (res) {
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
    };

    this.ListaClase = function (ano, nivel, grupo, res) {
        conexion.obtener(function (err) {
            if (err) {
                res.send({estado: error01})
            } else {
                var request = new sql.Request(conexion);
                request.input('ano', sql.Int, ano);
                request.input('nivel', sql.VarChar(15), nivel);
                request.input('grupo', sql.VarChar(2), grupo);
                request.execute('spListaClase', function (err, recordsets, returnValue, affected) {
                    if (recordsets.length = 0) {
                        res.send({estado: error01})
                    } else {
                        res.send(recordsets);
                        console.log(recordsets[0].length);
                    }
                })
            }
        })
    };// ==================================================================

    this.ListaClaseAusencias = function (ano, nivel, grupo, fecha, leccion, res) {
        conexion.obtener(function (err) {
            if (err) {
                res.send({estado: error01})
            } else {

                //convierte de string a fecha2 el parametro fecha
                var partes = fecha.split('-');
                var fecha2 = new Date(partes[2], partes[1] - 1, partes[0]);

                var request = new sql.Request(conexion);
                request.input('ano', sql.Int, ano);
                request.input('nivel', sql.VarChar(15), nivel);
                request.input('grupo', sql.VarChar(2), grupo);
                request.input('fecha', sql.Date, fecha2);
                request.input('leccion', sql.VarChar(2), leccion);
                request.execute('spListaClaseAusencias', function (err, recordsets, returnValue) {
                    res.send(recordsets[0]);
                    //console.log(recordsets[0])    // para debug en consola  servidor
                })
            }
        });
    }; //======================================================================

    this.cambiarEstadoAusencia = function (id, carnet, leccion, estado, res) {

        var isql = '';
        conexion.obtener(function (err) {
            if (err) {
                res.send({estado: error01})
            } else {
                // console.log('id:=',id);
                var request = new sql.Request(conexion);
                if (id == null) {
                    //console.log('cambiarEstadoAusencia = > inserta');
                    isql = 'INSERT INTO Ausencias (carnet, leccion, tipo) VALUES (@carnet, @leccion, @tipo);';
                    request.input('carnet', sql.VarChar(10), carnet);
                    request.input('leccion', sql.VarChar(2), leccion);
                    request.input('tipo', sql.VarChar(10), estado);

                    request.query(isql, function (err, resultado) {
                        res.send({estado: 'ausencia creada'});
                    });
                } else {
                    //console.log('cambiarEstadoAusencia = > actualiza');
                    isql = 'UPDATE Ausencias SET tipo = @tipo WHERE (id = @id)';
                    request.input('id', sql.Int, parseInt(id));
                    request.input('tipo', sql.VarChar(10), estado);
                    request.query(isql, function (err, resultado) {
                        if (err) {
                            res.send(err.message);
                        } else {
                            res.send({estado: 'Actualizado'});
                        }
                    })
                }
            }
        })
    }; // ==================================================================


}

module.exports = new MetodosDB();

