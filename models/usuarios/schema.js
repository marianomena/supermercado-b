var mongoose = require('../../config/mongoose');
var Schema = mongoose.Schema;

var schemas = {

			    userSchema: new Schema({
					
								        userName: {type: String},
								        password: {type: String},
								        email: {type: String, default:''},
								        firstName: {type: String, default:''},
								        lastName: {type: String, default:''},
								        status: {type: Boolean, default: true},
								        nivel: {type: Number, default: 0},
										avatar: {type: String , default:''},
										created_at: {type: Number, default: Date.now() },
										lastLogin: {type: Number, default: 0}
													        
			    					})

			  };

module.exports = schemas;