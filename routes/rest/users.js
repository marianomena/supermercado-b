/* 
 * CONTROLADOR: users.js
 * Maneja el CRUD para los usuarios
 */

// --------------- Dependencias ---------------
var express = require('express');
var router = express.Router();
var Guards = require('../../guards');
var Usuarios = require('../../models/usuarios/usuarios').User;
// --------------- Fin de Dependencias ---------------


// ======================================================================= 
// ======================   Rutas del controlador   ====================== 
// ======================================================================= 
/* ------------- Recupera la lista de items. ----------------- */
router.get('/', Guards(5), async function(req, res, next) {

  let page = req.body.page || 0;
  let limit = req.body.limit || 25;
  let sort = req.body.sort || 1;

  let usersList = await getUsers( parseInt(page), parseInt(limit), parseInt(sort) );

  res.json({status:true, message:'', usersList});
});


// ======================================================================= 
// ==================== FIN Rutas del controlador   ====================== 
// ======================================================================= 


// ======================================================================= 
// ====================== Funciones del controlador ====================== 
// ======================================================================= 

function getUsers(page = 0, limit = 25, sort=1){

  return new Promise((resolve, reject)=>{

    var query = Usuarios.find();
				
    // var fechaDesde = req.body.desde; // YYYY-MM-DD
    // var fechaHasta = req.body.hasta; // YYYY-MM-DD
    // var desde = new Date(fechaDesde+'T00:00:00.000Z');
    // var hasta = new Date(fechaHasta+'T23:00:00.000Z');

    // query.where({creado: {$gte: desde }});
    // query.where({creado: {$lte: hasta }});
    query.select({
                    userName: 1,
                    email: 1,
                    firstName: 1,
                    lastName: 1,
                    status: 1,
                    avatar: 1,
                    nivel: 1
              });
                
    query.skip(( page * limit ))
    query.limit(limit);
    query.sort({created_at: sort});

    query.exec(async function (errorQuery, docs) {

      if( errorQuery ) return resolve(false);

      if(docs === null) return resolve(false);

      return resolve(docs);

    });

  });

}

// ======================================================================= 
// ================== FIN Funciones del controlador ====================== 
// ======================================================================= 


// ====================== Exportación de módulos ====================== 
module.exports = router;
// ====================== Exportación de módulos ====================== 