const db = require("../config/db");

// get all reservations
const getAllReservations = (req, res) => {
  const query = "select * from reservation";
  db.query(query, (err, result) => {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .json({ message: "There was an error retrieving the reservations" });
    }
    res.json(result);
  });
};

// create a new reservation
const createReservation = async (req, res) => {
  const { name, email, phone, dateIn, dateOut, hourIn, hourOut } = req.body;
  if (!name || !email || !phone || !dateIn || !dateOut || !hourIn || !hourOut) {
    return res.status(400).json({ message: "Please enter all fields" });
  }
  const query =
    "insert into reservation (name, email, phone, dateIn, dateOut, hourIn, hourOut) values ( ?, ?, ?, ?, ?, ?, ?)";
  db.query(
    query,
    [name, email, phone, dateIn, dateOut, hourIn, hourOut],
    (err, result) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .json({ message: "There was an error creating the reservation" });
      }
      res.status(201).json({
        message: "Reservation created successfully",
        id: result.insertId,
      });
    }
  );
};
module.exports = {
  createReservation,
  getAllReservations,
};
