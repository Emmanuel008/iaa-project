const db = require("../models");

const TestResultTreatment = db.test_result_treatments;
const Patient = db.patients
const AdmitingInfo = db.admiting_infos

exports.create = async (req,res) =>{
    try {
        await TestResultTreatment.create(req.body)
        res.status(200).json("Created Succesfully")
    } catch (error) {
        res.status(500).json("Server Error")
    }
}

exports.getAll = async (req,res) =>{
    try {
        const id = req.params.id
        const status = req.params.status
        const data = await TestResultTreatment.findAll({
          where: { status: status },
          include: [
            {
              model: Patient,
              required: true,
              where: { hospital_id: id },
            },
            {
                model: AdmitingInfo,
                required:true
            }
          ],
        });
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json("Server Error");
    }
}

exports.update = async (req,res) =>{
    try {
        const id = req.params.id
        await TestResultTreatment.update(req.body, {
          where: { id: id },
        });
        res.status(200).json("Updated Succesfully")
    } catch (error) {
        res.status(500).json("Server Error")
    }
}

