var express = require('express');
var router = express.Router();

const Booking = require('../models/bookings');
const Cart    = require('../models/carts');
const { isValidMongoId, isValidMongoIdList } = require('../modules/isValid');


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
  //console.log( req.body.cartIdList )

  if ( isValidMongoIdList( req.body.cartIdList ) ) {
    // Check if records are into carts
    const listLength = req.body.cartIdList.length;
    const carts = await Cart.find( { _id: { $in: req.body.cartIdList } } );

    if ( carts.length === listLength ) {
      const tripList = carts.map( cart => cart.trip );
      //console.log( tripList );
      const existBooking = await Booking.findOne( { trip: { $in: tripList } } );
      //console.log( existBooking );

      if ( ( ! existBooking ) && ( tripList.length > 0 )) {
        for( let trip of tripList ) {
          const newBooking = new Booking( { trip } );
          await newBooking.save();                    // Add one to bookings
        }
        const del = await Cart.deleteMany( { _id: { $in: req.body.cartIdList } } ); // Remove all from carts
        //console.log( del );
        isAdded = true;
      }
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
