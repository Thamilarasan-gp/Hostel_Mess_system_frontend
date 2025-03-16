import { Routes, Route } from "react-router-dom";
import Signup from "./Auth/Signup";
import Login from "./Auth/Login";
import WardenDashboard from "./warden/WardenDashboard";
import IssueToken from "./warden/IssueToken";
import QRGenerate from "./warden/QRGenerate";
import TokenRecords from "./warden/TokenRecords";
import StudentDashboard from "./Students/StudentDashboard";
import NotFound from "./NotFound";
import AddStudent from "./warden/AddStudent";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Signup />} />
      <Route path="/Login" element={<Login/>} />
      <Route path="/Wardendash" element={<WardenDashboard/>} />
      <Route path="/issuetoken" element={<IssueToken/>} />
      <Route path="/qr" element={<QRGenerate/>} />
      <Route path="/tokenrecords" element={<TokenRecords/>} />
      <Route path="/studentdash" element={<StudentDashboard/>} />
      <Route path="/addstudent" element={<AddStudent/>} />
      <Route path="*" element={<NotFound/>} />
    </Routes>
  );
}

export default App;
