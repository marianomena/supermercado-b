var mongoose = require('../../config/mongoose');
var scopeSchema = require('../scopePath/schema').scopeSchema;

var models = {
	scopePath: mongoose.model('scopePath', scopeSchema)
			}

module.exports = models;