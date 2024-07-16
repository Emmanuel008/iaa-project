import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { url } from "../../Utills/API";

const Patient = () => {
  const navigate = useNavigate();
  const data = JSON.parse(localStorage.getItem("user"));
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [filteredRows, setFilteredRows] = useState([]);
  const [rows, setRows] = useState([]);

  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [patientToEdit, setPatientToEdit] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${url}/patient/${data.hospital_id}`);
        setRows(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [data.hospital_id]);

  

  useEffect(() => {
    setFilteredRows(
      rows.filter((row) =>
        row.first_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, rows]);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredRows.slice(indexOfFirstRow, indexOfLastRow);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const openDeleteModal = (row) => {
    setSelectedRow(row);
    setDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setDeleteModal(false);
    setSelectedRow(null);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios
        .delete(`${url}/patient/${selectedRow.patient_card_no}`)
        .then(() => {
          setRows(
            rows.filter(
              (row) => row.patient_card_no !== selectedRow.patient_card_no
            )
          );
          setSelectedRow(null); // Clear selectedRow state
          closeDeleteModal();
        });
    } catch (error) {
      console.log("Error deleting row:", error);
      closeDeleteModal();
    }
  };

  // Handle edit modal functions
  const handleOpenEditModal = (patient) => {
    setPatientToEdit({
      ...patient,
    });
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setPatientToEdit(null);
  };

  const handleEditSubmit = async (updateData) => {
    try {
      await axios.put(
        `${url}/patient/${updateData.patient_card_no}`
      )

      const updatedRows = rows.map((row)=>
        row.patient_card_no === updateData.patient_card_no ? updateData : row
      )
      setRows(updatedRows)
      handleCloseEditModal()
    } catch (error) {
      console.log(error);
    }
  };
  const calculateAge = (birthdate) => {
    const birthDate = new Date(birthdate);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    const dayDifference = today.getDate() - birthDate.getDate();

    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
      age--;
    }

    return age;
  };

  const handleAdmit = (data) => {
    localStorage.setItem("patient", JSON.stringify(data));
    navigate("/main/admitpatient");
  };

  return (
    <div className="pt-10 pl-4 pr-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl">Patients</h1>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search by name"
            className="border p-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Link
            to="/main/addpatient"
            className="bg-blue-900 hover:bg-blue-800 text-white py-2 px-4 rounded"
          >
            Add New
          </Link>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-md bg-white shadow-md rounded mb-4">
          <thead>
            <tr>
              <th className="text-left p-3 px-5">Name</th>
              <th className="text-left p-3 px-5">Card No</th>
              <th className="text-left p-3 px-5">Gender</th>
              <th className="text-left p-3 px-5">Age</th>
              <th className="text-left p-3 px-5">Residence</th>
              <th className="text-left p-3 px-5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((row, index) => (
              <tr
                key={index}
                className={`border-b hover:bg-orange-100 ${
                  index % 2 === 0 ? "bg-gray-100" : ""
                }`}
              >
                <td className="p-3 px-5">
                  {`${row.first_name} ${row.last_name}`}
                </td>
                <td className="p-3 px-5">{row.patient_card_no}</td>
                <td className="p-3 px-5">{row.gender}</td>
                <td className="p-3 px-5">{calculateAge(row.birth_date)}</td>
                <td className="p-3 px-5">{row.residence}</td>
                <td className="p-3 px-5 flex">
                  <button
                    type="button"
                    onClick={() => handleAdmit(row)}
                    className="mr-2 text-sm bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                  >
                    Admit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(row)}
                    className="mr-2 text-sm bg-green-500 hover:bg-green-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => openDeleteModal(row)}
                    className="text-sm bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end pr-3">
        <Pagination
          rowsPerPage={rowsPerPage}
          totalRows={filteredRows.length}
          paginate={paginate}
          currentPage={currentPage}
        />
      </div>
      <Modal
        show={deleteModal}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteConfirm}
      />

      <EditModal
        isOpen={showEditModal}
        onClose={handleCloseEditModal}
        onSubmit={handleEditSubmit}
        patientToEdit={patientToEdit}
      />
    </div>
  );
};

const Pagination = ({ rowsPerPage, totalRows, paginate, currentPage }) => {
  const pageNumbers = [];
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="flex pl-0 list-none rounded my-2">
        <li className="page-item">
          <a
            onClick={() => paginate(currentPage - 1 > 0 ? currentPage - 1 : 1)}
            href="#!"
            className="page-link relative block py-1.5 px-3 leading-tight bg-white border border-gray-300 text-gray-800 border-r-0 hover:bg-gray-200"
          >
            &laquo;
          </a>
        </li>
        {pageNumbers.map((number) => (
          <li key={number} className="page-item">
            <a
              onClick={() => paginate(number)}
              href="#!"
              className={`page-link relative block py-1.5 px-3 leading-tight ${
                number === currentPage ? "bg-gray-300" : "bg-white"
              } border border-gray-300 text-gray-800 border-r-0 hover:bg-gray-200`}
            >
              {number}
            </a>
          </li>
        ))}
        <li className="page-item">
          <a
            onClick={() =>
              paginate(
                currentPage + 1 <= totalPages ? currentPage + 1 : totalPages
              )
            }
            href="#!"
            className="page-link relative block py-1.5 px-3 leading-tight bg-white border border-gray-300 text-gray-800 border-r-0 hover:bg-gray-200"
          >
            &raquo;
          </a>
        </li>
      </ul>
    </nav>
  );
};

const Modal = ({ show, onClose, onConfirm }) => {
  console.log(show)
  if (!show) {
    return null;
  }

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
        &#8203;
        <div
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3
                  className="text-lg leading-6 font-medium text-gray-900"
                  id="modal-headline"
                >
                  Delete Patient
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete this Patient? This action
                    cannot be undone.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onConfirm}
            >
              Delete
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const EditModal =({isOpen, onClose, onSubmit, patientToEdit}) =>{

  const [formData, setFormData] = useState({
    patient_card_no: "",
    first_name: "",
    last_name: "",
    residence: "",
    birth_date: ""
  })

  useEffect(()=>{
    if(patientToEdit){
      setFormData({
        patient_card_no: patientToEdit.patient_card_no || "",
        first_name: patientToEdit.first_name || "",
        last_name: patientToEdit.last_name || "",
        residence: patientToEdit.residence || "",
        birth_date: patientToEdit.birth_date || ""
      });
    }
  },[patientToEdit])

  const handleChange = (e) =>{
    const {name, value} = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>

          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <form onSubmit={handleSubmit}>
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-headline"
                    >
                      Edit Patient
                    </h3>
                    <div className="mt-2">
                      <input
                        type="hidden"
                        name="user_id"
                        value={formData.patient_card_no}
                      />
                      <div className="mb-4">
                        <label
                          className="block text-gray-700 text-sm font-bold mb-2"
                          htmlFor="first_name"
                        >
                          First Name
                        </label>
                        <input
                          id="first_name"
                          name="first_name"
                          type="text"
                          value={formData.first_name}
                          onChange={handleChange}
                          required
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                      </div>
                      <div className="mb-4">
                        <label
                          className="block text-gray-700 text-sm font-bold mb-2"
                          htmlFor="last_name"
                        >
                          Last Name
                        </label>
                        <input
                          id="last_name"
                          name="last_name"
                          type="text"
                          value={formData.last_name}
                          onChange={handleChange}
                          required
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                      </div>
                      <div className="mb-4">
                        <label
                          className="block text-gray-700 text-sm font-bold mb-2"
                          htmlFor="phone"
                        >
                          Residence
                        </label>
                        <input
                          id="residence"
                          name="residence"
                          type="text"
                          value={formData.residence}
                          onChange={handleChange}
                          required
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                      </div>
                      <div className="mb-4">
                        <label
                          className="block text-gray-700 text-sm font-bold mb-2"
                          htmlFor="phone"
                        >
                          Birth Date
                        </label>
                        <input
                          id="birth_date"
                          name="birth_date"
                          type="date"
                          value={formData.birth_date.split("T")[0]}
                          onChange={handleChange}
                          required
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                      </div>
                      <div className="mb-4">
                        <label
                          className="block text-gray-700 text-sm font-bold mb-2"
                          htmlFor="user_type"
                        >
                          Gender
                        </label>
                        <select
                          id="gender"
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          required
                          className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                        >
                          <option value="">Select gender</option>
                          <option value="male">Male</option>
                          <option value="female">female</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="submit"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Patient;
