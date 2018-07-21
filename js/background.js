chrome.runtime.onInstalled.addListener(function(details) {
	if (details.reason == "install") {
		chrome.runtime.openOptionsPage();
	}
});

chrome.runtime.onMessage.addListener(function(request, sender, response) {
	if (request.action == "process") {
		return process(response);
	} else if (request.action == "processSilent") {
		return process(processSilent);
	} else if (request.action == "notification") {
		return displayNotification(request.msg);
	}
});

chrome.alarms.onAlarm.addListener(function(alarm) {
	return process(processSilent);
});

function processSilent(response) {
	if (response.success) {
		chrome.browserAction.setIcon({path:'../images/countries/' + response.result.country.toLowerCase() + '.png'});
		displayNotification('Location has been updated successfully!');
	} else {
		chrome.browserAction.setIcon({path:'../images/icon_128.png'});
		displayNotification('Failed to update location. Please try again!');
	}
}

function process(response) {
	$.ajax({
		url: 'https://ipinfo.io/geo',
		dataType: 'json',
		cache: false,
		timeout: 5000,
		success: function(data) {
			response({success: true, result: data});
		},
		error: function(data) {
			response({success: false, result: data});
		}
	});
	return true;
}

function displayNotification(msg) {
	chrome.storage.sync.get(null, function(settings) {
		if (settings.showNotifications) {
			chrome.notifications.clear('ipgeolocationnotification', function() {});
			chrome.notifications.create('ipgeolocationnotification', {
				type: 'basic',
				iconUrl: '../images/icon_128_centered.png',
				title: 'IP Geo Location',
				message: msg
			}, function() {});
		}
	});
	return true;
}