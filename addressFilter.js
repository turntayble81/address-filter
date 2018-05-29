#!/usr/bin/env node

const fs              = require('fs');
const async           = require('async');
const inputFileParser = require('./lib/inputFileParser');
const addressFilter   = require('./lib/addressFilter');

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
    (inputData, next) => addressFilter.run(inputData, next)

], (err, filteredAddressesArr=[])=> {
    if(err) {
        return console.error(err);
    }
    filteredAddressesArr.forEach((address) => {
        console.log(address);
    });
});
