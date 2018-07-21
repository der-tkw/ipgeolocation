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
		chrome.browserAction.setIcon({path:'../images/countries/' + data.country.toLowerCase() + '.png'});
		update('ip', data.ip);
		update('country', JSON.parse(countries)[0][data.country]);
		update('city', data.city + ", " + data.region);
		update('flag', '<img src="../images/countries/' + data.country.toLowerCase() + '.png"/>');
		if (settings.showMap) {
			var mapurl = 'https://maps.google.com/maps/api/staticmap?center=' + data.loc + '&zoom=' + settings.mapZoom + '&maptype=' + settings.mapType + '&markers=' + data.loc + '&size=350x200&sensor=false';
			update('map', '<img src="' + mapurl + '"/>');
		} else {
			update('map', '');
		} 
		if (settings.showLatLong) {
			update('latitude', data.loc.split(',')[0]);
			update('longitude', data.loc.split(',')[1]);
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
	update('city', '-');
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