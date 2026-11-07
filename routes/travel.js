var express = require('express');
var router = express.Router();

const moment = require('moment-timezone');

const Trip = require('../models/trips');
const { isValidDate, isValidCity, makeExistString } = require('../modules/isValid');

/* GET all travels for a set of departure/arrival/day */
router.get('/', async function(req, res, next) {
  let   isOk      = false;
  const departure = makeExistString( req.query.departure );
  const arrival   = makeExistString( req.query.arrival );
  const date      = makeExistString( req.query.date );
  //console.log( departure, arrival, date )
  
  if ( isValidCity( departure ) && isValidCity (arrival ) && isValidDate( date ) ) {
    const dateTz = moment.tz( date, 'Europe/Paris' );

    const travels = await Trip.find( {
      departure: new RegExp(`^${departure}$`, 'i'),
      arrival: new RegExp(`^${arrival}$`, 'i'),
      date: {
        $gte: moment.max( moment(), dateTz.clone().startOf('day') ),   // Do not report date previous to current time, so do not report any travel for a past day
        $lt: dateTz.clone().add(1, 'day').startOf('day').toDate() }
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
