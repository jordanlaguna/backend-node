const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Get all users
const getAllUsers = (req, res) => {
  const query = "SELECT * FROM users";
  db.query(query, (err, result) => {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .json({ message: "There was an error retrieving the users" });
    }
    res.json(result);
  });
};
const getUserById = (req, res) => {
  const id = req.params.id;
  const query = `
    SELECT users.id_user, users.email, users.id_person, persons.name, persons.lastName, persons.phone, persons.address
    FROM users
    LEFT JOIN persons ON users.id_person = persons.id_person
    WHERE users.id_user = ?
  `;

  db.query(query, [id], (err, result) => {
    if (err)
      return res.status(500).json({ message: "Error al obtener usuario" });
    if (result.length === 0)
      return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(result[0]);
  });
};

// Create a new user
const createUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please enter all fields" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters long" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const userQuery = "INSERT INTO users (email, password) VALUES (?, ?)";
    db.query(userQuery, [email, hashedPassword], (userErr, userResult) => {
      if (userErr) {
        console.log(userErr);
        return res.status(500).json({ message: "Error registering user" });
      }

      res.status(201).json({ message: "User registered successfully" });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// update user by id
const updateUser = (req, res) => {
  const id_user = req.params.id;
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "please enter all fields" });
  }
  const query =
    "update users set name = ?, email = ?, password = ? where id_user = ?";
  db.query(query, [name, email, password, id_user], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "there was an error updating the user" });
    }
    res.json({ message: "user updated successfully" });
  });
};

// delete user by id
const deleteUser = (req, res) => {
  const id_user = req.params.id;
  const query = "delete from users where id_user = ?";
  db.query(query, [id_user], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "there was an error deleting the user" });
    }
    res.json({ message: "user deleted successfully" });
  });
};

const validationLogin = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please enter all fields" });
  }

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Database error" });
      }

      if (results.length === 0) {
        console.log("No se encontró usuario con ese email");
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const user = results[0];

      try {
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("¿Coincide?", isMatch);

        if (!isMatch) {
          return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
          {
            id_user: user.id_user,
            email: user.email,
            id_person: user.id_person,
          },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        res.json({
          message: "Login successful",
          token,
        });
      } catch (err) {
        console.log("Error en comparación de contraseña:", err);
        res.status(500).json({ message: "Error interno" });
      }
    }
  );
};

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  validationLogin,
  getUserById,
};
