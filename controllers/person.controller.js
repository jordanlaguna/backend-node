const db = require("../config/db");

// method post to add a new person
const createPerson = (req, res) => {
  const { name, lastName, secondName, phone, address, birthDate } = req.body;
  const photo = req.file?.buffer;

  const id_user = req.user?.id_user;

  if (
    !name ||
    !lastName ||
    !secondName ||
    !phone ||
    !address ||
    !birthDate ||
    !photo
  ) {
    return res
      .status(400)
      .json({ message: "Todos los campos son obligatorios" });
  }

  if (!id_user) {
    return res.status(401).json({ message: "Usuario no autenticado" });
  }

  // Insertar en persons
  const insertPersonQuery = `
    INSERT INTO persons (name, lastName, secondName, phone, address, birthDate, photo)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    insertPersonQuery,
    [name, lastName, secondName, phone, address, birthDate, photo],
    (err, result) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .json({ message: "Error al registrar la persona" });
      }

      const id_person = result.insertId;

      const updateUserQuery = `
        UPDATE users SET id_person = ? WHERE id_user = ?
      `;

      db.query(updateUserQuery, [id_person, id_user], (err2) => {
        if (err2) {
          console.log(err2);
          return res.status(500).json({
            message:
              "Persona registrada, pero no se pudo vincular con el usuario",
          });
        }

        res.status(201).json({
          message: "Persona registrada y vinculada correctamente",
          id_person,
        });
      });
    }
  );
};

const updatePerson = async (req, res) => {
  const id_person = req.params.id;
  const { name, lastName, secondName, address, phone, birthDate } = req.body;
  const photo = req.file ? req.file.buffer : null;
  console.log({
    id_person,
    name,
    lastName,
    secondName,
    address,
    phone,
    birthDate,
    photo,
  });

  if ((!name, !lastName || !secondName || !address || !phone || !birthDate)) {
    return res.status(400).json({ message: "Please enter all fields" });
  }

  const query = `
      UPDATE persons 
      SET name = ? lastName = ?, secondName = ?, address = ?, phone = ?, photo = ?, birthDate = ?
      WHERE id_person = ?
    `;

  db.query(
    query,
    [name, lastName, secondName, address, phone, photo, birthDate, id_person],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Error al actualizar" });
      }

      console.log("Resultado de la actualización:", result);

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "Persona no encontrada o sin cambios" });
      }

      res.json({ message: "Usuario actualizado correctamente" });
    }
  );
};

// get all persons
const getAllPersons = (req, res) => {
  db.query("SELECT * FROM persons", (err, result) => {
    if (err) {
      console.log(err);
      res
        .status(500)
        .json({ message: "there was an error getting the persons" });
    }
    res.json(result);
  });
};

const getPhotoById = (req, res) => {
  const id_person = req.params.id;
  const query = "SELECT photo FROM persons WHERE id_person = ?";
  db.query(query, [id_person], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Error al obtener la foto" });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Persona no encontrada" });
    }
    res.set("Content-Type", "image/jpeg");
    res.send(result[0].photo);
  });
};
module.exports = {
  createPerson,
  updatePerson,
  getAllPersons,
  getPhotoById,
};
