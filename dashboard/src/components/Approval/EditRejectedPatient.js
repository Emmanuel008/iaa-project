import React,{useState} from 'react'
import axios from 'axios';
import { url } from '../../Utills/API';
import { useNavigate } from 'react-router-dom';

const EditRejectedPatient = () => {
    const navigate = useNavigate();
  const data = JSON.parse(localStorage.getItem("edit"));
  const [results, setResults] = useState(data.result.split(" "));

  const [muac, setMuac] = useState(data.muac);
  const [treatment, setTreatment] = useState(data.treatment);


  const handleResultChange = (e) => {
    const value = e.target.value;
    setResults((prevResults) =>
      prevResults.includes(value)
        ? prevResults.filter((result) => result !== value)
        : [...prevResults, value]
    );
  };
  const handleMuacChange = (e) => {
    setMuac(e.target.value);
  };

  const handleTreatmentChange = (e) => {
    setTreatment(e.target.value);
  };


  const approve = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        weight_height: data.weight_height,
        height_age: data.height_age,
        weight_age: data.weight_age,
        muac,
        result: results.join(" "),
        treatment,
        patient_card_no: data.patient_card_no,
        admit: data.admit_id,
        status: "pending",
      };
      await axios
        .put(`${url}/testresulttreatment/${data.id}`, updatedData)
        .then(() => {
          alert("updated Successfully");
          navigate("/main/rejectedapproval")
        });
    } catch (error) {
        alert("error occured")
      console.log(error);
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
                  Edit Test, Result And Treatment
                </h6>
              </div>
            </div>
            <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
              <form>
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
                        value={data.admiting_info.date.split("T")[0]}
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
                        value={data.admiting_info.patient_type}
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
                        value={data.admiting_info.height}
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
                        value={data.admiting_info.weight}
                        disabled
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      />
                    </div>
                  </div>
                </div>
                <hr className="mt-6 border-b-1 border-blueGray-300" />
                <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                  Test
                </h6>
                <div className="flex flex-wrap">
                  <div className="w-full lg:w-4/12 px-4">
                    <div className="relative w-full mb-3">
                      <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                        Weight/Height
                      </label>
                      <input
                        type="text"
                        value={data.weight_height}
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
                        value={data.height_age}
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
                        value={data.weight_height}
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
                  Result
                </h6>
                <div className="flex flex-wrap">
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          value="Wasting"
                          checked={results.includes("Wasting")}
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
                          checked={results.includes("Stunting")}
                          className="form-checkbox"
                          onChange={handleResultChange}
                        />
                        <span className="ml-2">Stunting</span>
                      </label>
                    </div>
                    <div className="relative w-full mb-3">
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          value="Underweight"
                          checked={results.includes("Underweight")}
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
                          checked={results.includes("Obesity")}
                          className="form-checkbox"
                          onChange={handleResultChange}
                        />
                        <span className="ml-2">Obesity</span>
                      </label>
                    </div>
                    <div className="relative w-full mb-3">
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          alue="Over-weight"
                          checked={results.includes("Over-weight")}
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
                <hr className="mt-6 border-b-1 border-blueGray-300" />
                <button
                  onClick={approve}
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
}

export default EditRejectedPatient
