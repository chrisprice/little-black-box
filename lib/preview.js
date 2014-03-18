chrome.runtime.getBackgroundPage(function(backgroundPage) {
	console.log(backgroundPage);
	var recorder = backgroundPage.recorder;
	var canvas = document.querySelector('canvas');
	var ctx = canvas.getContext('2d');
	var imageData = recorder.imageData;
	console.log(imageData);
	ctx.putImageData(imageData, 0, 0);
});



/*
chrome.runtime.sendMessage('ready', function(response) {
	console.log('response received', response);
	var canvas = document.querySelector('canvas');
	var ctx = canvas.getContext('2d');
	// var imageData = ctx.createImageData(response.width, response.height);
	// imageData.data.set(response.data);
	// ctx.putImageData(imageData, 0, 0);
	var img = document.createElement('img');
	img.src = response;
	ctx.drawImage(img, 0, 0);

	img = document.querySelector('img');
	img.src = response;
});
*/