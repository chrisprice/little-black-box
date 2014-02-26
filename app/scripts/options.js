'use strict';

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
	var video = document.querySelector('video');
	video.src = request.src;
	
})