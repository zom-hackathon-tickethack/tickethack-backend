var express = require('express');
var router = express.Router();

const Cart = require('../models/carts');


async function getFullCart() {
  return Cart.find().select('-__v').populate('cart').lean();
}


/* GET full cart listing. */
router.get('/', async function(req, res, next) {
  let isOk = false;

  const fullCart = await getFullCart();
  //console.log( fullCart )

  isOk = Boolean( fullCart );

  res.json( { "result": isOk, fullCart } );
});



router.post('/', async (req, res) => {
  let isAdded = false;
  console.log( req.body.tripId );

  if ( req.body.tripId ) {
    const cartJson = { cart: req.body.tripId };
    existTrip = await Cart.find( cartJson );
    console.log( existTrip );
    if ( existTrip.length === 0 ) {
      const newCart = new Cart( cartJson );
      await newCart.save();
      isAdded = true;
    }
  }

  const fullCart = await getFullCart();
  console.log( fullCart );
  res.json( { "result": isAdded, fullCart } );
});



router.delete('/', async (req, res) => {
  let isDeleted = false;
  //console.log( req.body.cartId )

  if ( req.body.cartId ) {
    const delStatus = await Cart.deleteOne( { _id: req.body.cartId } );
    isDeleted = ( delStatus.deletedCount > 0 );
  }

  const fullCart = await getFullCart();
  res.json( { "result": isDeleted, fullCart } );
});


module.exports = router;
