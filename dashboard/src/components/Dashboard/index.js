import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { url } from "../../Utills/API";

const Dashboard = () => {
  const data = JSON.parse(localStorage.getItem("user"))
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [filteredRows, setFilteredRows] = useState([]);
  const [rows, setRows] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const [stats, setStats] = useState([]);

  useEffect(()=>{
    const fetchData = async () => {
      try {
        if(data.user_type === "root"){
          const response = await axios.get(`${url}/stats/systemadmin`);
        setStats(response.data);
        }
        if(data.user_type === "admin"){
          const response = await axios.get(`${url}/stats/pending/${data.hospital_id}`)
          setStats(response.data)
        }
      } catch (error) {
        console.log(error)
      }  
    };
    fetchData()
  },[data.hospital_id, data.user_type])
  useEffect(() => {
    setFilteredRows(
      rows.filter((row) =>
        row.hospital_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, rows]);

  // Get current rows
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const [currentRows, setCurrentRows] = useState([]);
  useEffect(() => {
    setCurrentRows(filteredRows.slice(indexOfFirstRow, indexOfLastRow));
  }, [filteredRows, indexOfFirstRow, indexOfLastRow]);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`${url}/hospital`);
      setRows(response.data);
    };
    fetchData();
  }, []);

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
      await axios.delete(`${url}/hospital/${selectedRow.hospital_id}`);
      setRows(
        rows.filter((row) => row.hospital_id !== selectedRow.hospital_id)
      ); // Remove deleted row from state
      setSelectedRow(null); // Clear selectedRow state
      closeDeleteModal();
    } catch (error) {
      console.log("Error deleting row:", error);
      closeDeleteModal();
    }
  };

  const openEditModal = (row) => {
    setEditData(row);
    setEditModal(true);
  };

  const closeEditModal = () => {
    setEditModal(false);
    setEditData(null);
  };

  const handleEditSubmit = async (updatedData) => {
    try {
      await axios.put(
        `${url}/hospital/${updatedData.hospital_id}`,
        updatedData
      );
      const updatedRows = rows.map((row) =>
        row.hospital_id === updatedData.hospital_id ? updatedData : row
      );
      setRows(updatedRows);
      closeEditModal();
    } catch (error) {
      console.log("Error updating row:", error);
      closeEditModal();
    }
  };

  return (
    <div className="pt-10 pl-4 pr-4">
      {data.user_type === "root" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded shadow">
            <div className="flex items-center">
              <i className="iconoir-activity text-3xl text-blue-500" />
              <div className="ml-4">
                <p className="text-gray-600 uppercase">Total Health Center</p>
                <p className="text-2xl font-bold">{stats.hospitalsCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <div className="flex items-center">
              <i className="iconoir-user text-3xl text-green-500" />
              <div className="ml-4">
                <p className="text-gray-600 uppercase">
                  Total HEALTH Center Officer
                </p>
                <p className="text-2xl font-bold">{stats.adminUsersCount}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {data.user_type === "admin" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded shadow">
            <div className="flex items-center">
              <i className="iconoir-activity text-3xl text-blue-500" />
              <div className="ml-4">
                <p className="text-gray-600 uppercase">
                  Total Admited Patients
                </p>
                <p className="text-2xl font-bold">{stats.pendingTestsCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <div className="flex items-center">
              <i className="iconoir-user text-3xl text-green-500" />
              <div className="ml-4">
                <p className="text-gray-600 uppercase">Total Treated Patient</p>
                <p className="text-2xl font-bold">{stats.rejectedTestsCount}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      {data.user_type === "root" && (
        <>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl">Health Care Center</h1>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search by name"
                className="border p-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Link
                to="/main/addhospital"
                className="bg-blue-900 hover:bg-blue-800 text-white py-2 px-4 rounded"
              >
                Add New
              </Link>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-md bg-white shadow-md rounded mb-4">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 px-5">Name</th>
                  <th className="text-left p-3 px-5">District</th>
                  <th className="text-left p-3 px-5">Region</th>
                  <th className="text-left p-3 px-5">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentRows &&
                  currentRows.map((row, index) => {
                    return (
                      <tr
                        key={index}
                        className={`border-b hover:bg-orange-100 ${
                          index % 2 === 0 ? "bg-gray-100" : ""
                        }`}
                      >
                        <td className="p-3 px-5">{row.hospital_name}</td>
                        <td className="p-3 px-5">{row.hospital_district}</td>
                        <td className="p-3 px-5">{row.hospital_region}</td>

                        <td className="p-3 px-5 flex">
                          <button
                            type="button"
                            className="mr-2 text-sm bg-green-500 hover:bg-green-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                            onClick={() => openEditModal(row)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="text-sm bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                            onClick={() => openDeleteModal(row)}
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
        </>
      )}
      <EditModal
        show={editModal}
        onClose={closeEditModal}
        onSubmit={handleEditSubmit}
        initialData={editData}
      />

      <Modal
        show={deleteModal}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteConfirm}
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
          <button
            onClick={() => paginate(currentPage - 1 > 0 ? currentPage - 1 : 1)}
            className="page-link relative block py-1.5 px-3 leading-tight bg-white border border-gray-300 text-gray-800 border-r-0 hover:bg-gray-200"
          >
            &laquo;
          </button>
        </li>
        {pageNumbers.map((number) => (
          <li key={number} className="page-item">
            <button
              onClick={() => paginate(number)}
              className={`page-link relative block py-1.5 px-3 leading-tight ${
                number === currentPage ? "bg-gray-300" : "bg-white"
              } border border-gray-300 text-gray-800 border-r-0 hover:bg-gray-200`}
            >
              {number}
            </button>
          </li>
        ))}
        <li className="page-item">
          <button
            onClick={() =>
              paginate(
                currentPage + 1 <= totalPages ? currentPage + 1 : totalPages
              )
            }
            className="page-link relative block py-1.5 px-3 leading-tight bg-white border border-gray-300 text-gray-800 hover:bg-gray-200"
          >
            &raquo;
          </button>
        </li>
      </ul>
    </nav>
  );
};

const EditModal = ({ show, onClose, onSubmit, initialData }) => {
  const [editValues, setEditValues] = useState({
    hospital_id: initialData?.hospital_id || "",
    hospital_name: initialData?.hospital_name || "",
    hospital_district: initialData?.hospital_district || "",
    hospital_region: initialData?.hospital_region || "",
  });

  useEffect(() => {
    setEditValues({
      hospital_id: initialData?.hospital_id || "",
      hospital_name: initialData?.hospital_name || "",
      hospital_district: initialData?.hospital_district || "",
      hospital_region: initialData?.hospital_region || "",
    });
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSubmit(editValues);
  };

  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center  bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded  w-96 shadow-lg">
        <h2 className="text-lg mb-4">Edit Health Center</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="hospital_name"
              value={editValues.hospital_name}
              onChange={handleChange}
              className="border-2 border-gray-300 p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              District
            </label>
            <input
              type="text"
              name="hospital_district"
              value={editValues.hospital_district}
              onChange={handleChange}
              className="border-2 border-gray-300 p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Region
            </label>
            <input
              type="text"
              name="hospital_region"
              value={editValues.hospital_region}
              onChange={handleChange}
              className="border-2 border-gray-300 p-2 w-full"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 bg-gray-500 hover:bg-gray-700 text-white py-1 px-3 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Modal = ({ show, onClose, onConfirm }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-lg">
        <h2 className="text-lg mb-4">Confirm Delete</h2>
        <p>Are you sure you want to delete this hospital?</p>
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="mr-2 bg-gray-500 hover:bg-gray-700 text-white py-1 px-3 rounded"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
