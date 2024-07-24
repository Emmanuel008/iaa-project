const router = require("express").Router();


const {
  create,
  updateInfo,
  deleteInfo,
  getAllAdmited,
  getReleased,
} = require("../controllers/admitingController");

router.post("/", create);

router.get("/admited/:id", getAllAdmited);
router.get("/released/:id", getReleased);

router.put("/:id", updateInfo)

router.delete("/:id", deleteInfo)

module.exports = router;