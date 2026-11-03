var express = require('express');
var router = express.Router();

const moment = require('moment-timezone');

const Trip = require('../models/trips');

/* GET all travels for a set of departure/arrival/day */
router.get('/', async function(req, res, next) {
  let isOk = false;
  //console.log( req.query.departure, req.query.arrival, req.query.date )
  
  if ( req.query.departure && req.query.arrival && req.query.date ) {
    const departure = req.query.departure.trim();
    const arrival   = req.query.arrival.trim();
    const date      = moment.tz(req.query.date.trim(), 'Europe/Paris');
    //console.log( departure, arrival, date )

    const travels = await Trip.find( {
      departure: new RegExp(`^${departure}$`, 'i'),
      arrival: new RegExp(`^${arrival}$`, 'i'),
      date: {
        $gt: moment.max( moment(), date.clone().startOf('day') ),   // Do not report date previous to current time, so do not report any travel for a past day
        $lt: date.clone().add(1, 'day').startOf('day').toDate() }
    } ).select('-__v').lean();
    //console.log( travels )

    if ( travels ) {
      res.json({ "result": true, travels });
      isOk = true;
    }
  }

  if ( ! isOk ) {
    res.json({ "result": false, "error": "parameters mismatch" });
  }
});

module.exports = router;
