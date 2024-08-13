const db = require("../models");

const Hospital = db.hospitals;
const User = db.users;
const TestResultTreatment = db.test_result_treatments;
const Patient = db.patients;
const AdmitingInfo = db.admiting_infos;
const Results = db.results

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
    const pendingTestsCount = await AdmitingInfo.count({
      where: {
        admiting_status: "admited",
      },
      include: [
        {
          model: Patient,
          where: { hospital_id: id },
        },
      ],
    });
    const rejectedTestsCount = await AdmitingInfo.count({
      where: {
        admiting_status: "released",
      },
      include: [
        {
          model: Patient,
          where: { hospital_id: id },
        },
      ],
    });

    res.status(200).json({
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
  try {
    const malnutritionType = req.params.malnutritionType;
    const hospitalId = req.params.id;
    console.log(malnutritionType);

    // Define age ranges
    const ageRanges = [
      { label: "under5years", minAge: 0, maxAge: 5 },
      { label: "between5and19years", minAge: 5, maxAge: 19 },
      { label: "above19years", minAge: 19, maxAge: 100 },
    ];

   

    // Calculate dates for age ranges
    const ageRangeDates = ageRanges.map((range) => {
      const currentDate = new Date(); // Reset currentDate for each range
      return {
        ...range,
        minDate: new Date(
          currentDate.getFullYear() - range.maxAge,
          currentDate.getMonth(),
          currentDate.getDate()
        ),
        maxDate: new Date(
          currentDate.getFullYear() - range.minAge,
          currentDate.getMonth(),
          currentDate.getDate()
        ),
      };
    });

    const whereClause = hospitalId ? { hospital_id: hospitalId } : {};
    const d = await Patient.findAll();
    // console.log(d)
    const results = await Patient.findAll({
      where: whereClause,
      include: [
        {
          model: AdmitingInfo,
          required: true,
          include: [
            {
              model: Results,
              required: true,
              where: {
                typeOfTest: {
                  [Op.like]: malnutritionType,
                },
              },
            },
          ],
        },
      ],
    });
    console.log(results)

    const stats = {
      male: {
        "under5years": 0,
        "between5and19years": 0,
        "above19years": 0,
      },
      female: {
        "under5years": 0,
        "between5and19years": 0,
        "above19years": 0,
      },
      pregnant: 0,
    };

    results.forEach((patient) => {
      const birthDate = new Date(patient.birth_date);
      const gender = patient.gender;
      const isPregnant = patient.pregnancy;

      ageRangeDates.forEach((range) => {
        if (birthDate >= range.minDate && birthDate <= range.maxDate) {
          if (gender === "male") {
            stats.male[range.label]++;
          } else if (gender === "female") {
            stats.female[range.label]++;
          }
        }
      });

      if (isPregnant) {
        stats.pregnant++;
      }
    });

    res.status(200).json(stats);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

