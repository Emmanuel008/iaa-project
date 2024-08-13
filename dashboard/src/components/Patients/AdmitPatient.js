import React, { useState} from "react";
import axios from "axios";
import { url } from "../../Utills/API";
import { useNavigate } from "react-router-dom";
const AdmitPatient = () => {
  const navigate = useNavigate()
  const data = JSON.parse(localStorage.getItem("patient"));
  const [category, setCategory] = useState("");
 const calculateAge = (dob) => {
   const birthDate = new Date(dob);
   const today = new Date();
   let age = today.getFullYear() - birthDate.getFullYear();
   const monthDiff = today.getMonth() - birthDate.getMonth();
   if (
     monthDiff < 0 ||
     (monthDiff === 0 && today.getDate() < birthDate.getDate())
   ) {
     age--;
   }
   return age;
 };

 const determineCategory = (age) => {
   const months = age * 12;
   if (months >= 6 && months <= 23) {
     return "6 - 23 months";
   } else if (months >= 24 && months <= 59) {
     return "24 - 59 months";
   } else if (age >= 5 && age <= 9) {
     return "5 - 9 years";
   } else if (age >= 10 && age <= 15) {
     return "10 - 15 years";
   } else if (age > 15) {
     return "15+ years";
   } else {
     return "Below 6 months";
   }
 };

 React.useEffect(()=>{
    const age = calculateAge(data.birth_date);
    const category = determineCategory(age);
    setCategory(category)
 },[data.birth_date])
 console.log(category)
  const [values, setValues] = useState({
    weight: 0,
    height: 0,
    date: "",
    patient_type: ""
  });

  const handleChange = ({ currentTarget: input }) => {
    setValues({ ...values, [input.name]: input.value });
  };

  const handleSumbit = async (e)=>{
    e.preventDefault();
    const { height, weight, date, patient_type } = values;
     if (!date || !patient_type || !height || !weight) {
       alert("All fields are required. Please fill in all the details.");
       return;
     }
    try {
      const {height, weight, date, patient_type} = values
      await axios
        .post(`${url}/admiting`, {
          height,
          weight,
          date,
          patient_type,
          patient_card_no: data.patient_card_no,
        })
        .then((res) => {
          navigate("/main/admitedpatient")
        });
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <>
      <section className=" py-1 bg-blueGray-50">
        <div className="w-full  px-4 mx-auto mt-6">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
            <div className="rounded-t bg-white mb-0 px-6 py-6">
              <div className="text-center flex justify-between">
                <h6 className="text-blueGray-700 text-xl font-bold">
                  Admiting Patient
                </h6>
                <button
                  className="bg-blue-900 text-white active:bg-pink-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={handleSumbit}
                >
                  Admiting
                </button>
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
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlfor="grid-password"
                      >
                        Username
                      </label>
                      <input
                        type="text"
                        value={`${data.first_name} ${data.last_name}`}
                        disabled
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlfor="grid-password"
                      >
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
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlfor="grid-password"
                      >
                        Birth date
                      </label>
                      <input
                        type="date"
                        value={data.birth_date.split("T")[0]}
                        disabled
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlfor="grid-password"
                      >
                        Residence
                      </label>
                      <input
                        type="text"
                        value={data.residence}
                        disabled
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlfor="grid-password"
                      >
                        Gender
                      </label>
                      <input
                        type="text"
                        value={data.gender}
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
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlfor="grid-password"
                      >
                        Admiting date
                      </label>
                      <input
                        type="date"
                        value={values.date}
                        name="date"
                        onChange={handleChange}
                        required
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlfor="grid-password"
                      >
                        Patient Type
                      </label>
                      <select
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        value={values.patient_type}
                        name="patient_type"
                        required
                        onChange={handleChange}
                      >
                        <option>Select Type of pateint</option>
                        <option value={category}>{category}</option>
                        {data.pregnancy && (
                          <>
                            <option value="Preganant Women">
                              preganant women
                            </option>
                            <option value="post partum women">
                              Post Partum Women
                            </option>
                          </>
                        )}
                      </select>
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlfor="grid-password"
                      >
                        Height in cm
                      </label>
                      <input
                        type="Number"
                        value={values.height}
                        name="height"
                        onChange={handleChange}
                        required
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlfor="grid-password"
                      >
                        Weight in Kg
                      </label>
                      <input
                        type="Number"
                        value={values.weight}
                        name="weight"
                        onChange={handleChange}
                        required
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      />
                    </div>
                  </div>
                </div>
                <hr className="mt-6 border-b-1 border-blueGray-300" />
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AdmitPatient;
