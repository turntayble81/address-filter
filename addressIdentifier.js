#!/usr/local/bin/node

const readline = require('readline');
const fs       = require('fs');
const config   = require('./config');

//Get path of input file
const inputFile = process.argv[2];

if(!inputFile) {
    console.error('No input file specified.');
    process.exit(1);
}

const googleMapsClient = require('@google/maps').createClient({
    key: config.googleAPIKey
});

//TODO: check if file exists

function loadInputFile(inputFile, cb) {
    const inputFileReader = readline.createInterface({
        input: fs.createReadStream(inputFile)
    });

    let inputData = {
        coordinates : '',
        addresses   : []
    };

    let lineIdx = 0;
    inputFileReader.on('line', function (line) {
        if(lineIdx == 0) {
            inputData.coordinates = line;
        }else {
            inputData.addresses.push(line);
        }
        lineIdx++;
    });

    inputFileReader.on('close', () => {
        if(!inputData.coordinates || !inputData.addresses.length) {
            return cb('Input file is malformed');
        }

        inputData.coordinates = inputData.coordinates
            .split(',')
            .map((point) => {
                point = point.replace(/[^\d.-]/g, '');
                return parseFloat(point);
            });

        let coordinateArr = [];
        for(let n=0; n< inputData.coordinates.length; n+=2) {
            coordinateArr.push([
                inputData.coordinates[n],
                inputData.coordinates[n+1]
            ]);
        }
        inputData.coordinates = coordinateArr;
        cb(null, inputData);
    });
}

function checkAddresses({coordinates, addresses}=args={}, cb) {
    googleMapsClient.geocode({
        address: '1600 Amphitheatre Parkway, Mountain View, CA'
    }, (err, response) => {
        if(!err) {
            console.dir(response.json.results[0].geometry.location, {depth: null});
        }
    });
}

loadInputFile(inputFile, (err, inputData) => {
    console.dir(err)
    console.dir(inputData);
    checkAddresses();
});
