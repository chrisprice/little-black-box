module.exports = function(frameWidth, frameHeight, frameCount) {
	var obj = {};

	var frameSize = frameWidth * frameHeight * 4;
	var buffer = new ArrayBuffer(frameSize * frameCount);
	var frames = [];
	for (var i = 0; i < frameCount; i++) {
		frames.push(new Uint8ClampedArray(buffer, i * frameSize, frameSize));
	}
	var headIndex = -1;

	function normaliseIndex(index) {
		index += headIndex;
		if (index >= frameCount) {
			index -= frameCount;
		}
		return index;
	}

	obj.push = function(array) {
		if (array.length !== frameSize) {
			throw new Error('Unexpected frame size');
		}

		frames[headIndex].set(array);

		headIndex = normaliseIndex(headIndex + 1);
	};

	obj.get = function() {
		return frames;
	};

	return obj;
};