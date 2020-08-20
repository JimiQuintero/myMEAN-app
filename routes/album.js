const express = require('express');
const router = express.Router();
const albumController = require('../controllers/albumController');
const md_auth = require('../middlewares/authenticated');
const multiparty = require('connect-multiparty');
const md_upload = multiparty({
  uploadDir: './uploads/albums'
});


router.get('/album/:id', md_auth.verificaToken, albumController.getAlbum);
router.post('/album', md_auth.verificaToken, albumController.saveAlbum);
// router.get('/albums/:artist', md_auth.verificaToken, albumController.getAlbums);
router.put('/album/:id', md_auth.verificaToken, albumController.updateAlbum);
router.delete('/album/:id', md_auth.verificaToken, albumController.deleteAlbum);
router.post('/upload-image-album/:id', [md_auth.verificaToken, md_upload], albumController.uploadImage);
router.get('/get-image-album/:imageFile', albumController.getImageFile);



module.exports = router;