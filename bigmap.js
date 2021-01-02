function biginitialize() {

	var biglat1, biglng1, biglat2, biglng2, bigmyLatlng, bigmyLatlng2, mybigmap;

	biglat1 = 38;
	biglng1 = 8;

	let ownLocatorFromUrl = getURLParameter("ownLocator");

	if(ownLocatorFromUrl == null)
		ownLocator = window.prompt("Enter your locator","JN59IC")
	else
		ownLocator = ownLocatorFromUrl;

	let x = GHelper.GetLatLonByMaidenLocator(ownLocator);

	bigmyLatlng = new google.maps.LatLng(x.lat, x.lon);
	
	var mapOptions = {
		center: bigmyLatlng,
		zoom: 3,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		styles: myaray
	};

	bigmap = new google.maps.Map(document.getElementById('bigmap-canvas'), mapOptions);


	var myxxx = new DayNightOverlay({
		map: bigmap,
		date: new Date((new Date()).toUTCString()),
		fillColor: 'rgba(0,0,0,0.7)',
		strokeColor: 'rgba(255,0,0,1)'
	});

	window.setInterval(function () {
		myxxx.setDate(new Date((new Date()).toUTCString()));
	}, 300000);

	// last stepp is initmarkers!
	google.maps.event.addListenerOnce(bigmap, 'tilesloaded', function () {	
		initmarkers();
	});
	infoWindow = new google.maps.InfoWindow;
}

function initmarkers() {
	if (globalJsonData.length > showOnly)
		markerFillHandler(globalJsonData);
	else
		window.setTimeout(initmarkers, 1000);
}

function bindInfoWindow(marker, map, infoWindow, html) {
	google.maps.event.addListener(marker, 'mouseover', function () {
		infoWindow.setContent(html);
		infoWindow.open(map, marker);
	});
	google.maps.event.addListener(marker, 'mouseout', function () {
		infoWindow.close();
	});
}

function refillmarkers() {
	var descendingArray = collectivJsonArray.slice(0);
	markerFillHandler(descendingArray.reverse());
}

function markerFillHandler(sourceArray) {
	if (showOnly > sourceArray.length)
		showOnly = sourceArray.length;

	var firstElements = sourceArray.slice(0, showOnly);

	for (var i = 0; i < showOnly; i++) {
		createDxMarkerSet(firstElements[i]);
	}

	isInit = true;
}

function createDxMarkerSet(myElementSet) {

	var callInfo = {
		Spotter: myElementSet.de_call,
		Dx: myElementSet.dx_call,
		Qrg: myElementSet.frequency,
		Time: myElementSet.time,
		Country: myElementSet.info,
		LatLon: new google.maps.LatLng(myElementSet.dx_latitude, myElementSet.dx_longitude),
		SLatLon: new google.maps.LatLng(myElementSet.de_latitude, myElementSet.de_longitude)
	}

	addDxmarker(callInfo);
	addSpotmarker(callInfo);
	addPath(callInfo);

}

function addDxmarker(callInfo) {
	addmarker(callInfo, false);
}

function addSpotmarker(callInfo) {
	addmarker(callInfo, true);
}

