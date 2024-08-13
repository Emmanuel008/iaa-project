import axios from 'axios';
import React, {useState, useEffect} from 'react'
import {useNavigate } from "react-router-dom";
import { url } from '../../Utills/API';
import moment from "moment"


const AdmitedPatient = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const data = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [filteredRows, setFilteredRows] = useState([]);
  const [rows, setRows] = useState([]);

  // State for handling delete modal
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${url}/admiting/admited/${data.hospital_id}`
        );
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
        row.patient.first_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, rows]);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredRows.slice(indexOfFirstRow, indexOfLastRow);

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
      console.log(selectedRow)
      await axios.delete(`${url}/admiting/${selectedRow.admit_id}`);
      setRows(rows.filter((row) => row.admit_id !== selectedRow.admit_id));
      setSelectedRow(null); // Clear selectedRow state
      closeDeleteModal();
    } catch (error) {
      console.log("Error deleting row:", error);
      closeDeleteModal();
    }
  }

  const handleAdmit = (data) => {
    localStorage.setItem("admitedPatient", JSON.stringify(data));
    navigate("/main/test_treatment");
  };
  return (
    <>
      <div className="text-gray-900">
        <div className="p-4 flex justify-between">
          <h1 className="text-xl">Admited Patient</h1>
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
                <th className="text-left p-3 px-5">Card No</th>
                <th className="text-left p-3 px-5">Date</th>
                <th className="text-left p-3 px-5">Status</th>
                <th className="text-left p-3 px-5">Patient Type</th>
                <th className="text-left p-3 px-5">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.map((row, index) => {
                const birthdate = moment(row.patient.birth_date);
                const currentDate = moment();

                // Calculate age in years
                const ageByYear = currentDate.diff(birthdate, "years");
                console.log(ageByYear);
                return (
                  <tr
                    key={index}
                    className={`border-b hover:bg-orange-100 ${
                      index % 2 === 0 ? "bg-gray-100" : ""
                    }`}
                  >
                    <td className="p-3 px-5">
                      {`${row.patient.first_name} ${row.patient.last_name}`}
                    </td>
                    <td className="p-3 px-5">{row.patient_card_no}</td>
                    <td className="p-3 px-5">
                      {new Date(row.createdAt).toLocaleString()}
                    </td>
                    <td className="p-3 px-5">{row.admiting_status}</td>
                    <td className="p-3 px-5">
                      {ageByYear > 45 ? "45+ years" : row.patient_type}
                    </td>
                    <td className="p-3 px-5 flex">
                      <button
                        type="button"
                        onClick={() => handleAdmit(row)}
                        className="mr-2 text-sm bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                      >
                        Test
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
              }
              )}
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
    </>
  );
}

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
                  Delete Admited Patient
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete this Admited Patient? This
                    action cannot be undone.
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
export default AdmitedPatient
