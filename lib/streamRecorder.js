var circularVideoBuffer = require('./circularVideoBuffer');

module.exports = function(stream) {
	var obj = {};

	var buffer = null;
	var canvas = null;
	var ctx = null;
	var intervalId = null;

	var video = document.createElement('video');
	video.autoplay = "autoplay";
	video.src = URL.createObjectURL(stream);
	video.onloadedmetadata = function() {
		// buffer = circularVideoBuffer(video.videoWidth, video.videoHeight, 100);
		buffer = [];
		canvas = document.createElement('canvas');
		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;
		ctx = canvas.getContext('2d');
	};

	function captureFrame() {
		ctx.drawImage(video, 0, 0);
		var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		// buffer.push(imageData.data);
		obj.imageData = imageData;
		if (buffer.length === 100) {
			buffer.shift();
		}
		buffer.push(imageData);
	}

	obj.record = function() {
		intervalId = setInterval(captureFrame, 1000/10);
	};

	obj.stop = function() {
		clearInterval(intervalId);
	};
	
	obj.frames = function() {
		return buffer.slice();
	};

	return obj;
};