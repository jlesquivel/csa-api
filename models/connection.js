var sql = require('mssql');

function Conexion() {
  this.config = null;

  this.inicia = function() {
    this.config = {
      user: 'sa',
      password: '123',
      server: 'servidor-bd',
      database: 'colegio',
      parseJSON: true
    };
  };

  this.obtener = function(callback) {
    sql.close();
    sql.connect(this.config, function(err) {
      if (err) console.log(err.message);
      callback(err);
    });
  };

  this.cerrar = function(callback) {
    // console.log("connn close...");
    sql.close();
  };
}

module.exports = new Conexion();
