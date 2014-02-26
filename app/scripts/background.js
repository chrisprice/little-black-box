'use strict';

chrome.browserAction.onClicked.addListener(function(tab) {
 	// No tabs or host permissions needed!
 	console.log('Turning ' + tab.url + ' red!');
	chrome.tabCapture.capture({ video: true }, function(stream) {
		console.log('creating stream')
		chrome.runtime.sendMessage({ src: URL.createObjectURL(stream)}, function(response) {
		  console.log(response);
		});
		
		
	})
});