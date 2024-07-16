const router = require("express").Router();

const {
  create,
  getAll,
  updateHospital,
  deleteHospital,
  getById,
} = require("../controllers/hospitalController");

router.post("/", create);
router.get("/", getAll);
router.get("/:id", getById);
router.put("/:id", updateHospital);
router.delete("/:id", deleteHospital)

module.exports = router;
