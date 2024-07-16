import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {url} from "../../Utills/API"

const HealthCenterTable = () => {
  const [questions, setQuestions] = useState([]);

  const data = JSON.parse(localStorage.getItem("user"))

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(`${url}/hospitalinfo/${data.hospital_id}`);
        console.log(result.data)
        setQuestions(result.data);
      } catch (error) {
        console.log(error)
      }
    };

    fetchData();
  }, [data.hospital_id]);

  return (
    <div className="p-5 bg-gray-200 m-2 rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-text/90">
          Health Center Data
        </h2>
        <Link to="/main/healthcenterform">
          <button
            className="px-3 py-1 text-base rounded-lg font-semibold w-fit border-2 border-primary 
                             bg-blue-900 text-primary hover:bg-primary focus:bg-primary transition-all"
          >
            <span className="align-center text-white">Edit</span>
          </button>
        </Link>
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
  );
};

export default HealthCenterTable;
