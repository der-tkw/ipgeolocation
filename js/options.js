function updateStatus(msg) {
	var status = document.getElementById('status');
	status.innerHTML = msg;
	window.setTimeout(function() {
		status.innerHTML = '&nbsp;';
	}, 2000);
}

function save() {
	saveCheckbox('showMap');
	saveCheckbox('showPopupHeader');
	saveCheckbox('showLatLong');
	saveSelect('mapType');
	saveSelect('mapZoom');
	updateStatus('Options saved.');
}

function saveSelect(id) {
	var select = document.getElementById(id);
	var value = select.children[select.selectedIndex].value;
	localStorage[id] = value;
}

function saveCheckbox(id) {
	var checkbox = document.getElementById(id);
	var value = checkbox.checked;
	localStorage[id] = value;
}

function restore() {
	restoreCheckbox('showMap');
	restoreCheckbox('showPopupHeader');
	restoreCheckbox('showLatLong');
	restoreSelect('mapType');
	restoreSelect('mapZoom');
}

function restoreSelect(id) {
	var stored = localStorage[id];
	if (!stored) {
		// nothing to restore
    	return;
	}
	var select = document.getElementById(id);
	for (var i = 0; i < select.children.length; i++) {
    	var child = select.children[i];
		if (child.value == stored) {
			child.selected = 'true';
			break;
		}
	}
}

function restoreCheckbox(id) {
	var stored = localStorage[id];
	if (!stored) {
		// nothing to restore
    	return;
	}
	var checkbox = document.getElementById(id);
	checkbox.checked = JSON.parse(stored);
}

function handleMapCheckbox() {
	var checkbox = document.getElementById('showMap');
	$('.mapsub :input').prop('disabled', !checkbox.checked);
	if (!checkbox.checked) {
		document.getElementById('showLatLong').checked = false;
	}
}

window.addEventListener('load', function() {
	restore();
	handleMapCheckbox();
	document.querySelector('#save').addEventListener('click', save);
	document.querySelector('#restore').addEventListener('click', restore);
	document.querySelector('#showMap').addEventListener('change', handleMapCheckbox);
});