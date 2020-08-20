'use strict';
const path = require('path');
const fs = require('fs');
const _ = require('underscore');
// const mongoosePaginate = require('mongoose-pagination');
const Album = require('../models/model_album');
const Artist = require('../models/model_artist');
const Song = require('../models/model_song');
const { exists } = require('../models/model_album');

// Metodo obtener Artista por Id

exports.getArtist = (req, res) => {
  let artistId = req.params.id;

  Artist.findById(artistId, (err, artistDB) => {
    if (err) {
      res.status(500).json({
        ok: false,
        err,
      });
    } else {
      if (!artistDB) {
        res.status(404).json({
          ok: false,
          message: 'El artista no existe',
        });
      } else {
        res.status(200).json({
          ok: true,
          artistDB,
        });
      }
    }
  });
};

// Metodo listar (obtener lista) Artistas
exports.getArtists = (req, res) => {
  Artist.find({})
    .skip(0)
    .exec((err, artists) => {
      if (err) {
        return res.status(500).json({
          ok: true,
          err,
        });
      }

      res.json({
        ok: true,
        artists,
      });
    });
};

// Metodo Insertar (guardar) artista
exports.saveArtist = (req, res) => {
  let data = req.body;

  let artist = new Artist({
    name: data.name,
    description: data.description,
    imagen: 'null',
  });

  // console.log(req.body);

  artist.save((err, artistDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      artist: artistDB,
    });
  });
};

// Metodo Actualizar un Artista
exports.updateArtist = (req, res) => {
  let id = req.params.id;
  let body = _.pick(req.body, ['name', 'description']);

  Artist.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, artistDB) => {
    // Manejando el error en la DB
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      artist: artistDB,
    });
  });
};

// Metodo para eliminar un Artista
exports.deleteArtist = (req, res) => {
  let id = req.params.id;

  Artist.findByIdAndRemove(id, (err, artistRemoved) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        error: err,
        message: 'Error al eliminar el artista',
      });
    } else {
      if (!artistRemoved) {
        return res.status(404).json({
          ok: false,
          error: err,
          message: 'El artista no se ha eliminado',
        });
      } else {
        Album.find({ artist: artistRemoved._id }).remove((err, albumRemoved) => {
          if (err) {
            return res.status(500).json({
              ok: false,
              error: err,
              message: 'Error al eliminar el album',
            });
          } else {
            if (!albumRemoved) {
              return res.status(404).json({
                ok: false,
                error: err,
                message: 'El album no se ha eliminado',
              });
            } else {
              Song.find({ album: albumRemoved._id }).remove((err, songRemoved) => {
                if (err) {
                  return res.status(500).json({
                    ok: false,
                    error: err,
                    message: 'Error al eliminar la canción',
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
                      artistRemoved,
                    });
                  }
                }
              });
            }
          }
        });
      }
    }
  });
};

// Metodo para subir una imagen de artista
exports.uploadImage = (req, res) => {
  let artistId = req.params.id;
  let file_name = 'Imagen no subida...!!';

  if (req.files) {
    let file_path = req.files.image.path;

    let file_split = file_path.split('\\');

    let file_name = file_split[2];

    let ext_split = file_name.split('.');

    let file_ext = ext_split[1];

    if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
      Artist.findByIdAndUpdate(artistId, { imagen: file_name }, { new: true, runValidators: true }, (err, artistUpdate) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            error: err,
            msg: 'Error en la peticion. Intente Nuevamente',
          });
        }

        if (!artistUpdate) {
          return res.status(404).json({
            ok: false,
            error: err,
            msg: 'Error!! No se pudo actualizar la imagen del artista',
          });
        }

        res.status(200).json({
          ok: true,
          artistUpdate,
          msg: 'La imagen del artista se ha actualizado exitosamente',
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

  let fileImage = './uploads/artists/' + imageFile;

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
