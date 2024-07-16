import React from "react";
import { FaRegEdit } from "react-icons/fa";
import { Link } from "react-router-dom";

const Profile = () => {

  const data = JSON.parse(localStorage.getItem("user"))
  return (
    <>
      <div className="flex flex-col gap-4 mt-4 pl-2 pr-2">
        <div className="flex flex-row items-center gap-4 p-5 border border-text/20 rounded-xl ">
          <img
            src="/images/profile.png"
            alt="Profile of the user"
            className="w-24 aspect-square rounded-full"
          />
          <div className="overflow-hidden text-ellipsis">
            <h2 className="text-xl font-semibold text-text/90">{`${data.first_name} ${data.last_name}`}</h2>
            <h5 className="text-base font-semibold text-text/60">
              {data.email}
            </h5>
          </div>
        </div>
        <div className="flex flex-col gap-4 bg-gray-300 rounded-xl p-5 ">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <h3 className="text-lg font-semibold text-text/90">Name</h3>
            <h5 className="text-base font-semibold text-text/60">
              {`${data.first_name} ${data.last_name}`}
            </h5>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2">
            <h3 className="text-lg font-semibold text-text/90">Email</h3>
            <h5 className="text-base font-semibold text-text/60">
              {data.email}
            </h5>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2">
            <h3 className="text-lg font-semibold text-text/90">Phone</h3>
            <h5 className="text-base font-semibold text-text/60">
              {data.phone}
            </h5>
          </div>
          <div className="grid">
            <Link
              to="/main/settings"
              className="px-3 py-1 text-base rounded-lg font-semibold w-fit border-2 border-primary   
                            text-primary
                            hover:bg-primary focus:bg-primary
                            transition-all
                            text-text
                            bg-blue-900
                            "
            >
              <div className="flex flex-row items-center gap-2 ">
                <span className="align-center text-white">Edit</span>
                <FaRegEdit className="text-white" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
