var videoExporter = require('./videoExporter');
var $ = window.jQuery;
var Whammy = window.Whammy;

var recorder = null;
var canvas = null;
var currentFrameIndex = -1;
var mask = {};

chrome.runtime.getBackgroundPage(function(backgroundPage) {
	recorder = backgroundPage.recorder;
	console.log(backgroundPage);

	var $controls = $('#controls');

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

	$('#done').button().on('click', function() {
		window.close();
		return false;
	});

	$('#export').button().on('click', function() {
		var startIndex = $slider.slider('values', 0);
		var endIndex = $slider.slider('values', 1);
		var frames = recorder.frames().slice(startIndex, endIndex);
		var url = videoExporter(canvas.width, canvas.height, frames, mask);
		document.getElementsByTagName('video')[0].src = url;
		$('#video').show();
		return false;
	});
	
	$('#videoDone').click(function() {
		document.getElementsByTagName('video')[0].src = '';
		$('#video').hide();
	});

	$('#clearMask').button().on('click', function() {
		mask.left = 0;
		mask.top = 0;
		mask.right = canvas.width;
		mask.bottom = canvas.height;
		drawFrame();
		return false;
	});

	$(window).on('unload', function() {
		recorder.record();
	});

	drawFrame(framesCount - 1);

	var drawingMask = false;

	$(canvas).on('mousedown', function(e) {
		$controls.hide();
		drawingMask = true;
		mask.x1 = mask.x2 = e.clientX;
		mask.y1 = mask.y2 = e.clientY;
	}).on('mousemove', function(e) {
		if (drawingMask) {
			mask.x2 = e.clientX;
			mask.y2 = e.clientY;
			mask.left = Math.min(mask.x1, mask.x2);
			mask.top = Math.min(mask.y1, mask.y2);
			mask.right = Math.max(mask.x1, mask.x2);
			mask.bottom = Math.max(mask.y1, mask.y2);
			drawFrame();
		}
	}).on('mouseup', function(e) {
		if (drawingMask) {
			mask.x2 = e.clientX;
			mask.y2 = e.clientY;
			mask.left = Math.min(mask.x1, mask.x2);
			mask.top = Math.min(mask.y1, mask.y2);
			mask.right = Math.max(mask.x1, mask.x2);
			mask.bottom = Math.max(mask.y1, mask.y2);
			if (mask.x1 === mask.x2 || mask.y1 === mask.y2) {
				mask.left = 0;
				mask.top = 0;
				mask.right = canvas.width;
				mask.bottom = canvas.height;
			}
			drawFrame();
			drawingMask = false;
			$controls.show();
		}
	});
});

function drawFrame(index) {
	if (index == null) {
		index = currentFrameIndex;
	} else {
		currentFrameIndex = index;
	}
	var data = recorder.frames()[index];
	if (canvas == null) {
		canvas = document.querySelector('canvas');
		canvas.width = recorder.imageData.width;
		canvas.height = recorder.imageData.height;
		mask.left = 0;
		mask.top = 0;
		mask.right = canvas.width;
		mask.bottom = canvas.height;
	}
	if (data == null) {
		return; // remove this when the count is accurate
	}
	var ctx = canvas.getContext('2d');
	var imageData = ctx.createImageData(recorder.imageData.width, recorder.imageData.height);
	imageData.data.set(data);
	ctx.putImageData(imageData, 0, 0);
	// mask
	ctx.fillStyle = 'rgba(0,0,0,0.8)';
	// left (canvas top to canvas bottom)
	ctx.fillRect(0, 0, mask.left, canvas.height);
	// right (canvas top to canvas bottom)
	ctx.fillRect(mask.right, 0, canvas.width - mask.right, canvas.height);
	// top (mask left to mask right)
	ctx.fillRect(mask.left, 0, mask.right - mask.left, mask.top);
	// bottom (mask left to mask right)
	ctx.fillRect(mask.left, mask.bottom, mask.right - mask.left, canvas.height);

}

