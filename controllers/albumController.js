let path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const Album = require('../models/model_album');
const Artist = require('../models/model_artist');
const Song = require('../models/model_song');
const _ = require('underscore');




//Metodo obtener un album por un Id y esta asociado a un artista
exports.getAlbum = (req, res) => {

    let idx = req.params.id;

    Album.findById(idx, (err, albumDB) => {
      
    Artist.populate(albumDB, {path: 'artist'}, (err, albumDB) => {

      if (err) {
        return res.status(500).json({
          ok: false,
          error: err,
          message: 'Error al realizar la petición'
        });
      }

      return res.status(200).json({
        ok: true,
        albumDB
      });

    });

  });
     
  } 

 
  

  /* let albumId = req.params.id;

  Album.findById(albumId).populate({path: 'artist'}).exec((err, albumDB) => {

    if (err) {
      return res.status(500).json({
        ok: false,
        error: err,
        message: 'Error al realizar la petición'
      });
    }

    if (!albumDB) {
      return res.status(404).json({
        ok: false,
        error: err,
        message: 'Error..!! El album no existe'
      });
    }

    return res.status(200).json({
      ok: true,
      albumDB
    });

  }); */
  

  
// Metodo para obtener todos los album
/* exports.getAlbums = (req, res) => {
  let artistId = req.params.artist;

    if (!artistId) {
      // Sacar todos los albums de la DB
     let find = Album.find({}).sort('title');
    } else {
      // Sacar los albums de un artista concreto de la DB
      let find = Album.find({artist: artistId}).sort('year');
    }

    find.populate({path: 'artist'}).exec((err, albums) => {

      if (err) {
        return res.status(500).json({
          ok: false,
          error: err,
          message: 'Error al realizar la petición'
        });
      } 
      
      if (!albums) {
        return res.status(404).json({
          ok: false,
          error: err,
          message: 'No hay albums'
        });
      }

      return res.status(200).json({
        ok: true,
        albums
      });

    });
} */


// Metodo para guardar un album
exports.saveAlbum = (req, res) => {

  let data = req.body;

  let album = new Album({
    title: data.title,
    description: data.description,
    year: data.year,
    imagen: 'null',
    artist: data.artist
  });

  // console.log(req.body);

  album.save((err, albumDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

      res.status(200).json({
      ok: true,
      album: albumDB
    });

  });
}

// Metodo para actualizar album
exports.updateAlbum = (req, res) => {

  let albumId = req.params.id;
  let body = _.pick(req.body, ['title', 'description', 'year', 'imagen']);

  Album.findByIdAndUpdate(albumId, body, {new: true, runValidators: true}, (err, albumDB) => {
   
    if (err) {
      return res.status(500).json({
        ok: false,
        error: err,
        message: 'Error..!! en la petición'
      });
    }

    if (!albumDB) {
      return res.status(404).json({
        ok: false,
        error: err,
        message: 'No se ha actualizado el album'
      });
    }

    res.status(200).json({
      ok: true,
      album: albumDB
    });
  })
}

// Metod para eliminar un album
exports.deleteAlbum = (req, res) => {

  let albumId = req.params.id;

  Album.findByIdAndRemove(albumId, (err, albumRemoved) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        error: err,
        message: 'Error..!! en la petición'
      });
    } else{
      if (!albumRemoved) {
        return res.status(404).json({
          ok: false,
          error: err,
          message: 'No se ha eliminado el album'
        });
      } else {
        Song.find({album: albumId._id}).remove((err, songRemoved) => {
          if (err) {
            return res.status(500).json({
              ok: false,
              error: err,
              message: 'Error..!! en la petición'
            });
          } else {
            if (!songRemoved) {
              return res.status(404).json({
                ok: false,
                error: err,
                message: 'La canción no ha sido eliminada',
              });
            } else {
              return res.status(200).json({
                ok: true,
                albumRemoved,
              });
            }
          }
        });
      }
    }
  });
}

// Metodo para subir una imagen de artista
exports.uploadImage = (req, res) => {
  let albumId = req.params.id;
  let file_name = 'Imagen no subida...!!';

  if (req.files) {
    let file_path = req.files.image.path;

    let file_split = file_path.split('\\');

    let file_name = file_split[2];

    let ext_split = file_name.split('.');

    let file_ext = ext_split[1];

    if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
      Album.findByIdAndUpdate(albumId, { imagen: file_name }, { new: true, runValidators: true }, (err, albumUpdated) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            error: err,
            msg: 'Error en la peticion. Intente Nuevamente',
          });
        }

        if (!albumUpdated) {
          return res.status(404).json({
            ok: false,
            error: err,
            msg: 'Error!! No se pudo actualizar la imagen del album',
          });
        }

        res.status(200).json({
          ok: true,
          albumUpdated,
          msg: 'La imagen del album se ha actualizado exitosamente',
        });
      });
    } else {
      res.status(200).json({
        ok: false,
        error: err,
        msg: 'Error!! Extension del archivo no valida',
      });
    }
  } else {
    res.status(200).json({
      ok: false,
      error: err,
      msg: 'Error!! No has subido ninguna imagen',
    });
  }
};

// Metodo para obtener la imagen de un artista
exports.getImageFile = (req, res) => {
  let imageFile = req.params.imageFile;

  let fileImage = './uploads/albums/' + imageFile;

  fs.exists(fileImage, (exists) => {
    if (exists) {
      res.sendFile(path.resolve(fileImage));
    } else {
      return res.status(500).json({
        ok: false,
        msg: 'No existe la imagen solicitada',
      });
    }
  });
};
