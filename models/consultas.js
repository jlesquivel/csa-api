var conexion = require("./connection");
var sql = require("mssql");
var service = require("../services/service");
var error01 = "Error conexión servidor datos";

function MetodosDB() {
  // aqui se implementa todas las operaciones con la base de datos

  //respToekn :: Devuelve un JWT (json web token) s
  // si el usuario existe en la base de datos usuarios
  //
  this.respToken = function(usuario, clave, res) {
    conexion.obtener(function(err) {
      if (err) {
        res.status(503).send({ estado: error01 });
      } else {
        var request = new sql.Request(conexion);
        // console.log('< petición ingreso :', usuario);
        request.input("usuario", usuario);
        request.query("Select * from usuarios where correo=@usuario", function(
          err,
          resultado
        ) {
          if (err) res.send({ estado: "error" });
          else {
            //console.log(resultado[0]);
            if (resultado[0] == undefined) {
              res
                .status(200)
                .send({ success: false, message: "Usuario No Existe. " });
            } else {
              if (resultado[0].clave != clave) {
                res.send({ success: false, message: "Clave incorrecta." });
              } else {
                // return the information including token as JSON
                res.json({
                  success: true,
                  message: "Ingreso satisfactorio!!!",
                  token: service.createToken(resultado[0])
                });
                conexion.cerrar();
              }
            }
          }
        });
      }
    });
  }; // ==================================================================

  this.seleccionar = function(res) {
    conexion.obtener(function(err) {
      if (err) {
        res.send({ estado: error01 });
      } else {
        var request = new sql.Request(conexion);
        request.query("Select * from materia", function(err, resultado) {
          res.send(resultado);
          conexion.cerrar();
        });
      }
    });
  }; // =====================================================================

  this.ListaClase = function(ano, nivel, grupo, res) {
    conexion.obtener(function(err) {
      if (err) {
        res.send({ estado: error01 });
      } else {
        var request = new sql.Request(conexion);
        request.input("ano", sql.Int, ano);
        request.input("nivel", sql.VarChar(15), nivel);
        request.input("grupo", sql.VarChar(2), grupo);
        request.execute("spListaClase", function(err, recordsets, returnValue) {
          if (recordsets.length == 0) {
            res.send({ estado: error01 });
          } else {
            res.send(recordsets[0]);
            //console.log(recordsets[0]);
          }
          conexion.cerrar();
        });
      }
    });
  }; // ==================================================================

  this.ListaClaseAusencias = function(ano, nivel, grupo, fecha, leccion, res) {
    conexion.obtener(function(err) {
      if (err) {
        res.send({ estado: error01 });
      } else {
        //convierte de string a fecha2 el parametro fecha
        var partes = fecha.split("-");
        var fecha2 = new Date(partes[2], partes[1] - 1, partes[0]);

        var request = new sql.Request(conexion);
        request.input("ano", sql.Int, ano);
        request.input("nivel", sql.VarChar(15), nivel);
        request.input("grupo", sql.VarChar(2), grupo);
        request.input("fecha", sql.Date, fecha2);
        request.input("leccion", sql.VarChar(2), leccion);
        request.execute("spListaClaseAusencias", function(
          err,
          recordsets,
          returnValue
        ) {
          res.send(recordsets[0]);
          //console.log(recordsets[0])    // para debug en consola  servidor
          conexion.cerrar();
        });
      }
    });
  }; //======================================================================

  this.cambiarEstadoAusencia = function(id, carnet, leccion, estado, res) {
    var isql = "";
    conexion.obtener(function(err) {
      if (err) {
        res.send({ estado: error01 });
      } else {
        // console.log('id:=',id);
        var request = new sql.Request(conexion);
        if (id == null) {
          //console.log('cambiarEstadoAusencia = > inserta');
          isql =
            "INSERT INTO Ausencias (carnet, leccion, tipo) VALUES (@carnet, @leccion, @tipo);";
          request.input("carnet", sql.VarChar(10), carnet);
          request.input("leccion", sql.VarChar(2), leccion);
          request.input("tipo", sql.VarChar(10), estado);

          request.query(isql, function(err, resultado) {
            res.send({ estado: "ausencia creada" });
            conexion.cerrar();
          });
        } else {
          //console.log('cambiarEstadoAusencia = > actualiza');
          isql = "UPDATE Ausencias SET tipo = @tipo WHERE (id = @id)";
          request.input("id", sql.Int, parseInt(id));
          request.input("tipo", sql.VarChar(10), estado);
          request.query(isql, function(err, resultado) {
            if (err) {
              res.send(err.message);
              conexion.cerrar();
            } else {
              res.send({ estado: "Actualizado" });
              conexion.cerrar();
            }
          });
        }
      }
    });
  }; // ==================================================================

  this.grupos = function(ano, resp) {
    conexion.obtener(function(err) {
      if (err) {
        resp.send({ estado: error01 });
      } else {
        var request = new sql.Request(conexion);
        var isql =
          "SELECT (nivel+'-'+grupo) as grupo FROM grupos WHERE ano = @ano";
        request.input("ano", sql.Int, ano);
        request.query(isql, function(err, resultado) {
          if (err) resp.send({ estado: "error en consulta" });
          else {
            //console.log(resultado[0]);
            if (resultado[0] == undefined) {
              resp.status(400).send({ success: false, message: "sin datos. " });
              conexion.cerrar();
            } else {
              resp.status(200).send(resultado);
              conexion.cerrar();
            }
          }
        }); // fin query
      }
    });
  }; // fin consulta grupos
}

module.exports = new MetodosDB();
