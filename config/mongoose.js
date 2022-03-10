var mongoose = require('mongoose');
var stp = require('../config/setup');

const DB_CONNECTION    = process.env.DB_CONNECTION  || stp.db_conection;

const connect = mongoose.connect(DB_CONNECTION, { useUnifiedTopology: true, useNewUrlParser: true });
connect.then(res=>{
	console.log("Conectado con DB");
}).catch(err=>{
	console.log("Error conectando con DB", err);
});

module.exports = mongoose;
