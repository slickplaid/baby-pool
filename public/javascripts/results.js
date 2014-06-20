$(function() {

	updateDate();

});

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
			bars: {
				show: true,
				barWidth: 0.8,
				lineWidth: 0,
				fillColor: {
          colors: ['#CB4B4B', '#fff'],
          start: 'top',
          end: 'bottom'					
				},
        fillOpacity: 0.8
			}
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

	graph = Flotr.draw(container, [data, markers], {
		grid: { minorVerticalLines: true },
		yaxis: { min: 0 },
		xaxis: { mode: 'time', min: +Date.UTC(2014, 5, 18), title: 'Date of Arrival' },
		bars: { show: true }
	});
};

// (function basic(container) {

//   var
//     d1 = [[0, 3], [4, 8], [8, 5], [9, 13]], // First data series
//     d2 = [],                                // Second data series
//     i, graph;

//   // Generate first data set
//   for (i = 0; i < 14; i += 0.5) {
//     d2.push([i, Math.sin(i)]);
//   }

//   // Draw Graph
//   graph = Flotr.draw(container, [ d1, d2 ], {
//     xaxis: {
//       minorTickFreq: 4
//     }, 
//     grid: {
//       minorVerticalLines: true
//     }
//   });
// })(document.getElementById("chart-datetime"));