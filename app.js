
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var csrf = require('csurf');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var dbconfig = require('./dbconfig');
var tracking = require('./models/tracking');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(cookieParser(dbconfig.sessionKeys[0]));
app.use(cookieSession({ keys: dbconfig.sessionKeys }));
// app.use(csrf()); // Causes problems with Paypal's IPN. Disabled until I can find a good fix.
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));

app.locals.settings = require('./settings');
app.locals._csrf = ''; // Related to the above Paypal IPN. Remove once fixed.

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

app.get('/registration', routes.refresh);
app.get('/start', routes.refresh);
app.get('/guesses', routes.refresh);
app.get('/donation-request', routes.refresh);
app.get('/thanks', routes.refresh);
app.get('/donate-paypal', routes.refresh);
app.get('/donate-bitcoin', routes.refresh);
app.get('/donate-dogecoin', routes.refresh);

app.get('/payment-success', routes.success);

app.get('/results', routes.results);

app.post('/ipn', routes.ipn);
app.post('/saveEntry', routes.saveEntry);

var server = http.createServer(app)
var io = require('socket.io')(server);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
  tracking.loadSocketIO(io);
});
