var $ = window.jQuery;

var recorder = null;
var canvas = null;

chrome.runtime.getBackgroundPage(function(backgroundPage) {
	recorder = backgroundPage.recorder;

	var $slider = $('#slider').slider({
		range: true,
		min: 0,
		max: recorder.frames().length - 1,
		value: 0,
		slide: function( event, ui ) {
			drawFrame(ui.value);
		}
	});

	$('#done').on('click', function() {
		window.close();
		return false;
	});

	$('#export').on('click', function() {
		console.log($slider.slider('values', 0), $slider.slider('values', 1));
		return false;
	});

});

function drawFrame(index) {
	var imageData = recorder.frames()[index];
	if (canvas == null) {
		canvas = document.querySelector('canvas');
		canvas.width = imageData.width;
		canvas.height = imageData.height;
	}
	var ctx = canvas.getContext('2d');
	ctx.putImageData(imageData, 0, 0);
}

