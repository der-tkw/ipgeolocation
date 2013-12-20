function unknown() {
	chrome.browserAction.setIcon({path:"../images/unknown.png"});
	update('ip', '-');
	update('flag', '');
	update('country', '-');
	update('map', '');
	$('*').show();
}

function update(id, value) {
	$('#' + id).empty();
	$('#' + id).append(value);
}

function updateCountryIcon() {
	chrome.browserAction.setIcon({path:"../images/loading.png"});
	$('*').hide();
	$.ajax({
		url: 'http://jsonip.com/',
		dataType: 'json',
	    cache: false,
	    timeout: 5000,
		success: function(data){
			update('ip', data.ip);			
			$.ajax({
				url: 'http://freegeoip.net/json/' + data.ip,
				dataType: 'json',
			    cache: false,
			    timeout: 5000,
				success: function(data){
					chrome.browserAction.setIcon({path:"../images/countries/" + data.country_code.toLowerCase() + ".png"});
					update('country', data.country_name);
					update('flag', '<img src="../images/countries/' + data.country_code.toLowerCase() + '.png"/>');
					if (JSON.parse(localStorage.showMap)) {
						var latlng = data.latitude + "," + data.longitude;
						var mapurl = 'https://maps.google.com/maps/api/staticmap?center=' + latlng + '&zoom=10&markers=' + latlng + '&size=300x200&sensor=false';
						update('map', '<img src="' + mapurl + '"/>');
					} else {
						update('map', '');
					} 
					$('*').show();
				},
				error: unknown
			});
		},
		error: unknown
	});
}

updateCountryIcon();

if (!localStorage.isInitialized) {
	localStorage.showMap = true;
	localStorage.showHeader = true;
	localStorage.isInitialized = true;
}