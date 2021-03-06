module.exports = function(frameWidth, frameHeight, frameCount) {
	var obj = {};

	var frameSize = frameWidth * frameHeight * 4; // 4 bytes RGBA
	var buffer = new ArrayBuffer(frameSize * frameCount);
	var frames = [];
	for (var i = 0; i < frameCount; i++) {
		frames.push(new Uint8ClampedArray(buffer, i * frameSize, frameSize));
	}
	var tailIndex = 0;

	function normaliseIndex(index) {
		index += tailIndex;
		if (index >= frameCount) {
			index -= frameCount;
		}
		return index;
	}

	obj.push = function(array) {
		if (array.length !== frameSize) {
			throw new Error('Unexpected frame size');
		}

		frames[tailIndex].set(array);
		tailIndex = normaliseIndex(1);
	};

	obj.get = function() {
		var normalisedFrames = [];
		for (var i = 0; i < frameCount; i++) {
			normalisedFrames[i] = frames[normaliseIndex(i)];
		}
		return {
			width: frameWidth,
			height: frameHeight,
			frames: normalisedFrames
		};
	};

	return obj;
};
