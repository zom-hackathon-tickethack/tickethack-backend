Pour lancer l'appli faire un fichier .env qui contient la string de co à mongoDB soit :
  CONNECTION_STRING="MaStringDeCo" incluant le nom de la DB

Ladite DB doit avoir les collections "trips", "carts" et "bookings".


Les routes de l'app sont :

GET  /travel  : demande 3 queries "departure", "arrival" et "date"
GET  /cart    : demande -
POST /cart    : demande 1 body "tripId"
DEL  /cart    : demande 1 body "cartId"
GET  /booking : demande -
POST /booking : demande 1 body "cartId"
DEL  /booking : demande 1 body "bookingId"
