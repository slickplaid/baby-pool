var db = require('./database');
var io;

var getUserId = function(callback) {
	db.getUID(callback);
};

// var saveIPN = function(body) {
// 	db.save()
// };

var saveEntry = function(body, callback) {
	if(typeof callback !== 'function') {
		callback = function(){};
	}

	if(!body) {
		return callback('Invalid Body Data');
	}

	var uid = +body.uid;
	if(isNaN(uid)) {
		callback('Invalid UID');
	}

	db.save(uid, 'guess', body, callback);

	getChartData(function(err) {
		io.emit('chartData', chartData);
	});
};

var saveIPN = function(ipn, callback) {
	if(typeof callback !== 'function') {
		callback = function(){};
	}

	if(!ipn) {
		return callback('Invalid IPN Data');
	}

	db.getIPNID(function(err, ipnid) {
		if(err) return callback('Unable to retrieve valid IPN ID');
		db.save(ipnid, 'ipn', ipn, callback);
	});
};

var getChartData = function(callback) {
	if(typeof callback !== 'function') {
		callback = function(){};
	}

	db.getAll('guess', function(err, guesses) {
		if(!guesses) return callback('No guesses.');
		parseChartData(guesses, function(err) {
			callback(err);
		});
	});
};

exports.loadSocketIO = function(socketio) {
	io = socketio;

	getChartData();

	io.on('connection', function(socket) {
		socket.emit('chartData', chartData);
	});
};

exports.getUserId = getUserId;
exports.saveEntry = saveEntry;
exports.getChartData = getChartData;

function getTimeNow() {
	var year = new Date().getUTCFullYear();
	var month = new Date().getUTCMonth();
	var day = new Date().getUTCDate();

	return +new Date(year, month, day);
};

function parseChartData(guesses, callback) {

	chartData.date.options.xaxis.min = getTimeNow();

	var collateDates = {};
	var dates = [];
	var collateTimes = {};
	var times = [];
	var collateWeights = {};
	var weights = [];
	var collateHeights = {};
	var heights = [];
	var collateHair = {};
	var hair = [];
	var collateEyes = {};
	var eyes = [];

	var highestDate = getTimeNow();

	guesses.forEach(function(rawGuess, i) {
		var guess;
		
		try { guess = JSON.parse(rawGuess) }
		catch(e) { return false; }

		var dateGuess = parseDate(guess.date);
		if(dateGuess) {
			if(typeof collateDates[dateGuess] === 'undefined') {
				collateDates[dateGuess] = 1;
			} else {
				collateDates[dateGuess]++;
			}
		}

		var timeGuess = parseTime(guess.time);
		if(timeGuess) {
			if(typeof collateTimes[timeGuess] === 'undefined') {
				collateTimes[timeGuess] = 1;
			} else {
				collateTimes[timeGuess]++;
			}
		}

		var weightGuess = parseInt(+guess.weight);
		if(weightGuess) {
			if(typeof collateWeights[weightGuess] === 'undefined') {
				collateWeights[weightGuess] = 1;
			} else {
				collateWeights[weightGuess]++;
			}
		}

		var heightGuess = parseInt(+guess.height);
		if(heightGuess) {
			if(typeof collateHeights[heightGuess] === 'undefined') {
				collateHeights[heightGuess] = 1;
			} else {
				collateHeights[heightGuess]++;
			}
		}

		var hairGuess = guess.hair;
		if(hairGuess && hairGuess !== '') {
			if(typeof collateHair[hairGuess] === 'undefined') {
				collateHair[hairGuess] = 1;
			} else {
				collateHair[hairGuess]++;
			}
		}

		var eyeGuess = guess.eyes;
		if(eyeGuess && eyeGuess !== '') {
			if(typeof collateEyes[eyeGuess] === 'undefined') {
				collateEyes[eyeGuess] = 1;
			} else {
				collateEyes[eyeGuess]++;
			}
		}
	});

	for(var date in collateDates) {
		dates.push([+date, collateDates[date]]);
		if(date > highestDate) highestDate = +date;
	}
	for(var time in collateTimes) {
		times.push([+time, collateTimes[time]]);
	}
	for(var weight in collateWeights) {
		weights.push([+weight, collateWeights[weight]]);
	}
	for(var height in collateHeights) {
		heights.push([+height, collateHeights[height]]);
	}
	for(var h in collateHair) {
		hair.push({ data: [[0, collateHair[h]]], label: h, color: getColor(h) });
	}
	for(var e in collateEyes) {
		eyes.push({ data: [[0, collateEyes[e]]], label: e, color: getColor(e) });
	}

	chartData.date.data = [dates];
	chartData.time.data = [times];
	chartData.weight.data = [weights];
	chartData.height.data = [heights];
	chartData.hair.data = hair;
	chartData.eyes.data = eyes;

	chartData.date.options.xaxis.max = +highestDate + 86400000;
	callback(null, chartData);
};

