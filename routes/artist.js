'use strict'
const express = require('express');
const router = express.Router();
const artistController = require('../controllers/artistController');
const md_auth = require('../middlewares/authenticated');

const multiparty = require('connect-multiparty');
const md_upload = multiparty({
  uploadDir: './uploads/artists'
});

router.get('/artist', md_auth.verificaToken, artistController.getArtist);
router.post('/artist', md_auth.verificaToken, artistController.saveArtist);
router.get('/artist/:id', md_auth.verificaToken, artistController.getArtist);
router.get('/artists', md_auth.verificaToken, artistController.getArtists);
router.put('/artist/:id', md_auth.verificaToken, artistController.updateArtist);
router.delete('/artist/:id', md_auth.verificaToken, artistController.deleteArtist);
router.post('/upload-image-artist/:id', [md_auth.verificaToken, md_upload], artistController.uploadImage);
router.get('/get-image-artist/:imageFile', artistController.getImageFile);



module.exports = router;