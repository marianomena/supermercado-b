var mongoose = require('../../config/mongoose');
var Schema = mongoose.Schema;

var schemas = {

				scopeSchema: new Schema({
								        path: {type: String},
								        nivel: {type: Number},
								        name: {type: String },
								        description: {type: String }
			    					})

			  };

module.exports = schemas;