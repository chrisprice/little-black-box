var $ = window.jQuery;


chrome.runtime.getBackgroundPage(function(backgroundPage) {

	var $frames = $('#frames'), $fps = $('#fps'), $save = $('#save');

	var options = backgroundPage.getOptions();
	$frames.val(options.frames);
	$fps.val(options.fps);

	$save.click(function() {
		backgroundPage.setOptions({
			frames: $frames.val(),
			fps: $fps.val()
		});
	});

});