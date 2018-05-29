const async      = require('async');
const objPath    = require('object-path');
const googleMaps = require('@google/maps');
const config     = require('../config');

//Instantiate Google Maps SDK
const googleMapsClient = googleMaps.createClient({
    key: config.googleAPIKey
});

function run({coordinates=[], addresses=[]}=args={}, cb) {

    //Construct an array of latitudes in our region
    const latitudes = coordinates.map((coordinates) => {
        return coordinates[0];
    });

    //Construct an array of longitudes in our region
    const longitudes = coordinates.map((coordinates) => {
        return coordinates[1];
    });

    //Determine min and max lat/lng for our region
    const latMin = Math.min.apply(this, latitudes);
    const latMax = Math.max.apply(this, latitudes);
    const lngMin = Math.min.apply(this, longitudes);
    const lngMax = Math.max.apply(this, longitudes);

    //Initialize array which will contain addresses which are
    //determined to be within our defined region
    const withinRegionArr = [];

    //Iterate over array of addresses, asyncronously calling Google's API
    //for each address to determine it's lat/lng coordinates
    async.eachSeries(addresses, (address, eachNext) => {

        googleMapsClient.geocode({address}, (err, response) => {

            //If API returned an error, this address will be filtered out and loop continued
            if(err) {
                return eachNext();
            }

            //save lat/lng coordinates for address returned from API into a variable
            const addressCoords = objPath.get(response, 'json.results.0.geometry.location');

            //If address coordinates are not within box, continue
            if(addressCoords.lat < latMin || addressCoords.lat > latMax 
                || addressCoords.lng < lngMin || addressCoords.lng > lngMax) {
                return eachNext();
            }

            withinRegionArr.push(address);
            eachNext();
        });
    }, (err) => {
        return cb(err, withinRegionArr);
    });
}

module.exports = {
    run,

    //Exposed for testing purposes:
    _googleMapsClient: googleMapsClient
};