var ipn = require('paypal-ipn');
var settings = require('../settings');
var tracking = require('../models/tracking');

/*
 * Public Pages
 */

exports.index = function(req, res){
	tracking.getUserId(function(err, uid) {
		res.locals.uid = uid;
		res.locals._csrf = ''; //req.csrfToken();
  	res.render('index', { title: settings.applicationTitle });
	});
};

exports.success = function(req, res) {
	res.render('success', { title: settings.applicationTitle });
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
	res.send(200);
	tracking.saveEntry(req.body);
};

exports.ipn = function(req, res) {
	res.send(200);
	ipn.verify(req.body, function(err, msg) {
		tracking.saveIPN({
			status: msg,
			err: err,
			body: req.body
		});
		console.log('Paypal Message', req.body, err, msg);
	});
};

exports.admin = function(req, res, next) {
	tracking.getAllGuesses(function(err, raw) {
		
		var guesses = [];
		raw.forEach(function(guess) {
			var g = JSON.parse(guess);
			guesses.push(g);
		});

		res.render('admin', { title: 'Admin - '+settings.applicationTitle, guesses: guesses });
	});
};