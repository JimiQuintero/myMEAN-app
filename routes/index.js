const express = require('express');
const user_routes = require('./user');
const artist_routes = require('./artist');
const album_routes = require('./album');
const song_routes = require('./song');

const app = express();

app.use(user_routes);
app.use(artist_routes);
app.use(album_routes);
app.use(song_routes)


// Creando Rutas

// app.get('/', (req, res) => {
//     res.json({
//         nombre: 'Jimi',
//         apellido: 'Quintero',
//         email: 'jjimiq@gmail.com'
//     })
// })

module.exports = app;