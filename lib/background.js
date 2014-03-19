var desktopStream = require('./desktopStream'),
	streamRecorder = require('./streamRecorder');

var options = {
	frames: Number(localStorage.frames) || 30,
	fps: Number(localStorage.fps) || 10
};

global.recorder = null;

global.getOptions = function() {
	return options;
};

global.setOptions = function(opts) {
	options = opts;
	localStorage.frames = opts.frames;
	localStorage.fps = opts.fps;
	createRecorder();
};

var streamPromise = desktopStream();

function createRecorder() {
	streamPromise.then(function(stream) {
		recorder = streamRecorder(stream, options.frames, options.fps);
		recorder.record();
	});
}

chrome.browserAction.onClicked.addListener(function(tab) {
	recorder.stop();

	chrome.windows.create({ url: chrome.extension.getURL('preview.html') }, function(wnd) {
		chrome.windows.update(wnd.id, { state: 'fullscreen' });
	});
});

createRecorder();