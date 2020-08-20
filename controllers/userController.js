const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/model_user');
const secret = 'clave_secreta_myMEAN';
const _ = require('underscore');
// const jwt = require('../services/jwt');

// Metodo Post para registar un usuario en la DB
exports.saveUser = (req, res) => {

    // Recuperando la Data
    let data = req.body;
    // Inicializando el Modelo
    let user = new User({
        name: data.name,
        surname: data.surname,
        email: data.email,
        password: bcrypt.hashSync(data.password, 10),
        role: 'ROLE_USER',
        imagen: 'null'
    });

    // Mostrar los datos en consola
    console.log(req.body);

    user.save((err, userDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Error al guardar el usuario'
                }
            });
        }

        res.json({
            ok: true,
            user: userDB
        });
    });
};

// Metodo para el LOGIN para logear un usuario

exports.loginUser = (req, res) => {

    let data = req.body;

    User.findOne({ email: data.email }, (err, userDB) => {

        // Manejando el error en la DB
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        // Verificando el email
        if (!userDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) o la contraseña son invalidos'
                }
            });
        }

        //   Evaluando la Contraseña
        if (!bcrypt.compareSync(data.password, userDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o la (contraseña) son invalidos'
                }
            });
        }

        // Generando el jsonwebtoken (jwt)
        let token = jwt.sign({
            user: userDB
        }, secret, { expiresIn: 60 * 60 });

        // Otra forma de Crear el token
        // res.status(200).send({
        //     token: jwt.crearToken(user)
        // });

        // Si la contraseña hace match con la de la DB
        res.json({
            ok: true,
            user: userDB,
            token
        });
    });
};

// Metodo actualizar usuario

exports.updateUser = (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'surname', 'email', 'role', 'imagen']);

    User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userDB) => {

        // Manejando el error en la DB
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            user: userDB
        });
    });
};

// Metodo para subir Imagen
exports.uploadImage = (req, res) => {

    let userId = req.params.id;

    let file_name = 'No se subio...';

    if (req.files) {

        let file_path = req.files.image.path;

        let file_split = file_path.split('\\');

        let file_name = file_split[2];

        let ext_split = file_name.split('\.');

        let file_ext = ext_split[1];

       if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
           User.findByIdAndUpdate(userId, {imagen: file_name}, {new: true, runValidators: true}, (err, userUpdate) => {
               if (err) {
                return res.status(500).json({
                    ok:false,
                    error: err,
                    msg: 'Error en la peticion. Intente Nuevamente'
                });
               }

               if (!userUpdate) {
                return res.status(404).json({
                    ok:false,
                    error: err,
                    msg: 'Error!! No se pudo actualizar la imagen del artista'
                });
               }

               res.status(200).json({
                ok: true,
                userUpdate,
                msg: 'La imagen del usuario se ha actualizado exitosamente'
             });
           })
       } else {
        res.status(200).json({
            ok:false,
            error: err,
            msg: 'Error!! Extension del archivo no valida'
        });
       }
    } else {
        res.status(200).json({
            ok:false,
            error: err,
            msg: 'Error!! No has subido ninguna imagen'
        });
    }
};

// Metodo obtener imagen de usuario
exports.getImageFile = (req, res) => {

    let imageFile = req.params.imageFile;

    let fileImage = './uploads/users/' + imageFile ;

   fs.exists(fileImage, (exists) => {
       if (exists) {
           res.sendFile(path.resolve(fileImage));
       } else {
        return res.status(500).json({
            ok: false,
            msg: 'No existe la imagen solicitada'
        });
       }
   })
}


// Metodo Get
exports.getUser = (req, res) => {
    res.json({
        nombre: 'Jimi',
        apellido: 'Quintero',
        email: 'jjimiq@gmail.com',
        edad: 47,
        pais: 'Venezuela'
    });
}