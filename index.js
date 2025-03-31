const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const db = require("./config/db");
const usersRouter = require("./routes/user.routes");
const reservationRouter = require("./routes/reservation.routes");
const personRouter = require("./routes/person.routes");

const cors = require("cors");
// middleware
app.use(express.json());
app.use(cors());

// routes que usan JSON
app.use("/users", usersRouter);
app.use("/reservation", reservationRouter);

// routes que usan FormData (como archivos)
app.use("/person", personRouter);

// test route
app.get("/", (req, res) => {
  res.send("Server is running and database is connected");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
