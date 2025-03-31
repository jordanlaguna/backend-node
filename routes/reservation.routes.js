const express = require("express");
const router = express.Router();
const reservationController = require("../controllers/reservation.controller");

// get all reservations
router.get("/", reservationController.getAllReservations);

// create a new reservation
router.post("/", reservationController.createReservation);

module.exports = router;
