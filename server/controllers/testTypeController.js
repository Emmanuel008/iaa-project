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

    const Test = await AdmitingInfo.findOne({
      where: { admit_id: id },
      include: [
        {
          model: TestType,
          required: true,
        },
        {
          model: Patient,
          required: true,
        },
      ],
    });

    // find the result depending on the test type
    const birthdate = moment(Test.patient.birth_date);
    const currentDate = moment();
    const ageInMonths = currentDate.diff(birthdate, "months");
    if (Test.test_types[0].weight_height && ageInMonths <= 60) {
      const height = parseFloat(Test.height);
      // Check if height is a valid number
      if (isNaN(height)) {
        return res.status(400).json({ error: "Invalid height value" });
      }
      const closestRow = await HeightWeight.sequelize.query(
        `SELECT height, neg3sd, neg2sd, neg1sd, sd0, sd1, sd2, sd3
         FROM height_weights
         WHERE gender = :gender
         ORDER BY ABS(height - :height) ASC
         LIMIT 1`,
        {
          replacements: { gender: Test.patient.gender, height: height },
          type: QueryTypes.SELECT,
        }
      );

      if (closestRow.length > 0) {
        const row = closestRow[0];
        const weight = parseFloat(Test.weight);

        // Check if weight is a valid number
        if (isNaN(weight)) {
          return res.status(400).json({ error: "Invalid weight value" });
        }

        const sdCategories = {
          neg3sd: Math.abs(weight - row.neg3sd),
          neg2sd: Math.abs(weight - row.neg2sd),
          neg1sd: Math.abs(weight - row.neg1sd),
          sd0: Math.abs(weight - row.sd0),
          sd1: Math.abs(weight - row.sd1),
          sd2: Math.abs(weight - row.sd2),
          sd3: Math.abs(weight - row.sd3),
        };

        const closestSD = Object.keys(sdCategories).reduce((a, b) =>
          sdCategories[a] < sdCategories[b] ? a : b
        );
        switch (closestSD) {
          case "neg3sd":
            await Results.create({
              result: "severe",
              typeOfTest: "Wasting",
              typeOfTestUsed: "Height/Weight",
              admit_id: parseInt(id),
            });
            break;
          case "neg2sd":
            await Results.create({
              result: "moderate",
              typeOfTest: "Wasting",
              typeOfTestUsed: "Height/Weight",
              admit_id: parseInt(id),
            });
            break;
          case "neg1sd":
            await Results.create({
              result: "mild",
              typeOfTest: "Wasting",
              typeOfTestUsed: "Height/Weight",
              admit_id: parseInt(id),
            });
            break;
          case "sd0":
            await Results.create({
              result: "normal",
              typeOfTest: "No Malnutrition",
              typeOfTestUsed: "Height/Weight",
              admit_id: parseInt(id),
            });
            break;
          case "sd1":
            await Results.create({
              result: "mild",
              typeOfTest: "Overweight",
              typeOfTestUsed: "Height/Weight",
              admit_id: parseInt(id),
            });
            break;
          case "sd2":
            await Results.create({
              result: "moderate",
              typeOfTest: "Obesity",
              typeOfTestUsed: "Height/Weight",
              admit_id: parseInt(id),
            });
            break;
          case "sd3":
            await Results.create({
              result: "severe",
              typeOfTest: "Obesity",
              typeOfTestUsed: "Height/Weight",
              admit_id: parseInt(id),
            });
            break;
          default:
            break;
        }
      }
    }
    if (Test.test_types[0].height_age && ageInMonths <= 228) {
      const closestRow = await HeightAge.findOne({
        where: { age: ageInMonths, gender: Test.patient.gender },
      });
      if (Object.keys(closestRow).length > 0) {
        const row = closestRow;
        const height = parseFloat(Test.height);

        if (isNaN(height)) {
          return res.status(400).json({ error: "Invalid weight value" });
        }
        const sdCategories = {
          neg3sd: Math.abs(height - row.neg3sd),
          neg2sd: Math.abs(height - row.neg2sd),
          neg1sd: Math.abs(height - row.neg1sd),
          sd0: Math.abs(height - row.sd0),
          sd1: Math.abs(height - row.sd1),
          sd2: Math.abs(height - row.sd2),
          sd3: Math.abs(height - row.sd3),
        };

        const closestSD = Object.keys(sdCategories).reduce((a, b) =>
          sdCategories[a] < sdCategories[b] ? a : b
        );
        switch (closestSD) {
          case "neg3sd":
            await Results.create({
              result: "severe",
              typeOfTest: "Stunting",
              typeOfTestUsed: "Height/Age",
              admit_id: parseInt(id),
            });
            break;
          case "neg2sd":
            await Results.create({
              result: "moderate",
              typeOfTest: "Stunting",
              typeOfTestUsed: "Height/Age",
              admit_id: parseInt(id),
            });
            break;
          case "neg1sd":
            await Results.create({
              result: "mild",
              typeOfTest: "Stunting",
              typeOfTestUsed: "Height/Age",
              admit_id: parseInt(id),
            });
            break;
          case "sd0":
            await Results.create({
              result: "normal",
              typeOfTest: "Growth",
              typeOfTestUsed: "Height/Age",
              admit_id: parseInt(id),
            });
            break;
          case "sd1":
            await Results.create({
              result: "mild",
              typeOfTest: "Growth",
              typeOfTestUsed: "Height/Age",
              admit_id: parseInt(id),
            });
            break;
          case "sd2":
            await Results.create({
              result: "moderate",
              typeOfTest: "Growth",
              typeOfTestUsed: "Height/Age",
              admit_id: parseInt(id),
            });
            break;
          case "sd3":
            await Results.create({
              result: "severe",
              typeOfTest: "Growth",
              typeOfTestUsed: "Height/Age",
              admit_id: parseInt(id),
            });
            break;
          default:
            break;
        }
      }
    }
    if (Test.test_types[0].weight_age && ageInMonths <= 228) {
      const closestRow = await WeightAge.findOne({
        where: { age: ageInMonths, gender: Test.patient.gender },
      });
      if (Object.keys(closestRow).length > 0) {
        const row = closestRow;
        const weight = parseFloat(Test.weight);

        if (isNaN(weight)) {
          return res.status(400).json({ error: "Invalid weight value" });
        }
        const sdCategories = {
          neg3sd: Math.abs(weight - row.neg3sd),
          neg2sd: Math.abs(weight - row.neg2sd),
          neg1sd: Math.abs(weight - row.neg1sd),
          sd0: Math.abs(weight - row.sd0),
          sd1: Math.abs(weight - row.sd1),
          sd2: Math.abs(weight - row.sd2),
          sd3: Math.abs(weight - row.sd3),
        };

        const closestSD = Object.keys(sdCategories).reduce((a, b) =>
          sdCategories[a] < sdCategories[b] ? a : b
        );
        switch (closestSD) {
          case "neg3sd":
            await Results.create({
              result: "severe",
              typeOfTest: "Underweight",
              typeOfTestUsed: "Weight/Age",
              admit_id: parseInt(id),
            });
            break;
          case "neg2sd":
            await Results.create({
              result: "moderate",
              typeOfTest: "Underweight",
              typeOfTestUsed: "Weight/Age",
              admit_id: parseInt(id),
            });
            break;
          case "neg1sd":
            await Results.create({
              result: "mild",
              typeOfTest: "Underweight",
              typeOfTestUsed: "Weight/Age",
              admit_id: parseInt(id),
            });
            break;
          case "sd0":
            await Results.create({
              result: "normal",
              typeOfTest: "No Malnutrition",
              typeOfTestUsed: "Weight/Age",
              admit_id: parseInt(id),
            });
            break;
          case "sd1":
            await Results.create({
              result: "mild",
              typeOfTest: "Overweight",
              typeOfTestUsed: "Weight/Age",
              admit_id: parseInt(id),
            });
            break;
          case "sd2":
            await Results.create({
              result: "moderate",
              typeOfTest: "Obesity",
              typeOfTestUsed: "Weight/Age",
              admit_id: parseInt(id),
            });
            break;
          case "sd3":
            await Results.create({
              result: "severe",
              typeOfTest: "Obesity",
              typeOfTestUsed: "Weight/Age",
              admit_id: parseInt(id),
            });
            break;
          default:
            break;
        }
      }
    }
    if (Test.test_types[0].BMI) {
      const height = parseFloat(Test.height);
      const weight = parseFloat(Test.weight);

      const bmi = (10000 * weight) / (height * height);
      if (ageInMonths > 228) {
        if (bmi < 16) {
          await Results.create({
            result: "severe",
            typeOfTest: "Wasting",
            typeOfTestUsed: "BMI",
            admit_id: parseInt(id),
          });
        } else if (bmi >= 16 && bmi < 17) {
          await Results.create({
            result: "moderate",
            typeOfTest: "Wasting",
            typeOfTestUsed: "BMI",
            admit_id: parseInt(id),
          });
        } else if (bmi >= 17 && bmi < 18.5) {
          await Results.create({
            result: "mild",
            typeOfTest: "Wasting",
            typeOfTestUsed: "BMI",
            admit_id: parseInt(id),
          });
        } else if (bmi >= 18.5 && bmi < 25) {
          await Results.create({
            result: "normal",
            typeOfTest: "No Malnutrition",
            typeOfTestUsed: "BMI",
            admit_id: parseInt(id),
          });
        } else if (bmi >= 25 && bmi < 27) {
          await Results.create({
            result: "mild",
            typeOfTest: "Overweight",
            typeOfTestUsed: "BMI",
            admit_id: parseInt(id),
          });
        } else if (bmi >= 27 && bmi < 29) {
          await Results.create({
            result: "moderate",
            typeOfTest: "Obesity",
            typeOfTestUsed: "BMI",
            admit_id: parseInt(id),
          });
        } else {
          await Results.create({
            result: "severe",
            typeOfTest: "Obesity",
            typeOfTestUsed: "BMI",
            admit_id: parseInt(id),
          });
        }
      } else {
        const closestRow = await BMIAge.findOne({
          where: { age: ageInMonths, gender: Test.patient.gender },
        });

        if (Object.keys(closestRow).length > 0 && ageInMonths <= 228) {
          const row = closestRow;
          const sdCategories = {
            neg3sd: Math.abs(bmi - row.neg3sd),
            neg2sd: Math.abs(bmi - row.neg2sd),
            neg1sd: Math.abs(bmi - row.neg1sd),
            sd0: Math.abs(bmi - row.sd0),
            sd1: Math.abs(bmi - row.sd1),
            sd2: Math.abs(bmi - row.sd2),
            sd3: Math.abs(bmi - row.sd3),
          };

          const closestSD = Object.keys(sdCategories).reduce((a, b) =>
            sdCategories[a] < sdCategories[b] ? a : b
          );
          switch (closestSD) {
            case "neg3sd":
              await Results.create({
                result: "severe",
                typeOfTest: "Wasting",
                typeOfTestUsed: "BMI",
                admit_id: parseInt(id),
              });
              break;
            case "neg2sd":
              await Results.create({
                result: "moderate",
                typeOfTest: "Wasting",
                typeOfTestUsed: "BMI",
                admit_id: parseInt(id),
              });
              break;
            case "neg1sd":
              await Results.create({
                result: "mild",
                typeOfTest: "Wasting",
                typeOfTestUsed: "BMI",
                admit_id: parseInt(id),
              });
              break;
            case "sd0":
              await Results.create({
                result: "normal",
                typeOfTest: "No Malnutrition",
                typeOfTestUsed: "BMI",
                admit_id: parseInt(id),
              });
              break;
            case "sd1":
              await Results.create({
                result: "mild",
                typeOfTest: "Overweight",
                typeOfTestUsed: "BMI",
                admit_id: parseInt(id),
              });
              break;
            case "sd2":
              await Results.create({
                result: "moderate",
                typeOfTest: "Obesity",
                typeOfTestUsed: "BMI",
                admit_id: parseInt(id),
              });
              break;
            case "sd3":
              await Results.create({
                result: "severe",
                typeOfTest: "Obesity",
                typeOfTestUsed: "BMI",
                admit_id: parseInt(id),
              });
              break;
            default:
              break;
          }
        }
      }
    }
    if (Test.test_types[0].muac) {
      const muac = Test.test_types[0].muacValue;
      if (ageInMonths <= 60) {
        if (muac < 11.5) {
          await Results.create({
            result: "severe",
            typeOfTest: "Acute Malnutrition",
            typeOfTestUsed: "MUAC",
            admit_id: parseInt(id),
          });
        } else if (muac >= 11.5 && muac < 12.5) {
          await Results.create({
            result: "moderate",
            typeOfTest: "Acute Malnutrition",
            typeOfTestUsed: "MUAC",
            admit_id: parseInt(id),
          });
        } else {
          await Results.create({
            result: "normal",
            typeOfTest: "No Malnutrition",
            typeOfTestUsed: "MUAC",
            admit_id: parseInt(id),
          });
        }
      }
      if (ageInMonths > 60) {
        if (muac < 18.5) {
          await Results.create({
            result: "severe",
            typeOfTest: "Acute Malnutrition",
            typeOfTestUsed: "MUAC",
            admit_id: parseInt(id),
          });
        } else if (muac >= 18.5 && muac < 22.5) {
          await Results.create({
            result: "moderate",
            typeOfTest: "Acute Malnutrition",
            typeOfTestUsed: "MUAC",
            admit_id: parseInt(id),
          });
        } else {
          await Results.create({
            result: "normal",
            typeOfTest: "No Malnutrition",
            typeOfTestUsed: "MUAC",
            admit_id: parseInt(id),
          });
        }
      }
    }
    res.status(200).json("Results created successfully");
  } catch (error) {
    console.log("hello", error);
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
    console.log(malnutrition);
    const overnutrition = results.results.filter(
      (item) =>
        severityLevels.includes(item.result) &&
        overnutritionTests.includes(item.typeOfTest)
    );
    if (malnutrition.length > 0) {
      const patientCategory = results.patient_type;

      const containsSevere = malnutrition.some(
        (item) => item.result === "severe"
      );

      const containsModerateMild = malnutrition.some((item) =>
        ["moderate", "mild"].includes(item.result)
      );

      if (containsSevere) {
        const treatment = await Treatment.findOne({
          where: { patientCategory: patientCategory, resultCategory: "severe" },
        });
        await GivenTreatment.create({
          treatment: treatment.treatment,
          admit_id: id,
          typeOfMalnutrition: "Malnutrition",
        });
      }
      if (containsModerateMild) {
        const treatment = await Treatment.findOne({
          where: {
            patientCategory: patientCategory,
            resultCategory: "moderate",
          },
        });
        await GivenTreatment.create({
          treatment: treatment.treatment,
          admit_id: id,
          typeOfMalnutrition: "Malnutrition",
        });
      }
    }
    if (overnutrition.length > 0) {
      await GivenTreatment.create({
        treatment:
          "Weight loss councelling, Diet, Physical Activity and Exercises, Phentermine/ Topiramate, Or listat, Bupropion/ Naltrexone, Bariatric surgery",
        admit_id: id,
        typeOfMalnutrition: "Overnutrition",
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
