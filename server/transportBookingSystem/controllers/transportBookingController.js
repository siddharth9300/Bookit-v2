const TransportBooking = require("../model/transportBookingSchema");
const Transport = require("../model/transportSchema");
const User = require("../../authService/model/userSchema");
const nodemailer = require("nodemailer");
const e = require("express");

// transporter for sending email
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_PASSWORD,
  },
});

const generateBookingEmailTemplate = (
  eventName,
  eventDate,
  selfOrGuest,
  noOfPerson,
  eventDateType,
  eventStartDate,
  eventEndDate,
  bookedTransportName,
  bookedTransportNumber,
  organizingClub,
  institution,
  department,
  bookingId
) => {
  return `


  
  <head>
  <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
  <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">
  <style>
    a,
    a:link,
    a:visited {
      text-decoration: none;
      color: #00788a;
    }
  
    a:hover {
      text-decoration: underline;
    }
  
    h2,
    h2 a,
    h2 a:visited,
    h3,
    h3 a,
    h3 a:visited,
    h4,
    h5,
    h6,
    .t_cht {
      color: #000 !important;
    }
  
    .ExternalClass p,
    .ExternalClass span,
    .ExternalClass font,
    .ExternalClass td {
      line-height: 100%;
    }
  
    .ExternalClass {
      width: 100%;
    }
  </style>
  </head>
  
  <body style="font-size: 1.25rem;font-family: 'Roboto', sans-serif;padding-left:20px;padding-right:20px;padding-top:20px;padding-bottom:20px; background-color: #FAFAFA; width: 75%; max-width: 1280px; min-width: 600px; margin-right: auto; margin-left: auto">
  <table cellpadding="12" cellspacing="0" width="100%" bgcolor="#FAFAFA" style="border-collapse: collapse;margin: auto">

    <tbody>
    <tr>
      <td style="padding: 50px; background-color: #fff; max-width: 660px">
        <table width="100%" style="">
          <tr>
            <td style="text-align:center">
            <h1 style="font-size: 30px; color: #4f46e5; margin-top: 0;">New Transport Booking Request</h1> 
            <h1 style="font-size: 30px; color: #202225; margin-top: 0;">Hello Admin</h1>
              <p style="font-size: 18px; margin-bottom: 30px; color: #202225; max-width: 60ch; margin-left: auto; margin-right: auto">A new booking has been requested on our platform. Please review the booking details provided below and click the button to view the booking.</p>
               <h1 style="font-size: 25px;text-align: left; color: #202225; margin-top: 0;">Booking Details</h1>
              <div style="text-align: justify; margin:20px; display: flex;">
                
                <div style="flex: 1; margin-right: 20px;">
                  <h1 style="font-size: 20px; color: #202225; margin-top: 0;">EVENT NAME	 :</h1>
                  <h1 style="font-size: 20px; color: #202225; margin-top: 0;">VEHICLE NAME	 :</h1>
                    <h1 style="font-size: 20px; color: #202225; margin-top: 0;">VEHICLE NO.	 :</h1>
                  <h1 style="font-size: 20px; color: #202225; margin-top: 0;">ORGANIZING CLUB	 :</h1>
                  <h1 style="font-size: 20px; color: #202225; margin-top: 0;">INSTITUTION :</h1>
                       <h1 style="font-size: 20px; color: #202225; margin-top: 0;">DEPARTMENT :</h1>
                       ${
                         eventDateType === "full" || eventDateType === "half"
                           ? `<h1 style="font-size: 20px; color: #202225; margin-top: 0;">Date:</h1>`
                           : `<h1 style="font-size: 20px; color: #202225; margin-top: 0;">From: </h1><h1 style="font-size: 20px; color: #202225; margin-top: 0;">To: </h1>`
                       }

                

                   <h1 style="font-size: 20px; color: #202225; margin-top: 0;">SELF / GUEST :</h1>
                  <h1 style="font-size: 20px; color: #202225; margin-top: 0;">NO. OF PERSON :</h1>
                </div>
                <div style="flex: 1;">
                  <h1 style="font-size: 20px; color: #202225; margin-top: 0;">${eventName}</h1>
                  <h1 style="font-size: 20px; color: #202225; margin-top: 0;">${bookedTransportName}</h1>
               <h1 style="font-size: 20px; color: #202225; margin-top: 0;">${bookedTransportNumber}</h1>
                     
                  <h1 style="font-size: 20px; color: #202225; margin-top: 0;">${organizingClub}</h1>
                  <h1 style="font-size: 20px; color: #202225; margin-top: 0;">${institution}</h1>
                       <h1 style="font-size: 20px; color: #202225; margin-top: 0;">${department}</h1>
${
  eventDateType === "full" || eventDateType === "half"
    ? `<h1 style="font-size: 20px; color: #202225; margin-top: 0;">${eventDate}</h1>`
    : `<h1 style="font-size: 20px; color: #202225; margin-top: 0;">${eventStartDate}</h1> <h1 style="font-size: 20px; color: #202225; margin-top: 0;">${eventEndDate}</h1>`
}
             

                  <h1 style="font-size: 20px; color: #202225; margin-top: 0;">${selfOrGuest}</h1>
                   <h1 style="font-size: 20px; color: #202225; margin-top: 0;">${noOfPerson}</h1>
                  
                </div>
              </div>
              
              <a href="${
                process.env.CLIENT_URL
              }/bookingsView/${bookingId}" style="background-color: #4f46e5; color: #fff; padding: 8px 24px; border-radius: 8px; border-style: solid; border-color: #4f46e5; font-size: 14px; text-decoration: none; cursor: pointer">View Booking</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </tbody>

  </table>
  </body>


  `;
};

