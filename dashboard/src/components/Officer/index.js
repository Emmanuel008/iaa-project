/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { url } from "../../Utills/API";
import axios from "axios";

const Officer = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [filteredRows, setFilteredRows] = useState([]);
  const [rows, setRows] = useState([]);
  const [hospitalOptions, setHospitalOptions] = useState([]); // New state for hospital options
  const [meta, setMeta] = useState({
    totalUsers: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: 15,
  });

  // State for handling delete modal
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  // State for handling edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${url}/user/all?page=${meta.currentPage}&pageSize=${meta.pageSize}`
        );
        const { users, meta: responseMeta } = res.data;
        setRows(users);
        console.log(users)
        setMeta(responseMeta);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [meta.currentPage, meta.pageSize]);

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await axios.get(`${url}/hospital`);
        setHospitalOptions(response.data);
      } catch (error) {
        console.error("Error fetching hospitals:", error);
      }
    };

    fetchHospitals();
  }, []);

  useEffect(() => {
    setFilteredRows(
      rows.filter((row) =>
        row.first_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, rows]);

  // Get current rows
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredRows.slice(indexOfFirstRow, indexOfLastRow);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle delete modal functions
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
      await axios.delete(`${url}/user/${selectedRow.user_id}`);
      setRows(rows.filter((row) => row.user_id !== selectedRow.user_id)); // Remove deleted row from state
      setSelectedRow(null); // Clear selectedRow state
      closeDeleteModal();
    } catch (error) {
      console.log("Error deleting row:", error);
      closeDeleteModal();
    }
  };

  // Handle edit modal functions
  const handleOpenEditModal = (employee) => {
    setEmployeeToEdit({
      ...employee,
      hospital_name: hospitalOptions.find(
        (h) => h.hospital_id === employee.hospital_id
      )?.hospital_name,
    });
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEmployeeToEdit(null);
  };

  const handleEditSubmit = async (updatedData) => {
    try {
      const updatedEmployee = {
        ...updatedData,
        hospital: {
          hospital_id: updatedData.hospital_id,
          hospital_name: hospitalOptions.find(
            (h) => h.hospital_id === updatedData.hospital_id
          )?.hospital_name,
        },
      };

      await axios.put(
        `${url}/user/${updatedEmployee.user_id}`,
        updatedEmployee
      );

      const updatedRows = rows.map((row) =>
        row.user_id === updatedEmployee.user_id ? updatedEmployee : row
      );

      setRows(updatedRows);
      handleCloseEditModal();
    } catch (error) {
      console.log(error);
      handleCloseEditModal();
    }
  };

  return (
    <>
      <div className="text-gray-900">
        <div className="p-4 flex justify-between">
          <h1 className="text-xl">Users</h1>
          <input
            type="text"
            placeholder="Search by name"
            className="border p-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="overflow-x-auto p-5">
          <table className="w-full text-md bg-white shadow-md rounded mb-4">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 px-5">Name</th>
                <th className="text-left p-3 px-5">Email</th>
                <th className="text-left p-3 px-5">Check Number</th>
                <th className="text-left p-3 px-5">Phone Number</th>
                <th className="text-left p-3 px-5">Role</th>
                <th className="text-left p-3 px-5">Healthcare Center</th>
                <th className="text-left p-3 px-5">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.map((row, index) => {
                return (
                  <tr
                    key={index}
                    className={`border-b hover:bg-orange-100 ${
                      index % 2 === 0 ? "bg-gray-100" : ""
                    }`}
                  >
                    <td className="p-3 px-5">
                      {`${row.first_name} ${row.last_name}`}
                    </td>
                    <td className="p-3 px-5">{row.email}</td>
                    <td className="p-3 px-5">{row.checkNumber}</td>
                    <td className="p-3 px-5">{row.phone}</td>
                    <td className="p-3 px-5">{row.user_type === "admin" && "Health Center Officer"}</td>
                    <td className="p-3 px-5">{row.hospital?.hospital_name}</td>
                    <td className="p-3 px-5 flex">
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
                );
              })}
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
        employeeToEdit={employeeToEdit}
        hospitalOptions={hospitalOptions} // Pass hospitalOptions as a prop
      />
    </>
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
                  Delete Employee
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete this employee? This action
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

const EditModal = ({
  isOpen,
  onClose,
  onSubmit,
  employeeToEdit,
  hospitalOptions,
}) => {
  const [formData, setFormData] = useState({
    user_id: "",
    first_name: "",
    last_name: "",
    phone: "",
    user_type: "",
    hospital_id: "",
  });

  useEffect(() => {
    if (employeeToEdit) {
      setFormData({
        user_id: employeeToEdit.user_id || "",
        first_name: employeeToEdit.first_name || "",
        last_name: employeeToEdit.last_name || "",
        phone: employeeToEdit.phone || "",
        user_type: employeeToEdit.user_type || "",
        hospital_id: employeeToEdit.hospital?.hospital_id || "",
      });
    }
  }, [employeeToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
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
                    Edit Employee
                  </h3>
                  <div className="mt-2">
                    <input
                      type="hidden"
                      name="user_id"
                      value={formData.user_id}
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
                        Phone
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="text"
                        value={formData.phone}
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
                        Role
                      </label>
                      <select
                        id="user_type"
                        name="user_type"
                        value={formData.user_type}
                        onChange={handleChange}
                        required
                        className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                      >
                        <option value="">Select role</option>
                        <option value="admin">Admin</option>
                        <option value="user">user</option>
                      </select>
                    </div>
                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="hospital_id"
                      >
                        Healthcare Center
                      </label>
                      <select
                        id="hospital_id"
                        name="hospital_id"
                        value={formData.hospital_id}
                        onChange={handleChange}
                        required
                        className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                      >
                        <option value="">Select Healthcare Center</option>
                        {hospitalOptions.map((hospital) => (
                          <option
                            key={hospital.hospital_id}
                            value={hospital.hospital_id}
                          >
                            {hospital.hospital_name}
                          </option>
                        ))}
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
  );
};

export default Officer;
