const db = require("../models");
const { QueryTypes } = require("sequelize");
const moment = require("moment");
const TestType = db.test_types;
const Results = db.results;
const AdmitingInfo = db.admiting_infos;
const Patient = db.patients;
const HeightWeight = db.height_weight_results;
const HeightAge = db.height_age_results;
const WeightAge = db.weight_age_results;
const BMIAge = db.bmi_age_results;
const GivenTreatment = db.given_treatments;
const Treatment = db.treatments;

exports.createTest = async (req, res) => {
  try {
    const test = await TestType.create(req.body);
    res.status(200).json({ message: "Created Test", test });
  } catch (error) {
    res.status(500).json("Server Error");
  }
};

exports.createResults = async (req, res) => {
  try {
    const id = req.params.id;

    const test = await AdmitingInfo.findOne({
      where: { admit_id: id },
      include: [
        { model: TestType, required: true },
        { model: Patient, required: true },
      ],
    });

    if (!test) {
      return res.status(404).json({ error: "Test not found" });
    }

    const { birth_date: birthDate, gender } = test.patient;
    const ageInMonths = moment().diff(moment(birthDate), "months");

    const sdCategories = [
      "neg3sd",
      "neg2sd",
      "neg1sd",
      "sd0",
      "sd1",
      "sd2",
      "sd3",
    ];

    const evaluateSD = async (value, row, typeOfTest, typeOfTestUsed) => {
      const closestSD = sdCategories.reduce((a, b) =>
        Math.abs(value - row[a]) < Math.abs(value - row[b]) ? a : b
      );

      const resultsMap = {
        neg3sd: "severe",
        neg2sd: "moderate",
        neg1sd: "mild",
        sd0: "normal",
        sd1: "mild",
        sd2: "moderate",
        sd3: "severe",
      };

      await Results.create({
        result: resultsMap[closestSD],
        typeOfTest,
        typeOfTestUsed,
        admit_id: parseInt(id),
      });
    };

    const processHeightWeight = async () => {
      if (!test.test_types[0].weight_height || ageInMonths > 60) return;

      const height = parseFloat(test.height);
      if (isNaN(height))
        return res.status(400).json({ error: "Invalid height value" });

      const [closestRow] = await HeightWeight.sequelize.query(
        `SELECT * FROM height_weights WHERE gender = :gender ORDER BY ABS(height - :height) ASC LIMIT 1`,
        {
          replacements: { gender, height },
          type: QueryTypes.SELECT,
        }
      );

      if (closestRow) {
        const weight = parseFloat(test.weight);
        if (isNaN(weight))
          return res.status(400).json({ error: "Invalid weight value" });

        await evaluateSD(
          weight,
          closestRow,
          weight < closestRow.sd0
            ? "Wasting"
            : weight < closestRow.sd1
            ? "No Malnutrition"
            : "Obesity",
          "Height/Weight"
        );
      }
    };

    const processHeightAge = async () => {
      if (!test.test_types[0].height_age || ageInMonths > 228) return;

      const closestRow = await HeightAge.findOne({
        where: { age: ageInMonths, gender },
      });
      if (closestRow) {
        const height = parseFloat(test.height);
        if (isNaN(height))
          return res.status(400).json({ error: "Invalid height value" });

        await evaluateSD(
          height,
          closestRow,
          height < closestRow.sdo
            ? "Stunting"
            : height < closestRow.sd1
            ? "No Malnutrition"
            : "Over Growth",
          "Height/Age"
        );
      }
    };

    const processWeightAge = async () => {
      if (!test.test_types[0].weight_age || ageInMonths > 228) return;

      const closestRow = await WeightAge.findOne({
        where: { age: ageInMonths, gender },
      });
      if (closestRow) {
        const weight = parseFloat(test.weight);
        if (isNaN(weight))
          return res.status(400).json({ error: "Invalid weight value" });

        await evaluateSD(
          weight,
          closestRow,
          weight < closestRow.sd0
            ? "Underweight"
            : weight < closestRow.sd1
            ? "No Malnutrition"
            : "Obesity",
          "Weight/Age"
        );
      }
    };

    const processBMI = async () => {
      if (!test.test_types[0].BMI) return;

      const height = parseFloat(test.height);
      const weight = parseFloat(test.weight);
      if (isNaN(height) || isNaN(weight))
        return res
          .status(400)
          .json({ error: "Invalid height or weight value" });

      const bmi = (10000 * weight) / (height * height);
      const closestRow = await BMIAge.findOne({
        where: { age: ageInMonths, gender },
      });

      if (closestRow && ageInMonths <= 228) {
        await evaluateSD(
          bmi,
          closestRow,
          bmi < closestRow.sd0
            ? "Wasting"
            : bmi < closestRow.sd1
            ? "No Malnutrition"
            : "Obesity",
          "BMI"
        );
      } else if (ageInMonths > 228) {
        const bmiCategories = [
          { limit: 16, result: "severe" },
          { limit: 17, result: "moderate" },
          { limit: 18.5, result: "mild" },
          { limit: 25, result: "normal" },
          { limit: 27, result: "mild" },
          { limit: 29, result: "moderate" },
          { result: "severe" },
        ];

        for (const { limit, result } of bmiCategories) {
          if (!limit || bmi < limit) {
            await Results.create({
              result,
              typeOfTest: result.includes("Wasting") ? "Wasting" : "Obesity",
              typeOfTestUsed: "BMI",
              admit_id: parseInt(id),
            });
            break;
          }
        }
      }
    };

    // const processMUAC = async () => {
    //   if (!test.test_types[0].muac) return;

    //   const muac = parseFloat(test.test_types[0].muacValue);
    //   if (isNaN(muac))
    //     return res.status(400).json({ error: "Invalid MUAC value" });

    //   const muacCategories = [
    //     { limit: 11.5, result: "severe" },
    //     { limit: 12.5, result: "moderate" },
    //     { limit: ageInMonths <= 60 ? Infinity : 18.5, result: "normal" },
    //     { limit: 22.5, result: "moderate" },
    //     { result: "severe" },
    //   ];

    //   for (const { limit, result } of muacCategories) {
    //     if (muac < limit) {
    //       await Results.create({
    //         result,
    //         typeOfTest: "Acute Malnutrition",
    //         typeOfTestUsed: "MUAC",
    //         admit_id: parseInt(id),
    //       });
    //       break;
    //     }
    //   }
    // };

    const processMUAC = async (test, ageInMonths, id, res) => {
      if (!test.test_types[0].muac) return;

      const muac = parseFloat(test.test_types[0].muacValue);
      if (isNaN(muac)) {
        return res.status(400).json({ error: "Invalid MUAC value" });
      }

      const muacCategories =
        ageInMonths <= 60
          ? [
              { limit: 11.5, result: "severe" },
              { limit: 12.5, result: "moderate" },
              { limit: 26.5, result: "normal" },
            ]
          : [
              { limit: 18.5, result: "severe" },
              { limit: 22.5, result: "moderate" },
              { limit: 40.5, result: "normal" },
            ];

      for (const { limit, result } of muacCategories) {
        if (muac < limit) {
          await Results.create({
            result,
            typeOfTest: result === "normal" ? "No Malnutrition" : "Wasting",
            typeOfTestUsed: "MUAC",
            admit_id: parseInt(id),
          });
          break;
        }
      }
    };


    await Promise.all([
      processHeightWeight(),
      processHeightAge(),
      processWeightAge(),
      processBMI(),
      processMUAC(),
    ]);

    res.status(200).json("Results created successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json("Server Error");
  }
};

exports.createTreatment = async (req, res) => {
  try {
    const id = req.params.id;
    const results = await AdmitingInfo.findOne({
      where: { admit_id: id },
      include: [
        {
          model: Patient,
          required: true,
        },
        {
          model: Results,
          required: true,
        },
        {
          model: TestType,
          required: true,
        },
      ],
    });

    const malnutritionTests = ["Wasting", "UnderWeight", "Stunting"];
    const overnutritionTests = ["Obesity", "Overweight"];
    const severityLevels = ["severe", "moderate", "mild"];

    const malnutrition = results.results.filter(
      (item) =>
        severityLevels.includes(item.result) &&
        malnutritionTests.includes(item.typeOfTest)
    );

    const overnutrition = results.results.filter(
      (item) =>
        severityLevels.includes(item.result) &&
        overnutritionTests.includes(item.typeOfTest)
    );
    if (malnutrition.length > 0) {
      const patientCategory = results.patient_type;

      const containsSevere = malnutrition.some((obj) => {
        ["severe"].includes(obj.result);
      });
      const containsModerateMild = malnutrition.some((obj) => {
        ["moderate", "mild"].includes(obj.result);
      });

      if (containsSevere) {
        const treatment = await Treatment.findOne({
          where: { patient_type: patientCategory, resultCategory: "severe" },
        });
        await GivenTreatment.create({
          treatment: treatment.treatment,
          admit_id: id,
        });
      }
      if (containsModerateMild) {
        const treatment = await Treatment.findOne({
          where: { patient_type: patientCategory, resultCategory: "moderate" },
        });
        await GivenTreatment.create({
          treatment: treatment.treatment,
          admit_id: id,
        });
      }
    }
    if (overnutrition.length > 0) {
      await GivenTreatment.create({
        treatment:
          "Weight loss councelling, Diet, Physical Activity and Exercises, Phentermine/ Topiramate, Or listat, Bupropion/ Naltrexone, Bariatric surgery",
        admit_id: id,
      });
    }
    res.status(200).json("Treatment generated successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json("Server Error");
  }
};

exports.getResults = async (req, res) => {
  try {
    const id = req.params.id;
    const results = await Results.findAll({
      where: { admit_id: id },
    });
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json("Server Error");
  }
};

exports.getTreatment = async (req, res) => {
  try {
    const id = req.params.id;
    const treatment = await GivenTreatment.findAll({
      where: { admit_id: id },
    });
    res.status(200).json(treatment);
  } catch (error) {
    res.status(500).json("Server Error");
  }
};
