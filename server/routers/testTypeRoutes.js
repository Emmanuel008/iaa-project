const router = require("express").Router();


const {
  createTest,
  createResults,
  createTreatment,
  getResults,
  getTreatment,
} = require("../controllers/testTypeController");

router.post("/", createTest);
router.post("/result/:id", createResults);
router.get("/treatment/:id", createTreatment);
router.get("/results/:id", getResults)
router.get("/resulttreatment/:id", getTreatment)


module.exports = router