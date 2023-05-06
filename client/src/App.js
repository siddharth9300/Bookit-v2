import "./App.css";
import { Routes, Route } from "react-router-dom";
import { createContext, useReducer } from "react";
// importing components
import Navbar from "./components/Navbar";
// import Home from "./components/Home";
import About from "./components/About";
import Contact from "./components/Contact";
import Signup from "./components/auth/Signup";
import Logout from "./components/auth/Logout";
import Login from "./components/auth/Login";
import ErrorPage from "./components/ErrorPage";
import Halls from "./components/halls/Halls";
import BookingForm from "./components/bookings/BookingForm";
import BookingsAdmin from "./components/bookings/BookingsAdmin";
import BookingsHod from "./components/bookings/BookingsHod";

import AdminDashboard from "./components/dashboard/AdminDashboard";
import FacultyDashboard from "./components/dashboard/FacultyDashboard";
import BookingByUserId from "./components/bookings/BookingsByUserId";
import Footer from "./components/Footer";
import HallsAdmin from "./components/halls/HallsAdmin";
import { initialState, reducer } from "./reducer/UseReducer";



import {  ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HallsEdit from "./components/halls/HallsEdit";
import HallForm from "./components/halls/HallForm";
import HodDashboard from "./components/dashboard/HodDashboard";


export const UserContext = createContext();
const App = () => {


    const [state, dispatch] = useReducer(reducer, initialState)



  return (

    <>

      <UserContext.Provider value={{ state, dispatch }}>


        <Navbar />
        <Routes>
        <Route path="/" element={state.userType === "admin" ? <AdminDashboard /> : state.userType === "faculty" ? <FacultyDashboard /> : state.userType === "hod" ? <HodDashboard /> : <FacultyDashboard />} />
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/halls" element={state.userType === "admin" ? <HallsAdmin/> : <Halls />}/>
          <Route exact path="/halls/:hallId/:hallName" element={<HallsEdit />} />
          <Route path="/hallForm" element={<HallForm />} />
          <Route path="/bookings" element={state.userType === "admin" ? <BookingsAdmin/> : state.userType === "faculty" ? <BookingByUserId/> : state.userType === "hod" ? <BookingsHod/>  : <Halls />} />
          <Route exact path="/bookingForm/:hallId/:hallName" element={<BookingForm />} />
          {/* <Route path="/bookings" element={<Booking/>} /> */}

   

          <Route path="/*" element={<ErrorPage />} />
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