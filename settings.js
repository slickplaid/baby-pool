
/*
 * Application Settings
 */

var settings = {
	// Required Fields
	applicationTitle: 'Baby Johnson Guessing Pool',
	babyName: 'Baby Johnson',
	motherName: 'Ashley',
	dueDateYear: 2014,
	dueDateMonth: 7, // Zero index: 0 = January, 11 = December;
	dueDateDay: 6,
	email: 'evan@slicklabs.io',

	// Optional Fields. To omit, simply set to false.
	fatherName: 'Evan',


	// Display Options
	boxClass: 'box col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1 col-sm-12 col-xs-12'
};

settings.dueDate = new Date(settings.dueDateYear, settings.dueDateMonth, settings.dueDateDay);
settings.dueDateString = 'new Date('+settings.dueDateYear+', '+settings.dueDateMonth+', '+settings.dueDateDay+')';
settings.dueDateToString = settings.dueDateYear+'-'+(settings.dueDateMonth+1)+'-'+settings.dueDateDay;
module.exports = settings;