function addmarker(callInfo, isSpotter) {

	var actualLatLon;
	var theColor = "center";
	var theArray;

	if (isSpotter) {
		actualLatLon = callInfo.SLatLon;
		theArray = spotmarkers;
	} else {
		actualLatLon = callInfo.LatLon;
		theColor = getPinName(callInfo.Qrg);
		theArray = markers;
	}

	var marker = new google.maps.Marker({
		position: actualLatLon,
		icon: icons[theColor],
		map: bigmap
	});

	var mhMyToDX = new GHelper(null, null, callInfo.LatLon.lat(), callInfo.LatLon.lng(), ownLocator);
	var mhMyToSpot = new GHelper(null, null, callInfo.SLatLon.lat(), callInfo.SLatLon.lng(), ownLocator);
	var mhTheirs = new GHelper(callInfo.LatLon.lat(), callInfo.LatLon.lng(), callInfo.SLatLon.lat(), callInfo.SLatLon.lng(), null);

	var html = "<div class='infowin'>";
	if (isSpotter) {
		html = html + "<b>"+callInfo.Spotter + "</b> found " + callInfo.Dx + " in "+ callInfo.Country + "<BR/>";
		html = html + "QRG: " + callInfo.Qrg + " @ " + callInfo.Time + "<BR/>";
	} else {
		html = html + "<b>" + callInfo.Dx +"</b>, " + callInfo.Country + " spotted by "+callInfo.Spotter+"<BR/>";
		html = html + "QRG: " + callInfo.Qrg + " @ " + callInfo.Time + "<BR/>";
	}
	html = html + "Myself to: " + callInfo.Dx + ": " + mhMyToDX.Heading + "&deg;(" + mhMyToDX.Longpath + "&deg;)" + " - " + mhMyToDX.Distance + "km" + "<BR/>";
	html = html + "Myself to: " + callInfo.Spotter + ": " + mhMyToSpot.Heading + "&deg;(" + mhMyToSpot.Longpath + "&deg;)" + " - " + mhMyToSpot.Distance + "km" + "<BR/>";
	html = html + callInfo.Dx + " to " + callInfo.Spotter + ": " + mhTheirs.Heading + "&deg;|" + mhTheirs.Longpath + "&deg; - " + mhTheirs.Distance + "km" + "<BR/>";

	bindInfoWindow(marker, bigmap, infoWindow, html);
	theArray.push(marker);
}


function addPath(callInfo) {
	var pathCoordinates = [
				callInfo.LatLon,
				callInfo.SLatLon
	];
	var flightPath = new google.maps.Polyline({
		path: pathCoordinates,
		geodesic: true,
		strokeColor: '#69acfd',
		strokeOpacity: 1.0,
		strokeWeight: 1
	});
	dxPath.push(flightPath);
	flightPath.setMap(bigmap);
}

function getPinName(qrg) {

	var wert = parseInt(qrg);
	if (wert > 1000 && wert < 2000)
		return "160";
	if (wert > 3000 && wert < 4000)
		return "80";
	if (wert > 4000 && wert < 6000)
		return "60";
	if (wert > 6000 && wert < 8000)
		return "40";
	if (wert > 9000 && wert < 11000)
		return "30";
	if (wert > 13000 && wert < 15000)
		return "20";
	if (wert > 17000 && wert < 19000)
		return "17";
	if (wert > 20000 && wert < 22000)
		return "15";
	if (wert > 24000 && wert < 25000)
		return "12";
	if (wert > 27000 && wert < 31000)
		return "10";

	return "6";
}


var icons = new Array();
let icon_def = ["center", "6", "10", "12", "15", "17", "20", "30", "40", "60", "80", "160"]

for(let a = 0; a < icon_def.length; a++)
{
	icons[icon_def[a]] = {
		url: "images/"+icon_def[a]+".png",
		size: new google.maps.Size(12, 20),
		origin: new google.maps.Point(0, 0),
		anchor: new google.maps.Point(6, 20)	
	}
}

// icons["center"] = {
// 	url: "images/center.png",
// 	// This marker is 20 pixels wide by 32 pixels tall.
// 	size: new google.maps.Size(12, 20),
// 	// The origin for this image is 0,0.
// 	origin: new google.maps.Point(0, 0),
// 	// The anchor for this image is the base of the flagpole at 0,32.
// 	anchor: new google.maps.Point(6, 20)
// };

// icons["6"] = {
// 	url: "images/6.png",
// 	// This marker is 20 pixels wide by 32 pixels tall.
// 	size: new google.maps.Size(12, 20),
// 	// The origin for this image is 0,0.
// 	origin: new google.maps.Point(0, 0),
// 	// The anchor for this image is the base of the flagpole at 0,32.
// 	anchor: new google.maps.Point(6, 20)
// };

// icons["10"] = {
// 	url: "images/10.png",
// 	// This marker is 20 pixels wide by 32 pixels tall.
// 	size: new google.maps.Size(12, 20),
// 	// The origin for this image is 0,0.
// 	origin: new google.maps.Point(0, 0),
// 	// The anchor for this image is the base of the flagpole at 0,32.
// 	anchor: new google.maps.Point(6, 20)
// };

