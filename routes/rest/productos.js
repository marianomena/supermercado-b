/* 
 * CONTROLADOR: productos.js
 * Maneja el CRUD para los productos
 * Fecha: 
 */

// --------------- Dependencias ---------------
var express = require('express');
var router = express.Router();
var Productos = require('../../models/productos/productos').Productos;
// --------------- Fin de Dependencias ---------------


// ======================================================================= 
// ======================   Rutas del controlador   ====================== 
// ======================================================================= 

/* ------------- Recupera la lista de productos. ----------------- */
router.get('/', async function(req, res, next) {

  let page = req.query.page    || 1;
  let limit = req.query.limit  || 25;
  let sort = req.query.sort    || 1;
  let text = req.query.text    || '';


  // Ordenamiento de los registros
  let orderBy = {
    name: sort
  }

  let docsList = await getProductos( parseInt(page), parseInt(limit), text, orderBy);

  res.json({status:true, message:'', docsList});
});

/* ------------- Recupera la lista de productos. ----------------- */
router.get('/item', async function(req, res, next) {

  let id = req.query.id || '';

  if(id=='') return res.json({status:true, message:'Falta parámetro', doc:null});

  let doc = await getProducto( parseInt(id) );

  return res.json({status:true, message:'', doc});
});

/* ----------------- Crea y añade un producto. -------------------- */
router.put('/', async function(req, res, next) {

  let name = req.body.name || '';
  let description = req.body.description || '';
  let price = req.body.price || 0;
  let category = req.body.category || '';

  if( name === '' ) return res.status(201).json({ status:false, message:'El campo Nombre es requerido.'});

  let product = {
    name: name,
    description: description,
    price: price,
    category: category
  }

  let newItem = await createProduct( product );

  res.json({status:true, message:'', newItem});
});

/* ----------------- Actualiza el producto. -------------------- */
router.post('/', async function(req, res, next) {

  let id = req.body.id || '';
  let data = req.body.data || {};
 
  // evalua si hay datos a actualizar, si el objeto está vacio, entonces no actualiza nada
  if(Object.keys(data).length === 0 ) return res.status(201).json({ status:false, message:'No se actualizaron datos.'});

  // si el ID objetivo está ausente, entonces no actualiza  nada.
  if( id === '' ) return res.status(201).json({ status:false, message:'El campo ID es requerido.'});

  let newItem = await updateProducto( id, data );

  res.json({status:true, message:'', newItem});
});

/* ----------------- Elimina el producto. -------------------- */
router.delete('/', async function(req, res, next) {

  let id = req.query.id || '';

  if( id === '' ) return res.status(201).json({ status:false, message:'El campo ID es requerido.'});


  let removedItem = await deleteProducto( id );

  res.json({status:true, message:'', removedItem});
});
// ======================================================================= 
// ==================== FIN Rutas del controlador   ====================== 
// ======================================================================= 


// ======================================================================= 
// ====================== Funciones del controlador ====================== 
// ======================================================================= 


/* 
 * Descripcion: Función que recupera la lista de items de la DB(mongo) 
 * Parámetros: 
 *            1ro | page: <integer> | El nro de página
 *            2do | limit: <integer> | La cantidad de items por página
 *            3ro | text: <string> | Texto a buscar
 *            4to | sort: <integer> | Bandera(1[ASC] | -1[DESC]) para especificar el sentido del ordenamiento
 * Retorna una promesa: <Boolean | item:[productModel]>
 * Fecha: 19.12.21
 * Author: pamaco
 */
function getProductos(page = 1, limit = 25, text='', sort=null){

  return new Promise((resolve, reject)=>{

    var skip = (page===1) ?  0 : ( page - 1 ) * limit;

    var query = null;
    if(text !== ''){

      query = Productos.find(  {
                                  $or: [
                                        {name:new RegExp(text, 'i') },
                                        {description:new RegExp(text, 'i') },
                                        {category:new RegExp(text, 'i') }
                                      ]
                                }
                           );
    }else{
    
      query = Productos.find();
		
    }
    		
    // var fechaDesde = req.body.desde; // YYYY-MM-DD
    // var fechaHasta = req.body.hasta; // YYYY-MM-DD
    // var desde = new Date(fechaDesde+'T00:00:00.000Z');
    // var hasta = new Date(fechaHasta+'T23:00:00.000Z');

    // query.where({creado: {$gte: desde }});
    // query.where({creado: {$lte: hasta }});
    query.select({
                    name: 1,
                    description: 1,
                    category: 1,
                    price: 1,
                    created_at: 1
              });
                
    query.skip( skip );
    query.limit(limit);
    if(sort!==null){

      query.sort(sort);

    }

    query.exec(async function (errorQuery, docs) {

      if( errorQuery ) return resolve(false);

      if(docs === null) return resolve(false);

      return resolve(docs);

    });

  });

}



