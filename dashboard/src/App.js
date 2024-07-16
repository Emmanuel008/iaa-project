import React, {useEffect} from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login"
import Main from "./pages/Main";
import Dashboard from "./components/Dashboard";
import Officer from "./components/Officer";
import AddOfficer from "./components/Officer/AddOfficer";
import Profile from "./components/Settings/Profile";
import ChangePassword from "./components/Settings/ChangePassword";
import Settings from "./components/Settings";
import EditProfile from "./components/Settings/EditProfile";
import AddHospital from "./components/Hospital/AddHospital";
import HealthCenter from "./components/HealthCenter";
import Form from "./components/HealthCenter/Form";
import Patient from "./components/Patients";
import AddPatients from "./components/Patients/AddPatients";
import AdmitPatient from "./components/Patients/AdmitPatient";
import AdmitedPatient from "./components/Patients/AdmitedPatient";
import TestAndTreatement from "./components/Patients/TestAndTreatement";
import Pending from "./components/Approval/Pending";
import Approve from "./components/Approval/Approve";
import RejectedPatientData from "./components/Approval/RejectedPatientData";
import EditRejectedPatient from "./components/Approval/EditRejectedPatient";
import ChooseHopistal from "./components/Report/RootAdminReport/ChooseHopistal";
import ChooseReportType from "./components/Report/ChooseReportType";
import ViewReport from "./components/Report/ViewReport";

function App() {
  const data = JSON.parse(localStorage.getItem("user"))
  
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/main" element={<Main />}>
            <Route path="/main" element={<Dashboard />} />
            {/* root */}
            {data && data.user_type === "root" && (
              <>
                <Route path="/main/officer" element={<Officer />} />
                <Route path="/main/addOfficer" element={<AddOfficer />} />
                <Route path="/main/addhospital" element={<AddHospital />} />
                <Route
                  path="/main/choosehospital"
                  element={<ChooseHopistal />}
                />
              </>
            )}
            {/* health care admin */}
            {data && data.user_type === "admin" && (
              <>
                <Route path="/main/healthcare" element={<HealthCenter />} />
                <Route path="/main/healthcenterform" element={<Form />} />
              </>
            )}
            {/* admin and user */}
            {data && (data.user_type === "admin" || data.user_type === "user") && (
              <>
                <Route path="/main/patient" element={<Patient />} />
                <Route path="/main/addpatient" element={<AddPatients />} />
                <Route path="/main/admitpatient" element={<AdmitPatient />} />
                <Route
                  path="/main/admitedpatient"
                  element={<AdmitedPatient />}
                />
                <Route
                  path="/main/test_treatment"
                  element={<TestAndTreatement />}
                />
                <Route path="/main/pending" element={<Pending />} />
                <Route path="/main/approveresult" element={<Approve />} />
                <Route
                  path="rejectedapproval"
                  element={<RejectedPatientData />}
                />
                <Route
                  path="/main/editrejected"
                  element={<EditRejectedPatient />}
                />
              </>
            )}
            {/*  all users */}
            <Route path="/main/choosereporttype" element={<ChooseReportType/>} />
            <Route path="/main/report" element={<ViewReport/>} />
            <Route path="/main/profile" element={<Profile />} />
            <Route path="/main/settings" element={<Settings />}>
              <Route path="/main/settings" element={<EditProfile />} />
              <Route
                path="/main/settings/security"
                element={<ChangePassword />}
              />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
