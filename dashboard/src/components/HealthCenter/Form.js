import React, { useState, useEffect } from "react";
import axios from "axios";
import { url } from "../../Utills/API";
import { useNavigate } from "react-router-dom";

const Form = () => {
 
  const data = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [formData, setFormData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(
          `${url}/hospitalinfo/${data.hospital_id}`
        );
        setFormData(result.data)
        console.log(result.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [data.hospital_id]);


  const handleChange = (index, answer) => {
    const updatedFormData = [...formData];
    updatedFormData[index].answer = answer;
    setFormData(updatedFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Replace with your backend API endpoint
      await axios
        .put(`${url}/hospitalinfo/`, {
          hospital_id: data.hospital_id, // Replace with the actual hospital ID
          questions: formData,
        })
        .then(() => {
          navigate("/main/healthcare");
        });

    } catch (error) {
      console.error("Error submitting form data:", error);
      alert("Failed to submit form data. Please try again.");
    }
  };

  return (
    <div className="p-5 bg-gray-200 m-2 rounded-xl">
      <h2 className="text-xl font-semibold text-text/90">
        To be completed by Health Center In-Charge Officer
      </h2>
      <h6 className="text-sm font-thin text-text/60">
        It’s Mandatory and should be filled once not every time, maybe if
        changes occur
      </h6>

      <form className="flex flex-col gap-4 mt-4" onSubmit={handleSubmit}>
        {formData.map((item, index) => (
          <div key={index} className="flex flex-col gap-2">
            <label className="font-semibold text-gray-900 text-base">
              {index + 1}. {item.question}
            </label>
            <div>
              <label>
                <input
                  type="radio"
                  name={`q${index + 1}`}
                  value="yes"
                  checked={item.answer === "yes"}
                  onChange={() => handleChange(index, "yes")}
                />
                Yes
              </label>
              <label className="ml-4">
                <input
                  type="radio"
                  name={`q${index + 1}`}
                  value="no"
                  checked={item.answer === "no"}
                  onChange={() => handleChange(index, "no")}
                />
                No
              </label>
            </div>
          </div>
        ))}

        <button
          type="submit"
          className="px-3 py-1 text-base rounded-lg font-semibold w-fit border-2 border-primary 
                      bg-blue-900 text-primary hover:bg-primary focus:bg-primary transition-all mt-4"
        >
          <div className="flex flex-row items-center gap-2">
            <span className="align-center text-white">Submit</span>
          </div>
        </button>
      </form>
    </div>
  );
};

export default Form;
