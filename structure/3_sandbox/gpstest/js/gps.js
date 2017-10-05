$(document).ready(function() {
	
	console.log('document.ready');

	// vars
	var track_count = "track_count";
	var $output = $("#output");
	var positions = [];
	var watchID;
	var options = { 
		enableHighAccuracy: true, 
		timeout           : 10000
	};
	
	if ("geolocation" in navigator) {
		_initButtons();
	}
	else console.log('geolocation not supported....');
	
	function _initButtons(){

		$('.start').click(_startTracking);
		$('.stop').click(_stopTracking);
		$('.map').click(_drawMap);
	}

	function _startTracking(){
		
		console.log('_startTracking');

		_reset();

		watchID = navigator.geolocation.watchPosition(function(position) {

			var time = new Date(position.timestamp);

			$output.append("<li>long: " + position.coords.longitude + "lat: " + position.coords.latitude + " at " + time.toTimeString() + "</li>")
			positions.push(position);
			
		}, 
			function(){ console.log('onLocationError: ' + error.code + ": " + error.message);
	    }, options);
	}

	function _stopTracking(){

		console.log('_stopTracking');

		navigator.geolocation.clearWatch(watchID);
		watchID = null;

		var trackCount = parseInt(window.localStorage.getItem(track_count));
		var trackID = (!Number.isNaN(trackCount)) ? trackCount+1 : 1;

		window.localStorage.setItem(trackID, JSON.stringify(positions));
		window.localStorage.setItem(track_count, trackID);

		_reset();
	}

	function _drawMap(){

		console.log('_drawMap');

		var lastID = parseInt(window.localStorage.getItem(track_count));
		var trackData = JSON.parse(window.localStorage.getItem(lastID));
		
		console.log(lastID + ": " + trackData);
		
		// var latLng = new google.maps.LatLng(trackData[0].coords.latitude, trackData[0].coords.longitude);
		var latLng = new google.maps.LatLng(-34.397, 150.644);
		var mapOptions = {
		  zoom: 15,
		  center: latLng,
		  mapTypeId: google.maps.MapTypeId.ROADMAP,
		  disableDefaultUI: true
		};
		var map = new google.maps.Map(document.getElementById("map"), mapOptions);

		/*var marker = new google.maps.Marker({
			position: latlng,
			map: map,
			title:"You are here"
		});*/
	}

	function _reset(){

		positions = [];
		$output.html('');
	}
});