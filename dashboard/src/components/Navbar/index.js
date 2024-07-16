/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useState} from "react";
import { FiMenu } from "react-icons/fi";
import { IoIosNotifications } from "react-icons/io";
import { createPopper } from "@popperjs/core";
import { Link } from "react-router-dom";
import axios from "axios";
import { url } from "../../Utills/API";
import { useNavigate } from "react-router-dom";
const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const clearStorageAndCookies = () => {
    localStorage.clear();

    const cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;`;
    }
    navigate("/")
  };
  const data = JSON.parse(localStorage.getItem("user"))
    const [stats, setStats] = useState([]);

    useEffect(()=>{
      const fetchData =async ()=>{
        try {
          if (data.user_type === "admin") {
            await axios.get(`${url}/stats/pending/${data.hospital_id}`)
            .then((res)=>{
              setStats(res.data)
            })
          }
          if(data.user_type === "user"){
            await axios
              .get(`${url}/stats/rejected/${data.hospital_id}`)
              .then((res) => {
                setStats(res.data);
              });
          }
        } catch (error) {
          console.log(error)
        }
      }
      fetchData()
    },[data.hospital_id, data.user_type])

    console.log(stats)
   useEffect(() => {
     const popperInstance = {};
     document.querySelectorAll(".dropdown").forEach(function (item, index) {
       const popperId = "popper-" + index;
       const toggle = item.querySelector(".dropdown-toggle");
       const menu = item.querySelector(".dropdown-menu");
       if(menu){
       menu.dataset.popperId = popperId;
       popperInstance[popperId] = createPopper(toggle, menu, {
         modifiers: [
           {
             name: "offset",
             options: {
               offset: [0, 8],
             },
           },
           {
             name: "preventOverflow",
             options: {
               padding: 24,
             },
           },
         ],
         placement: "bottom-end",
       });
      }
     });

     const handleDocumentClick = (e) => {
       const toggle = e.target.closest(".dropdown-toggle");
       const menu = e.target.closest(".dropdown-menu");
       if (toggle) {
         const menuEl = toggle
           .closest(".dropdown")
           .querySelector(".dropdown-menu");
         const popperId = menuEl.dataset.popperId;
         if (menuEl.classList.contains("hidden")) {
           hideDropdown();
           menuEl.classList.remove("hidden");
           showPopper(popperId);
         } else {
           menuEl.classList.add("hidden");
           hidePopper(popperId);
         }
       } else if (!menu) {
         hideDropdown();
       }
     };

     const hideDropdown = () => {
       document.querySelectorAll(".dropdown-menu").forEach(function (item) {
         item.classList.add("hidden");
       });
     };

     const showPopper = (popperId) => {
       popperInstance[popperId].setOptions(function (options) {
         return {
           ...options,
           modifiers: [
             ...options.modifiers,
             { name: "eventListeners", enabled: true },
           ],
         };
       });
       popperInstance[popperId].update();
     };

     const hidePopper = (popperId) => {
       popperInstance[popperId].setOptions(function (options) {
         return {
           ...options,
           modifiers: [
             ...options.modifiers,
             { name: "eventListeners", enabled: false },
           ],
         };
       });
     };

     document.addEventListener("click", handleDocumentClick);

     return () => {
       document.removeEventListener("click", handleDocumentClick);
     };
   }, []);
  return (
    <>
      <div className="py-2 px-6 bg-white flex items-center shadow-md shadow-black/5 sticky top-0 left-0 z-30">
        <button
          type="button"
          className="text-lg text-gray-600 sidebar-toggle"
          onClick={toggleSidebar}
        >
          <FiMenu />
        </button>
        <ul className="flex items-center text-sm ml-4">
          <li className="mr-2">
            <a
              href="/main"
              className="text-gray-400 hover:text-gray-600 font-medium"
            >
              Dashboard
            </a>
          </li>
        </ul>
        <ul className="ml-auto flex items-center">
          {(data.user_type === "admin" || data.user_type === "user") && (
            <li className="dropdown">
              <button
                type="button"
                className="dropdown-toggle text-gray-400 w-8 h-8 rounded flex items-center justify-center hover:bg-gray-50 hover:text-gray-600"
              >
                <IoIosNotifications />
              </button>
              <div className="dropdown-menu shadow-md shadow-black/5 z-30 hidden max-w-xs w-full bg-white rounded-md border border-gray-100">
                <div className="flex items-center px-4 pt-4 border-b border-b-gray-100 notification-tab">
                  <button
                    type="button"
                    data-tab="notification"
                    data-tab-page="notifications"
                    className="text-gray-400 font-medium text-[13px] hover:text-gray-600 border-b-2 border-b-transparent mr-4 pb-1 active"
                  >
                    Notifications
                  </button>
                </div>
                <div className="my-2">
                  <ul
                    className="max-h-64 overflow-y-auto"
                    data-tab-for="notification"
                    data-page="notifications"
                  >
                    {data.user_type === "admin" && (
                      <li>
                        <a
                          href="/main/pending"
                          className="py-2 px-4 flex items-center hover:bg-gray-50 group"
                        >
                          <div className="ml-2">
                            <div className="text-[13px] text-gray-600 font-medium truncate group-hover:text-blue-500">
                              {stats.pendingTestsCount} pending Approval
                            </div>
                            <div className="text-[11px] text-gray-400">
                              from a Health Officer
                            </div>
                          </div>
                        </a>
                      </li>
                    )}
                    {(data.user_type === "user" ||
                      data.user_type === "admin") && (
                      <li>
                        <a
                          href="/main/rejectedapproval"
                          className="py-2 px-4 flex items-center hover:bg-gray-50 group"
                        >
                          <div className="ml-2">
                            <div className="text-[13px] text-gray-600 font-medium truncate group-hover:text-blue-500">
                              {stats.rejectedTestsCount} Rejected Approval
                            </div>
                            <div className="text-[11px] text-gray-400">
                              from a In-charge Officer
                            </div>
                          </div>
                        </a>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </li>
          )}
          <li className="dropdown ml-3">
            <button type="button" className="dropdown-toggle flex items-center">
              <img
                src="/images/profile.png"
                alt
                className="w-8 h-8 rounded block object-cover align-middle"
              />
            </button>
            <ul className="dropdown-menu shadow-md shadow-black/5 z-30 hidden py-1.5 rounded-md bg-white border border-gray-100 w-full max-w-[140px]">
              <li>
                <Link
                  to="/main/profile"
                  className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                >
                  Profile
                </Link>
              </li>
              <li>
                <div
                  onClick={clearStorageAndCookies}
                  className="flex cursor-pointer items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                >
                  Logout
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Navbar;
