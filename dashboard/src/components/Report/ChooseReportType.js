import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ChooseReportType = () => {
  const [selectedReport, setSelectedReport] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setSelectedReport(e.target.value);
  };

  const handleNext = () => {
    if(selectedReport){
      localStorage.setItem("reportType", JSON.stringify(selectedReport));
      navigate("/main/report");
    }else{
      alert("Please select a report type");
    }
    
  };

  return (
    <div className="p-5  mx-4 mt-4 bg-gray-200 rounded-md ">
      <h2 className="text-xl font-bold mb-4">Choose Report Type</h2>
      <div className="mb-4">
        <label className="block mb-2">
          <input
            type="radio"
            value="Wasting"
            checked={selectedReport === "Wasting"}
            onChange={handleChange}
            className="mr-2"
          />
          Wasting
        </label>
        <label className="block mb-2">
          <input
            type="radio"
            value="Stunting"
            checked={selectedReport === "Stunting"}
            onChange={handleChange}
            className="mr-2"
          />
          Stunting
        </label>
        <label className="block mb-2">
          <input
            type="radio"
            value="Underweight"
            checked={selectedReport === "Underweight"}
            onChange={handleChange}
            className="mr-2"
          />
          Underweight
        </label>
        <label className="block mb-2">
          <input
            type="radio"
            value="Obesity"
            checked={selectedReport === "Obesity"}
            onChange={handleChange}
            className="mr-2"
          />
          Obesity
        </label>
        <label className="block mb-2">
          <input
            type="radio"
            value="Over-weight"
            checked={selectedReport === "Over-weight"}
            onChange={handleChange}
            className="mr-2"
          />
          Over-weight
        </label>
      </div>
      <button
        onClick={handleNext}
        className="bg-blue-500 text-white py-2 px-4 rounded"
      >
        Next
      </button>
    </div>
  );
};

export default ChooseReportType;
