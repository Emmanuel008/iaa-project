import React, {useState, useEffect} from 'react'
import axios from 'axios';
import { url } from '../../../Utills/API';
import { useNavigate } from 'react-router-dom';
const ChooseHopistal = () => {
    const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [filteredRows, setFilteredRows] = useState([]);
  const [rows, setRows] = useState([]);

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

  const handleChoose = (data)=>{
    localStorage.setItem("hospital",JSON.stringify(data));
    navigate("/main/choosereporttype");
  }
  return (
    <div className="pt-10 pl-4 pr-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl">Choose Hospital</h1>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search by name"
            className="border p-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
                        onClick={() => handleChoose(row)}
                      >
                        Choose
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
export default ChooseHopistal
