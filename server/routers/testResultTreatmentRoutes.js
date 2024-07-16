const router = require("express").Router();


const {create, getAll, update} = require("../controllers/testResultTreatmentController");

router.post("/", create);
router.get("/:id/:status", getAll);
router.put("/:id", update);

module.exports = router;