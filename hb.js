$(document).ready(function () {
	showOnly = getURLParameter("showOnly");
	autoClean = (getURLParameter("autoClean"));

	if (autoClean == null)
		autoClean = 0;
	else
		autoClean = autoClean * 1000;

	if (showOnly == null || showOnly == 0)
		isCleanup = false;
	else
		isCleanup = true;

	$('#bordermyframe').draggable({
		handle: 'thead'
	});

	$('#myClock').draggable();

	updateDxSpots(lastCallingId, init);
	setInterval(function () { updateDxSpots(lastCallingId, update); }, 5000);

	if (autoClean > 0)
		setInterval(startAutoCleanUp, autoClean);

	$(".iframe").colorbox({ iframe: true, width: "80%", height: "80%" });

	var heightBodyFrame = $("#bordermyframe").height();

	$("#bordermyframe").mouseover(function () {
		$("#scroller1").height("500");
		$("#bordermyframe").height(heightBodyFrame + 390 - 13);
	});
	$("#bordermyframe").mouseout(function () {
		$("#scroller1").height("110");
		$("#bordermyframe").height(heightBodyFrame-13);
	});


	// Create two variable with the names of the months and days in an array
	var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

	// Create a newDate() object
	var newDate = new Date();
	// Extract the current date from Date object
	newDate.setDate(newDate.getUTCDate());
	// Output the day, date, month and year   
	$('#Date').html(dayNames[newDate.getDay()] + " " + newDate.getDate() + ' ' + monthNames[newDate.getMonth()] + ' ' + newDate.getFullYear());

	setInterval(function () {
		// Create a newDate() object and extract the seconds of the current time on the visitor's
		var seconds = new Date().getUTCSeconds();
		// Add a leading zero to seconds value
		$("#sec").html((seconds < 10 ? "0" : "") + seconds);
	}, 1000);

	setInterval(function () {
		// Create a newDate() object and extract the minutes of the current time on the visitor's
		var minutes = new Date().getUTCMinutes();
		// Add a leading zero to the minutes value
		$("#min").html((minutes < 10 ? "0" : "") + minutes);
	}, 1000);

	setInterval(function () {
		// Create a newDate() object and extract the hours of the current time on the visitor's
		var hours = new Date().getUTCHours();
		// Add a leading zero to the hours value
		$("#hours").html((hours < 10 ? "0" : "") + hours);
	}, 1000);


});

var updateDxSpots = function updateDxSpots(lastCallingId, callback) {
	var jsonMyUrl = 'http://www.dxsummit.fi/api/v1/spots';
	getAllContent(jsonMyUrl, callback);
};


function getAllContent(jsonMyUrl, callback) {
	fetch(jsonMyUrl)
		.then(response => response.json())
		.then(data => {
			for(let a = 0; a < data.length; a++)
	 		{
	 			data[a].dx_longitude = data[a].dx_longitude * -1;
	 			data[a].de_longitude = data[a].de_longitude * -1;
	 		}

			callback(data);
		});
}

var init = function (data) {

	globalJsonData = data;
	jsonObjectCollector();

	for (var i = 0; i < globalJsonData.length; i++) {
		var mapHelper = new GHelper(null, null, globalJsonData[i].dx_latitude, globalJsonData[i].dx_longitude, ownLocator);

		var dxEntry = {
			id: globalJsonData[i].id,
			spc: globalJsonData[i].de_call,
			qrg: globalJsonData[i].frequency,
			dxc: globalJsonData[i].dx_call,
			com: globalJsonData[i].info,
			tim: globalJsonData[i].time,
			lat: globalJsonData[i].dx_latitude,
			lon: globalJsonData[i].dx_longitude,
			bea: mapHelper.Heading,
			lop: mapHelper.Longpath,
			dis: mapHelper.Distance,
			map: '<a class="ajax" href="map.html?lat=' + globalJsonData[i].dx_latitude + '&lon=' + globalJsonData[i].dx_longitude + '">map</a>'
		}

		renderMyRows(dxEntry);
	}
}

var startAutoCleanUp = function () {
		deleteMarkers();
		refillmarkers();
}

var update = function (data) {
	globalJsonData = data;
	jsonObjectCollector();
}

var addMyMarker = function (aCurrentElement) {
//	if (isInit == true) {
		createDxMarkerSet(aCurrentElement);
//	}
}


var jsonObjectCollector = function jsonObjectCollector() {

	var globalLenght = globalJsonData.length;

	for (var i = globalJsonData.length - 1; i >= 0; i--) {
		collectivJsonArray.pushIfNotExist(globalJsonData[i], function (e) {
			return e.id === globalJsonData[i].id;
		});
	}

	if (globalLenght > 0)
		lastCallingId = globalJsonData[0].id;

	if (isCleanup) {
		deleteMarkers();
		refillmarkers();
	} 
}

var renderMyRows = function renderMyRows(myJsonData) {
		row = Mustache.to_html(templating, myJsonData);
		$('#myTable').append(row);
		$(".ajax").colorbox({ width: "600px", height: "400px", iframe: true });
}


var appendNewRow = function appendNewRow(myJsonData) {
	row = Mustache.to_html(templating, myJsonData);
	var newRow = $(row);
	newRow.hide();
	$('#myTable > tbody > tr:first').before(newRow);
	$(".ajax").colorbox({ width: "600px", height: "400px", iframe: true });
	newRow.fadeIn(1000);
	newRow.glowEffect(0, 10, 500);
}

Array.prototype.inArray = function (comparer) {
	for (var i = 0; i < this.length; i++) {
		if (comparer(this[i])) return true;
	}
	return false;
};

Array.prototype.pushIfNotExist = function (element, comparer) {
	if (!this.inArray(comparer)) {
		this.push(element);

		var mapHelper = new GHelper(null, null, element.dx_latitude, element.dx_longitude, ownLocator);

		var dxEntry = {
			id: element.id,
			spc: element.de_call,
			qrg: element.frequency,
			dxc: element.dx_call,
			com: element.info,
			tim: element.time,
			lat: element.dx_latitude,
			lon: element.dx_longitude,
			bea: mapHelper.Heading,
			lop: mapHelper.Longpath,
			dis: mapHelper.Distance,
			map: '<a class="ajax" href="map.html?lat=' + element.dx_latitude + '&lon=' + element.dx_longitude + '">map</a>'
		}

		appendNewRow(dxEntry);
		if (!isCleanup) {
			addMyMarker(element);
		}
	}
};

$.fn.glowEffect = function (start, end, duration, myfunction) {
	var $this = this;
	return this.css("a", start).animate({ a: end }, {
		duration: duration,
		complete: function() {
			$this.css("text-shadow", "none");
		},
		step: function(now) {
			$this.css("text-shadow", "0px 0px " + now + "px #fff");
		}
	});
};

function getURLParameter(name) {
	return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
}
