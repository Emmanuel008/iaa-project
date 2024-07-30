import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { url } from "../../Utills/API";
import ReactToPrint from "react-to-print";


const ViewPatient = () => {
  const componentRef = useRef();
  const data = JSON.parse(localStorage.getItem("tested"));
  const [test, setTest] = useState([]);
  const [result, setResult] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${url}/test/results/${data.admit_id}`);
        setTest(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetch();
  }, [data.admit_id]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(
          `${url}/test/resulttreatment/${data.admit_id}`
        );
        setResult(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetch();
  }, [data.admit_id]);


  return (
    <>
      <section className="py-1 bg-blueGray-50">
        <div className="flex justify-end mt-2 mr-5">
          <ReactToPrint
            trigger={() => (
              <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-700">
                Print
              </button>
            )}
            content={() => componentRef.current}
          />
        </div>
        <div ref={componentRef} className="w-full px-4 mx-auto mt-6">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
            <div className="rounded-t bg-white mb-0 px-6 py-6 flex justify-between">
              <h6 className="text-blueGray-700 text-xl font-bold">
                Tested Patient
              </h6>
            </div>
            <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
              <div>
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
                        value={data.patient.patient_card_no}
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
                        value={data.createdAt.split("T")[0]}
                        disabled
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                        Patient Type
                      </label>
                      <input
                        value={data.patient_type}
                        disabled
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
                  <div className="w-full lg:w-6/12 px-4">
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
                  Malnutrition Test & Results
                </h6>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                  <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th scope="col" className="px-6 py-3">
                          Malnutrition Test
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Result
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {test &&
                        test.map((item, index) => (
                          <tr
                            key={index}
                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                          >
                            <th
                              scope="row"
                              className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                            >
                              {item.typeOfTestUsed}
                            </th>
                            <td className="px-6 py-4">
                              {item.result} {item.typeOfTest}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                <hr className="mt-6 border-b-1 border-blueGray-300" />
                <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                  Treatments
                </h6>
                {result.length > 0 &&
                  result.map((item, index) => (
                    <div key={index} className="mb-3">
                      <h6 className="mb-2 text-blueGray-400 text-sm mt-3 font-bold uppercase">
                        {item.typeOfMalnutrition}
                      </h6>
                      <textarea
                        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        value={item.treatment}
                        disabled
                      />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ViewPatient;
