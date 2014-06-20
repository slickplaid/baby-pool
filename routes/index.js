var ipn = require('paypal-ipn');
var settings = require('../settings');
var tracking = require('../models/tracking');

/*
 * Public Pages
 */

exports.index = function(req, res){
  res.render('index', { title: settings.applicationTitle });
};

exports.refresh = function(req, res) {
	res.redirect('/');
};

exports.results = function(req, res) {
	res.render('results', { title: 'Results - '+settings.applicationTitle });
};

/*
 * API
 */

exports.saveEntry = function(req, res) {

};

exports.ipn = function(req, res) {
	ipn.verify(req.body, function(err, msg) {
		console.log('Paypal Message', err, msg);
	});
};
