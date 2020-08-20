'use strict'
const express = require('express');
const bodyParser = require('body-parser');
const index_routes = require('../routes/index');
const mongoose = require('mongoose');
const port = process.env.PORT || 3000;
const app = express();

// Cargando las Rutas
// app.use(index_routes);

// Implementnado Body-Parser

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Middleware para rutas base
app.use('/api', index_routes);

// Configurar las cabeceras



app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

// Mongoose Deprecation
mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true);

// Conexion a la DB

mongoose.connect('mongodb://localhost:27017/myMEAN', (err, respuesta) => {
    if (err) {
        throw err;
    }
    console.log('Conectado correctamente a la base de datos');
});