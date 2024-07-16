import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { url } from "../../Utills/API";
import ReactToPrint from "react-to-print";

const ViewReport = () => {
  const [data, setData] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const hospital = JSON.parse(localStorage.getItem("hospital"));
  const reportType = JSON.parse(localStorage.getItem("reportType"));
  const id = user.hospital_id || hospital.hospital_id;
  const componentRef = useRef();
  const [hospitalData, setHospitalData] = useState(hospital);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user.user_type === "admin" || user.user_type === "user") {
          await axios.get(`${url}/hospital/${id}`).then((res) => {
            console.log(res.data);
            setHospitalData(res.data);
          });
        }
      } catch (error) {
        console.log(error)
      }
    };
    fetchData();
  }, [user.user_type, id]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios
          .get(`${url}/stats/malnutrition/${id}/${reportType}`)
          .then((res) => {
            setData(res.data);
          });
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [id, reportType]);

  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      await axios.get(`${url}/hospitalinfo/${id}`).then((res) => {
        setQuestions(res.data);
      });
    };
    fetchData();
  }, [id]);

  return (
    <div>
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
      <div ref={componentRef} className="mt-5">
        <div>
          <div className="flex justify-center">
            <h2 className="font-bold uppercase tracking-wide text-xl mb-2">
              Monthly Report on Malnutrition
            </h2>
          </div>
          {hospitalData && (
            <div className="flex justify-center mb-2">
              <ul className="flex items-center justify-between flex-wrap gap-5 uppercase">
                <li className="flex justify-between gap-3">
                  <strong>Name of Hospital</strong>
                  <u>{hospitalData.hospital_name}</u>
                </li>
                <li className="flex justify-between gap-3">
                  <strong>District</strong>
                  <u>{hospitalData.hospital_district}</u>
                </li>
                <li className="flex justify-between gap-3">
                  <strong>Region</strong>
                  <u>{hospitalData.hospital_region}</u>
                </li>
              </ul>
            </div>
          )}
        </div>
        <div className="p-5 bg-gray-200 m-2 rounded-xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-text/90">
              Health Center Data
            </h2>
          </div>
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border">Question</th>
                <th className="py-2 px-4 border">Answer</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((question, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border">{question.question}</td>
                  <td className="py-2 px-4 border">{question.answer || ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-5 bg-gray-200 m-2 rounded-xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-text/90">{reportType}</h2>
          </div>
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border">Result Type</th>
                <th className="py-2 px-4 border">Male</th>
                <th className="py-2 px-4 border">Female</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td className="py-2 px-4 border">Children under 5 years</td>
                <td className="py-2 px-4 border text-center">
                  {data.male?.childrenUnder5Years || "0"}
                </td>
                <td className="py-2 px-4 border text-center">
                  {data.female?.childrenUnder5Years || "0"}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border">Elderly</td>
                <td className="py-2 px-4 border text-center">
                  {data.male?.elderly || "0"}
                </td>
                <td className="py-2 px-4 border text-center">
                  {data.female?.elderly || "0"}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border">Other patient</td>
                <td className="py-2 px-4 border text-center">
                  {data.male?.otherPatient || "0"}
                </td>
                <td className="py-2 px-4 border text-center">
                  {data.female?.otherPatient || "0"}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border">Pregnancy women</td>
                <td className="py-2 px-4 border text-center"></td>
                <td className="py-2 px-4 border text-center">
                  {data.pregnantWomen || "0"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewReport;
