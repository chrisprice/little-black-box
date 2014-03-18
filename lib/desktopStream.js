var Q = require('q');

module.exports = function() {

	var deferred = Q.defer();

	function onError(error) {
		console.error(error);
		deferred.reject(error);
	}

	function onStream(stream) {
		deferred.resolve(stream);
	}

	chrome.desktopCapture.chooseDesktopMedia(["screen"], function(streamId) {

		if (streamId == null) {
			onError(new Error('Permission denied'));
		}

		var options = {
			audio: false,
			video: {
				mandatory: {
					chromeMediaSource: 'desktop',
					chromeMediaSourceId: streamId,
					// must be set otherwise 640 * 480
					maxWidth: 1920,
					maxHeight: 1200
				}
			}
		};


		navigator.webkitGetUserMedia(options, onStream, onError);
	});

	return deferred.promise;
};