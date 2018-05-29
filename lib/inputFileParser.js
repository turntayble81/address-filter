const readline   = require('readline');
const fs         = require('fs');

function inputFileParser(inputFile, cb) {

    //Instantiate file reader
    const inputFileReader = readline.createInterface({
        input: fs.createReadStream(inputFile)
    });

    //Initialize data structure which will
    //contain data from processed input file
    let inputData = {
        coordinates : '',
        addresses   : []
    };

    //Subscribe to line event of file reader. It
    //will be called for each line in the input file.
    inputFileReader.on('line', function (line) {

        //First line contains polygon coordinates
        //Each subsequent line contains an address
        if(!inputData.coordinates) {
            inputData.coordinates = line;
        }else {
            inputData.addresses.push(line);
        }
    });

    //Subscribe to close event of file reader. It will be
    //called once input file has been completely read
    inputFileReader.on('close', () => {

        //Transform coordinates string into an array of floats
        inputData.coordinates = inputData.coordinates
            .split(',')
            .map((point) => {
                point = point.replace(/[^\d.-]/g, '');
                return parseFloat(point);
            });

        //Build array of [lat, lng] coordinate arrays
        let coordinateArr = [];
        for(let n=0; n< inputData.coordinates.length; n+=2) {
            coordinateArr.push([
                inputData.coordinates[n],
                inputData.coordinates[n+1]
            ]);
        }

        //Quick safety check to ensure we were able to read region coordinates
        //from first line and at least 1 address from our file. While it sounds
        //like we're assuming clean input for this test, this enables demonstrating
        //a test case for a non happy path scenario.
        if(coordinateArr.length < 3 || !inputData.addresses.length) {
            return cb('Input file is malformed');
        }

        inputData.coordinates = coordinateArr;
        cb(null, inputData);
    });
}

module.exports = inputFileParser;