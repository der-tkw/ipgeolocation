function save_options() {
	var silentMode = document.getElementById('silentMode').checked;
	var refreshInterval = document.getElementById('refreshInterval').value;
	var showNotifications = document.getElementById('showNotifications').checked;
	var showPopupHeader = document.getElementById('showPopupHeader').checked;
	var showMap = document.getElementById('showMap').checked;
	var showLatLong = document.getElementById('showLatLong').checked;
	var mapZoom = document.getElementById('mapZoom').value;

	chrome.storage.sync.set({
		silentMode: silentMode,
		refreshInterval: refreshInterval,
		showNotifications: showNotifications,
		showPopupHeader: showPopupHeader,
		showMap: showMap,
		showLatLong: showLatLong,
		mapZoom: mapZoom
	}, function() {
		var status = document.getElementById('status');
		status.textContent = 'Options saved.';
		setTimeout(function() {
			status.textContent = '';
		}, 1500);
	});

	if (refreshInterval != '-1') {
		chrome.alarms.clear('ipgeolocationalarm');
		chrome.alarms.create('ipgeolocationalarm', {periodInMinutes: parseFloat(refreshInterval)});
	} else {
		chrome.alarms.clear('ipgeolocationalarm');
	}
}

function restore_options() {
	chrome.storage.sync.get({
		silentMode: false,
		refreshInterval: '-1',
		showNotifications: true,
		showPopupHeader: true,
		showMap: true,
		showLatLong: false,
		mapZoom: '8'
	}, function(items) {
		document.getElementById('silentMode').checked = items.silentMode;
		document.getElementById('refreshInterval').value = items.refreshInterval;
		document.getElementById('showNotifications').checked = items.showNotifications;
		document.getElementById('showPopupHeader').checked = items.showPopupHeader;
		document.getElementById('showMap').checked = items.showMap;
		document.getElementById('showLatLong').checked = items.showLatLong;
		document.getElementById('mapZoom').value = items.mapZoom;
		handleUiSettings(items.silentMode);
		handleMapSettings(items.showMap);
	});
}

function handleUiSettings() {
	toggleState('uiSettings', !document.getElementById('silentMode').checked);
	handleMapSettings();
}

function handleMapSettings() {
	toggleState('mapSettings', document.getElementById('showMap').checked);
}

function toggleState(parent, val) {
	var nodes = document.getElementById(parent).getElementsByTagName('*');
	for(var i = 0; i < nodes.length; i++){
		nodes[i].disabled = !val;
	}
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
document.getElementById('showMap').addEventListener('change', handleMapSettings);
document.getElementById('silentMode').addEventListener('change', handleUiSettings);