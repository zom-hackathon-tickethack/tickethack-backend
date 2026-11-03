var express = require('express');
var router = express.Router();

const Booking = require('../models/bookings');
const { isValidMongoId } = require('../modules/isValid');


async function getFullBooking() {
  return Booking.find().select('-__v').populate( 'trip'/*{ path: 'booking', populate: { path: 'cart' } }*/ ).lean();
}


/* GET all booking listing. */
router.get('/', async function(req, res, next) {
  let isOk = false;
  
  const fullBooking = await getFullBooking();
  //console.log( fullBooking )

  isOk = Boolean( fullBooking );

  res.json( { "result": isOk, fullBooking } );
});



router.post('/', async (req, res) => {
  let isAdded = false;
  //console.log( req.body.tripId )

  if ( isValidMongoId( req.body.tripId ) ) {
    const tripJson = { trip: req.body.tripId };
    existTrip = await Booking.find( tripJson );
    if ( existTrip.length === 0 ) {
      const newBooking = new Booking( tripJson );
      await newBooking.save();
      isAdded = true;
    }
  }

  const fullBooking = await getFullBooking();;
  res.json( { "result": isAdded, fullBooking } );
});



router.delete('/', async (req, res) => {
  let isDeleted = false;
  //console.log( req.body.bookingId )

  if ( isValidMongoId( req.body.bookingId ) ) {
    const delStatus = await Booking.deleteOne( { _id: req.body.bookingId } );
    isDeleted = ( delStatus.deletedCount > 0 );
  }

  const fullBooking = await getFullBooking();
  res.json( { "result": isDeleted, fullBooking } );
});


module.exports = router;
