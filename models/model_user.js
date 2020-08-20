const mongoose = require('mongoose');
let Schema = mongoose.Schema;


const UserSchema = new Schema({

    name: {
        type: String,
        required: [true, 'El campo nombre es obligatorio']
    },
    surname: {
        type: String,
        required: [true, 'El campo nombre es obligatorio']
    },
    email: {
        type: String,
        required: [true, 'El campo email es obligatorio']
    },
    password: {
        type: String,
        required: [true, 'El campo password es obligatorio']
    },

    rol: String,

    imagen: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('User', UserSchema);