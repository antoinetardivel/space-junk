# ReactJS Satellite Tracker

ReactJS web application for tracking satellites using [Celestrak](https://celestrak.com/) data and TLE format to read orbits.

## Live version
[Live Version](https://satellite-track.herokuapp.com/)

## Getting Started

    $ git clone https://github.com/ophusdev/satellite-tracker
    $ cd satellite-tracker
    $ npm install
    $ npm start


## Prerequisites

For this project need ReactJS installed or otherwise build and run container with Docker

## Installing

See Getting Started for run project on machine with ReactJs installed.

To use Docker run this commands inside cloned folder:

    docker build -f Dockerfile.prod -t satellite-track .
    docker run -it --rm -p 3000:80 satellite-track

