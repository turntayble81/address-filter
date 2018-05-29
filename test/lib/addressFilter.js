const chai           = require('chai');
const sinon          = require('sinon');
const addressFilter  = require('../../lib/addressFilter');

const {expect}        = chai;

const inputData       = {
    coordinates: [
        [ 37.5, -122.5 ],
        [ 38.2, -121.6 ],
        [ 37, -121.4 ],
        [ 36.6, -121.3 ]
    ],
    addresses: [
        '1706 Forest View Ave Hillsborough CA 94010',
        '1 Hacker Way, Menlo Park, CA',
        '3045 Novato Blvd, Novato, CA 94947',
        '30840 Northwestern Highway, Farmington Hills, MI'
    ]
};

describe('addressFilter', () => {

    const sandbox = sinon.createSandbox();

    beforeEach((done) => {
        sandbox.stub(addressFilter._googleMapsClient, 'geocode');
        done();
    });

    afterEach((done) => {
        sandbox.restore();
        done();
    });

    it('should properly filter out addresses which are not within specified region', (done) => {
        addressFilter._googleMapsClient.geocode.onCall(0).callsArgWith(1, null, {
            json: {results: [{geometry: {location: { lat: 37.57987800000001, lng: -122.3633997 }}}]}
        });
        addressFilter._googleMapsClient.geocode.onCall(1).callsArgWith(1, null, {
            json: {results: [{geometry: {location: { lat: 37.4843038, lng: -122.1458147 }}}]}
        });
        addressFilter._googleMapsClient.geocode.onCall(2).callsArgWith(1, null, {
            json: {results: [{geometry: {location: { lat: 38.1209168, lng: -122.6190433 }}}]}
        });
        addressFilter._googleMapsClient.geocode.onCall(3).callsArgWith(1, null, {
            json: {results: [{geometry: {location: { lat: 42.51364909999999, lng: -83.3308998 }}}]}
        });

        addressFilter.run(inputData, (err, filteredAddresses) => {
            expect(err).to.be.null;
            expect(filteredAddresses).to.deep.equal([
                '1 Hacker Way, Menlo Park, CA',
                '1706 Forest View Ave Hillsborough CA 94010'
            ]);
            done();
        });
    });

    it(`should filter out an address if call to API failed, as we were not able to determine it's coordinates`, (done) => {
        addressFilter._googleMapsClient.geocode.onCall(0).callsArgWith(1, `Call to API returned an error.`);
        addressFilter._googleMapsClient.geocode.onCall(1).callsArgWith(1, null, {
            json: {results: [{geometry: {location: { lat: 37.4843038, lng: -122.1458147 }}}]}
        });
        addressFilter._googleMapsClient.geocode.onCall(2).callsArgWith(1, null, {
            json: {results: [{geometry: {location: { lat: 38.1209168, lng: -122.6190433 }}}]}
        });
        addressFilter._googleMapsClient.geocode.onCall(3).callsArgWith(1, null, {
            json: {results: [{geometry: {location: { lat: 42.51364909999999, lng: -83.3308998 }}}]}
        });

        addressFilter.run(inputData, (err, filteredAddresses) => {
            expect(err).to.be.null;
            expect(filteredAddresses).to.deep.equal([
                '1 Hacker Way, Menlo Park, CA'
            ]);
            done();
        });
    });
});
