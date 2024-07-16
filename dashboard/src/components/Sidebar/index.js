/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { RiHome2Line } from "react-icons/ri";
import { FaRegUser } from "react-icons/fa";
import { MdKeyboardArrowRight } from "react-icons/md";
import { FiSettings } from "react-icons/fi";
import { LiaHospitalSymbolSolid } from "react-icons/lia";
import { BiSolidReport } from "react-icons/bi";
import { MdOutlineSick } from "react-icons/md";
import { Link } from "react-router-dom";

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const data = JSON.parse(localStorage.getItem("user"));
  const [activeItem, setActiveItem] = useState("");

  useEffect(() => {
    const sidebarToggle = document.querySelector(".sidebar-toggle");
    const sidebarOverlay = document.querySelector(".sidebar-overlay");
    const sidebarMenu = document.querySelector(".sidebar-menu");
    const main = document.querySelector(".main");

    if (window.innerWidth < 768) {
      main.classList.toggle("active");
      sidebarOverlay.classList.toggle("hidden");
      sidebarMenu.classList.toggle("-translate-x-full");
    }

    const handleSidebarToggleClick = (e) => {
      e.preventDefault();
      main.classList.toggle("active");
      sidebarOverlay.classList.toggle("hidden");
      sidebarMenu.classList.toggle("-translate-x-full");
    };

    const handleSidebarOverlayClick = (e) => {
      e.preventDefault();
      main.classList.add("active");
      sidebarOverlay.classList.add("hidden");
      sidebarMenu.classList.add("-translate-x-full");
    };

    const handleSidebarDropdownToggleClick = (e) => {
      e.preventDefault();
      const parent = e.target.closest(".group");
      if (parent.classList.contains("selected")) {
        parent.classList.remove("selected");
        setActiveItem("");
      } else {
        document
          .querySelectorAll(".sidebar-dropdown-toggle")
          .forEach((item) => {
            item.closest(".group").classList.remove("selected");
          });
        parent.classList.add("selected");
      }
    };

    if (sidebarToggle) {
      sidebarToggle.addEventListener("click", handleSidebarToggleClick);
    }
    if (sidebarOverlay) {
      sidebarOverlay.addEventListener("click", handleSidebarOverlayClick);
    }
    document.querySelectorAll(".sidebar-dropdown-toggle").forEach((item) => {
      item.addEventListener("click", handleSidebarDropdownToggleClick);
    });

    return () => {
      if (sidebarToggle) {
        sidebarToggle.removeEventListener("click", handleSidebarToggleClick);
      }
      if (sidebarOverlay) {
        sidebarOverlay.removeEventListener("click", handleSidebarOverlayClick);
      }
      document.querySelectorAll(".sidebar-dropdown-toggle").forEach((item) => {
        item.removeEventListener("click", handleSidebarDropdownToggleClick);
      });
    };
  }, []);

  const handleItemClick = ( item) => {
    setActiveItem(item);
  };

  return (
    <>
      <div>
        <div
          className={`fixed left-0 top-0 w-64 h-full bg-gray-900 p-4 z-50 sidebar-menu transition-transform 
            ${isSidebarOpen ? "transform-none" : "-translate-x-full"}`}
        >
          <Link
            to="/main/"
            className="flex items-center pb-4 border-b border-b-gray-800"
          >
            <img
              src="/images/morogoro.png"
              alt
              className="w-8 h-8 rounded object-cover"
            />
            <span className="text-lg font-bold text-white ml-3">
              Health Center
            </span>
          </Link>
          <ul className="mt-4">
            <li className="mb-1 group active">
              <Link
                to="/main"
                className="flex items-center py-2 px-4 text-gray-300 hover:bg-gray-950 hover:text-gray-100 rounded-md group-[.active]:bg-gray-800 group-[.active]:text-white group-[.selected]:bg-gray-950 group-[.selected]:text-gray-100"
              >
                <RiHome2Line className=" mr-3 text-lg" />
                <span className="text-sm">Dashboard</span>
              </Link>
            </li>
            {data.user_type === "admin" && (
              <li className="mb-1 group">
                <Link
                  to="/main/healthcare"
                  className="flex items-center py-2 px-4 text-gray-300 hover:bg-gray-950 hover:text-gray-100 rounded-md group-[.active]:bg-gray-800 group-[.active]:text-white group-[.selected]:bg-gray-950 group-[.selected]:text-gray-100"
                >
                  <LiaHospitalSymbolSolid className=" mr-3 text-lg" />
                  <span className="text-sm">Health Center Info</span>
                </Link>
              </li>
            )}
            {data.user_type === "root" && (
              <li className="mb-1 group">
                <Link
                  // to=""
                  className="flex items-center py-2 px-4 text-gray-300 hover:bg-gray-950 hover:text-gray-100 rounded-md group-[.active]:bg-gray-800 group-[.active]:text-white group-[.selected]:bg-gray-950 group-[.selected]:text-gray-100 sidebar-dropdown-toggle"
                >
                  <FaRegUser className=" mr-3 text-lg" />
                  <span className="text-sm">User Management</span>
                  <MdKeyboardArrowRight className="ml-auto group-[.selected]:rotate-90" />
                </Link>
                <ul className="pl-4 mt-2 hidden group-[.selected]:block">
                  <li className="mb-2">
                    <Link
                      to="/main/addOfficer"
                      className={`py-2 px-2 rounded-md text-gray-300 text-sm flex items-center hover:bg-gray-950 hover:text-gray-100 ${
                        activeItem === "add-officer"
                          ? "bg-gray-950 text-gray-100"
                          : ""
                      }`}
                      onClick={(e) => handleItemClick(e, "add-officer")}
                    >
                      Add User
                    </Link>
                  </li>
                  <li className="mb-4">
                    <Link
                      to="/main/officer"
                      className={`py-2 px-2 rounded-md text-gray-300 text-sm flex items-center hover:bg-gray-950 hover:text-gray-100 ${
                        activeItem === "manage-officers"
                          ? "bg-gray-950 text-gray-100"
                          : ""
                      }`}
                      onClick={(e) => handleItemClick(e, "manage-officers")}
                    >
                      Manage User
                    </Link>
                  </li>
                </ul>
              </li>
            )}
            {(data.user_type === "admin" || data.user_type === "user") && (
              <li className="mb-1 group">
                <Link
                  // to=""
                  className="flex items-center py-2 px-4 text-gray-300 hover:bg-gray-950 hover:text-gray-100 rounded-md group-[.active]:bg-gray-800 group-[.active]:text-white group-[.selected]:bg-gray-950 group-[.selected]:text-gray-100 sidebar-dropdown-toggle"
                >
                  <MdOutlineSick className=" mr-3 text-lg" />
                  <span className="text-sm">Patients</span>
                  <MdKeyboardArrowRight className="ml-auto group-[.selected]:rotate-90" />
                </Link>
                <ul className="pl-4 mt-2 hidden group-[.selected]:block">
                  <li className="mb-2">
                    <Link
                      to="/main/patient"
                      className={`py-2 px-2 rounded-md text-gray-300 text-sm flex items-center hover:bg-gray-950 hover:text-gray-100 ${
                        activeItem === "add-patient"
                          ? "bg-gray-950 text-gray-100"
                          : ""
                      }`}
                      onClick={(e) => handleItemClick(e, "add-patient")}
                    >
                      Manage Patients
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link
                      to="/main/admitedpatient"
                      className={`py-2 px-2 rounded-md text-gray-300 text-sm flex items-center hover:bg-gray-950 hover:text-gray-100 ${
                        activeItem === "admited-patient"
                          ? "bg-gray-950 text-gray-100"
                          : ""
                      }`}
                      onClick={(e) => handleItemClick(e, "admited-patient")}
                    >
                      Admited Patients
                    </Link>
                  </li>
                  {data.user_type ===
                    "admin" && (
                      <li className="mb-4">
                        <Link
                          to="/main/pending"
                          className={`py-2 px-2 rounded-md text-gray-300 text-sm flex items-center hover:bg-gray-950 hover:text-gray-100 ${
                            activeItem === "pending-approval"
                              ? "bg-gray-950 text-gray-100"
                              : ""
                          }`}
                          onClick={(e) =>
                            handleItemClick(e, "pending-approval")
                          }
                        >
                          Pending Approval
                        </Link>
                      </li>
                    )}
                  <li className="mb-4">
                    <Link
                      to="/main/rejectedapproval"
                      className={`py-2 px-2 rounded-md text-gray-300 text-sm flex items-center hover:bg-gray-950 hover:text-gray-100 ${
                        activeItem === "manage-approval"
                          ? "bg-gray-950 text-gray-100"
                          : ""
                      }`}
                      onClick={(e) => handleItemClick(e, "manage-approval")}
                    >
                      Rejected Approval
                    </Link>
                  </li>
                </ul>
              </li>
            )}

            {data.user_type === "root" && (
              <li className="mb-1 group">
                <Link
                  to="/main/choosehospital"
                  className="flex items-center py-2 px-4 text-gray-300 hover:bg-gray-950 hover:text-gray-100 rounded-md group-[.active]:bg-gray-800 group-[.active]:text-white group-[.selected]:bg-gray-950 group-[.selected]:text-gray-100"
                >
                  <BiSolidReport className=" mr-3 text-lg" />
                  <span className="text-sm">Report</span>
                </Link>
              </li>
            )}
            {(data.user_type === "admin" || data.user_type === "user") && (
              <li className="mb-1 group">
                <Link
                  to="/main/choosereporttype"
                  className="flex items-center py-2 px-4 text-gray-300 hover:bg-gray-950 hover:text-gray-100 rounded-md group-[.active]:bg-gray-800 group-[.active]:text-white group-[.selected]:bg-gray-950 group-[.selected]:text-gray-100"
                >
                  <BiSolidReport className=" mr-3 text-lg" />
                  <span className="text-sm">Report</span>
                </Link>
              </li>
            )}
            <hr className="mt-6 border-b-1 border-blueGray-300" />
            <li className="mb-1 group mt-2">
              <Link
                to="/main/settings"
                className="flex items-center py-2 px-4 text-gray-300 hover:bg-gray-950 hover:text-gray-100 rounded-md group-[.active]:bg-gray-800 group-[.active]:text-white group-[.selected]:bg-gray-950 group-[.selected]:text-gray-100"
              >
                <FiSettings className="mr-3 text-lg" />
                <span className="text-sm">Settings</span>
              </Link>
            </li>
          </ul>
        </div>
        <div
          className={`fixed top-0 left-0 w-full h-full bg-black/50 z-40 md:hidden sidebar-overlay ${
            isSidebarOpen ? "block" : "hidden"
          }`}
          onClick={toggleSidebar}
        />
      </div>
    </>
  );
};

export default Sidebar;
