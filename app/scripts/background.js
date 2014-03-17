'use strict';

function createStream() {
 	chrome.desktopCapture.chooseDesktopMedia(["screen"], function(streamId) {
		console.log('Got streamId', streamId);
		if (streamId == null) {
			return;
		}
		navigator.webkitGetUserMedia({
			audio: false,
			video: {
				mandatory: {
					chromeMediaSource: 'desktop',
					chromeMediaSourceId: streamId
				}
			}
		}, function(stream) {
	 		console.log('Creating URL')
	 		captureFrame(URL.createObjectURL(stream));
	 		// chrome.runtime.sendMessage({ src: URL.createObjectURL(stream)}, function(response) {
	 		// 	console.log(response);
	 		// });
 		}, console.error.bind(console));
	});
 }


chrome.browserAction.onClicked.addListener(function(tab) {
 	// No tabs or host permissions needed!
 	console.log('Turning ' + tab.url + ' red!');
 });

function captureFrame(src) {
	var video = document.createElement('video');
	video.autoplay = "autoplay";
	video.src = src;
	setInterval(function() {
		var canvas = document.createElement('canvas');
		var ctx = canvas.getContext('2d');
		ctx.drawImage(video, 0, 0);

		console.log(ctx.getImageData(0, 0, canvas.width, canvas.height))
	}, 1000/30);
}