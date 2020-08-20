const jwt = require('jwt-simple');
const moment = require('moment');
const secret = 'clave_secreta_myMEAN';

exports.crearToken = function(user) {
    let payload = {
        sub: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        password: user.password,
        role: user.role,
        imagen: user.imagen,
        // fecha de creacion del token
        iat: moment().unix(),
        // fecha de expiracion del token
        exp: moment().add(30, 'days').unix
    };

    return jwt.encode(payload, secret);
};