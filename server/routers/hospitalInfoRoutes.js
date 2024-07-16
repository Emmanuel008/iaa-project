const router = require("express").Router();

const {create, updateHospitalQuestions, getHospitalQuestions } = require("../controllers/hospitalInfoController")

router.post("/", create);
router.get("/:id", getHospitalQuestions);
router.put("/", updateHospitalQuestions);

module.exports = router