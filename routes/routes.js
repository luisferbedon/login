var express = require('express');
var router = express.Router();
var passport = require('passport');
var controllers = require('.././controllers');
var AuthMiddleware = require('.././middleware/auth');
//var formidable = require('express-formidable');
//var fs = require('fs');

router.get('/', controllers.HomeController.index);

//routas de usuario
router.get('/auth/signup', AuthMiddleware.isLogged , controllers.UserController.getSignUp);
router.get('/users/crm', AuthMiddleware.isLogged , controllers.UserController.crm);
router.post('/auth/signup', AuthMiddleware.isLogged , controllers.UserController.postSignUp);
router.get('/auth/signin', controllers.UserController.getSignIn);
router.post('/auth/signin',  passport.authenticate('local', {
	successRedirect : '/users/panel',
	failureRedirect : '/auth/signin',
	failureFlash : true 
}));
router.get('/auth/logout', controllers.UserController.logout);
router.get('/users/panel', AuthMiddleware.isLogged ,controllers.UserController.getUserPanel);
router.get('/users/perfil', AuthMiddleware.isLogged, controllers.UserController.getProfile);
router.post('/users/perfil', AuthMiddleware.isLogged, controllers.UserController.postProfile);

module.exports = router;
