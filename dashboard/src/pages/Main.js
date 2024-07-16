import React, { useEffect, useState } from "react";
import { url } from "../Utills/API";
import axios from "axios";
import {Outlet} from "react-router-dom"
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
const Main = () => {
  axios.defaults.withCredentials = true;
  useEffect(() => {
    try {
      axios.get(`${url}/user`).then((res) => {
        if (!res.data.status) {
          window.location.href = "/";
        }
      });
    } catch (error) {
      console.log(error)
    }
  }, []);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <>
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <main
        className={`w-full md:w-[calc(100%-256px)] md:ml-64 bg-gray-50 min-h-screen transition-all main ${!isSidebarOpen && "active"}`}
      >
        <Navbar toggleSidebar={toggleSidebar} />
        <Outlet/>
      </main>
    </>
  );
};

export default Main;
