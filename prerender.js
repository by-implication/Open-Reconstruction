// For prerendering pages with js that manipulates the DOM

var page = require('webpage').create(),
    system = require('system');

if (system.args.length === 1) {
    console.log('Usage: prerender.js <some URL>');
    phantom.exit();
}

// suppress js errors from being logged
page.onError = function(){};
page.customHeaders = { "X-Do-Not-Prerender": true };

page.open(system.args[1], function (status) {
	console.log(JSON.stringify({
		status: status,
		content: page.content
	}));
    phantom.exit();
});