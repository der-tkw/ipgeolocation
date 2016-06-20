function process() {
	chrome.browserAction.setIcon({path:'../images/icon_128.png'});

	chrome.storage.sync.get(null, function(settings) {
		if (settings.silentMode) {
			chrome.runtime.sendMessage({
				action: "processSilent"
			}, null);
			window.close();
		} else {
			displayLoading();
			chrome.runtime.sendMessage({
				action: "process"
			}, function(response) {
				if (response.success) {
					success(response.result);
				} else {
					error();
				}
			});
		}
	});
}

function success(data) {
	chrome.storage.sync.get(null, function(settings) {
		chrome.browserAction.setIcon({path:'../images/countries/' + data.country_code.toLowerCase() + '.png'});
		update('ip', data.ip);
		update('country', data.country_name);
		update('flag', '<img src="../images/countries/' + data.country_code.toLowerCase() + '.png"/>');
		if (settings.showMap) {
			var latlng = data.latitude + ',' + data.longitude;
			var mapurl = 'https://maps.google.com/maps/api/staticmap?center=' + latlng + '&zoom=' + settings.mapZoom + '&maptype=' + settings.mapType + '&markers=' + latlng + '&size=350x200&sensor=false';
			update('map', '<img src="' + mapurl + '"/>');
		} else {
			update('map', '');
		} 
		if (settings.showLatLong) {
			update('latitude', data.latitude);
			update('longitude', data.longitude);
		}
		displayContent();
		displayNotification('Location has been updated successfully!');
	});
}

function error() {
	chrome.browserAction.setIcon({path:'../images/icon_128.png'});
	update('ip', '-');
	update('flag', '');
	update('country', '-');
	update('latitude', '-');
	update('longitude', '-');
	update('map', '');
	window.close();
	displayNotification('Failed to update location. Please try again!');
}

function displayContent() {
	chrome.storage.sync.get(null, function(settings) {
		if (!settings.silentMode) {
			$('#content').show();
			$('#loading').hide();
			if (!settings.showPopupHeader) {
				$('h1').hide();
			}
			if (!settings.showLatLong) {
				$('.latlong').hide();
			}
		}
	});
}

function displayLoading() {
	chrome.storage.sync.get(null, function(settings) {
		if (!settings.silentMode) {
			$('#content').hide();
			$('#loading').show();
		} else {
			$('#content').hide();
			$('#loading').hide();
		}
	});
}

function displayNotification(msg) {
	chrome.runtime.sendMessage({
		action: "notification",
		msg: msg
	}, null);
}

function update(id, value) {
	$('#' + id).empty();
	$('#' + id).append(value);
}

window.addEventListener('load', function() {
	process();
});