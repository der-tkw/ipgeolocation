function process() {
	chrome.action.setIcon({path:'../images/icon_128.png'});

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
		chrome.action.setIcon({path:'../images/countries/' + data.country.toLowerCase() + '.png'});
		update('ip', data.ip);
		update('country', JSON.parse(countries)[0][data.country]);
		update('city', data.city + ", " + data.region);
		update('flag', '<img src="../images/countries/' + data.country.toLowerCase() + '.png"/>');

		var lat = data.loc.split(',')[0];
		var lon = data.loc.split(',')[1];
		if (settings.showMap) {
		    var map = document.getElementById('map');
			map.style.height = '350px';
			map.style.width = '400px';
			map.style.border = '1px solid #d3d3d3';

			var map = new ol.Map({
				target: 'map',
				layers: [
					new ol.layer.Tile({
						source: new ol.source.OSM()
					})
				],
				controls: ol.control.defaults({
					rotation: false
				}),
				view: new ol.View({
					center: ol.proj.fromLonLat([lon, lat]),
					zoom: settings.mapZoom,
					maxZoom: 20
				})
			});

			var pin = new ol.Feature({
				 geometry: new ol.geom.Point(ol.proj.fromLonLat([lon, lat]))
			});

			pin.setStyle(
				new ol.style.Style({
					image: new ol.style.Icon({
					src: '../images/pin.png',
					scale: 0.05,
					}),
				})
			);

			var layer = new ol.layer.Vector({
				 source: new ol.source.Vector({
					 features: [
						pin
					]
				})
			});
			map.addLayer(layer);
		} else {
			update('map', '');
		}
		if (settings.showLatLong) {
			update('latitude', lat);
			update('longitude', lon);
		}
		displayContent();
		displayNotification('Location has been updated successfully!');
	});
}

function error() {
	chrome.action.setIcon({path:'../images/icon_128.png'});
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
			show('#content');
			hide('#loading');
			if (!settings.showPopupHeader) {
				hide('h1');
			}
			if (!settings.showLatLong) {
				hide('.latlong');
			}
		}
	});
}

function displayLoading() {
	chrome.storage.sync.get(null, function(settings) {
		if (!settings.silentMode) {
			hide('#content');
			show('#loading');
		} else {
			hide('#content');
			hide('#loading');
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
    var elem = document.getElementById(id);
    elem.innerHTML = value;
}

function hide(selector) {
    document.querySelectorAll(selector).forEach(elem => { elem.style.display = "none" });
}

function show(selector) {
    document.querySelectorAll(selector).forEach(elem => { elem.style.display = "block" });
}

window.addEventListener('load', function() {
	process();
});