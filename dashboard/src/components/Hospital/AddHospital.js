import React, { useState } from "react";
import axios from "axios";
import { url } from "../../Utills/API";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddHospital = () => {
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
         const data = { hospital_id, question, answer: null };
         await fetch("http://localhost:8085/hospitalinfo", {
           method: "POST",
           headers: {
             "Content-Type": "application/json",
           },
           body: JSON.stringify(data),
         });
         console.log("succesfully created");
       }
     } catch (error) {
       console.error("Error initializing questions:", error);
     }
   };
  const navigate = useNavigate();
  const [values, setValues] = useState({
    hospital_name: "",
    hospital_district: "",
    hospital_region: "",
  });

  const toastOptions = {
    position: "top-center",
    autoClose: 8000, // Time in milliseconds for the toast to auto close
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const handleChange = ({ currentTarget: input }) => {
    setValues({ ...values, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${url}/hospital`, values);
      initializeQuestions(response.data.hospital.hospital_id);
      toast.success(response.data.message, toastOptions);
      setValues({
        hospital_name: "",
        hospital_district: "",
        hospital_region: "",
      });
    } catch (error) {
      console.log(error);
      toast.error(error.response.data, toastOptions);
    }
  };

  const handleToastClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    // Navigate only on success toast close
    if (!toast.isActive("success-toast")) {
      navigate("/main");
    }
  };

  return (
    <>
      <section className="py-1 bg-blueGray-50">
        <div className="w-full px-4 mx-auto mt-6">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
            <div className="rounded-t bg-white mb-0 px-6 py-6">
              <div className="text-center flex justify-between">
                <h6 className="text-blueGray-700 text-xl font-bold">
                  Add Health Center
                </h6>
                <button
                  className="bg-blue-900 text-white active:bg-pink-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={handleSubmit}
                >
                  Save Health Center
                </button>
              </div>
            </div>
            <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
              <div>
                <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                  Health Center Information
                </h6>
                <div className="flex flex-wrap">
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="hospital_name"
                      >
                        Health Center Name
                      </label>
                      <input
                        type="text"
                        id="hospital_name"
                        value={values.hospital_name}
                        name="hospital_name"
                        onChange={handleChange}
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        placeholder="Enter hospital name"
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="hospital_district"
                      >
                        Health Center District
                      </label>
                      <input
                        type="text"
                        id="hospital_district"
                        value={values.hospital_district}
                        name="hospital_district"
                        onChange={handleChange}
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        placeholder="Enter hospital district"
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="hospital_region"
                      >
                        Health Center Region
                      </label>
                      <input
                        type="text"
                        id="hospital_region"
                        value={values.hospital_region}
                        name="hospital_region"
                        onChange={handleChange}
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        placeholder="Enter hospital region"
                      />
                    </div>
                  </div>
                </div>
                <hr className="mt-6 border-b-1 border-blueGray-300" />
              </div>
            </div>
          </div>
        </div>
      </section>
      <ToastContainer onClose={handleToastClose} />
    </>
  );
};

export default AddHospital;
