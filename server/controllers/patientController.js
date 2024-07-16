const db = require("../models")

const Patient = db.patients;
const Hospital = db.hospitals


exports.create = async (req,res) =>{
    try {
        const {first_name, last_name} = req.body;

        const check = await Patient.findOne({where: {first_name: first_name, last_name: last_name}})

        if(check) {
            return res.status(409).json("Patient already Created")
        }
        await Patient.create(req.body)

        res.status(200).json("Patient Create successfuly")
    } catch (error) {
        console.log(error)
        res.status(500).json("Server Error")
    }
}

exports.getAll = async (req,res) =>{
    try {
        const id = req.params.id
        const patient = await Patient.findAll({
            where: {
                hospital_id: id
            }
        })
        res.status(200).json(patient)
    } catch (error) {
        res.status(500).json("Server Error");
    }
}

exports.updatePatient = async (req, res) =>{
    try {
        const id = req.params.id;
        await Patient.update(req.body, { where: { patient_card_no: id} });
        res.status(200).json("Patient Updated Successfuly");
    } catch (error) {
        res.status(500).json("Server Error");
    }
}

exports.deletePatient = async (req,res) =>{
    try {
        const id = req.params.id;
        await Patient.destroy({ where: { patient_card_no: id } });
        res.status(200).json("Patient Delete Successfully")
    } catch (error) {
        res.status(500).json("Server Error");
    }
}