# Address Filter

This is a simple CLI script which filters out addresses that are not within a given area. It calls the Google Maps API to determine coordinates for addresses. 
This has been verified to run correctly on Ubuntu 18.04LTS with Node.JS 8.11.1. It will likely run on any flavor of Linux and any version of Node.JS.

## Installation

1. Clone this repo
2. Navigate to root directory of cloned repository
3. Install dependencies:
```bash
$ npm install
```

## Running the script

```bash
$ ./addressFilter.js inputFile.txt
```

## Input file format
The first line of the input file will contain coordinates which define a box. Addresses outside this box will be filtered out.
Each subsequent line will be an address. Here's a sample file:

```
(37.5, -122.5), (38.2, -121.6), (37.0, -121.4), (36.6, -121.3)
1706 Forest View Ave Hillsborough CA 94010
1 Hacker Way, Menlo Park, CA
3045 Novato Blvd, Novato, CA 94947
30840 Northwestern Highway, Farmington Hills, MI
```

## Running unit tests

From root directory of repository, run:
```bash
$ npm test
```