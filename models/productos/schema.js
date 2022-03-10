var mongoose = require('../../config/mongoose');
var Schema = mongoose.Schema;

var schemas = {

				productosSchema: new Schema({
					
								        name: {type: String},
								        description: {type: String},
								        category: {type: String},
								        price: {type: Number },
										created_at: {type: Number, default: Date.now }
													        
			    					})

			  };

module.exports = schemas;