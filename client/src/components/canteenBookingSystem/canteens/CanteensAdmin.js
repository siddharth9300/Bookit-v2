import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom"
import axios from 'axios';
import LoadingSpinner from "../../LoadingSpinner";
import { toast } from "react-toastify";
// import BookingForm from "./BookingForm";

const CanteensAdmin = () => {
  const navigate = useNavigate();
  const [canteenData, setCanteenData] = useState({});
    const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  // const [authStatus, setAuthStatus] = useState("");
  const [showModal,setShowModal]=useState(false);
  const [selectedCanteenId, setSelectedCanteenId] = useState("");
  const [selectedCanteenName, setSelectedCanteenName] = useState("");

  const callAboutPage = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/about`, {
        withCredentials: true, 
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      });
      const data = response.data;
      //consolelog(data);
      setUserData(data);
      console.log(data);
      setIsLoading(false);
      if (response.status !== 200) {
        throw new Error(response.error);
      }
    } catch (error) {
      if (error.response.status === 401) {
        toast.warn("Unauthrized Access! Please Login!", {
          toastId: 'Unauthrized'
      })
        navigate("/login");
      }
    }
  };
  // useEffect(() => {
  //   callAboutPage()
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])


  const getCanteensData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/canteen-booking-system/canteens`, {
        withCredentials: true, // include credentials in the request
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      });

      const data = response.data;
      // console.log(data);
      setCanteenData(data.canteens);
      setIsLoading(false);

      if (response.status !== 200) {
        throw new Error(response.error);
      }
    } catch (error) {
      // console.log(error);
      // navigate("/login");
    }
  };



  useEffect(() => {
  callAboutPage()
    getCanteensData();

  }, [])


  
  const handleDeleteClick = async (canteenId) => {
    // e.preventDefault();


    try {
      const response = await axios.delete (`${process.env.REACT_APP_SERVER_URL}/canteen-booking-system/canteens/${canteenId}`,

        {
          withCredentials: true, // To include credentials in the request
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;

      if (!data) {
        toast.error("Request not send!")
        // console.log("Message not send");
      } else {
        getCanteensData();
        toast.success("Menu Item Deleted Successfull!")
        // alert("Message send");
        setShowModal(false);
        setSelectedCanteenId("");
        setSelectedCanteenName("");
        navigate("/canteen-booking-system/canteens")
        // setBookingData({ ...bookingData });
      }
    } catch (error) {
      if (error.response.status === 422 && error.response) {
        const data = error.response.data;
        // setAuthStatus(data.error);
        // console.log(data.error);
        // window.alert(data.error);
      } else {
        console.error(error);
      }
      // console.log(error);
    }
  };


  const handleBookingClick = (canteenId, canteenName) => {
    navigate(`/canteen-booking-system/bookingForm/${canteenId}/${canteenName}`)
  };

  const handleEditClick = (canteenId, canteenName) => {
    navigate(`/canteen-booking-system/canteens/${canteenId}/${canteenName}`)
  };


  // const canteenId =canteenData.canteenId
  // const canteenName = canteenData.canteenName

  // const handleBookingClick = (canteenId,canteenName) => {
  //   navigate('/bookingForm', { state: { canteenId, canteenName } });

  // };


  // const handleBookingClick = () => {
  //   sendData(data);
  // };
  const handleDeleteModal = (canteenId, canteenName) => {
    setSelectedCanteenId(canteenId);
    setSelectedCanteenName(canteenName);
    setShowModal(true);
  };

  return (
<>{isLoading ? (
          <LoadingSpinner />
        ) : 
    <div className="mt-6 min-h-screen"> 
    
   <div className="py-5 md:py-0 flex container mx-auto px-6 justify-between  items-center">
   <div className="mx-auto ">
    <h1 className="text-xl  sm:text-3xl md:text-4xl lg:text-3xl xl:text-3xl text-center text-gray-800 font-black leading-7 ml-3 md:leading-10">
   Available <span className="text-indigo-700"> Menu Items</span>  </h1>

   </div>
   <Link to="/canteen-booking-system/canteenForm">
            <button className="flex self-end bg-indigo-700 lg:text-lg lg:font-bold   md:block  hover:bg-indigo-500 rounded border border-indigo-700 text-white  sm:px-8 py-1 sm:py-3 text-sm">
              Create Menu Item</button>
          </Link>
   </div>
   <div className="grid  grid-cols-1 gap-4  md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
      {Array.isArray(canteenData) && canteenData.length > 0 ? (
        canteenData.map((canteen) => (
          <div key={canteen._id} className="my-2 ">

<div className="flex w-full items-center justify-center ">
                  <div class="max-w-sm  overflow-hidden  rounded-xl  shadow-2xl shadow-blue-300">
                    <img
                       class="w-full h-72"
                      src={`${process.env.REACT_APP_SERVER_URL}/${canteen.photo}`}
                      alt="menu item"
                    />
                      <div class=" px-6 py-4 font-bold text-xl mb-2 my-2">{canteen.name}</div>
                    {/* <div class="px-6 py-4"> */}
                      {/* <div className="mt-6 grid grid-cols-2 gap-6 text-center lg:text-left">
                        <div>
                          <p className="font-bold text-zinc-700">Number</p>
                        </div>

                        <div>
                          <p className="text-m font-semibold text-zinc-700">
                            {canteen.number}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 grid grid-cols-2 gap-6 text-center lg:text-left">
                        <div>
                          <p className="font-bold text-zinc-700">Capacity</p>
                        </div>

                        <div>
                          <p className="text-m font-semibold text-zinc-700">
                            {canteen.capacity}+1
                          </p>
                        </div>
                      </div> */}
                    {/* </div> */}
                    <div className="my-6  grid grid-cols-3 mx-auto">
                    <button className="rounded-xl w-4/5 px-3 py-2 mx-auto  bg-indigo-700 hover:bg-indigo-600 focus:shadow-outline focus:outline-none text-white font-bold"
                        onClick={() => handleBookingClick(canteen._id, canteen.name)}
                      >
                        Book Menu Item
                      </button>
                    {userData.email === process.env.REACT_APP_MASTER_ADMIN_EMAIL || userData.email === canteen.canteenCreater  ? 
                   <>
                      <button className="rounded-xl w-4/5 px-3 py-2 mx-auto  bg-blue-700 hover:bg-blue-600 focus:shadow-outline focus:outline-none text-white font-bold"
                        onClick={() => handleEditClick(canteen._id, canteen.name)}
                      >
                        Edit Menu Item
                      </button>

                      <button className="rounded-xl w-4/5 px-3 py-2 mx-auto  bg-red-700 hover:bg-red-600 focus:shadow-outline focus:outline-none text-white font-bold"
                       
                        onClick={() =>
                          handleDeleteModal(canteen._id, canteen.name)
                        }
                        >
                        Delete Menu Item
                      </button>
                        </>

                    : <></>}
                 
                    </div>
                  </div>
                </div>

                
            {/* <div className="flex w-full items-center justify-center">
              <div className="w-full rounded-xl p-12 shadow-2xl shadow-blue-200 md:w-8/12 lg:w-8/12 bg-white">

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                 
                  <div className="col-span-1 lg:col-span-9">
                    <div className="text-center lg:text-left">
                      <h2 className="text-2xl font-bold text-zinc-700">{canteen.name}</h2>
                
                    </div>

                  

                    <div className="mt-6 grid grid-cols-2 gap-6 text-center lg:text-left">
                      <div>
                        <p className="font-bold text-zinc-700">Number</p>
                      </div>

                      <div>
                        <p className="text-m font-semibold text-zinc-700">{canteen.number}</p>
                      </div>
                    </div>



                    <div className="mt-6 grid grid-cols-2 gap-6 text-center lg:text-left">
                      <div>
                        <p className="font-bold text-zinc-700">Capacity</p>
                      </div>

                      <div>
                        <p className="text-m font-semibold text-zinc-700">{canteen.capacity}</p>
                      </div>
                    </div>


                    <div className="mt-6 grid grid-cols-2 gap-6 text-center lg:text-left">
                      <div>
                        <p className="font-bold text-zinc-700">Photo</p>
                      </div>

                      <div>
                      <img src={`${process.env.REACT_APP_SERVER_URL}/${canteen.photo}`} alt="photos"  />
                        
                      </div>
                    </div>

                    









                    <div className="mt-6 grid grid-cols-3 gap-4">
                     
                      <button className="w-full rounded-xl border-2 border-blue-500 bg-white px-3 py-2 font-semibold text-blue-500 hover:bg-blue-500 hover:text-white"
                        onClick={() => handleBookingClick(canteen._id, canteen.name)}
                      >
                        Book Now
                      </button>
                    {userData.email === process.env.REACT_APP_MASTER_ADMIN_EMAIL || userData.email === canteen.canteenCreater  ? 
                   <>
                      <button className="w-full rounded-xl border-2 border-blue-500 bg-white px-3 py-2 font-semibold text-blue-500 hover:bg-blue-500 hover:text-white"
                        onClick={() => handleEditClick(canteen._id, canteen.name)}
                      >
                        Edit Menu Item
                      </button>

                      <button className="w-full rounded-xl border-2 border-red-500 bg-white px-3 py-2 font-semibold text-red-500 hover:bg-red-500 hover:text-white"
                       
                        onClick={() =>
                          handleDeleteModal(canteen._id, canteen.name)
                        }
                        >
                        Delete Menu Item
                      </button>
                        </>

                    : <></>}
                      
                    </div>


                  </div>
                </div>
              </div>
            </div> */}
          </div>
        

      
        

        ))
      ) : (
        <h2 className="text-2xl font-bold text-zinc-700  text-center mt-10">No canteens found.</h2>

      )}

      </div>
      </div>
}

  
{/* 
      {
        showModal &&
              
        <div class="bg-slate-800 bg-opacity-50 flex justify-center items-center absolute top-0 right-0 bottom-0 left-0">
            <div class="bg-white px-16 py-14 rounded-md text-center">
              <h1 class="text-xl mb-4 font-bold text-slate-500">Do you Want Delete</h1>
              <button onClick={() => handleDeleteClick(canteen._id, canteen.name)} class="bg-indigo-500 px-7 py-2 ml-2 rounded-md text-md text-white font-semibold">Ok</button>
              <button onClick={() => setShowModal(false)} class="bg-red-500 px-4 py-2 rounded-md text-md text-white">Cancel</button>
            </div>
          </div>
        
      } */}

{showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg px-8 py-6">
            <h2 className="text-lg font-bold mb-4">
              Are you sure you want to delete {selectedCanteenName}?
            </h2>
            <div className="flex justify-end">
              <button
                className="mr-2 px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-lg focus:outline-none"
                onClick={() =>
                  handleDeleteClick(selectedCanteenId)
                }
              >
                Delete
              </button>
              <button
                className="px-4 py-2 text-white bg-gray-500 hover:bg-gray-600 rounded-lg focus:outline-none"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
        </>
  );
  
};

export default CanteensAdmin;