const createTransportBooking = async (req, res, next) => {
  try {
    const {
      userId,
      eventManager,
      department,
      institution,
      eventName,
      eventDateType,
      eventDate,
      eventStartDate,
      eventEndDate,
      startTime,
      endTime,
      email,
      bookedTransportId,
      bookedTransportName,
      selfOrGuest,
      noOfPerson,
      naneOfGuest,
      mobNoOfGuest,

      pickupLocation,
      dropLocation,
      organizingClub,
      phoneNumber,
      altNumber,
      isApproved,
    } = req.body;

    const transport = await Transport.findById(bookedTransportId);
    if (!transport) {
      return res.status(422).json({ error: "Transport not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(422).json({ error: "user not found" });
    }

    if (eventDateType === "full" && eventDateType === "half") {
      if (!eventDate) {
        return res.status(422).json({ error: "Please fill all details" });
      }
    } else if (eventDateType === "multiple") {
      if (!eventStartDate || !eventStartDate) {
        return res.status(422).json({ error: "Please fill all details" });
      }
    }

    const eventStartDateTime = new Date(eventStartDate);
    const eventEndDateTime = new Date(eventEndDate);

    if (eventEndDateTime <= eventStartDateTime) {
      return res
        .status(422)
        .json({ error: "Event end date should be after event start date" });
    }

    // Validate start and end time
    //  const startDateTime = new Date(`2000-01-01T${startTime}:00Z`);
    //  const endDateTime = new Date(`2000-01-01T${endTime}:00Z`);

    //  const startDateTime = new Date(startTime);
    //  const endDateTime = new Date(endTime);

    //  // Check if end time is after start time
    //  if (endDateTime <= startDateTime) {
    //    return res
    //      .status(422)
    //      .json({ error: "End time should be after start time" });
    //  }

    if (
      !eventManager ||
      !phoneNumber ||
      !department ||
      !institution ||
      !startTime ||
      !endTime ||
      !selfOrGuest ||
      // || !altNumber
      !eventName ||
      !organizingClub ||
      !pickupLocation ||
      !dropLocation ||
      !noOfPerson
    ) {
      return res.status(422).json({ error: "Please fill all details" });
    }

    if (selfOrGuest === "guest") {
      if (!naneOfGuest || !mobNoOfGuest) {
        return res.status(422).json({ error: "Please fill all details" });
      } else if (mobNoOfGuest.length !== 10) {
        return res.status(422).json({
          error: "Please enter a valid 10-digit phone number of Guest",
        });
      }
    }
    // Regular expression to validate full name with at least two words separated by a space

    const nameRegex =
      /^[\w'.]+\s[\w'.]+\s*[\w'.]*\s*[\w'.]*\s*[\w'.]*\s*[\w'.]*$/;

    if (!nameRegex.test(eventManager)) {
      return res
        .status(422)
        .json({ error: "Please enter your full Event Coordinator name" });
    }

    // Phone validation
    if (phoneNumber.length !== 10) {
      return res
        .status(422)
        .json({ error: "Please enter a valid 10-digit phone number" });
    }

    // if (altNumber.length !== 10) {
    //   return res.status(422).json({ error: "Please enter a valid 10-digit alternate number" });
    // }

    const booking = new TransportBooking({
      userId: user._id,
      institution,
      department,
      eventManager,
      eventName,
      eventDateType,
      eventDate,
      eventStartDate,
      eventEndDate,
      startTime,
      endTime,
      email,
      bookedTransportId: transport._id,
      bookedTransport: transport,
      bookedTransportName,
      selfOrGuest,
      noOfPerson,
      naneOfGuest,
      mobNoOfGuest,
      pickupLocation,
      dropLocation,
      organizingClub,
      // eventDetailFile,
      // eventDetailText,
      phoneNumber,
      altNumber,
      isApproved,
    });
    // await booking.validate();
    // booking.bookedTransportId = transport;
    // await booking.populate(bookedTransportId);
    await booking.save();
    console.log(booking);

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: transport.transportCreater, // Use the transport creator's email here
      subject: "New Booking Request",
      html: generateBookingEmailTemplate(
        eventName,
        eventDate,
        selfOrGuest,
        noOfPerson,
        eventDateType,
        eventStartDate,
        eventEndDate,
        bookedTransportName,
        transport.number,
        organizingClub,
        institution,
        department,
        booking._id
      ),
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    res.status(201).json({ message: "Booking created successfully" });
  } catch (error) {
    next(error);
  }
};

const getTransportEvents = async (req, res, next) => {
  try {
    const bookings = await TransportBooking.find({
      isApproved: "Approved By Admin",
    }).populate("bookedTransportId");

    res.json({ bookings });
  } catch (error) {
    next(error);
  }
};

const getTransportBookings = async (req, res, next) => {
  try {
    const bookings = await TransportBooking.find()
      .populate("bookedTransportId")
      .populate("userId");

    res.json({ bookings });
  } catch (error) {
    next(error);
  }
};

const getTransportBookingById = async (req, res, next) => {
  // console.log("function called");

  try {
    const { bookingId } = req.params;
    const booking = await TransportBooking.findById(bookingId)
      .populate("bookedTransportId")
      .populate("userId");
    // console.log(booking);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json({ booking });
  } catch (error) {
    next(error);
  }
};

const getTransportBookingByUserId = async (req, res, next) => {
  try {
    // const { userId } = req.params;
    const userId = req.rootUser._id;
    const booking = await TransportBooking.find({ userId })
      .populate("bookedTransportId")
      .populate("userId");
    // if (!mongoose.Types.ObjectId.isValid(userId)) {
    //   return res.status(400).json({ message: 'Invalid userId' });
    // }
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.json({ booking });
  } catch (error) {
    next(error);
  }
};

const getTransportBookingAdmin = async (req, res, next) => {
  try {
    let statusArray = [
      "Approved By HOD",
      "Approved By Admin",
      "Rejected By Admin",
    ];
    const adminEmail = req.rootUser.email;
    const userId = req.rootUser._id;
    // console.log("admin bookng");
    // console.log(adminEmail);
    if (process.env.REACT_APP_HOD_FEATURE != "true") {
      statusArray.unshift("Request Sent"); // Add "Request Sent" at the beginning if HOD feature is on
    }

    const bookings = await TransportBooking.find({
      isApproved: { $in: statusArray },
      $or: [
        { email: adminEmail },
        // Add other conditions as needed
        { "bookedTransport.transportCreater": adminEmail },
      ],
    })
      .populate("bookedTransportId")
      .populate("userId");
    // console.log(bookings);
    res.json({ bookings });
  } catch (error) {
    next(error);
  }
};

const getTransportBookingHod = async (req, res, next) => {
  const hodDepartment = req.rootUser.department;
  // console.log(hodDepartment);
  try {
    const bookings = await TransportBooking.find({
      department: hodDepartment,
    }).populate("bookedTransportId");

    res.json({ bookings });
  } catch (error) {
    next(error);
  }
};

const updateTransportBooking = async (req, res, next) => {
  try {
    const { bookingId } = req.params;

    const {
      eventManager,

      eventName,
      eventDateType,
      eventStartDate,
      eventEndDate,
      eventDate,
      startTime,
      endTime,
      selfOrGuest,
      noOfPerson,
      naneOfGuest,
      mobNoOfGuest,
      nameOfDriver,
      mobNoOfDriver,
      pickupLocation,
      dropLocation,
      // email,

      // bookedTransportId,
      // transportId,
      rejectionReason,
      isApproved,
    } = req.body;

    // const transport = await Transport.findById(transportId);
    // if (!transport) {
    //   return res.status(404).json({ message: 'Transport not found' });
    // }

    // if(isApproved === "Approved By Admin"){
    //   if(!nameOfDriver || !mobNoOfDriver){
    //     return res.status(422).json({ error: "Please fill all details" });
    //   } else if (mobNoOfDriver.length !== 10) {
    //     return res.status(422).json({ error: "Please enter a valid 10-digit phone number of Driver" });
    //   }
    // }

    const booking = await TransportBooking.findByIdAndUpdate(
      bookingId,
      {
        eventName,
        eventDate,
        startTime,
        endTime,
        eventDateType,
        eventStartDate,
        eventEndDate,
        selfOrGuest,
        noOfPerson,
        naneOfGuest,
        mobNoOfGuest,
        nameOfDriver,
        mobNoOfDriver,
        pickupLocation,
        dropLocation,
        //  transportId: transport._id,email,
        isApproved,
        rejectionReason,
      },
      { new: true }
    ).populate("bookedTransportId");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    console.log(booking);

    // Send email based on the updated approval status

    if (isApproved === "Approved By Admin") {
      // Send email for approval
      sendApprovalEmail(booking, bookingId);
    } else if (isApproved === "Rejected By Admin") {
      // Send email for rejection
      sendRejectionEmail(booking, bookingId, rejectionReason);
    }

    res.json({ message: "Booking updated successfully", booking });
  } catch (error) {
    next(error);
  }
};

const sendApprovalEmail = async (booking, bookingId) => {
  try {
    console.log("this is send approveal email asdasdasdasddddddddddddd");
    console.log(booking);

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: process.env.SENDER_EMAIL, // Use the user's email associated with the booking
      subject: "Booking Request Approved",
      html: sendApprovalEmailTemplate(
        booking.nameOfDriver,
        booking.mobNoOfDriver,
        booking.bookedTransportName,
        booking.bookedTransport.number,
        booking.bookedTransport.capacity,
        // booking.bookedTransport.photo,
        booking.eventName,
        booking.organizingClub,
        booking.institution,
        booking.department,
        booking.eventDate,
        booking.selfOrGuest,
        booking.noOfPerson,
        // booking.eventDateType,
        // booking.eventStartDate,
        // booking.eventEndDate,
        bookingId,




       
      ),
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
};

const sendRejectionEmail = async (booking, bookingId, rejectionReason) => {
  try {
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: process.env.SENDER_EMAIL, // Use the user's email associated with the booking
      subject: "Booking Request Rejected",
      html: sendRejectionEmailTemplate(
        booking.eventName,
        booking.bookedTransportName,
        booking.organizingClub,
        booking.institution,
        booking.department,
        bookingId,
        rejectionReason
      ),
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

const sendRejectionEmailTemplate = (
  eventName,
  bookedTransportName,
  organizingClub,
  institution,
  department,
  bookingId,
  rejectionReason
) => {
  return `
    

      <head>
      <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
      <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">
      <style>
        a,
        a:link,
        a:visited {
          text-decoration: none;
          color: #00788a;
        }
      
        a:hover {
          text-decoration: underline;
        }
      
        h2,
        h2 a,
        h2 a:visited,
        h3,
        h3 a,
        h3 a:visited,
        h4,
        h5,
        h6,
        .t_cht {
          color: #000 !important;
        }
      
        .ExternalClass p,
        .ExternalClass span,
        .ExternalClass font,
        .ExternalClass td {
          line-height: 100%;
        }
      
        .ExternalClass {
          width: 100%;
        }
      </style>
      </head>
      
      <body style="font-size: 1.25rem;font-family: 'Roboto', sans-serif;padding-left:20px;padding-right:20px;padding-top:20px;padding-bottom:20px; background-color: #FAFAFA; width: 75%; max-width: 1280px; min-width: 600px; margin-right: auto; margin-left: auto">
      <table cellpadding="12" cellspacing="0" width="100%" bgcolor="#FAFAFA" style="border-collapse: collapse;margin: auto">
  
        <tbody>
        <tr>
          <td style="padding: 50px; background-color: #fff; max-width: 660px">
            <table width="100%" style="">
              <tr>
                <td style="text-align:center">
                 
                  <h1 style="font-size: 30px; color: #ef4444; margin-top: 0;">Booking Request Rejected</h1>
                  
                  <h1 style="font-size: 30px; color: #202225; margin-top: 0;">Hello User</h1>
                  <p style="font-size: 18px; margin-bottom: 30px; color: #202225; max-width: 60ch; margin-left: auto; margin-right: auto">Your booking request has been rejected due to following reason. Please review the booking details provided below and click the button below to view the booking.</p>
                    <h1 style="font-size: 25px;text-align: left; color: #202225; margin-top: 0;">Reason for Rejection</h1>
                  <p style="font-size: 18px; margin-bottom: 30px; color: #202225; max-width: 60ch; text-align: left;">${rejectionReason}</p>
                   <h1 style="font-size: 25px;text-align: left; color: #202225; margin-top: 0;">Booking Details</h1>
                  
                  <div style="text-align: justify; margin:20px; display: flex;">
                    
                    <div style="flex: 1; margin-right: 20px;">
                      <h1 style="font-size: 20px; color: #202225; margin-top: 0;">EVENT NAME	 :</h1>
                      <h1 style="font-size: 20px; color: #202225; margin-top: 0;">TRANSPORT NAME	 :</h1>
                      <h1 style="font-size: 20px; color: #202225; margin-top: 0;">ORGANIZING CLUB	 :</h1>
                      <h1 style="font-size: 20px; color: #202225; margin-top: 0;">INSTITUTION :</h1>
                           <h1 style="font-size: 20px; color: #202225; margin-top: 0;">DEPARTMENT :</h1>
                     
                    </div>
                    <div style="flex: 1;">
                    <h1 style="font-size: 20px; color: #202225; margin-top: 0;">${eventName}</h1>
                    <h1 style="font-size: 20px; color: #202225; margin-top: 0;">${bookedTransportName}</h1>
                    <h1 style="font-size: 20px; color: #202225; margin-top: 0;">${organizingClub}</h1>
                    <h1 style="font-size: 20px; color: #202225; margin-top: 0;">${institution}</h1>
                         <h1 style="font-size: 20px; color: #202225; margin-top: 0;">${department}</h1>
                
                  </div>
                  </div>
                  
                  <a href="${process.env.CLIENT_URL}/bookingsView/${bookingId}"  style="background-color: #4f46e5; color: #fff; padding: 8px 24px; border-radius: 8px; border-style: solid; border-color: #4f46e5; font-size: 14px; text-decoration: none; cursor: pointer">View Booking</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </tbody>
  
      </table>
      </body>
  
  
  
      `;
};

const sendApprovalEmailTemplate = (
  nameOfDriver,
  mobNoOfDriver,
  bookedTransportName,
  bookedTransportNumber,
  bookedTransportCapacity,
  // bookedTransportPhoto,
  eventName,
  organizingClub,
  institution,
  department,
  eventDate,
  selfOrGuest,
  noOfPerson,
  // eventDateType,
  // eventStartDate,
  // eventEndDate,
  bookingId,
 
  ) => {
  return `
    
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">
    <style>
        a,
        a:link,
        a:visited {
            text-decoration: none;
            color: #00788a;
        }

        a:hover {
            text-decoration: underline;
        }

        h2,
        h2 a,
        h2 a:visited,
        h3,
        h3 a,
        h3 a:visited,
        h4,
        h5,
        h6,
        .t_cht {
            color: #000 !important;
        }

<<<<<<< HEAD
        .ExternalClass p,
        .ExternalClass span,
        .ExternalClass font,
        .ExternalClass td {
            line-height: 100%;
        }

        .ExternalClass {
            width: 100%;
        }
    </style>
</head>

<body style="font-size: 1.25rem;font-family: 'Roboto', sans-serif;padding-left:20px;padding-right:20px;padding-top:20px;padding-bottom:20px; background-color: #FAFAFA; width: 75%; max-width: 1280px; min-width: 600px; margin-right: auto; margin-left: auto">
    <table cellpadding="12" cellspacing="0" width="100%" bgcolor="#FAFAFA" style="border-collapse: collapse;margin: auto">
        <tbody>
            <tr>
                <td style="padding: 50px; background-color: #fff; max-width: 660px">
                    <table width="100%" style="">
                        <tr>
                            <td style="text-align:center">
                                <h1 style="font-size: 30px; color: #16a34a; margin-top: 0;">Booking Request Approved</h1>
                                <h1 style="font-size: 30px; color: #202225; margin-top: 0;">Hello User</h1>
                                <p style="font-size: 18px; margin-bottom: 30px; color: #202225; max-width: 60ch; margin-left: auto; margin-right: auto">Your booking request has been approved. Please review the booking details provided below and click the button below to view the booking.</p>
                                <h1 style="font-size: 25px;text-align: left; color: #202225; margin-top: 0;">Driver Details</h1>
                                <table style="width: 100%;">
                                    <tr>
                                        <td style="font-size: 20px; color: #202225; margin-top: 0; text-align: left;">Driver Name:</td>
                                        <td style="font-size: 20px; color: #202225; margin-top: 0; text-align: left;">${nameOfDriver}</td>
                                    </tr>
                                    <tr>
                                        <td style="font-size: 20px; color: #202225; margin-top: 0; text-align: left;">Mobile No.:</td>
                                        <td style="font-size: 20px; color: #202225; margin-top: 0; text-align: left;">${mobNoOfDriver}</td>
                                    </tr>
                                </table>
                                <table width="100%" style="">
                        <tr>
                            <br>
                                <h1 style="font-size: 25px;text-align: left; color: #202225; margin-top: 0;">Transport Details</h1>
                                <table style="width: 100%;">
                                    <tr>
                                        <td style="font-size: 20px; color: #202225; margin-top: 0; text-align: left;">Transport Name:</td>
                                        <td style="font-size: 20px; color: #202225; margin-top: 0; text-align: left;">${bookedTransportName}</td>
                                    </tr>
                                    <tr>
                                        <td style="font-size: 20px; color: #202225; margin-top: 0; text-align: left;">Number:</td>
                                        <td style="font-size: 20px; color: #202225; margin-top: 0; text-align: left;"> ${bookedTransportNumber}</td>
                                    </tr>
 <tr>
                                        <td style="font-size: 20px; color: #202225; margin-top: 0; text-align: left;">Capacity:</td>
                                        <td style="font-size: 20px; color: #202225; margin-top: 0; text-align: left;"> ${bookedTransportCapacity}</td>
                                    </tr>
                                  
                                </table>
                          <br>
<table width="100%" style="">
                        <tr>
                            
                                <h1 style="font-size: 25px;text-align: left; color: #202225; margin-top: 0;">Booking Details</h1>
                                <table style="width: 100%;">
                                    <tr>
                                        <td style="font-size: 20px; color: #202225; margin-top: 0; text-align: left;">EVENT NAME:</td>
                                        <td style="font-size: 20px; color: #202225; margin-top: 0; text-align: left;">${eventName}</td>
                                    </tr>
                                    <tr>
                                        <td style="font-size: 20px; color: #202225; margin-top: 0; text-align: left;">ORGANIZING CLUB:</td>
                                        <td style="font-size: 20px; color: #202225; margin-top: 0; text-align: left;"> ${organizingClub}</td>
                                    </tr>
 <tr>
                                        <td style="font-size: 20px; color: #202225; margin-top: 0; text-align: left;">INSTITUTION :</td>
                                        <td style="font-size: 20px; color: #202225; margin-top: 0; text-align: left;"> ${institution}</td>
                                    </tr>
 <tr>
                                        <td style="font-size: 20px; color: #202225; margin-top: 0; text-align: left;">DEPARTMENT :</td>
                                        <td style="font-size: 20px; color: #202225; margin-top: 0; text-align: left;"> ${department}</td>
                                    </tr>
<tr>
                                        <td style="font-size: 20px; color: #202225; margin-top: 0; text-align: left;">Date:</td>
                                        <td style="font-size: 20px; color: #202225; margin-top: 0; text-align: left;"> ${eventDate}</td>
                                    </tr>
<tr>
                                        <td style="font-size: 20px; color: #202225; margin-top: 0; text-align: left;">SELF / GUEST :</td>
                                        <td style="font-size: 20px; color: #202225; margin-top: 0; text-align: left;"> ${selfOrGuest}</td>
                                    </tr>
<tr>
                                        <td style="font-size: 20px; color: #202225; margin-top: 0; text-align: left;">NO. OF PERSON :</td>
                                        <td style="font-size: 20px; color: #202225; margin-top: 0; text-align: left;"> ${noOfPerson}</td>
                                    </tr>
                                  
                                </table>

                            </td>
                        </tr>
                                  
                    </table>
                </td>
            </tr>
        </tbody>
                   
    </table>
       <center>  <a href="${
                process.env.CLIENT_URL
              }/transport-booking-system/bookingsView/${bookingId}"  style=" background-color: #4f46e5; color: #fff; padding: 8px 24px;  border-radius: 8px; border-style: solid; border-color: #4f46e5; font-size: 14px; text-decoration: none; cursor: pointer">View Booking</a></center>
</body>
=======
            
              </div>
              </div>
              
              
              
              
              <hr>
              
              
              
              
                <h1 style="font-size: 25px;text-align: left; color: #202225; margin-top: 0;">Vehicle Details </h1>
              <div style="margin-top: 2rem;">

<div style="text-align: justify; margin:20px; display: flex;">
                
                <div style="flex: 1; margin-right: 20px;">
                  <h1 style="font-size: 20px; color: #202225; margin-top: 0;">Vehicle Name	 :</h1>
                  <h1 style="font-size: 20px; color: #202225; margin-top: 0;">Vehicle Number	 :</h1>
                 
<h1 style="font-size: 20px; color: #202225; margin-top: 0;">Vehicle Capacity	 :</h1>
                 
                </div>
                <div style="flex: 1;">
                <h1 style="font-size: 20px; color: #202225; margin-top: 0;">${bookedTransportName}</h1>
                <h1 style="font-size: 20px; color: #202225; margin-top: 0;">${bookedTransportNumber}</h1>
<h1 style="font-size: 20px; color: #202225; margin-top: 0;">${bookedTransportCapacity}</h1>
            
              </div>
              </div>
              
              
                
                
                 <hr>
                 <h1 style="font-size: 25px;text-align: left; color: #202225; margin-top: 0;">Booking Details</h1>
              
              <div style="text-align: justify; margin:20px; display: flex;">
                
               
                 <div style="flex: 1; margin-right: 20px;">
              <h1 style="font-size: 20px; color: #202225; margin-top: 0;">EVENT NAME	 :</h1>
             
              <h1 style="font-size: 20px; color: #202225; margin-top: 0;">ORGANIZING CLUB	 :</h1>
              <h1 style="font-size: 20px; color: #202225; margin-top: 0;">INSTITUTION :</h1>
                   <h1 style="font-size: 20px; color: #202225; margin-top: 0;">DEPARTMENT :</h1>
                   ${eventDateType === "full" || eventDateType === "half" ? `<h1 style="font-size: 20px; color: #202225; margin-top: 0;">Date:</h1>` : `<h1 style="font-size: 20px; color: #202225; margin-top: 0;">From: </h1><h1 style="font-size: 20px; color: #202225; margin-top: 0;">To: </h1>`}

            

               <h1 style="font-size: 20px; color: #202225; margin-top: 0;">SELF / GUEST :</h1>
              <h1 style="font-size: 20px; color: #202225; margin-top: 0;">NO. OF PERSON :</h1>
                 
                </div>
                <div style="flex: 1;">
                <h1 style="font-size: 20px; color: #202225; margin-top: 0;">${eventName}</h1>
             
                 
              <h1 style="font-size: 20px; color: #202225; margin-top: 0;">${organizingClub}</h1>
              <h1 style="font-size: 20px; color: #202225; margin-top: 0;">${institution}</h1>
                   <h1 style="font-size: 20px; color: #202225; margin-top: 0;">${department}</h1>
${eventDateType === "full" || eventDateType === "half" ? `<h1 style="font-size: 20px; color: #202225; margin-top: 0;">${eventDate}</h1>` : `<h1 style="font-size: 20px; color: #202225; margin-top: 0;">${eventStartDate}</h1> <h1 style="font-size: 20px; color: #202225; margin-top: 0;">${eventEndDate}</h1>`}
         

              <h1 style="font-size: 20px; color: #202225; margin-top: 0;">${selfOrGuest}</h1>
               <h1 style="font-size: 20px; color: #202225; margin-top: 0;">${noOfPerson}</h1>
              </div>
              </div>
              
              
              
              
             
              <a href="${process.env.CLIENT_URL}/transport-booking-system/bookingsView/${bookingId}"  style=" background-color: #4f46e5; color: #fff; padding: 8px 24px;  border-radius: 8px; border-style: solid; border-color: #4f46e5; font-size: 14px; text-decoration: none; cursor: pointer">View Booking</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </tbody>

  </table>
  </body>
>>>>>>> 9253807b304aae0bfa2572cccc47dbf69f100007
  
  
      `;
};

const deleteTransportBooking = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const booking = await TransportBooking.findByIdAndDelete(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTransportBooking,
  getTransportBookings,
  getTransportBookingById,
  updateTransportBooking,
  deleteTransportBooking,
  getTransportBookingByUserId,
  getTransportEvents,
  getTransportBookingAdmin,
  getTransportBookingHod,
};
