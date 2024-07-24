import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { url } from "../../Utills/API";
import ReactToPrint from "react-to-print";

const ViewReport = () => {
  const [data, setData] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const hospital = JSON.parse(localStorage.getItem("hospital"));
  const allHospital = JSON.parse(localStorage.getItem("allHospital"));
  const reportType = JSON.parse(localStorage.getItem("reportType"));
  const id =
    user.user_type === "root"
      ? !allHospital.data
        ? hospital.hospital_id
        : null
      : user.user_type === "admin"
      ? user.hospital_id
      : !allHospital.data && hospital.hospital_id;


  const componentRef = useRef();
  const [hospitalData, setHospitalData] = useState(hospital);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user.user_type === "admin") {
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
        if (user.user_type === "root" && !allHospital.data ) {
          await axios
            .get(`${url}/stats/malnutrition/${id}/${reportType}`)
            .then((res) => {
              setData(res.data);
            });
        } else {
          await axios
            .get(`${url}/stats/malnutrition/${reportType}`)
            .then((res) => {
              setData(res.data);
            });
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, reportType, user.user_type]);

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
          {(user.user_type === "admin" || !allHospital.data) &&
            hospitalData && (
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
        {(user.user_type === "admin" || !allHospital.data) && (
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
                    <td className="py-2 px-4 border">
                      {question.answer || ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
                  {data.male?.under5years || "0"}
                </td>
                <td className="py-2 px-4 border text-center">
                  {data.female?.under5years || "0"}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border">Elderly</td>
                <td className="py-2 px-4 border text-center">
                  {data.male?.above19years || "0"}
                </td>
                <td className="py-2 px-4 border text-center">
                  {data.female?.above19years || "0"}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border">
                  Between 5 years and 19 years
                </td>
                <td className="py-2 px-4 border text-center">
                  {data.male?.between5and19years || "0"}
                </td>
                <td className="py-2 px-4 border text-center">
                  {data.female?.between5and19years || "0"}
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
