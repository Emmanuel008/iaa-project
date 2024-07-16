import React, { useState } from "react";
import axios from "axios"
import {url} from "../../Utills/API"
import {useNavigate} from "react-router-dom"
const TestAndTreatement = () => {
  const navigate = useNavigate();
  const data = JSON.parse(localStorage.getItem("admitedPatient"));
  console.log(data)
  console.log(data)
  const [muac, setMuac] = useState("");
  const [results, setResults] = useState([]);
  const [treatment, setTreatment] = useState("");

  const handleMuacChange = (e) => {
    setMuac(e.target.value);
  };

  const handleResultChange = (e) => {
    const value = e.target.value;
    setResults((prevResults) =>
      prevResults.includes(value)
        ? prevResults.filter((result) => result !== value)
        : [...prevResults, value]
    );
  };



  const handleTreatmentChange = (e) => {
    setTreatment(e.target.value);
  };

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

  const handleSubmit = async (e)=>{
    e.preventDefault();
    try {
      const weight_height = (data.weight / data.height).toFixed(2);
      const height_age = (
        data.height / calculateAge(data.patient.birth_date)
      ).toFixed(2);
      const weight_age = (
        data.weight / calculateAge(data.patient.birth_date)
      ).toFixed(2);

      const postData = {
        weight_height,
        height_age,
        weight_age,
        muac,
        result: results.join(" "),
        treatment,
        patient_card_no: data.patient_card_no,
        admit_id: data.admit_id,
      };

      // Filter out empty values (empty strings and empty arrays)
      const filteredPostData = Object.fromEntries(
        Object.entries(postData).filter(([_, value]) => {
          return value !== "";
        })
      );
      await axios.post(`${url}/testresulttreatment`, filteredPostData)
      await axios
        .put(`${url}/admiting/${data.admit_id}`, {
          patient_status: "released",
        })
        .then(() => {
          alert("Successfully");
          navigate("/main/admitedpatient");
        });
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
                  Malnutrition Test
                </h6>
                <div className="flex flex-wrap">
                  <div className="w-full lg:w-4/12 px-4">
                    <div className="relative w-full mb-3">
                      <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                        Weight/Height
                      </label>
                      <input
                        type="text"
                        value={(data.weight / data.height).toFixed(2)}
                        disabled
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-4/12 px-4">
                    <div className="relative w-full mb-3">
                      <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                        Height/Age
                      </label>
                      <input
                        type="text"
                        value={(
                          data.height / calculateAge(data.patient.birth_date)
                        ).toFixed(2)}
                        disabled
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-4/12 px-4">
                    <div className="relative w-full mb-3">
                      <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                        Weight/Age
                      </label>
                      <input
                        type="text"
                        value={(
                          data.weight / calculateAge(data.patient.birth_date)
                        ).toFixed(2)}
                        disabled
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-4/12 px-4">
                    <div className="relative w-full mb-3">
                      <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                        Mid upper arm circumference (MUAC)
                      </label>
                      <input
                        type="Number"
                        value={muac}
                        onChange={handleMuacChange}
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      />
                    </div>
                  </div>
                </div>
                <hr className="mt-6 border-b-1 border-blueGray-300" />
                <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                  Malnutrition Result
                </h6>
                <div className="flex flex-wrap">
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          value="Wasting"
                          onChange={handleResultChange}
                          className="form-checkbox"
                        />
                        <span className="ml-2">Wasting</span>
                      </label>
                    </div>
                    <div className="relative w-full mb-3">
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          value="Stunting"
                          onChange={handleResultChange}
                          className="form-checkbox"
                        />
                        <span className="ml-2">Stunting</span>
                      </label>
                    </div>
                    <div className="relative w-full mb-3">
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          value="Underweight"
                          onChange={handleResultChange}
                          className="form-checkbox"
                        />
                        <span className="ml-2">Underweight</span>
                      </label>
                    </div>
                    <div className="relative w-full mb-3">
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          value="Obesity"
                          onChange={handleResultChange}
                          className="form-checkbox"
                        />
                        <span className="ml-2">Obesity</span>
                      </label>
                    </div>
                    <div className="relative w-full mb-3">
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          value="Over-weight"
                          onChange={handleResultChange}
                          className="form-checkbox"
                        />
                        <span className="ml-2">Over-weight</span>
                      </label>
                    </div>
                  </div>
                </div>
                <hr className="mt-6 border-b-1 border-blueGray-300" />
                <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                  Treatment
                </h6>
                <div className="flex flex-wrap">
                  <div className="w-full px-4">
                    <div className="relative w-full mb-3">
                      <textarea
                        rows="4"
                        value={treatment}
                        onChange={handleTreatmentChange}
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        placeholder="Describe the treatment..."
                      ></textarea>
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="bg-blue-900 text-white active:bg-blue-700 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150"
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
