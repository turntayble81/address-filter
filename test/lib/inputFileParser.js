const chai            = require('chai');
const inputFileParser = require('../../lib/inputFileParser');

const {expect}        = chai;

describe('inputFileParser', () => {

    it('should return an error if input file is malformed', (done) => {
        inputFileParser('test/mocks/malformedData.txt', (err, result) => {
            expect(err).to.equal('Input file is malformed');
            expect(result).to.be.undefined;
            done();
        });
    });

    it('should properly parse an input file', (done) => {
        inputFileParser('test/mocks/sampleData.txt', (err, result) => {
            expect(err).to.be.null;
            expect(result).to.deep.equal({
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
            });
            done();
        });
    });
});