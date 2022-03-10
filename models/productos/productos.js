var mongoose = require('../../config/mongoose');
var productosSchema = require('../productos/schema').productosSchema;

var models = {
				Productos: mongoose.model('productos', productosSchema)
			}

module.exports = models;