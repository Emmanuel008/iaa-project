const db = require("../models");

const Hospital = db.hospitals;
const User = db.users;
const TestResultTreatment = db.test_result_treatments;
const Patient = db.patients;
const AdmitingInfo = db.admiting_infos;

// Controller to return number of hospitals and number of users who have user_type = "admin"
exports.getHospitalsAndAdminUsersCount = async (req, res) => {
  try {
    const hospitalsCount = await Hospital.count();
    const adminUsersCount = await User.count({
      where: {
        user_type: "admin",
      },
    });
    res.status(200).json({
      hospitalsCount,
      adminUsersCount,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json("Internal server error");
  }
};

// Controller to return number of users who are user_type = "admin" and who are user_type = "user"
// by specific hospital_id and number of TestResultTreatment where status = "pending" where the patient has specific hospital_id
exports.getUsersAndPendingTestsCountByHospitalId = async (req, res) => {
  const id = req.params.id;

  try {
    const adminUsersCount = await User.count({
      where: {
        user_type: "admin",
        hospital_id: id,
      },
    });

    const userUsersCount = await User.count({
      where: {
        user_type: "user",
        hospital_id: id,
      },
    });

    const pendingTestsCount = await TestResultTreatment.count({
      where: {
        status: "pending",
      },
      include: [
        {
          model: Patient,
          where: { hospital_id: id },
        },
      ],
    });
    const rejectedTestsCount = await TestResultTreatment.count({
      where: {
        status: "rejected",
      },
      include: [
        {
          model: Patient,
          where: { hospital_id: id },
        },
      ],
    });

    res.status(200).json({
      adminUsersCount,
      userUsersCount,
      pendingTestsCount,
      rejectedTestsCount,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller to return number of TestResultTreatment where status = "rejected"
// where the patient has specific hospital_id
exports.getRejectedTestsCountByHospitalId = async (req, res) => {
  const id = req.params.id;


  try {
    const rejectedTestsCount = await TestResultTreatment.count({
      where: {
        status: "rejected",
      },
      include: [
        {
          model: Patient,
          where: { hospital_id: id },
        },
      ],
    });
    const ApprovedTestCount = await TestResultTreatment.count({
      where: {
        status: "approved",
      },
      include: [
        {
          model: Patient,
          where: { hospital_id: id },
        },
      ],
    });

    const pendingTestsCount = await TestResultTreatment.count({
      where: {
        status: "pending",
      },
      include: [
        {
          model: Patient,
          where: { hospital_id: id },
        },
      ],
    });
    res.status(200).json({
      rejectedTestsCount,
      ApprovedTestCount,
      pendingTestsCount,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const { Op } = require("sequelize");

exports.getMalnutritionStats = async (req, res) => {
  const malnutritionType = req.params.malnutritionType;
  const id = req.params.id;

  try {
    // Define patient types
    const patientTypes = {
      childrenUnder5Years: "Children under 5 years",
      elderly: "Elderly",
      otherPatient: "other patient",
    };

    // Initialize results object
    const results = {
      male: {},
      female: {},
      pregnantWomen: 0,
    };

    // Regex pattern to match the malnutrition type as a whole word
    const malnutritionSearchPattern = `%${malnutritionType}%`;

    for (const key in patientTypes) {
      const patientType = patientTypes[key];

      // Male counts with specific malnutrition type and patient type
      results.male[key] = await Patient.count({
        where: { gender: "male", hospital_id: id },
        include: [
          {
            model: AdmitingInfo,
            where: { patient_type: patientType },
            required: true,
          },
          {
            model: TestResultTreatment,
            where: {
              status: "approved",
              result: { [Op.like]: malnutritionSearchPattern },
            },
            required: true,
          },
        ],
      });

      // Female counts with specific malnutrition type and patient type
      results.female[key] = await Patient.count({
        where: { gender: "female", hospital_id: id },
        include: [
          {
            model: AdmitingInfo,
            where: { patient_type: patientType },
            required: true,
          },
          {
            model: TestResultTreatment,
            where: {
              status: "approved",
              result: { [Op.like]: malnutritionSearchPattern },
            },
            required: true,
          },
        ],
      });
    }

    // Pregnant women count with specific malnutrition type
    results.pregnantWomen = await Patient.count({
      where: { gender: "female", hospital_id: id },
      include: [
        {
          model: AdmitingInfo,
          where: { patient_type: "Pregnancy women" },
          required: true,
        },
        {
          model: TestResultTreatment,
          where: { result: { [Op.like]: malnutritionSearchPattern } },
          required: true,
        },
      ],
    });

    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

