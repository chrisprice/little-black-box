(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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


},{}]},{},[1])