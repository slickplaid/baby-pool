var socket = io(), chartData = {};

socket.on('chartData', function(cd) {
	chartData = cd;
	updateChartData(cd);
	console.log(cd);
});

$(function() {
	$(window).on('resize', function() {
		updateChartData(chartData);
	});
});

function updateChartData(cd) {
	Flotr.draw(document.getElementById('chart-date'), cd.date.data, cd.date.options);
	Flotr.draw(document.getElementById('chart-time'), cd.time.data, cd.time.options);
	Flotr.draw(document.getElementById('chart-weight'), cd.weight.data, cd.weight.options);
	Flotr.draw(document.getElementById('chart-height'), cd.height.data, cd.height.options);
	Flotr.draw(document.getElementById('chart-hair'), cd.hair.data, cd.hair.options);
	Flotr.draw(document.getElementById('chart-eye'), cd.eyes.data, cd.eyes.options);
};

function updateDate(data) {
	if(!data) {
		var points = [
			[+Date.UTC(2014,6,6),1],
			[+Date.UTC(2014,6,6),2],
			[+Date.UTC(2014,6,6),3],
			[+Date.UTC(2014,6,7),2],
			[+Date.UTC(2014,7,8),1],
			[+Date.UTC(2014,7,9),5],
			[+Date.UTC(2014,7,10),1],
			[+Date.UTC(2014,7,11),2],
			[+Date.UTC(2014,7,12),3],
			[+Date.UTC(2014,7,13),5],
			[+Date.UTC(2014,7,14),1],
			[+Date.UTC(2014,7,15),2],
			[+Date.UTC(2014,7,16),3],
			[+Date.UTC(2014,7,17),5]
		];

		data = {
			data: points,
			// bars: {
			// 	show: true,
			// 	barWidth: 0.8,
			// 	lineWidth: 0,
			// 	fillColor: {
   //        colors: ['#CB4B4B', '#fff'],
   //        start: 'top',
   //        end: 'bottom'					
			// 	},
   //      fillOpacity: 0.8
			// }
		};

		var markers = {
			data: points,
      markers: {
        show: true,
        position: 'ct'
      }			
		}
	}
	var container = document.getElementById('chart-date');
	var graph;

	graph = Flotr.draw(container, [points], {
		grid: { minorVerticalLines: true },
		yaxis: { min: 0 },
		xaxis: { mode: 'time', min: +Date.UTC(2014, 5, 18), title: 'Date of Arrival' },
		bars: { show: true }
	});
};