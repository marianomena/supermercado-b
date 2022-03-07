var express = require('express');
var router = express.Router();

/* Home */
router.get('/', function(req, res, next) {

	res.send("Servidor On-line.");
	res.end();
});

module.exports = router;
