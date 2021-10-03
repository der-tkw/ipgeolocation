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
		chrome.action.setIcon({path:'../images/countries/' + response.result.country.toLowerCase() + '.png'});
		displayNotification('Location has been updated successfully!');
	} else {
		chrome.action.setIcon({path:'../images/icon_128.png'});
		displayNotification('Failed to update location. Please try again!');
	}
}

function process(response) {
    fetch('https://ipinfo.io/geo', {cache: "no-store"})
        .then(response => response.json())
        .then(data => response({success: true, result: data}))
        .catch(error => response({success: false}));
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