import React, { useState, useEffect } from "react";
import axios from "axios";
import { url } from "../../Utills/API";
import { useNavigate } from "react-router-dom";

const AddOfficer = () => {
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [checkNumber, setCheckNumber] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [healthCareCenter, setHealthCareCenter] = useState("");
  const [hospitalOptions, setHospitalOptions] = useState([]);

  useEffect(() => {
    // Fetch hospitals data
    const fetchHospitals = async () => {
      try {
        const response = await axios.get(`${url}/hospital`);
        setHospitalOptions(response.data); // Assuming response.data is an array of hospitals
      } catch (error) {
        console.error("Error fetching hospitals:", error);
        // Handle error, show a notification, etc.
      }
    };

    fetchHospitals();
  }, []);

  const formatPhoneNumber = (value) => {
    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, "");
    // Format the phone number as "0756-456-789"
    const formatted = cleaned
      .substring(0, 10)
      .replace(/(\d{4})(\d{3})(\d{0,3})/, "$1-$2-$3")
      .replace(/-$/, ""); // Remove trailing dash
    return formatted;
  };

  const handlePhoneNumberChange = (e) => {
    const { value } = e.target;
    const formattedValue = formatPhoneNumber(value);
    setPhoneNumber(formattedValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newOfficer = {
      first_name: firstName,
      last_name: lastName,
      email,
      user_type: userRole,
      checkNumber,
      phone: phoneNumber,
      hospital_id: healthCareCenter, // Assigning hospital_id from healthCareCenter for demonstration
    };

    try {
      await axios.post(`${url}/user`, newOfficer)
      .then(()=>{
          navigate("/main/officer");
      })
      // Optionally, you can redirect or show a success message here
    } catch (error) {
      console.error("Error adding officer:", error);
      // Handle error, show a notification, etc.
    }

    // Clear form fields after submission
    setFirstName("");
    setCheckNumber(null);
    setLastName("");
    setEmail("");
    setUserRole("");
    setPhoneNumber("");
    setHealthCareCenter("");
  };

  return (
    <>
      <section className="py-1 bg-blueGray-50">
        <div className="w-full px-4 mx-auto mt-6">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
            <div className="rounded-t bg-white mb-0 px-6 py-6">
              <div className="text-center flex justify-between">
                <h6 className="text-blueGray-700 text-xl font-bold">
                  Add User
                </h6>
                <button
                  onClick={handleSubmit}
                  className="bg-blue-900 text-white active:bg-pink-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                  type="button"
                >
                  Save User
                </button>
              </div>
            </div>
            <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
              <form>
                <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                  User Information
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
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
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
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="email"
                      >
                        Email address
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                        User Role
                      </label>
                      <select
                        id="user-role"
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        value={userRole}
                        onChange={(e) => setUserRole(e.target.value)}
                        required
                      >
                        <option disabled value="">
                          Select User Role
                        </option>
                        <option value="admin">Health Officer</option>
                      </select>
                    </div>
                  </div>
                </div>
                <hr className="mt-6 border-b-1 border-blueGray-300" />
                <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                  Contact Information
                </h6>
                <div className="flex flex-wrap">
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="check-number"
                      >
                        Check Number
                      </label>
                      <div className="relative">
                        <input
                          type="Number"
                          id="check-number"
                          aria-describedby="helper-text-explanation"
                          className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          required
                          value={checkNumber}
                          onChange={(e)=> setCheckNumber(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="phone-number"
                      >
                        Phone Number
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 start-0 top-0 flex items-center ps-3.5 pointer-events-none">
                          <svg
                            className="w-4 h-4 text-gray-500 dark:text-gray-400"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 19 18"
                          >
                            <path d="M18 13.446a3.02 3.02 0 0 0-.946-1.985l-1.4-1.4a3.054 3.054 0 0 0-4.218 0l-.7.7a.983.983 0 0 1-1.39 0l-2.1-2.1a.983.983 0 0 1 0-1.389l.7-.7a2.98 2.98 0 0 0 0-4.217l-1.4-1.4a2.824 2.824 0 0 0-4.218 0c-3.619 3.619-3 8.229 1.752 12.979C6.785 16.639 9.45 18 11.912 18a7.175 7.175 0 0 0 5.139-2.325A2.9 2.9 0 0 0 18 13.446Z" />
                          </svg>
                        </div>
                        <input
                          type="text"
                          id="phone-number"
                          aria-describedby="helper-text-explanation"
                          className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring block w-full ps-10 p-2.5 ease-linear transition-all duration-150 "
                          pattern="[0-9]{4}-[0-9]{3}-[0-9]{3}"
                          placeholder="0756-456-789"
                          value={phoneNumber}
                          onChange={handlePhoneNumberChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="health-care-center"
                      >
                        Health Center
                      </label>
                      <select
                        id="health-care-center"
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        value={healthCareCenter}
                        onChange={(e) => setHealthCareCenter(e.target.value)}
                        required
                      >
                        <option disabled value="">
                          Select Health Center
                        </option>
                        {hospitalOptions.map((hospital) => (
                          <option
                            key={hospital.id}
                            value={hospital.hospital_id}
                          >
                            {hospital.hospital_name}
                          </option>
                        ))}
                      </select>
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

export default AddOfficer;
