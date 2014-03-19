(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var videoExporter = require('./videoExporter');
var $ = window.jQuery;
var Whammy = window.Whammy;

var recorder = null;
var canvas = null;
var currentFrameIndex = -1;
var mask = {};

chrome.runtime.getBackgroundPage(function(backgroundPage) {
	recorder = backgroundPage.recorder;

	var $controls = $('#controls');

	var framesCount = recorder.buffer().frames.length;
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
		var frames = recorder.buffer().frames.slice(startIndex, endIndex + 1);
		var url = videoExporter(canvas.width, canvas.height, frames, mask, backgroundPage.getOptions().fps);
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
	var data = recorder.buffer().frames[index];
	if (canvas == null) {
		canvas = document.querySelector('canvas');
		canvas.width = recorder.buffer().width;
		canvas.height = recorder.buffer().height;
		mask.left = 0;
		mask.top = 0;
		mask.right = canvas.width;
		mask.bottom = canvas.height;
	}
	if (data == null) {
		return; // remove this when the count is accurate
	}
	var ctx = canvas.getContext('2d');
	var imageData = ctx.createImageData(canvas.width, canvas.height);
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


},{"./videoExporter":2}],2:[function(require,module,exports){
module.exports = function(width, height, frames, mask, fps) {
	var canvas = document.createElement('canvas');
	canvas.width = mask.right - mask.left;
	canvas.height = mask.bottom - mask.top;

	var ctx = canvas.getContext('2d');
	var imageData = ctx.createImageData(width, height);

	var vid = new Whammy.Video(fps);

	frames.forEach(function(frame) {
		imageData.data.set(frame);
		ctx.putImageData(imageData, -mask.left, -mask.top);
		vid.add(canvas);
	});

	return URL.createObjectURL(vid.compile());
};


},{}]},{},[1])