// Find a class grabs data from the database that Facilitators have added to their profile, maps the entries and displays them according to geolocation proximity or using location data from a form (for the travelers).
if (typeof($j)!='function') {
	$j = jQuery.noConflict();
}
var map, instructors, locations, global_long, global_lat
$j(document).ready(function(){
	$j('#get_location').bind('click', function(){
		$j('#msg').html('Attempting to determine your location...');
		$j('#location_form').hide();
		initiate_geolocation();
	})
	$j('#enter_location').bind('click', function(){
		$j('#location_form').show('slow');
		$j('#location_form').find('input[type="text"]').each(function(){
			$j(this).val('');
		})
	})
	$j('#location_submit').bind('click', function(){
		$j('#location_form').hide();

		data = $j('#form1').serialize();
		$j.ajax({
			url: '/ajax/geolocate.php',
			type: 'POST',
			dataType: 'json',
			data: data,
			success: function(result) {
				if (result.status=='success') {
					initialize_map(result.lat, result.long);
				} else {
					$j('#msg').html("Unable to resolve your location.  Add or remove some information and try again.");
				}
			}
		})
	})
	console.log("event handlers ready.");
})
function add_marker(lat, long, title, instructor_id) {
	var pos = new google.maps.LatLng(lat, long)
	var opts = new google.maps.Marker({
			position: pos,
			draggable: false,
			clickable: true,
			map: map,
			visible: true,
			zIndex:map.markers.length,
			title: title,
			icon: 'http://thebodygrooveexperience.com/images/dancer.png'
		});
	google.maps.event.addListener(opts, 'click', function() {
		map.setZoom(18);
		map.setCenter(opts.getPosition());
		show_schedule(String(this.position.lat()), String(this.position.lng()));
		console.log(this.position.lat())
	});

}
function initialize_map(lat, long) {
	global_long = long;
	global_lat = lat;
	$j('#msg').html("Getting class locations...");
  var mapOptions = {
    zoom: 8,
    center: new google.maps.LatLng(lat, long),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
  map.markers = map.markers || [];
  getClassLocations();
}
function reset_map() {
	initialize_map(global_lat, global_long);
}
function initiate_geolocation() {
	console.log('Initiating geolocation...');
	navigator.geolocation.getCurrentPosition(handle_geolocation_query,handle_errors);  
}  
function handle_errors(error)  
{  
	switch(error.code)  
	{  
		case error.PERMISSION_DENIED: $j('#msg').html("Either your browser is set to automatically deny geolocation requests or you elected not to share geolocation data.<br><br>Could not find you automatically.");  
		break;  
		case error.POSITION_UNAVAILABLE: $j('#msg').html("For some reason, I could not detect your current position.");  
		break;  
		case error.TIMEOUT: $j('#msg').html("A timeout occurred while retrieving your location.  Please try again or use the form.");  
		break;  
		default: $j('#msg').html("unknown error");  
		break;  
	}
	$j('#location_form').show();
}  
function handle_geolocation_query(position){
	initialize_map(position.coords.latitude,position.coords.longitude);
}
function getClassLocations() {
	$j.ajax({
		url: '/ajax/getClassLocations.php',
		dataType: 'json',
		success: function(result){
			if (result.status=='success') {
				locations = result.locations
				for (i=0;i<locations.length;i++) {
					loc = result.locations[i];
					add_marker(loc.lat, loc.long, loc.name, loc.ID);
				}
				instructors = result.instructors;
			} else {
				$j('#msg').html('An error has occurred.  Please let the <a href="mailto: mark@markcicchetti.info">webmaster</a> know.');
			}
		}
	});
	$j('#msg').html('');
}
function show_schedule(lat, long) {
	/*
	*
	*	The idea here is to list all instructors that teach at this location.
	*	if there's only one, show the profile and the schedule.
	*	if there's more than one, show the profile pic with a link to show the profile.
	*	Build a profile for each facilitator that has a class at this location.
	*/
	//	Search through all trainings for matching lat and long...
	instructor_list = new Array();
	
	for (i=0;i<locations.length;i++) {
		//	hack to get around float imprecision in 64 bit numbers.
		if ((parseInt(locations[i].lat*1000000)==parseInt(lat*1000000))&&(parseInt(locations[i].long*1000000)==parseInt(long*1000000))) {
			if ($j.inArray(locations[i].ID+'-'+locations[i].site, instructor_list)==-1) {
				instructor_list.push(locations[i].ID+'-'+locations[i].site);
			}
		}
	}
	console.log(instructor_list);
	$j('#avatars').empty();
	for (i=0;i<instructor_list.length;i++) {
		avatar = new Image();
		avatar.src = instructors[instructor_list[i]].user_avatar;
		avatar.width = '75';
		avatar.lat = lat;
		avatar.long = long;
		$j(avatar).addClass('avatar');
		avatar.instructor_id = instructor_list[i];
		$j('#avatars').append(avatar)
		$j(avatar).bind('click', function(){
			$j('.avatar').removeClass('active');
			$j(this).addClass('active');
			$j('#facilitator').html(instructors[this.instructor_id].first_name+' '+instructors[this.instructor_id].last_name);
			$j('#facilitator_email').html(instructors[this.instructor_id].user_email);
			$j('#website').html(instructors[this.instructor_id].user_url);
			$j('#bio').html(instructors[this.instructor_id].description);
			$j('#schedule').html('<h3>Schedule</h3>');
			for (i=0;i<locations.length;i++) {
				if ((parseInt(locations[i].lat*1000000)==parseInt(this.lat*1000000))&&(parseInt(locations[i].long*1000000)==parseInt(this.long*1000000))) {
					if (locations[i].ID+'-'+locations[i].site==this.instructor_id) {
						$j('#schedule').append(locations[i].schedule+'<br />')
					}
				}
			}
		})
	}
	$j('.avatar').first().click()
	$j('#instructor_info').show();
}