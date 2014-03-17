var desktopStream = require('./desktopStream'),
	streamRecorder = require('./streamRecorder');

desktopStream().then(function(stream) {
	console.log('stream', stream);
	var recorder = streamRecorder(stream);
	recorder.record();
	chrome.browserAction.onClicked.addListener(function(tab) {
		recorder.stop();
		console.log(recorder.frames());
	});
});


