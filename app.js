
/**
 * Module dependencies del core
 */
 var path = require('path');
 var http = require('http');
 var express = require('express');
 var session = require('express-session');
 var bodyParser = require('body-parser');
 var cookieParser = require('cookie-parser');
 var debug = require('debug')('test:server');
 var logger = require('morgan');
 var compression = require('compression');


// =========================== Dependencies de la app ===========================
 
// Controladores del sistema
var index = require('./routes/index');

const SECRET_WORD = process.env.SECRET_WORD || 'frontera_de_menelaus';

// =============== Configuración del servidor ===============
var app = express();
// Motor de vistas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));
app.use(session({	secret: SECRET_WORD ,	resave: false,	saveUninitialized: true }));

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);
// =============== Configuración del servidor ===============

// =============== Rutas del servidor ===============
app.use('/', index);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Manejador de errores
app.use(function(err, req, res, next) {

    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    if(err.status==404)
    {
        // res.render('errors/error404', {data:stp});
        res.json({message:'404 No encontrado.'});
        
    }
    if(err.status==500)
    {
    //  res.render('errors/error500', {data:stp});
        res.json({message:'500 Error desconosido.'});
    }

});
  
 /**
  * Create HTTP server.
  */
 
 var server = http.createServer(app);
 
 /**
  * Listen on provided port, on all network interfaces.
  */
 
 server.listen(port);
 server.on('error', onError);
 server.on('listening', onListening);
 
 /**
  * Normalize a port into a number, string, or false.
  */
 
 function normalizePort(val) {
   var port = parseInt(val, 10);
 
   if (isNaN(port)) {
     // named pipe
     return val;
   }
 
   if (port >= 0) {
     // port number
     return port;
   }
 
   return false;
 }
 
 /**
  * Event listener for HTTP server "error" event.
  */
 
 function onError(error) {
   if (error.syscall !== 'listen') {
     throw error;
   }
 
   var bind = typeof port === 'string'
     ? 'Pipe ' + port
     : 'Port ' + port;
 
   // handle specific listen errors with friendly messages
   switch (error.code) {
     case 'EACCES':
       console.error(bind + ' requires elevated privileges');
       process.exit(1);
       break;
     case 'EADDRINUSE':
       console.error(bind + ' is already in use');
       process.exit(1);
       break;
     default:
       throw error;
   }
 }
 
 /**
  * Event listener for HTTP server "listening" event.
  */
 
 function onListening() {
   var addr = server.address();
   var bind = typeof addr === 'string'
     ? 'pipe ' + addr
     : 'port ' + addr.port;
   debug('Listening on ' + bind);
 }
 