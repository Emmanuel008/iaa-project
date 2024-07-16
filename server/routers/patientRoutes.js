const router = require("express").Router();

const {create,  getAll, updatePatient, deletePatient} = require("../controllers/patientController")

router.post("/", create);
router.get("/:id", getAll);
router.put("/:id", updatePatient);
router.delete("/:id", deletePatient)

module.exports = router