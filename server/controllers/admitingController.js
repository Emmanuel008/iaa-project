const db = require("../models");

const AdmitingInfo = db.admiting_infos;
const Patient = db.patients

exports.create = async (req, res) => {
    try {
        const { patient_type, height, weight, patient_card_no, date } = req.body;

        await AdmitingInfo.create({
          patient_type,
          weight,
          height,
          date,
          patient_card_no,
          patient_status: "admited",
        });

        res.status(200).json("Patient Admited Successfully")

    } catch (error) {
        console.log(error)
        res.status(500).json("Server Error");
    }
}

exports.getAll = async (req,res) =>{
    try {
        const id = req.params.id
        const admitingInfo = await AdmitingInfo.findAll({
            where: {patient_status: "admited"},
            include:[{
                model: Patient,
                required: true,
                where: {
                    hospital_id: id
                }
            }]
        })
        res.status(200).json(admitingInfo)
    } catch (error) {
        res.status(500).json("Server Error");
    }
}

exports.updateInfo = async (req,res) =>{
    try {
      const id = req.params.id
      await AdmitingInfo.update(req.body, {
        where: { admit_id: id },
      });  
      res.status(200).json("Updated Successfully")
    } catch (error) {
        res.status(500).json("Server Error")
    }
}

exports.deleteInfo = async (req,res) =>{
    try {
        const id = req.params.id
        await AdmitingInfo.destroy({where: {admit_id: id}})
        res.status(200).json("Admitted Patient was delete succesfully")
    } catch (error) {
        res.status(500).json("Server Error")
    }
}