(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
chrome.runtime.getBackgroundPage(function(backgroundPage) {
	console.log(backgroundPage);
	var recorder = backgroundPage.recorder;
	var canvas = document.querySelector('canvas');
	var ctx = canvas.getContext('2d');
	var imageData = recorder.imageData;
	console.log(imageData);
	ctx.putImageData(imageData, 0, 0);
});



/*
chrome.runtime.sendMessage('ready', function(response) {
	console.log('response received', response);
	var canvas = document.querySelector('canvas');
	var ctx = canvas.getContext('2d');
	// var imageData = ctx.createImageData(response.width, response.height);
	// imageData.data.set(response.data);
	// ctx.putImageData(imageData, 0, 0);
	var img = document.createElement('img');
	img.src = response;
	ctx.drawImage(img, 0, 0);

	img = document.querySelector('img');
	img.src = response;
});
*/
},{}]},{},[1])