'use strict';

var express = require('express');
var router = express.Router();
var util = require('../util');
var Location = require('../models/location');

module.exports = function (app) {
  app.use('/', router);
};

/**
* List all locations
*/
router.get('/locations', function (req, res, next) {

  Location.find(function (err, locations) {

    if (err) return next(err);

    res.render('locations', {
      title: 'Locations',
      locations: locations,
      lat: 13.012284,
      long: 80.210410,
    });
  });
});

/**
* Render a page to create a new location
*/
router.get('/locations/add', function (req, res, next) {
  res.render('add-location', {
    title: 'Add a new Location',
  });
});

/**
* Add a new location
*/
router.post('/locations', function (req, res, next) {
  // Fill loc object with request body
  var loc = {
    title: req.body.title,
    coordinates: [req.body.long, req.body.lat],
  };

  var location = new Location(loc);

  // save the data received
  location.save(function (err, location) {
    if (err) {
      return res.status(400).send({
        message: err,
      });
    }

    res.render('add-location', {
      message: 'Added Successfully',
      obj: location,
    });
  });
});

/**
* Locate shops near me
*/

router.post('/nearme', function (req, res, next) {

    // Setup limit
    var limit = req.body.limit || 10;

    // Default max distance to 10 kilometers
    var maxDistance = req.body.distance || 10;

    // Setup coords Object = [ <longitude> , <latitude> ]
    var coords = [];

    // Create the array
    coords[0] = req.body.longitude;
    coords[1] = req.body.latitude;

    // find a location
    Location.find({
        coordinates: {
          $near: {
              $geometry: {
                  type: 'Point',
                  coordinates: coords,
                },

              // distance to radians
              $maxDistance: maxDistance * 1609.34,
              spherical: true,
            },
        },
      }).limit(limit).exec(function (err, locations) {
          console.log(locations);
          if (err) {
            return res.status(500).json(err);
          }

          res.render('locations', {
            title: 'Locations',
            locations: locations,
            lat: 13.012284,
            long: 80.210410,
          });
        });
  });

router.get('/locations/add', util.isLoggedIn, function (req, res, next) {
  res.render('add-location', {
    title: 'Add new Location',
  });
});