function parseDate(dateString) {
	var date = dateString.split('-');

	date[0] = +date[0];
	date[1] = +date[1];
	date[2] = +date[2];

	var thisYear = new Date().getUTCFullYear();
	if(isNaN(date[0]) || date[0] < thisYear || date[0] > thisYear+2) {
		return false;
	}

	var thisMonth = new Date().getUTCMonth();
	if(thisMonth > date[1] || date[1] > 12) {
		return false;
	}
	thisMonth = thisMonth;

	if(1 > date[2] || date[2] > 31) {
		return false;
	}

	return Date.UTC(date[0], date[1]-1, date[2]);
};

function parseTime(timeString) {
	var hour = +timeString.split(':')[0];
	if(isNaN(hour)) {
		return false;
	} else {
		return hour;
	}
};

function getColor(color) {
	color = color.replace('hair-', '').replace('eyes-', '');
	if(color === 'black') {
		return '#272B2A';
	} else if(color === 'blonde') {
		return '#BC9B34';
	} else if(color === 'brown') {
		return '#492D2A';
	} else if(color === 'red') {
		return '#cc3333';
	} else if(color === 'gray') {
		return '#a3a695';
	} else if(color === 'blue') {
		return '#3399ff';
	} else if(color === 'green') {
		return '#009966';
	} else if(color === 'hazel') {
		return '#6b7e47';
	} else {
		return '#eeeeee';
	}
};

var chartData = {
	date: {
		data: [],
		options: {
			HtmlText: false,
			shadowSize: 0,
			grid: { minorVerticalLines: true },
			yaxis: { min: 0, title: '# of Entries', titleAngle: 90 },
			xaxis: { mode: 'time', min: +Date.UTC(2014, 6, 1), title: 'Birth Date' },
			bars: { show: true, barWidth: 0.5 },
			title: 'Birth Date'
		}
	},
	time: {
		data: [],
		options: {
			HtmlText: false,
			shadowSize: 0,
			grid: { minorVerticalLines: true },
			yaxis: { min: 0, title: '# of Entries', titleAngle: 90 },
			xaxis: { min: 0, max: 23, title: 'Birth Time (Hour of Day)',
				ticks: [[0, '12a'], [1, '1a'], [2, '2a'], [3, '3a'], [4, '4a'], [5, '5a'], [6, '6a'], [7, '7a'], [8, '8a'], [9, '9a'], [10, '10a'], [11, '11a'], [12, '12p'], 
								[13, '1p'], [14, '2p'], [15, '3p'], [16, '4p'], [17, '5p'], [18, '6p'], [19, '7p'], [20, '8p'], [21, '9p'], [22, '10p'], [23, '11p']] },
			bars: { show: true }
		}
	},
	weight: {
		data: [],
		options: {
			HtmlText: false,
			shadowSize: 0,
			grid: { minorVerticalLines: true },
			yaxis: { min: 0, title: '# of Entries', titleAngle: 90 },
			xaxis: { min: 4, max: 12, title: 'Birth Weight in Pounds' },
			bars: { show: true }
		}
	},
	height: {
		data: [],
		options: {
			HtmlText: false,
			shadowSize: 0,
			grid: { minorVerticalLines: true },
			yaxis: { min: 0, title: '# of Entries', titleAngle: 90 },
			xaxis: { min: 16, max: 24, title: 'Birth Length in Inches' },
			bars: { show: true }
		}
	},
	hair: {
		data: [],
		options: {
	    HtmlText : false,
			shadowSize: 0,
	    grid : {
	      verticalLines : false,
	      horizontalLines : false
	    },
	    xaxis : { showLabels : false },
	    yaxis : { showLabels : false },
	    pie : {
	      show : true, 
	      explode : 6
	    },
	    mouse : { track : true },
	    legend : {
	      position : 'se',
	      backgroundColor : '#D2E8FF'
	    },
			title: 'Hair Color'	
		}
	},
	eyes: {
		data: [],
		options: {
	    HtmlText : false,
			shadowSize: 0,
	    grid : {
	      verticalLines : false,
	      horizontalLines : false
	    },
	    xaxis : { showLabels : false },
	    yaxis : { showLabels : false },
	    pie : {
	      show : true, 
	      explode : 6
	    },
	    mouse : { track : true },
	    legend : {
	      position : 'se',
	      backgroundColor : '#D2E8FF'
	    },
			title: 'Eye Color'
		}
	}
};
