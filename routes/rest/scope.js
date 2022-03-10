/* 
 * CONTROLADOR: scope.js
 * Maneja el Scope del path solicitado por el cliente(app)
 * Fecha: 19.12.21
 * Author: pamaco
 */

// --------------- Dependencias ---------------
var express = require('express');
var router = express.Router();
var Guards = require('../../guards');
var Scope = require('../../models/scopePath/scope').scopePath;
// --------------- Fin de Dependencias ---------------


// ======================================================================= 
// ======================   Rutas del controlador   ====================== 
// ======================================================================= 
/* ------------- Retorna la condición del usuario logueado, frente al path solicitado ----------------- */
router.post('/', Guards(1), async function(req, res, next) {

  let userLevel =  req.usuario.nivel;

  let path =  req.body.path || '';

  if(path=='') return res.status(401).json({ status: false, message: 'Scope requerido' });

  let scope = await getPathScope(path);

  if(!scope) return res.status(401).json({status:false, message: 'Scope inexistente'});

  if(userLevel < scope.nivel) return res.status(401).json({status:false, message: 'Privilegios insuficientes'});

  return res.status(200).json({status:true, message: 'Acceso permitido'});
});


// Ruta para que el cliente verifique su sesion, si esta activa o caducó
router.get('/', Guards(0), async function(req, res, next) {
  
  return res.status(200).json({status:true, message: 'Sessión existente.'});

});

// ======================================================================= 
// ==================== FIN Rutas del controlador   ====================== 
// ======================================================================= 


// ======================================================================= 
// ====================== Funciones del controlador ====================== 
// ======================================================================= 

/* 
 * Descripcion: Función que recupera un registro segun el primer parámetro(mongo) 
 * Parámetros: 
 *            1ro | path: <string> | El path a encontrar
 * Retorna una promesa: <Boolean | item:[scopeModel]>
 * Fecha: 19.12.21
 * Author: pamaco
 */
function getPathScope(text=''){

  return new Promise((resolve, reject)=>{

    var query = Scope.findOne({path: text}); 
  
    query.exec(async function (errorQuery, docs) {

      if( errorQuery ) {
       
       console.log(errorQuery);
        return resolve(false);
      }

      if(docs === null) return resolve(false);

      return resolve(docs);

    });

  });

}


/* 
 * Descripcion: Función que inserta un item en la DB(mongo) 
 * Parámetros: 
 *            1ro | producto: <ScopeModel> | Objeto con las propiedades del registro a insertar(name, description, etc)
 * Retorna una promesa: <Boolean | item:ScopeModel>
 * Fecha: 19.12.21
 * Author: pamaco
 */
function createScopePath( scope ){

  return new Promise((resolve, reject)=>{

    Scope( scope ).save(function( error, doc ){
      
      if( error ){
       
        console.log(error)
        return resolve(false);
      }

      if(doc === null) return resolve(false);

      return resolve(doc);

    });

  });

}

// ======================================================================= 
// ================== FIN Funciones del controlador ====================== 
// ======================================================================= 


// ====================== Exportación de módulos ====================== 
module.exports = router;
// ====================== Exportación de módulos ====================== 