// icons["12"] = {
// 	url: "images/12.png",
// 	// This marker is 20 pixels wide by 32 pixels tall.
// 	size: new google.maps.Size(12, 20),
// 	// The origin for this image is 0,0.
// 	origin: new google.maps.Point(0, 0),
// 	// The anchor for this image is the base of the flagpole at 0,32.
// 	anchor: new google.maps.Point(6, 20)
// };

// icons["15"] = {
// 	url: "images/15.png",
// 	// This marker is 20 pixels wide by 32 pixels tall.
// 	size: new google.maps.Size(12, 20),
// 	// The origin for this image is 0,0.
// 	origin: new google.maps.Point(0, 0),
// 	// The anchor for this image is the base of the flagpole at 0,32.
// 	anchor: new google.maps.Point(6, 20)
// };

// icons["17"] = {
// 	url: "images/17.png",
// 	// This marker is 20 pixels wide by 32 pixels tall.
// 	size: new google.maps.Size(12, 20),
// 	// The origin for this image is 0,0.
// 	origin: new google.maps.Point(0, 0),
// 	// The anchor for this image is the base of the flagpole at 0,32.
// 	anchor: new google.maps.Point(6, 20)
// };

// icons["20"] = {
// 	url: "images/20.png",
// 	// This marker is 20 pixels wide by 32 pixels tall.
// 	size: new google.maps.Size(12, 20),
// 	// The origin for this image is 0,0.
// 	origin: new google.maps.Point(0, 0),
// 	// The anchor for this image is the base of the flagpole at 0,32.
// 	anchor: new google.maps.Point(6, 20)
// };

// icons["30"] = {
// 	url: "images/30.png",
// 	// This marker is 20 pixels wide by 32 pixels tall.
// 	size: new google.maps.Size(12, 20),
// 	// The origin for this image is 0,0.
// 	origin: new google.maps.Point(0, 0),
// 	// The anchor for this image is the base of the flagpole at 0,32.
// 	anchor: new google.maps.Point(6, 20)
// };

// icons["40"] = {
// 	url: "images/40.png",
// 	// This marker is 20 pixels wide by 32 pixels tall.
// 	size: new google.maps.Size(12, 20),
// 	// The origin for this image is 0,0.
// 	origin: new google.maps.Point(0, 0),
// 	// The anchor for this image is the base of the flagpole at 0,32.
// 	anchor: new google.maps.Point(6, 20)
// };

// icons["80"] = {
// 	url: "images/80.png",
// 	// This marker is 20 pixels wide by 32 pixels tall.
// 	size: new google.maps.Size(12, 20),
// 	// The origin for this image is 0,0.
// 	origin: new google.maps.Point(0, 0),
// 	// The anchor for this image is the base of the flagpole at 0,32.
// 	anchor: new google.maps.Point(6, 20)
// };

// icons["160"] = {
// 	url: "images/160.png",
// 	// This marker is 20 pixels wide by 32 pixels tall.
// 	size: new google.maps.Size(12, 20),
// 	// The origin for this image is 0,0.
// 	origin: new google.maps.Point(0, 0),
// 	// The anchor for this image is the base of the flagpole at 0,32.
// 	anchor: new google.maps.Point(6, 20)
// };

// Sets the map on all markers in the array.
function setAllMap(bigmap) {
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(bigmap);
	}
	for (var j = 0; j < spotmarkers.length; j++) {
		spotmarkers[j].setMap(bigmap);
	}
	for (var k = 0; k < dxPath.length; k++) {
		dxPath[k].setMap(bigmap);
	}
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
	setAllMap(null);
}

// Shows any markers currently in the array.
function showMarkers() {
	setAllMap(bigmap);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
	clearMarkers();
	markers = [];
	spotmarkers = [];
	dxPath = [];
}

function spliceMarker(numbertodelete) {
	markers.splice(0, numbertodelete);
}

function getMarkerCount()
{
	return markers.length;	
}

