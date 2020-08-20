const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

const artistSchema = new Schema({

  name: {
    type: String,
    required: [true, 'El campo Nombre es Obligatorio']
  },
  description: {
    type:String,
    required: [true, 'El campo Descripción es Obligatorio']
  },
  imagen: {
    type: String,
    default: 'null'
  }
});



module.exports = mongoose.model('Artist', artistSchema);