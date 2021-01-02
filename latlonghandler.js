class GHelper {
    // from source lat lon to target lat lon
    constructor(lat1,lon1,lat2,lon2, locator){        
        var dms = new Dms();

        if(locator == null || typeof(locator) == 'undefined')
        {
            this.P1 = new LatLonSpherical(lat1, lon1);
            this.Locator = GHelper.GetLocatorByLatLong(lat1, lon1);            
        }
        else
        {
            this.Locator = locator;
            this.P1 = GHelper.GetLatLonByMaidenLocator(this.Locator);
        }
        this.P2 = new LatLonSpherical(lat2, lon2);
        
        this.Distance = this.roundTo((this.P1.distanceTo(this.P2)/1000),0);
        this.Heading = this.roundTo(this.P1.initialBearingTo(this.P2),0);
        this.Longpath = this.roundTo(((this.Heading + 180) % 360),0);   
    }

    static GetLatLonByMaidenLocator(locator)
    {
        let upper = locator.toUpperCase();
        let e0 = (upper.charCodeAt(0) - 65) * 20;
        let e1 = (upper.charCodeAt(1) - 65) * 10;
        let e2 = locator[2] * 2;
        let e3 = locator[3];
        let e4 = (((upper.charCodeAt(4) - 65) / 12) + 0.0416666666667);
        let e5 = (((upper.charCodeAt(5) - 65) / 24) + 0.0208333333334) - 90;

        let latitude =  parseFloat(e1) + parseFloat(e3) + parseFloat(e5);
        let longitude =  (parseFloat(e0) + parseFloat(e2) + parseFloat(e4)) -180;

        return new LatLonSpherical(latitude, longitude);
    };

    static GetLocatorByLatLong(lat, lon)
    {    
        lat = 90 + lat;
        lon = 180 + lon;
    
        let latFields = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.charAt(Math.floor(lat / 10));
        let lonFields = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.charAt(Math.floor(lon / 20));

        let remLat = lat % 10;                                        
        let remLon = lon % 20;                                        
        
        let latSub = '0123456789'.charAt(Math.floor(remLat / 1));
        let lonSub = '0123456789'.charAt(Math.floor(remLon / 2));
    
        remLat = remLat % 1;                                        
        remLon = remLon % 2;                                        
        
        let latSubFields = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.charAt(Math.floor(remLat / 0.0416666666667));
        let lonSubFields = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.charAt(Math.floor(remLon / 0.0833333333334));
        
        return lonFields + latFields + lonSub + latSub + lonSubFields + latSubFields;
        ;
    };

    roundTo(val, decimals) {
        var n = Math.pow(10, decimals);
        return (Math.round(val * n) / n);
    }
}