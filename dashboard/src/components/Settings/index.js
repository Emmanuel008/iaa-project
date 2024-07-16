import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";

const Settings = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("");

  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location]);

  return (
    <>
      <div
        role="tablist"
        aria-orientation="horizontal"
        className="flex flex-row pl-2 mt-5 whitespace-wrap"
      >
        <Link
          to="/main/settings"
          id="headlessui-tabs-tab-78"
          role="tab"
          aria-selected={activeTab === "/main/settings"}
          tabIndex={0}
          className={`px-4 py-2 border-b-2 transition-all ${
            activeTab === "/main/settings"
              ? "border-blue-900 text-blue-900"
              : "border-transparent"
          }`}
          aria-controls="headlessui-tabs-panel-81"
        >
          Accounts
        </Link>
        <Link
          to="/main/settings/security"
          id="headlessui-tabs-tab-79"
          role="tab"
          aria-selected={activeTab === "/main/settings/security"}
          tabIndex={-1}
          className={`px-4 py-2 border-b-2 transition-all ${
            activeTab === "/main/settings/security"
              ? "border-blue-900 text-blue-900"
              : "border-transparent"
          }`}
        >
          Security
        </Link>
      </div>
      <Outlet />
    </>
  );
};

export default Settings;
