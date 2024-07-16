import React, {useState} from 'react'
import {useLogin} from "../hooks/useLoign"
import { ToastContainer, toast } from "react-toastify";

const Login = () => {
  const { login, error, isLoading, setError } = useLogin();

  const toastOptions = {
    position: "top-center",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const handleChange = ({ currentTarget: input }) => {
    setValues({ ...values, [input.name]: input.value });
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    const { email, password } = values;
    await login(email, password);
  };

  if (error) {
    toast.error(error, toastOptions);
    setError(null);
  }

  return (
    <>
      <div className=" flex flex-col text-center items-center justify-content-center mt-16">
        <div className="flex flex-row flex-wrap gap-4 mt-4">
          <div>
            <img src="/images/court.png" alt="" width={100} height={100} />
          </div>
          <div className="flex flex-col flex-wrap gap-3 font-bold">
            <h1>United Republic of Tanzania</h1>
            <h1>
              President’s Office - Regional Administration and Local Government
            </h1>
            <h1>Morogoro District Council</h1>
          </div>
          <div>
            <img src="/images/morogoro.png" alt="" width={100} height={100} />
          </div>
        </div>
        <div className="mt-10 flex flex-col flex-wrap gap-4">
          <h1 className="font-bold">
            Malnutrition Data Collect Information System
          </h1>
          <div className="bg-white drop-shadow-md rounded-lg p-0.5 max-w-4xl w-full flex border-t-4 border-b-2 border-blue-900 rounded-t-lg">
            <div className="w-2/4 flex items-center justify-center">
              <img src="/images/flag.png" alt="logo" className="" />
            </div>
            <div className="w-2/4 pt-10 pl-4">
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label className="block text-gray-700 mb-2 text-start">
                    Username
                  </label>
                  <input
                    type="email"
                    className="w-full p-2 border rounded"
                    placeholder="username"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-gray-700 mb-2 text-start">
                    Password
                  </label>
                  <input
                    type="password"
                    className="w-full p-2 border rounded"
                    placeholder="Password"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                  />
                </div>
                <div className="text-start grid grid-rows-3 grid-flow-col gap-4">
                  <a className="cursor-pointer row-start-1 row-span-2" href="/">
                    Reset Password?
                  </a>
                  <button className="btn bg-blue-600 row-start-1 row-end-4 text-white">
                    {isLoading? "Login...": "Login"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default Login
