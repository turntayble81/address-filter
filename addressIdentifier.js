#!/usr/local/bin/node

const fs              = require('fs');
const async           = require('async');
const inputFileParser = require('./lib/inputFileProcessor');
const checkAddresses  = require('./lib/checkAddresses');

//Get path of input file
const inputFile = process.argv[2];

if(!inputFile) {
    console.error('No input file specified.');
    process.exit(1);
}

async.waterfall([

    //Check if specified input file exists
    (next)=> fs.stat(inputFile, next),

    //Process input file
    (stat, next) => inputFileParser(inputFile, next),

    //Filter addresses to those contained within specified region
    (inputData, next) => checkAddresses(inputData, next),

], (err, withinRegionArr=[])=> {
    if(err) {
        return console.error(err);
    }
    withinRegionArr.forEach((address) => {
        console.log(address);
    });
});