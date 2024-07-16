const db = require("../models")

const HospitalInfo = db.hospital_infos;


exports.create = async (req,res) =>{
    try {
        const { hospital_id, question } = req.body;
        const check = await HospitalInfo.findOne({where: {hospital_id: hospital_id, question: question}})
        if(check){
            return res.status(409).json("this Equqation is already created")
        }
        await HospitalInfo.create(req.body);
        res.status(200).json("Question created Succesfuly")
    } catch (error) {
        res.status(500).json("Server Error")
    }
}

exports.updateHospitalQuestions = async (req, res) => {
  try {
    const { hospital_id, questions } = req.body;

    if (!hospital_id || !questions || !Array.isArray(questions)) {
      return res.status(400).json({ error: "Invalid data" });
    }

    for (const question of questions) {
      const { question_text, answer, id } = question;

      await HospitalInfo.update({
        hospital_id,
        question: question_text,
        answer,
      }, {where: {id: id}});
    }

    res
      .status(200)
      .json("Hospital questions updated successfully");
  } catch (error) {
    console.log(error)
    res.status(500).json("Server error");
  }
};

exports.getHospitalQuestions = async (req, res) => {
  try {
    const hospital_id = req.params.id;
    console.log(hospital_id)
    const questions = await HospitalInfo.findAll({
      where: { hospital_id },
    });

    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json("Server error");
  }
};