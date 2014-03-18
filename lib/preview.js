var $ = window.jQuery;
var Whammy = window.Whammy;

var recorder = null;
var canvas = null;

chrome.runtime.getBackgroundPage(function(backgroundPage) {
	recorder = backgroundPage.recorder;
	console.log(backgroundPage);

	var framesCount = recorder.frames().length;

	var $slider = $('#slider').slider({
		range: true,
		min: 0,
		max: framesCount - 1,
		values: [framesCount - 1, framesCount - 1],
		slide: function( event, ui ) {
			drawFrame(ui.value);
		}
	});

	$('#done').on('click', function() {
		window.close();
		return false;
	});

	$('#export').on('click', function() {
		var vid = new Whammy.Video(10);
		var startIndex = $slider.slider('values', 0);
		var endIndex = $slider.slider('values', 1);
		for (var i = startIndex; i <= endIndex; i++) {
			drawFrame(i);
			vid.add(canvas);
		}
		var output = vid.compile();
		window.open(URL.createObjectURL(output));
		return false;
	});

	$(window).on('unload', function() {
		recorder.record();
	});

	drawFrame(framesCount - 1);
});

function drawFrame(index) {
	var data = recorder.frames()[index];
	if (canvas == null) {
		canvas = document.querySelector('canvas');
		canvas.width = recorder.imageData.width;
		canvas.height = recorder.imageData.height;
	}
	if (data == null) {
		return; // remove this when the count is accurate
	}
	var ctx = canvas.getContext('2d');
	var imageData = ctx.createImageData(recorder.imageData.width, recorder.imageData.height);
	imageData.data.set(data);
	ctx.putImageData(imageData, 0, 0);
}

