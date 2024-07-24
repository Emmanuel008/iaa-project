const router = require("express").Router();

const {
  getHospitalsAndAdminUsersCount,
  getUsersAndPendingTestsCountByHospitalId,
  getRejectedTestsCountByHospitalId,
  getMalnutritionStats,
} = require("../controllers/statsController");

router.get("/systemadmin", getHospitalsAndAdminUsersCount)

router.get("/pending/:id", getUsersAndPendingTestsCountByHospitalId)

router.get("/rejected/:id", getRejectedTestsCountByHospitalId)

router.get("/malnutrition/:id?/:malnutritionType", getMalnutritionStats);

module.exports = router;
