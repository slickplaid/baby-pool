var preloadImgs = [
		'/images/e1386867903711.jpg',
		'/images/baby-hands.jpeg',
		'/images/file0001162934373.jpg',
		'/images/hr_baby.jpg',
		'/images/file000177357244.jpg',
		'/images/28182.jpg',
		'/images/bitcoins.jpg',
		'/images/dogecoin.jpg',
		'/images/file000118360846.jpg',
		'/images/bite.jpg'
];

$(function() {
	$('.datepicker').datepicker({ defaultDate: defaultDate });
	
	$('.slider.weight').slider({ value: 7.5, min: 4, max: 12, step: 0.0625, slide: function(e, ui) {
		var pounds = Math.floor(ui.value);
		var ounces = (ui.value - pounds) / 0.0625;

		var parent = $(this).parent();
		var out = parent.find('.slider-text');
		var valout = parent.find('#weight');

		out.text('You have selected: '+pounds+' pounds, '+ounces+' ounces');
		valout.val(ui.value);
	}});

	$('.slider.height').slider({ value: 20, min: 16, max: 24, step: 0.01, slide: function(e, ui) {
		var inches = ui.value;

		var parent = $(this).parent();
		var out = parent.find('.slider-text');
		var valout = parent.find('#height');

		out.text('You have selected: '+inches+' inches');
		valout.val(inches);

	}});

	$('.btn').button();

	var frameId = 0;
	changeFrame();
	$('.forward').click(function(e) {
		e.preventDefault();
		changeFrame(++frameId);
		var id = $('.box-'+frameId).attr('id');
		history.pushState({ page: frameId }, document.title, '/'+id);
		preload([preloadImgs[frameId+1]]);
		if(frameId === 3) {
			preload([preloadImgs[5], preloadImgs[6], preloadImgs[7]]);
		}
	});
	$('.backward').click(function(e) {
		e.preventDefault();
		changeFrame(--frameId);
		var id = $('.box-'+frameId).attr('id');
		history.pushState({ page: frameId }, document.title, '/'+id);
	});
	$('.donate-paypal').click(function(e) {
		e.preventDefault();
		frameId = 5;
		changeFrame(5);
		var id = $('.box-'+frameId).attr('id');
		history.pushState({ page: frameId }, document.title, '/'+id);
	});
	$('.donate-bitcoin').click(function(e) {
		e.preventDefault();
		frameId = 6;
		changeFrame(frameId);
		var id = $('.box-'+frameId).attr('id');
		history.pushState({ page: frameId }, document.title, '/'+id);
	});
	$('.donate-dogecoin').click(function(e) {
		e.preventDefault();
		frameId = 7;
		changeFrame(frameId);
		var id = $('.box-'+frameId).attr('id');
		history.pushState({ page: frameId }, document.title, '/'+id);
	});
	$('.backward-to-donate-choice').click(function(e) {
		e.preventDefault();
		frameId = 3;
		changeFrame(frameId);
		var id = $('.box-'+frameId).attr('id');
		history.pushState({ page: frameId }, document.title, '/'+id);
	});

	window.addEventListener('popstate', function(e) {
		if(!e.state) {
			changeFrame(0);
		} else if(isNaN(e.state.page)) {
			return window.location = '/';
		}
		changeFrame(e.state.page);
	});

	preload([preloadImgs[0], preloadImgs[1]]);

	$(document).on('blur', 'input, .ui-slider-handle', saveForm);
	$(document).on('click', '.save-form', saveForm);
	$(document).on('click', '.backward-to-donate-choice', resetDonation);	
	$(document).on('click', '.donate-paypal', donate('paypal'));
	$(document).on('click', '.donate-bitcoin', donate('bitcoin'));
	$(document).on('click', '.donate-dogecoin', donate('dogecoin'));

});

function changeFrame(frameNum) {
	if(!frameNum || frameNum < 0) frameNum = 0;
	var bdy = $('body');
	var boxes = $('.boxes');

	for(var i = 0; i < 10; i++) bdy.removeClass('frame-'+i);
	$('body').addClass('frame-'+frameNum);

	boxes.hide();
	$('.box-'+frameNum).show();

	$('html,body').animate({ scrollTop: 0 }, 500);
};

function preload(arrayOfImages) {
  $(arrayOfImages).each(function(){
    //$('<img/>')[0].src = this;
    (new Image()).src = this;
  });
}

function saveForm(e) {
	var data = $('form').not('.exclude').serialize();
	$.post('/saveEntry', data);
};

function resetDonation(e) {
	$('.toggle-paypal, .toggle-bitcoin, .toggle-dogecoin').val(false);
	saveForm();
};

function donate(type) {
	return function(e) {
		$('.toggle-'+type).val(true);
		saveForm();
	};
};