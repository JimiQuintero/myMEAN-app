const mongoose = require('mongoose');

let Schema = mongoose.Schema;

const albumSchema = new Schema({

    title: {
        type: String,
        required: [true, 'El campo Titulo es Obligatorio']
    },

    description: {
        type: String,
        required: [true, 'El campo Descrpción es Obligatorio']
    },

    year: {
        type: Number,
        required: [true, 'El campo Año es Obligatorio']
    },

    imagen: {
        type: String,
        default: 'null'
    },

    // autor: { type: Schema.ObjectId, ref: "Autor" } 

    artist: { type: Schema.ObjectId, ref: "artist" }
});



module.exports = mongoose.model('Album', albumSchema);