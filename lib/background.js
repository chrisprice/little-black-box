var desktopStream = require('./desktopStream'),
	streamRecorder = require('./streamRecorder');

global.recorder = null;

desktopStream().then(function(stream) {
	console.log('stream', stream);
	global.recorder = streamRecorder(stream);
	recorder.record();
});

chrome.browserAction.onClicked.addListener(function(tab) {
	// recorder.stop();
	// console.log(recorder.frames());
	chrome.windows.create({ url: chrome.extension.getURL('preview.html') }, function(wnd) {
		// chrome.windows.update(wnd.id, { state: 'fullscreen' }, function(wnd) {
			// send it some shizzle?
		// });
	});
});





