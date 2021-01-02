function GHelper(sourceLatitude, sourceLongitude, targetLatitude, targetLongitude) {

	var radientConvertValue = Math.PI / 180;
	this.SourceLatitude = sourceLatitude * radientConvertValue;
	this.SourceLongitude = sourceLongitude * radientConvertValue,
	this.TargetLatitude = targetLatitude * radientConvertValue,
	this.TargetLongitude = targetLongitude * radientConvertValue;
	this.Distance = function () {
		return roundTo(6378.388 * Math.acos(Math.sin(this.SourceLatitude) * Math.sin(this.TargetLatitude) + Math.cos(this.SourceLatitude) * Math.cos(this.TargetLatitude) * Math.cos(this.TargetLongitude - this.SourceLongitude)), 0);
	};
	this.Heading = function () {
		var dLon = (this.TargetLongitude - this.SourceLongitude);
		var y = Math.sin(dLon) * Math.cos(this.TargetLatitude);
		var x = Math.cos(this.SourceLatitude) * Math.sin(this.TargetLatitude) - Math.sin(this.SourceLatitude) * Math.cos(this.TargetLatitude) * Math.cos(dLon);

		var bearing = Math.atan2(y, x) * 180 / Math.PI;
		if (bearing < 0) {
			bearing = bearing + 360;
		}
		return roundTo(bearing,0);
	};
	this.Longpath = function () {
		return roundTo(((this.Heading() + 180) % 360),0);
	}

}

function roundTo(val, decimals) {
	var n = Math.pow(10, decimals);
	return (Math.round(val * n) / n);
}
