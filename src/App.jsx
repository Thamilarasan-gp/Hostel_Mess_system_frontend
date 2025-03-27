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
import StudentLogin from "./Auth/StudentLogin";
import AddTimetable from "./MessStaff/AddTimetable";
import AddFood from "./MessStaff/AddFood";
import FoodList from "./MessStaff/FoodList";
import AddReview from "./MessStaff/AddReview";
import ReviewList from "./MessStaff/ReviewList";
import AddMess from "./warden/AddMess";
import MessDashboard from "./MessStaff/MessDashboard";
import LoginMess from "./Auth/LoginMess";
import GetFoodItems from "./Students/GetFoodItems";
import ReviewStatus from "./Students/ReviewStatus";

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
      <Route path="/studentlogin" element={<StudentLogin/>} />
     
      <Route path="/footlist" element={<FoodList/>} />
        <Route path="/add-timetable" element={<AddTimetable />} />
        <Route path="/add-food" element={<AddFood />} />
        <Route path="/add-review/:foodItemId" element={<AddReview />} />
        <Route path="/reviews/:foodItemId" element={<ReviewList />} />
   <Route path="/addMess" element={<AddMess/>}/>
   <Route path="/mess-dashboard" element={<MessDashboard/>}/>
    <Route path="/messLogin" element={<LoginMess/>}/>
     <Route path="/getfooditems" element={<GetFoodItems/>}/>
       <Route path="/reviewsstatus/:foodItemId" element={<ReviewStatus/>} />
    
      <Route path="*" element={<NotFound/>} />
    </Routes>
  );
}

export default App;
