const express = require("express");
const router = express.Router();
const personController = require("../controllers/person.controller");
const upload = require("../middlewares/multer");
const verifyToken = require("../middlewares/verify");

// create person
router.post(
  "/createPerson",
  verifyToken,
  upload.single("photo"),
  personController.createPerson
);
// update person by id
router.put("/:id", upload.single("photo"), personController.updatePerson);

// get all persons
router.get("/", personController.getAllPersons);
// get ophoto by id
router.get("/photo/:id", personController.getPhotoById);
module.exports = router;
