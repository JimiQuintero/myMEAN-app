const jwt = require('jsonwebtoken');
const secret = 'clave_secreta_myMEAN';

// ===========================
//     VERIFICAR TOKEN
// ===========================

let verificaToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, secret, (err, decoded) => {

        // Si existe un error
        if (err) {
            return res.status(401).json({
                ok: true,
                err
            });
        }

        // Si los datos son correctos y pasa la verificacion
        req.user = decoded.user;

        // Para que continue el programa
        next();

    });

    // console.log(token); 

    // res.json({
    //   token: token
    // });

};

module.exports = {
    verificaToken
}