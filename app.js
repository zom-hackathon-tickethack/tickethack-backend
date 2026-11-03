const envFile = (process.env.NODE_ENV === "dev" ) ? ".env.dev" :".env";

require('dotenv').config({ path: envFile });
//console.log( 'envFile', envFile );
//console.log( 'CONNECTION_STRING',process.env.CONNECTION_STRING, 'OWM_API_KEY',process.env.OWM_API_KEY );

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const connMongoDB = require('./models/connection');

var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');
var travelRouter = require('./routes/travel');
var bookingRouter = require('./routes/booking');
var cartRouter = require('./routes/cart');

var app = express();
app.connMongoDB = connMongoDB; //permet d'exporter la promise de co comme une propriété de l'app

const cors = require('cors');
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
//app.use('/users', usersRouter);
app.use('/travel', /*checkApiKey,*/ travelRouter);
app.use('/booking', /*checkApiKey,*/ bookingRouter);
app.use('/cart', /*checkApiKey,*/ cartRouter);


// temp test
// const Trip = require('./models/trips');
// Trip.find( {departure: "Paris", arrival: "Marseille"}).then( e => console.log(e) )

module.exports = app;
