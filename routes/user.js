const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const md_auth = require('../middlewares/authenticated');
//  Crear la ruta que va ha tener el metodo en el controlador

const multiparty = require('connect-multiparty');
const md_upload = multiparty({ 
  uploadDir: './uploads/users' 
});

router.get('/user', md_auth.verificaToken, userController.getUser);
router.post('/register', userController.saveUser);
router.post('/login', userController.loginUser);
router.put('/update-user/:id', md_auth.verificaToken, userController.updateUser);
router.post('/upload-image-user/:id', [md_auth.verificaToken, md_upload], userController.uploadImage);
router.get('/get-image-user/:imageFile', userController.getImageFile);



module.exports = router;