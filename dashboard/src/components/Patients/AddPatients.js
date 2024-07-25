import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { url } from "../../Utills/API";
import axios from "axios";

const AddPatients = () => {
  const navigate = useNavigate();
  const data = JSON.parse(localStorage.getItem("user"));
  const [values, setValues] = useState({
    first_name: "",
    last_name: "",
    residence: "",
    birth_date: "",
    gender: "",
    pregnancy: null,
  });

  const handleChange = ({ currentTarget: input }) => {
    setValues({ ...values, [input.name]: input.value });
  };

  const handleRadioChange = ({ currentTarget: input }) => {
    setValues({ ...values, pregnancy: input.value === "true" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const {
        first_name,
        last_name,
        gender,
        residence,
        birth_date,
        pregnancy,
      } = values;

      const payload = {
        first_name,
        last_name,
        gender,
        residence,
        birth_date,
        pregnancy: gender === "male" ? false : pregnancy,
        hospital_id: data.hospital_id,
      };

      await axios.post(`${url}/patient`, payload).then((res) => {
        console.log(res.data);
        navigate("/main/patient");
      });
    } catch (error) {
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
                  Add Patient
                </h6>
                <button
                  onClick={handleSubmit}
                  className="bg-blue-900 text-white active:bg-pink-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                  type="button"
                >
                  Save Patient
                </button>
              </div>
              <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                <form>
                  <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                    Patient Information
                  </h6>
                  <div className="flex flex-wrap">
                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                          htmlFor="first-name"
                        >
                          First Name
                        </label>
                        <input
                          type="text"
                          id="first-name"
                          className="border px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          value={values.first_name}
                          name="first_name"
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                          htmlFor="last-name"
                        >
                          Last Name
                        </label>
                        <input
                          type="text"
                          id="last-name"
                          className="border px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          value={values.last_name}
                          name="last_name"
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                          htmlFor="residence"
                        >
                          Residence
                        </label>
                        <input
                          type="text"
                          id="residence"
                          className="border px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          value={values.residence}
                          name="residence"
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                          htmlFor="user-role"
                        >
                          Patient Gender
                        </label>
                        <select
                          id="user-role"
                          className="border px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          value={values.gender}
                          name="gender"
                          onChange={handleChange}
                          required
                        >
                          <option disabled value="">
                            Select Gender
                          </option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                      </div>
                    </div>
                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                          htmlFor="date"
                        >
                          Birth Date
                        </label>
                        <input
                          type="date"
                          id="date"
                          className="border px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          value={values.birth_date}
                          name="birth_date"
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    {values.gender === "female" && (
                      <div className="w-full lg:w-6/12 px-4">
                        <div className="relative w-full mb-3">
                          <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="can-be-pregnant"
                          >
                            Can Be Pregnant
                          </label>
                          <div>
                            <div className="flex items-center mb-4">
                              <input
                                id="pregnant-yes"
                                type="radio"
                                name="pregnancy"
                                value="true"
                                checked={values.pregnancy === true}
                                onChange={handleRadioChange}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <label
                                htmlFor="pregnant-yes"
                                className="ml-2 text-sm font-medium text-gray-900"
                              >
                                Yes
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                id="pregnant-no"
                                type="radio"
                                name="pregnancy"
                                value="false"
                                checked={values.pregnancy === false}
                                onChange={handleRadioChange}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <label
                                htmlFor="pregnant-no"
                                className="ml-2 text-sm font-medium text-gray-900"
                              >
                                No
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AddPatients;
