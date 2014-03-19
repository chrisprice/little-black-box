module.exports = function(width, height, frames, mask) {
	var canvas = document.createElement('canvas');
	canvas.width = mask.right - mask.left;
	canvas.height = mask.bottom - mask.top;

	var ctx = canvas.getContext('2d');
	var imageData = ctx.createImageData(width, height);

	var vid = new Whammy.Video(10);

	frames.forEach(function(frame) {
		imageData.data.set(frame);
		ctx.putImageData(imageData, -mask.left, -mask.top);
		vid.add(canvas);
	});

	return URL.createObjectURL(vid.compile());
};

