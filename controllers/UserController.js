var mysql = require('mysql');
var bcrypt = require('bcryptjs');
//var express = require('express');
var formidable = require('express-formidable');

module.exports = {

	//controlador para gestionar ewl perfil 
	getProfile : function(req, res, next)
	{
		return res.render('users/perfil',{
			isAuthenticated : req.isAuthenticated(),
			user: req.user,
			message : req.flash('info')
		})
	},
	//peticion post para actualizar los campos del perfil
	postProfile : function(req,res,next)
	{
		var config = require('.././database/config');
		var db = mysql.createConnection(config);
		db.connect();
		 var salt = bcrypt.genSaltSync(10);
                var password = bcrypt.hashSync(req.body.password, salt);
                var user = {
                    nombre : req.body.nombre,
                    password : password
                };
		//sql para actualizar datos 
        db.query('UPDATE riodedio_node.usuarios SET ? WHERE usuarios.id='+req.body.id, user ,function(err, rows, fields){
                    if(err) throw err;
                });
                req.flash('info', 'Se Actualizó correctamente los datos');
                   db.end();
                return res.redirect('/users/perfil'); 
	},
	//controlador para  nuevo usuario
	getSignUp : function(req, res, next){
		return res.render('users/signup', {
			isAuthenticated : req.isAuthenticated(),
			user : req.user,
			message : req.flash('info'),
			fail_msg : req.flash('fail_msg')
			
		});
	},

    crm : function(req, res, next){
		var user = req.user;
		if(user.tipo==1)
			{
				return res.render('users/crm', {
			isAuthenticated : req.isAuthenticated(),
			user : req.user
				});
			}
		else
			return res.redirect('/');
	},
	//controlador para nuevo usuario 
	postSignUp: function(req, res, next){
        
        var config = require('.././database/config');
		var db = mysql.createConnection(config);
		db.connect();
        db.query('SELECT * FROM riodedio_node.usuarios WHERE email = ?', req.body.email , function(err, rows, fields){
			if(err) throw err;
            if(rows.length > 0)
                {
                    req.flash('fail_msg', 'Ya  existe un usuario con ese correo electrónico');
                    console.log('no se creo el usuario ');
                       db.end();
                    return res.redirect('/auth/signup'); 
                }
            else
            {
             //encriptacion de contraseñas 
                var salt = bcrypt.genSaltSync(10);
                var password = bcrypt.hashSync(req.body.password, salt);

                var user = {
                    email : req.body.email,
                    nombre : req.body.nombre,
					tipo : req.body.tipo,
					grupo: req.body.grupo,
                    password : password
                };
                db.query('INSERT INTO riodedio_node.usuarios SET ?', user, function(err, rows, fields){
                    if(err) 
						console.log(err);
                });
                req.flash('info', 'Se registró correctamente el nuevo usuario');
                   db.end();
                return res.redirect('/auth/signup');   
            }
		});
		
	},

	getSignIn: function(req, res, next){
		return res.render('users/signin', {message: req.flash('info'), authmessage : req.flash('authmessage')});
	},

	logout : function(req, res, next){
		req.logout();
		res.redirect('/auth/signin');
	},

	getUserPanel : function(req, res, next){
		res.render('users/panel', {
			isAuthenticated : req.isAuthenticated(),
			user : req.user
		});
	}



};