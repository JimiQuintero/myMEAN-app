const mongoose = require('mongoose');

let Schema = mongoose.Schema;


const songSchema = new Schema({

    number: {
        type: Number,
        required: [true, 'El campo numero es Obligatorio']
    },

    name: {
        type: String,
        required: [true, 'El campo Nombre es Obligatorio']
    },

    duration: {
        type: String,
        required: [true, 'El campo duracion es obligatorio']
    },

    file: {
        type: String,
        default: 'null'
    },

    album: { type: Schema.ObjectId, ref: "album" }

});

module.exports = mongoose.model('Song', songSchema);