/*

"featureType": "all",
		"elementType": "labels",
		"stylers": [
			{
				"color": "#ffffff"
			},
			{
				"gamma": "6.77"
			},
			{
				"lightness": "49"
			}
		]

		"featureType": "landscape",
		"elementType": "geometry",
		"stylers": [
			{
				"lightness": 30
			},
			{
				"saturation": 30
			},
			{
				"color": "#00ff3e"
			}

		"featureType": "water",
		"elementType": "labels.text.fill",
		"stylers": [
			{
				"color": "#0000dd"
			},
			{
				"lightness": "28"
			}
		]

		"featureType": "all",
		"elementType": "geometry",
		"stylers": [
			{
				"color": "#000000"
			}
		]
*/

var myaray = [
	{
		"featureType": "all",
		"elementType": "geometry",
		"stylers": [
			{
				"color": "#1a4d2e"
			}
		]
	},
	{
		"featureType": "all",
		"elementType": "labels",
		"stylers": [
			{
				"color": "#4acd4c"
			},
			{
				"gamma": "6.77"
			},
			{
				"lightness": "49"
			}
		]
	},
	{
		"featureType": "all",
		"elementType": "labels.text.fill",
		"stylers": [
			{
				"gamma": "0.00"
			},
			{
				"lightness": 20
			}
		]
	},
	{
		"featureType": "all",
		"elementType": "labels.text.stroke",
		"stylers": [
			{
				"saturation": -31
			},
			{
				"lightness": -33
			},
			{
				"weight": 2
			},
			{
				"gamma": 0.8
			}
		]
	},
	{
		"featureType": "all",
		"elementType": "labels.icon",
		"stylers": [
			{
				"visibility": "off"
			}
		]
	},
	{
		"featureType": "administrative.country",
		"elementType": "geometry",
		"stylers": [
			{
				"weight": "1.48"
			}
		]
	},
	{
		"featureType": "landscape",
		"elementType": "geometry",
		"stylers": [
			{
				"lightness": 30
			},
			{
				"saturation": 30
			},
			{
				"color": "#00ff3e"
			}
		]
	},
	{
		"featureType": "poi",
		"elementType": "geometry",
		"stylers": [
			{
				"saturation": 20
			},
			{
				"color": "#005727"
			}
		]
	},
	{
		"featureType": "poi.park",
		"elementType": "geometry",
		"stylers": [
			{
				"lightness": 20
			},
			{
				"saturation": -20
			},
			{
				"color": "#003f02"
			}
		]
	},
	{
		"featureType": "road",
		"elementType": "all",
		"stylers": [
			{
				"saturation": "70"
			},
			{
				"gamma": "2.08"
			},
			{
				"color": "#005f20"
			}
		]
	},
	{
		"featureType": "road",
		"elementType": "geometry",
		"stylers": [
			{
				"lightness": 10
			},
			{
				"saturation": -30
			}
		]
	},
	{
		"featureType": "road",
		"elementType": "geometry.stroke",
		"stylers": [
			{
				"saturation": 25
			},
			{
				"lightness": 25
			}
		]
	},
	{
		"featureType": "water",
		"elementType": "all",
		"stylers": [
			{
				"lightness": "-36"
			},
			{
				"visibility": "on"
			},
			{
				"weight": "2.16"
			},
			{
				"saturation": "11"
			},
			{
				"gamma": "1.22"
			},
			{
				"color": "#000000"
			}
		]
	},
	{
		"featureType": "water",
		"elementType": "labels",
		"stylers": [
			{
				"weight": "0.01"
			},
			{
				"lightness": "-42"
			},
			{
				"gamma": "0.51"
			}
		]
	},
	{
		"featureType": "water",
		"elementType": "labels.text.fill",
		"stylers": [
			{
				"color": "#4acd4c"
			},
			{
				"lightness": "28"
			}
		]
	},
	{
		"featureType": "water",
		"elementType": "labels.text.stroke",
		"stylers": [
			{
				"weight": "0.13"
			},
			{
				"gamma": "0.94"
			},
			{
				"lightness": "-81"
			},
			{
				"saturation": "19"
			}
		]
	}
];
