import React, { useState } from "react";
import axios from "axios";
import { url } from "../../Utills/API";
import { useNavigate } from "react-router-dom";
const TestAndTreatement = () => {
  const navigate = useNavigate();
  const data = JSON.parse(localStorage.getItem("admitedPatient"));
  console.log(data);
  
  const calculateAge = (birthdate) => {
    const birthDate = new Date(birthdate);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    const dayDifference = today.getDate() - birthDate.getDate();

    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
      age--;
    }

    return age;
  };

  const [values, setValues] = useState({
    weight_height: false,
    height_age: false,
    weight_age: false,
    muac: false,
    BMI: false,
    muacValue: ""
  });

  const [age, setAge] = useState(null);

  React.useEffect(() => {
    const patientAge = calculateAge(data.patient.birth_date);
    setAge(patientAge);
  }, [data.patient.birth_date]);


   const handleChange = ({ currentTarget: input }) => {
     setValues((prevValues) => ({
       ...prevValues,
       [input.name]: input.type === "checkbox" ? input.checked : input.value,
     }));
   };

const handleSubmit = async(e) =>{
  e.preventDefault();
  const {weight_age, weight_height, height_age, muac, BMI} = values
  if(!weight_age && !weight_height && !height_age &&  !muac && !BMI){
    alert("Aleast One filed should be checked")
    return;
  }
  try {
    const response = await axios.post(`${url}/test`, {
      ...values, admit_id: data.admit_id
    });
    if(response.statusText === "OK"){
      const response2 = await axios.post(`${url}/test/result/${data.admit_id}`);
      if(response2.statusText === "OK"){
        const response3 = await axios.get(`${url}/test/treatment/${data.admit_id}`)
        if(response3.statusText === "OK"){
          await axios.put(`${url}/admiting/${data.admit_id}`, {
            admiting_status: "released",
          }).then(() =>{
            navigate("/main/treatedpatient")
          })
        }
      }
    }
  } catch (error) {
    console.log(error)
  }
}
  return (
    <>
      <section className="py-1 bg-blueGray-50">
        <div className="w-full px-4 mx-auto mt-6">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
            <div className="rounded-t bg-white mb-0 px-6 py-6">
              <div className="text-center flex justify-between">
                <h6 className="text-blueGray-700 text-xl font-bold">
                  Test, Result And Treatment
                </h6>
              </div>
            </div>
            <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
              <form onSubmit={handleSubmit}>
                <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                  Patient Information
                </h6>
                <div className="flex flex-wrap">
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                        Username
                      </label>
                      <input
                        type="text"
                        value={`${data.patient.first_name} ${data.patient.last_name}`}
                        disabled
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={data.patient_card_no}
                        disabled
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                        Birth date
                      </label>
                      <input
                        type="date"
                        value={data.patient.birth_date.split("T")[0]}
                        disabled
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                        Residence
                      </label>
                      <input
                        type="text"
                        value={data.patient.residence}
                        disabled
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                        Gender
                      </label>
                      <input
                        type="text"
                        value={data.patient.gender}
                        disabled
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      />
                    </div>
                  </div>
                </div>
                <hr className="mt-6 border-b-1 border-blueGray-300" />
                <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                  Admiting Information
                </h6>
                <div className="flex flex-wrap">
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                        Admiting date
                      </label>
                      <input
                        type="date"
                        value={data.date.split("T")[0]}
                        disabled
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                        Patinet Type
                      </label>
                      <input
                        type="text"
                        value={data.patient_type}
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                        Height in cm
                      </label>
                      <input
                        type="Number"
                        value={data.height}
                        disabled
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-4/12 px-4">
                    <div className="relative w-full mb-3">
                      <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                        Weight in Kg
                      </label>
                      <input
                        type="Number"
                        value={data.weight}
                        disabled
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      />
                    </div>
                  </div>
                </div>
                <hr className="mt-6 border-b-1 border-blueGray-300" />
                <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                  Choose Malnutrition Test
                </h6>
                <div className="flex flex-wrap">
                  <div className="flex flex-col flex-wrap w-full">
                    {age <= 5 && (
                      <div className="flex items-center mb-4">
                        <input
                          id="weight_height"
                          type="checkbox"
                          name="weight_height"
                          checked={values.weight_height}
                          onChange={handleChange}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label
                          htmlFor="weight_height"
                          className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          Height/Weight
                        </label>
                      </div>
                    )}
                    {age <= 19 && (
                      <div className="flex items-center mb-4">
                        <input
                          id="height_age"
                          type="checkbox"
                          name="height_age"
                          checked={values.height_age}
                          onChange={handleChange}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label
                          htmlFor="height_age"
                          className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          Height/Age
                        </label>
                      </div>
                    )}
                    {age <= 19 && (
                      <div className="flex items-center mb-4">
                        <input
                          id="weight_age"
                          type="checkbox"
                          name="weight_age"
                          checked={values.weight_age}
                          onChange={handleChange}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label
                          htmlFor="weight_age"
                          className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          Weight/Age
                        </label>
                      </div>
                    )}

                    {age >= 0 && (
                      <div className="flex items-center mb-4">
                        <input
                          id="BMI"
                          type="checkbox"
                          name="BMI"
                          checked={values.BMI}
                          onChange={handleChange}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label
                          htmlFor="BMI"
                          className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          BMI
                        </label>
                      </div>
                    )}
                    {age >= 3 && (
                      <div className="flex items-center mb-4">
                        <input
                          id="muac"
                          type="checkbox"
                          name="muac"
                          checked={values.muac}
                          onChange={handleChange}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label
                          htmlFor="muac"
                          className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          MUAC
                        </label>
                      </div>
                    )}
                    {values.muac && (
                      <div className="w-full lg:w-6/12 px-4">
                        <div className="relative w-full mb-3">
                          <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                            MUAC Value (cm)
                          </label>
                          <input
                            type="number"
                            name="muacValue"
                            value={values.muacValue}
                            onChange={handleChange}
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <hr className="mt-6 border-b-1 border-blueGray-300" />
                <button
                  type="submit"
                  className="mt-5 bg-blue-900 text-white active:bg-blue-700 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150"
                >
                  Save
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default TestAndTreatement;
