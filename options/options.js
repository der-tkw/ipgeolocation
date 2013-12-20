window.addEventListener('load', function() {
	// init
	options.showMap.checked = JSON.parse(localStorage.showMap);
	
	// on change listener
	options.showMap.onchange = function() {
    	localStorage.showMap = options.showMap.checked;
	};
});
