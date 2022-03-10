/* ***********************************

*  Descripción:
*  Midelware que verifica JWT y niveles de acceso del usuario.

* ************************************ */

(function () {
    'use strict';
  
    var Jwt = require('jwt-simple')
    var Usuarios = require('./models/usuarios/usuarios').User;
  
    function middlewareWrapper(intNivel) {
  
      return function guardsMiddleware(req, res, next) {
  
        // JwToken recibido por encabezado.
        var tokenClient = req.header('token');

        // Nivel de acceso requerido por el recurso.
        var nivelAccess = intNivel || 0;

        // Nivel de acceso requerido por el recurso.
        var secretWord = process.env.SECRET_WORD || ''

        // Valida palabra secreta ( presente en la variable de entorno ).
        if(secretWord=='') return res.status(500).json({estado:false, message: 'Error de configuración en el servidor.'});

        if(!tokenClient) return res.status(401).json({estado:false, message: 'El usuario no está loguado.'});

        // Decodificar token
        var payload = Jwt.decode(tokenClient, secretWord);

        // Evalua el vencimiento del token
        if( payload.exp  < Date.now() ) return res.status(401).json({estado:false, message: 'Expiró la sesión'}); 

        // Recupera el usuario de la DB
        getUser( payload.userName ).then((user)=>{
          
          if(user==false) return res.status(500).json({estado:false, message: 'El servidor no pudo determinar los privilegios del usuario.(1)'});

          // Paso el usuario a la delegación
          req.usuario = user;

          // Evalua privilegios del usuario
          if(user.nivel < nivelAccess) return res.status(401).json({estado:false, message: 'Privilegios insuficientes.'});

          // Hasta aquí superó todas las evaluaciónes
          next();

        }).catch(error=>{

          console.log(error);
          return res.status(500).json({estado:false, message: 'El servidor no pudo determinar los privilegios del usuario.(2)'});

        });
        

      }

      // Recupera el usuario de la DB
      function getUser(userName){
        return new Promise((resolve, reject )=>{

          // Recupera el usuario para verificar privilegios.
          Usuarios.findOne( { userName: userName }, function( errUser, user ){

            // Retorno en caso de error en la consulta
            if(errUser || user===null ) {
              console.log(errUser)
              return resolve(false);
            } 
            
            // retorna el usuario
            return resolve(user);
          });

        });
      }

    }
  
    // can pass either an options hash, an options delegate, or nothing
    module.exports = middlewareWrapper;
  
  }());
  