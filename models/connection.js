var sql = require('mssql');

function Conexion() {
    this.config = null;

    this.inicia = function () {
        this.config = {
            user: 'sa',
            password: '123',
            server: 'servidor-bd',
            database: 'colegio'
        }
    };

    this.obtener = function (callback) {
        sql.connect(this.config, function (err) {
            if (err)
                console.log(err.message);
            callback(err);
        })
    };

    this.cerrar = function (callback) {
        // console.log("connn close...");
        sql.close()
    };
}

module.exports = new Conexion();