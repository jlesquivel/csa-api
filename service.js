var jwt = require('jwt-simple');
var moment = require('moment');
var config = require('./config');

exports.createToken = function (user) {
    var payload = {
        sub: user.id_usuario,
        cedula: user.cedula,
        correo: user.correo,
        nombre: user.nombre,
        foto: user.foto,
        rol: user.rol,

        iat: moment().unix(),
        exp: moment().add(14, "h").unix()
    };
    return jwt.encode(payload, config.TOKEN_SECRET);
};