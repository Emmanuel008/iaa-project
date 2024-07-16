import React, { useState, useEffect } from "react";
import axios from "axios"
import {url} from "../../Utills/API"
const EditProfile = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });

  // Retrieve data from localStorage when the component mounts
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("user"));
    if (data) {
      setFormData({
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        email: data.email || "",
        phone: data.phone || "",
      });
    }
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = JSON.parse(localStorage.getItem("user"));

    const updatedData = { ...data, ...formData };
    // Update data in localStorage
    await axios.put(`${url}/user/${data.user_id}`, formData)
    .then((res) => {
      localStorage.setItem("user", JSON.stringify(updatedData));
      alert("Profile updated successfully!");
    })
  };

  return (
    <>
      <div
        id="headlessui-tabs-panel-81"
        role="tabpanel"
        aria-labelledby="headlessui-tabs-tab-78"
        tabIndex={0}
        className="pl-3"
      >
        <div className="mt-4 pb-4">
          <h2 className="text-xl font-semibold text-text/90">Account</h2>
          <h6 className="text-sm font-thin text-text/60">
            Alter your account settings
          </h6>
        </div>
      </div>
      <div className="p-5 bg-gray-200 m-2 rounded-xl">
        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <h3 className="text-lg font-semibold text-dark">
                Update account settings
              </h3>
              <h6 className="text-sm font-thin text-gray-600">
                Change your personal info
              </h6>
            </div>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-[0.2rem] relative">
                <label
                  htmlFor="firstName"
                  className="font-semibold text-gray-900 text-base"
                >
                  <span className="font-semibold flex flex-row justify-between items-center">
                    First Name
                  </span>
                </label>
                <div className="flex flex-row items-center">
                  <input
                    className="bg-transparent ring-gray-400 p-2 ring-2 hover:ring-text-gray-600 focus:ring-primary rounded-lg transition-all border-none w-full text-gray-900"
                    type="text"
                    id="firstName"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col gap-[0.2rem] relative">
                <label
                  htmlFor="lastName"
                  className="font-semibold text-gray-900 text-base"
                >
                  <span className="font-semibold flex flex-row justify-between items-center">
                    Last Name
                  </span>
                </label>
                <div className="flex flex-row items-center">
                  <input
                    className="bg-transparent ring-gray-400 p-2 ring-2 hover:ring-text-gray-600 focus:ring-primary rounded-lg transition-all border-none w-full text-gray-900"
                    type="text"
                    id="lastName"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col gap-[0.2rem] relative">
                <label
                  htmlFor="email"
                  className="font-semibold text-gray-900 text-base"
                >
                  <span className="font-semibold flex flex-row justify-between items-center">
                    Email
                  </span>
                </label>
                <div className="flex flex-row items-center">
                  <input
                    className="bg-transparent ring-gray-400 p-2 ring-2 hover:ring-text-gray-600 focus:ring-primary rounded-lg transition-all border-none w-full text-gray-900"
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col gap-[0.2rem] relative">
                <label
                  htmlFor="phone"
                  className="font-semibold text-gray-900 text-base"
                >
                  <span className="font-semibold flex flex-row justify-between items-center">
                    Phone
                  </span>
                </label>
                <div className="flex flex-row items-center">
                  <input
                    className="bg-transparent ring-gray-400 p-2 ring-2 hover:ring-text-gray-600 focus:ring-primary rounded-lg transition-all border-none w-full text-gray-900"
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="px-3 py-1 text-base rounded-lg font-semibold w-fit border-2 border-primary 
                            bg-blue-900 text-primary
                            hover:bg-primary focus:bg-primary
                            transition-all"
              >
                <div className="flex flex-row items-center gap-2">
                  <span className="align-center text-white">
                    Update account settings
                  </span>
                </div>
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProfile;
