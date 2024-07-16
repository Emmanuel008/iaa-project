const db = require("../models");
const Hospital = db.hospitals;

exports.create = async (req, res) => {
  try {
    const { hospital_name, hospital_district, hospital_region } = req.body;

    const hospitalCheck = await Hospital.findOne({
      where: { hospital_name: hospital_name },
    });

    if (hospitalCheck) {
      return res.status(409).json("Hospital with given name already exist");
    }

    const hospital = await Hospital.create({
      hospital_name: hospital_name,
      hospital_district: hospital_district,
      hospital_region: hospital_region,
    });

    res.status(200).json({message: "Created succesfully",hospital});
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.getAll = async (req, res) => {
  try {
    const hospitals = await Hospital.findAll();
    res.status(200).json(hospitals);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.getById = async (req,res)=>{
  try {
    const id = req.params.id;
    const hospital = await Hospital.findOne({where: {hospital_id: id}})
    res.status(200).json(hospital)
  } catch (error) {
    res.status(500).error
  }
}



exports.updateHospital = async (req, res) => {
  try {
    const id = req.params.id;
    await Hospital.update(req.body,{ where: { hospital_id: id } });
        res
          .status(200)
          .json("Hopsital updated successfully");
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.deleteHospital = async (req, res) => {
  try {
    const id = req.params.id;
    await Hospital.destroy({ where: { hospital_id: id } });
    res.status(200).json("Hospital deteled successfully" );

  } catch (error) {
    res.status(500).json(error);
  }
};
