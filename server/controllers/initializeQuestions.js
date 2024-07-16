const questionsList = [
  "Does the facility provide inpatient treatment for severe malnutrition?",
  "Does the facility provide outpatient treatment for malnutrition?",
  "Is the facility eligible to provide inpatient treatment for severe malnutrition?",
  "Does the facility have locally made therapeutic food F75& F100?",
  "Does the facility have ready-made therapeutic food F75& F100?",
  "Does the facility have ready to use therapeutic food RUTF/PLUMPYNUT&?",
];

const initializeQuestions = async (hospital_id) => {
  try {
    for (const question of questionsList) {
      const data = {hospital_id, question, answer: null}
      await fetch("http://localhost:8085/hospitalinfo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      console.log("succesfully created")
    }
  } catch (error) {
    console.error("Error initializing questions:", error);
  }
};


initializeQuestions(17);