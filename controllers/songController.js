let path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const Album = require('../models/model_album');
const Artist = require('../models/model_artist');
const Song = require('../models/model_song');
const _ = require('underscore');


// Metodo obtener Canción
exports.getSong = (req, res) => {

  let idx = req.params.id;

    Song.findById(idx, (err, songDB) => {
     
      Album.populate(songDB, {path: 'album'}, (err, songDB) => {

        if (err) {
          return res.status(500).json({
            ok: false,
            error: err,
            message: 'Error al realizar la petición'
          });
        }

        return res.status(200).json({
          ok: true,
          song: songDB
        });
      });
    });
  }

/* Song.findById(songId).populate({path: 'album'}).exec((err, songDB) => {
  
  if (err) {
    return res.status(500).json({
      ok: false,
      err,
    });
  }

  if (!songDB) {
    return res.status(404).json({
      ok: false,
      error: err,
      message: 'La canción no existe',
    });
  }

  res.json({
    ok: true,
    song: songDB,
  });

 }); */

// Metodo guardar canción
exports.saveSong = (req, res) => {

  let data = req.body;

  let song = new Song({
    number: data.number,
    name: data.name,
    duration: data.duration,
    file: 'null',
    album: data.album
  });

  song.save((err, songDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        error: err,
        message: 'Error..!! en la petición'
      });
    }

    res.json({
      ok: true,
      song: songDB,
    });
  });
}

// Metodo para listar canciones
/* exports.getSongs = (req, res) => {

    let albumId = req.params.album;

      if (!albumId) {
        let find = Song.find({}).sort('number');
      } else {
        let find = Song.find({album: albumId}).sort('number');
      }

        find.populate({
          path: 'album',
          populate: {
            path: 'artist',
            model: 'Artist'
          }
        }).exec((err, songs) => {

          if (err) {
            return res.status(500).json({
              ok: false,
              error: err,
              message: 'Error..!! en la petición'
            });
          }

          res.json({
            ok: true,
            songs
          });
        });
      } */

// Metodo para actualizar canción
exports.updateSong = (req, res) => {
  let songId = req.params.id;

  let body = req.body;

  Song.findByIdAndUpdate(songId, body, {new: true, runValidators: true}, (err, songUpdated) => {

    if (err) {
      return res.status(500).json({
        ok: false,
        error: err,
        message: 'Error..!! en la petición'
      });
    }

    if (!songUpdated) {
      return res.status(404).json({
        ok: false,
        error: err,
        message: 'Error..!! No se ha actuañizado la canción'
      });
    }

    return  res.json({
      ok: true,
      songUpdated
    });

  });
}

// Metodo para borrar una canción
exports.deleteSong = (req, res) => {

  let songId = req.params.id;

  Song.findByIdAndRemove(songId, (err, songRemoved) => {

    if (err) {
      return res.status(500).json({
          ok:false,
          error: err,
          msg: 'Error en la peticion. Intente Nuevamente'
      });
  }

  if (!songRemoved) {
      return res.status(404).json({
          ok:false,
          error: err,
          msg: 'Error!! La Canción no pudo eliminarse'
      });
  }

  return res.status(200).json({
      ok: true,
      songRemoved,
      msg: 'La Cancion se ha eliminado exitosamente'
  });
  });
}

// Metodo para subir un archivo de audio de cancion
exports.uploadFile = (req, res) => {
  let songId = req.params.id;
  let file_name = 'Imagen no subida...!!';

  if (req.files) {
    let file_path = req.files.file.path;

    let file_split = file_path.split('\\');

    let file_name = file_split[2];

    let ext_split = file_name.split('.');

    let file_ext = ext_split[1];

    if (file_ext == 'mp3' || file_ext == 'ogg') {
      Song.findByIdAndUpdate(songId, { file: file_name }, { new: true, runValidators: true }, (err, songUpdated) => {
       
        if (err) {
          return res.status(500).json({
            ok: false,
            error: err,
            msg: 'Error en la peticion. Intente Nuevamente',
          });
        }

        if (!songUpdated) {
          return res.status(404).json({
            ok: false,
            error: err,
            msg: 'Error!! No se pudo actualizar la canción',
          });
        }

        res.status(200).json({
          ok: true,
          songUpdated,
          msg: 'La canción del artista se ha actualizado exitosamente',
        });
      });
    } else {
      res.status(200).json({
        ok: false,
        error: err,
        msg: 'Error!! Extension del fichero no es valida',
      });
    }
  } else {
    res.status(200).json({
      ok: false,
      error: err,
      msg: 'Error!! No has subido ningun archivo',
    });
  }
}

// Metodo para obtener el archivo (file) canción
exports.getSongFile = (req, res) => {
  
  let songFile = req.params.songFile;

  let fileImage = './uploads/songs/' + songFile;

  fs.exists(fileImage, (exists) => {
    
    if (exists) {
      res.sendFile(path.resolve(fileImage));
    } else {
      return res.status(500).json({
        ok: false,
        msg: 'No existe el fichero de audio solicitado',
      });
    }
  });
};

