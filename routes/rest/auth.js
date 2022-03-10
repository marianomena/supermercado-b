/* 
 * CONTROLADOR: auth.js
 * Maneja la estrategia de autenticación del sistema
 */

// --------------- Dependencias ---------------
var express = require('express');
var router = express.Router();
var Usuarios = require('../../models/usuarios/usuarios').User;
var Jwt = require('jwt-simple')
var bcrypt = require('bcrypt');
var Stp = require('../../config/setup');
// --------------- Fin de Dependencias ---------------

// ======================================================================= 
// ======================   Rutas del controlador   ====================== 
// ======================================================================= 

/* ------------- SignIn del usuario a través de usuario y contraseña ----------------- */
router.post('/', async function(req, res, next) {

  let userName = req.body.userName || '';
  let password = req.body.password || '';
  
  let user = await getUserByUserName(userName);
  if( !user ) return res.status(404).json({ status:false, message:'Usuario o contraseña incorrecto.'});

  if(!bcrypt.compareSync(password, user.password)) return res.status(404).json({ status:false, message:'Usuario o contraseña incorrecto.'});

  // Crear sesión
  let session = await crearSesion(user, req, res);
  console.log(session)

  if( !session ) return res.status(500).json({ status:false, message:'Error iniciando sesión.'});

  let resUser = {
    firstName: user.firstName,
    lastName: user.lastName,
    userName: user.userName,
  }
  
  return res.json({ status:true, message:'Sesión iniciada con éxito', user: resUser, token:session});
});

// router.post('/recovery', async function(req, res, next) {

//   let userName = req.body.user || '';

//   let usuario = await getUserByUserName(userName);
//   if( !usuario ) return res.status(404).json({ status:false, message:'No existe ninguna cuenta asociada.'});

//   let recupera = passwordHash('Lapostal256');

//   if( !recupera ) return res.status(500).json({ status:false, message:'Error recuperando acceso.'});

//   res.json({ status:true, message:'Reuperación enviada', recupera});
  
// });

/* ------------- SignUp del usuario  ----------------- */
router.post('/signup', async function(req, res, next) {

  let userName = req.body.userName || '';
  let password = req.body.password || '';
  let firstName = req.body.firstName || '';
  let lastName = req.body.lastName || '';
  let email = userName;


  if( userName === '' ) return res.status(201).json({ status:false, message:'El campo usuario es requerido.'});
  if( password === '' ) return res.status(201).json({ status:false, message:'El campo password es requerido.'});

  let usuario = await getUserByUserName(userName);
  if( usuario !== false ) return res.status(201).json({ status:false, message:'Ya existe una cuenta con ese usuario.'});

  let user = { userName, password: await passwordHash(password), firstName, lastName, email }
  let newUser = await creatUser(user);
  if( !newUser ) return res.status(500).json({ status:false, message:'Error creando usuario.'});

  res.json({ status:true, message:'Usuario creado con éxito.'});
  
});


// ======================================================================= 
// ==================== FIN Rutas del controlador   ====================== 
// ======================================================================= 

// ======================================================================= 
// ====================== Funciones del controlador ====================== 
// ======================================================================= 
function getUserByUserName(userName){

  return new Promise((resolve, reject)=>{

    Usuarios.findOne( { userName }, function( errUser, user ){
      
      if( errUser ) return resolve(false);

      if(user === null) return resolve(false);

      return resolve(user);

    });

  });

}


function creatUser(user){

  return new Promise((resolve, reject)=>{

    Usuarios( user ).save(function( errUser, user ){
      
      if( errUser ){
       
        console.log(errUser)
        return resolve(false);
      }

      if(user === null) return resolve(false);

      return resolve(user);

    });

  });

}


function crearSesion(user, req, res){

  return new Promise((resolve, reject)=>{
    
    try {
      
      // Crea session 
      // IP del ordenador del cliente
      var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
      
      // Configuración del payload;
      var duracion= Stp.timeSession;// Minutos de vida del token
      var expira = Date.now() + ( duracion * 60 * 1000 )
      var payload = { 
                      userName: user.userName, 
                      ip:ip, 
                      exp: expira
                    }
      
      // Genera el token
      let secretWord = process.env.SECRET_WORD || '';

      if(secretWord == '')  return resolve(false);

      var newToken = Jwt.encode(payload, secretWord);

      return resolve(newToken);

    } catch (error) {
      console.log(error);
      return resolve(false);
    }

  });

}

function passwordHash(password){

  return new Promise((resolve, reject)=>{

    bcrypt.hash( password , 12)
          .then( hashed=>{
            return resolve(hashed);
          })
          .catch(err=>{
            return resolve(false);
          });
  });
}

// ======================================================================= 
// ================== FIN Funciones del controlador ====================== 
// ======================================================================= 


// ====================== Exportación de módulos ====================== 
module.exports = router;
// ====================== Exportación de módulos ====================== 