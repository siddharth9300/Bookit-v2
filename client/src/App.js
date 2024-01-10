import "./App.css";
import { Routes, Route } from "react-router-dom";
import { createContext, useReducer } from "react";
// importing components
import axios from "axios"
import Navbar from "./components/Navbar";
// import Home from "./components/Home";
import About from "./components/About";
import Contact from "./components/Contact";
import Signup from "./components/auth/Signup";
import Logout from "./components/auth/Logout";
import Login from "./components/auth/Login";
import ErrorPage from "./components/ErrorPage";
import Footer from "./components/Footer";

import { initialState, reducer } from "./reducer/UseReducer";
import {  ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PasswordReset from "./components/auth/PasswordReset";

import ForgotPassword from "./components/auth/ForgotPassword";
import VerifySuccess from "./components/auth/VerifySuccess";
// import Unauthorized from "./components/Unauthorized";
import HallBookingRoutes from "./routes/HallBookingRoutes";
import TransportBookingRoutes from "./routes/TransportBookingRoutes";
import CanteenBookingRoutes from "./routes/CanteenBookingRoutes";

import MasterPage from "./components/MasterPage";







// import Halls from "./components/halls/Halls";
// import BookingForm from "./components/hallBookings/BookingForm";
// import BookingsAdmin from "./components/hallBookings/BookingsAdmin";
// import BookingsHod from "./components/hallBookings/BookingsHod";
// import AdminDashboard from "./components/dashboard/AdminDashboard";
// import FacultyDashboard from "./components/dashboard/FacultyDashboard";
// import BookingFaculty from "./components/hallBookings/BookingsFaculty";
// import HallsAdmin from "./components/halls/HallsAdmin";
// import { CalendarView } from "./components/CalendarView";
// import HallsEdit from "./components/halls/HallsEdit";
// import HallForm from "./components/halls/HallForm";
// import HodDashboard from "./components/dashboard/HodDashboard";
// import BookingUpdateFrom from "./components/hallBookings/BookingUpdateForm"
// import Events from "./components/hallBookings/Events";
// import BookingsView from "./components/hallBookings/BookingView";


export const UserContext = createContext();
const App = () => {


      const token = (localStorage.getItem("jwtoken"))


      axios.defaults.headers.common['authorization'] = `Bearer ${token}`;
  
      axios.defaults.withCredentials = true;
  
    
    const [state, dispatch] = useReducer(reducer, initialState)
console.log(state)


  return (

    <>

      <UserContext.Provider value={{ state, dispatch }}>


        {/* <Navbar /> */}
        <Routes>

        <Route path="/" element={state.user ? <MasterPage /> : <Login />} />


        {/* <Route path="/" element={ <MasterPage /> } /> */}

        <Route path="/hall-booking-system/*" element={<HallBookingRoutes />} />
        <Route path="/transport-booking-system/*" element={<TransportBookingRoutes />} />
        <Route path="/canteen-booking-system/*" element={<CanteenBookingRoutes />} />
          <Route path="/profile" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/passwordReset" element={<PasswordReset />} />
          <Route path="/forgotPassword/:id/:token" element={<ForgotPassword />} />
          <Route path="/verifyEmail/:id/:token" element={<VerifySuccess/>} />       
          <Route path="/*" element={<ErrorPage />} />
          
          
          
          {/* Hall booking routes starts here 


          <Route path="/" element={state.userType === "admin" ? <AdminDashboard /> : state.userType === "faculty" ? <FacultyDashboard /> : process.env.REACT_APP_HOD_FEATURE &&  state.userType === "hod" ? <HodDashboard />  : <Login />} />
          <Route path="/events" element={<Events />} />
          <Route path="/calendar" element={<CalendarView />} />
          <Route path="/halls" element={state.userType === "admin" ? <HallsAdmin/> : <Halls />}/>
          <Route exact path="/halls/:hallId/:hallName" element={state.userType === "admin" ?<HallsEdit /> : <Unauthorized />} />
          <Route exact path="/bookingsEdit/:bookingId" element={state.userType === "admin" ? <BookingUpdateFrom/>  : process.env.REACT_APP_HOD_FEATURE &&  state.userType === "hod" ? <BookingUpdateFrom/>  : <Unauthorized />} />
          <Route path="/hallForm" element={state.userType === "admin" ?<HallForm /> : <Unauthorized />} />
          <Route path="/bookings" element={state.userType === "admin" ? <BookingsAdmin/> : state.userType === "faculty" ? <BookingFaculty/> :  process.env.REACT_APP_HOD_FEATURE && state.userType === "hod" ? <BookingsHod/>  : <Unauthorized />} />
          <Route exact path="/bookingForm/:hallId/:hallName" element={<BookingForm />} />
          <Route exact path="/bookingsView/:bookingId" element={<BookingsView/>} />
          
          
          Hall booking routes ends here */}
   

        </Routes>
        
      <Footer/>
      </UserContext.Provider>


      <ToastContainer
        position="bottom-left"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default App;
