import React, { useState } from "react";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { url } from "../../Utills/API";
import axios from "axios";
const ChangePassword = () => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const toggleOldPasswordVisibility = () => {
    setShowOldPassword(!showOldPassword);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    // Retrieve the stored user data
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      console.log(user)
      await axios
        .put(`${url}/user/changepassword/${user.user_id}`, passwordData)
        .then((res) => {
          console.log(res);
          alert("Password changed successfully!");
        });
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <>
      <div
        id="headlessui-tabs-panel-8"
        role="tabpanel"
        aria-labelledby="headlessui-tabs-tab-5"
        tabIndex={0}
        className="pl-3"
      >
        <div className="mt-4 pb-4">
          <h2 className="text-xl font-semibold text-gray-900">Security</h2>
          <h6 className="text-sm font-thin text-gray-700">Protect your data</h6>
        </div>
      </div>

      <div className="p-5 bg-gray-200 m-2 rounded-xl">
        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold text-text/90">
                Change password
              </h3>
              <h6 className="text-sm font-thin text-text/60">
                Update password
              </h6>
            </div>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-[0.2rem] relative">
                <label
                  htmlFor="oldPassword"
                  className="font-semibold text-text/90 text-base"
                >
                  <span className="font-semibold flex flex-row justify-between items-center">
                    Old password
                    <button
                      type="button"
                      className="text-gray-600 items-center flex flex-row"
                      onClick={toggleOldPasswordVisibility}
                    >
                      <span className="text-[0.8rem] font-thin">
                        {showOldPassword ? "Hide" : "Show"}
                      </span>
                      {showOldPassword ? (
                        <FaRegEyeSlash className="ml-2" />
                      ) : (
                        <FaRegEye className="ml-2" />
                      )}
                    </button>
                  </span>
                </label>
                <div className="flex flex-row items-center">
                  <input
                    className="bg-transparent ring-gray-400 p-2 ring-2 hover:ring-text-gray-600 focus:ring-primary rounded-lg transition-all border-none w-full text-gray-900"
                    type={showOldPassword ? "text" : "password"}
                    id="oldPassword"
                    name="oldPassword"
                    value={passwordData.oldPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col gap-[0.2rem] relative">
                <label
                  htmlFor="newPassword"
                  className="font-semibold text-text/90 text-base"
                >
                  <span className="font-semibold flex flex-row justify-between items-center">
                    New password
                    <button
                      type="button"
                      className="text-gray-600 items-center flex flex-row"
                      onClick={toggleNewPasswordVisibility}
                    >
                      <span className="text-[0.8rem] font-thin">
                        {showNewPassword ? "Hide" : "Show"}
                      </span>
                      {showNewPassword ? (
                        <FaRegEyeSlash className="ml-2" />
                      ) : (
                        <FaRegEye className="ml-2" />
                      )}
                    </button>
                  </span>
                </label>
                <div className="flex flex-row items-center">
                  <input
                    className="bg-transparent ring-gray-400 p-2 ring-2 hover:ring-text-gray-600 focus:ring-primary rounded-lg transition-all border-none w-full text-gray-900"
                    type={showNewPassword ? "text" : "password"}
                    id="newPassword"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="px-3 py-1 text-base rounded-lg font-semibold w-fit border-2 border-primary 
                            bg-blue-900 text-primary
                            hover:bg-primary/10 focus:bg-primary/20
                            transition-all"
              >
                <div className="flex flex-row items-center gap-2">
                  <span className="align-center text-white">Change</span>
                </div>
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