/* 
 * Descripcion: Función que recupera un item de la DB(mongo) 
 * Parámetros: 
 *            1ro | id: <integer> | El nro de id del item en la DB

* Retorna una promesa: <item:productModel>
 * Fecha: 27.12.21
 * Author: pamaco
 */
function getProducto(id){

  return new Promise((resolve, reject)=>{

    let query = Productos.find({_id: id});
    query.select({
                    name: 1,
                    description: 1,
                    category: 1,
                    price: 1,
                    created_at: 1
              });
                
    query.exec(async function (errorQuery, doc) {

      if( errorQuery ) return resolve(false);

      if(doc === null) return resolve(false);

      return resolve(doc);

    });

  });

}


/* 
 * Descripcion: Función que inserta un item en la DB(mongo) 
 * Parámetros: 
 *            1ro | producto: <ProductModel> | Objeto con las propiedades del registro a insertar(name, description, etc)
 * Retorna una promesa: <Boolean | item:productModel>
 * Fecha: 19.12.21
 * Author: pamaco
 */
function createProduct( product ){

  return new Promise((resolve, reject)=>{

    Productos( product ).save(function( error, doc ){
      
      if( error ){
       
        console.log(error)
        return resolve(false);
      }

      if(doc === null) return resolve(false);

      return resolve(doc);

    });

  });

}

/* 
 * Descripcion: Función que actualiza un item en la DB(mongo) 
 * Parámetros: 
 *            1ro | id: <string> | id del item en la DB
 *            2ro | producto: <ProductModel> | Objeto con las propiedades del registro a insertar(name, description, etc)
 * Retorna una promesa: <Boolean | item:productModel>
 * Fecha: 19.12.21
 * Author: pamaco
 */
function updateProducto( id, itemUp ){

  return new Promise((resolve, reject)=>{

    // Busca el item en la DB
    Productos.findOne({"_id":id},function(err, item){
      
      // En caso de error retorna un false
      if(err){
        console.log(error)
        return resolve(false);
      }

      // En caso de no encontrar el item retorna un false y ya no actualiza
      if(item === null) return resolve(false);

      // Configura las propiedades a actualizar
      if(itemUp.name) item.name = itemUp.name ;
      if(itemUp.description) item.description = itemUp.description;
      if(itemUp.price) item.price = itemUp.price;
      if(itemUp.category) item.category = itemUp.category;

      // Guarda los cambios en la DB
      Productos(item).save(function(error, doc)
      {
        
        // En caso de error retorna un false
        if(err){
          console.log(error)
          return resolve(false);
        }
  
        // En caso de éxito retorna resulset del proceso(mongoose)
        return resolve(doc);
      });

    });

  });

}


/* 
 * Descripcion: Función que elimina un item en la DB(mongo) 
 * Parámetros: 
 *            1ro | id: <string> | id del item en la DB
 * Retorna una promesa: <Boolean | doc:removeMogoose>
 * Fecha: 19.12.21
 * Author: pamaco
 */
function deleteProducto( id ){

  return new Promise((resolve, reject)=>{

    // Remueve el item de la DB
    Productos.remove({"_id":id},function(err, item){
      
      // En caso de error retorna un false
      if(err){
        console.log(error)
        return resolve(false);
      }

        // En caso de éxito retorna resulset del proceso(mongoose)
        return resolve(item);

    });

  });

}
// ======================================================================= 
// ================== FIN Funciones del controlador ====================== 
// ======================================================================= 

// ====================== Exportación de módulos ====================== 
module.exports = router;
// ====================== Exportación de módulos ====================== 
