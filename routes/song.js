const express = require('express');
const router = express.Router();
const songController = require('../controllers/songController');
const md_auth = require('../middlewares/authenticated');

const multiparty = require('connect-multiparty');
const md_upload = multiparty({
  uploadDir: './uploads/songs'
});


router.get('/song/:id', md_auth.verificaToken, songController.getSong);
router.post('/song', md_auth.verificaToken, songController.saveSong);
// router.get('/songs/:album?', md_auth.verificaToken, songController.getSongs);
router.put('/song/:id', md_auth.verificaToken, songController.updateSong);
router.delete('/song/:id', md_auth.verificaToken, songController.deleteSong);
router.post('/upload-file-song/:id', [md_auth.verificaToken, md_upload], songController.uploadFile);
router.get('/get-song-file/:songFile', songController.getSongFile);



module.exports = router;