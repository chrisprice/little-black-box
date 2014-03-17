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
		buffer = circularVideoBuffer(video.videoWidth, video.videoHeight, 100);
		canvas = document.createElement('canvas');
		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;
		ctx = canvas.getContext('2d');
	};

	function captureFrame() {
		ctx.drawImage(video, 0, 0);
		var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		buffer.push(imageData.data);
	}

	obj.record = function() {
		intervalId = setInterval(captureFrame, 1000/30);
	};

	obj.stop = function() {
		clearInterval(intervalId);
	};
	
	obj.frames = function() {
		return buffer.get();
	};

	return obj;
};