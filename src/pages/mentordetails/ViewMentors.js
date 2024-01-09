import React, { useEffect, useState } from "react";
import { getAllMentors } from "../../firebase/firebase";
import { DataGrid } from "@mui/x-data-grid";

export default function ViewMentors() {
  const columnss = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "firstName", headerName: "First name", width: 130 },
    { field: "lastName", headerName: "Last name", width: 130 },
    {
      field: "age",
      headerName: "Age",
      type: "number",
      width: 90,
    },
    {
      field: "fullName",
      headerName: "Full name",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 160,
      valueGetter: (params) =>
        `${params.row.firstName || ""} ${params.row.lastName || ""}`,
    },
  ];
  const columns = [
    { field: "image", headerName: "Image", width: 130 },
    { field: "name", headerName: "Name", width: 130 },
    { field: "email", headerName: "Email", width: 250 },
    { field: "designation", headerName: "Designation", width: 230 },
    { field: "mobile", headerName: "Phone Number", width: 130 },
    { field: "industry", headerName: "Industry", width: 130 },
    { field: "about", headerName: "About", width: 1000 },
    { field: "domain", headerName: "Domains", width: 130 },
    { field: "linlkedin", headerName: "Linkedin", width: 130 },
    { field: "plans", headerName: "Mentor Pricings", width: 230 },
    { field: "mentorUniqueID", headerName: "Mentor Unique ID", width: 180 },
    { field: "mentorCalendlyLink", headerName: "Calendly LInk", width: 130 },
    { field: "clients", headerName: "Client's Email", width: 130 },
    { field: "upiId", headerName: "UPI ID", width: 230 },
    {
      field: "accountHolderName",
      headerName: "Account Holder Name",
      width: 230,
    },
    { field: "accountNumber", headerName: "Account Number", width: 230 },
    { field: "accountType", headerName: "Account Type", width: 230 },
    { field: "bankAdress", headerName: "Bank Address", width: 230 },
    { field: "bankName", headerName: "Bank Name", width: 230 },
    { field: "ifscCode", headerName: "IFSC Code", width: 230 },
    { field: "orders", headerName: "Order IDs", width: 130 },
  ];

  const rowss = [
    { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
    { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
    { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
    { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
    { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
    { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
    { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
    { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
    { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
  ];
  const [mentors, setMentors] = useState();
  const [rows, setRows] = useState([]);
  var counter = 0;

  const getMentors = async () => {
    var temp = await getAllMentors();
    setMentors(temp);
    await getRows(temp);
  };

  const getRows = async (data) => {
    console.log(data);
    if (data.length > counter)
      data.map((mentor, idx) => {
        counter += 1;
        const temp = {
          id: mentor.email + idx + Math.random(),
          about: mentor.about ? mentor.about : "",
          accountHolderName:
            mentor.accountDetails && mentor.accountDetails.accountHolderName
              ? mentor.accountDetails.accountHolderName
              : "",
          accountNumber:
            mentor.accountDetails && mentor.accountDetails.accountNumber
              ? mentor.accountDetails.accountNumber
              : "",
          accountType:
            mentor.accountDetails && mentor.accountDetails.accountType
              ? mentor.accountDetails.accountType
              : "",
          bankAdress:
            mentor.accountDetails && mentor.accountDetails.bankAdress
              ? mentor.accountDetails.bankAdress
              : "",
          bankName:
            mentor.accountDetails && mentor.accountDetails.bankName
              ? mentor.accountDetails.bankName
              : "",
          ifscCode:
            mentor.accountDetails && mentor.accountDetails.ifscCode
              ? mentor.accountDetails.ifscCode
              : "",
          upiId:
            mentor.accountDetails && mentor.accountDetails.upiId
              ? mentor.accountDetails.upiId
              : "",
          clients: mentor.clients ? mentor.clients : "",
          designation: mentor.designation ? mentor.designation : "",
          domain: mentor.domain ? mentor.domain : "",
          email: mentor.email ? mentor.email : "",
          image: mentor.image ? mentor.image : "",
          industry: mentor.industry ? mentor.industry : "",
          linlkedin: mentor.linlkedin ? mentor.linlkedin : "",
          mentorCalendlyLink: mentor.mentorCalendlyLink
            ? mentor.mentorCalendlyLink
            : "",
          mentorUniqueID: mentor.mentorUniqueID ? mentor.mentorUniqueID : "",
          mobile: mentor.mobile ? mentor.mobile : "",
          name: mentor.name ? mentor.name : "",
          plans: mentor.plans ? mentor.plans : "",
          orders: mentor.orders ? mentor.orders : "",
        };
        // const {about,
        //     accountHolderName,
        //     accountNumber,
        //     accountType,
        //     bankAdress,
        //     bankName,
        //     ifscCode,
        //     upiId,
        //     clients,
        //     designation,
        //     domain,
        //     email,
        //     image,
        //     industry,
        //     linlkedin,
        //     mentorCalendlyLink,
        //     mentorUniqueID,
        //     mobile,
        //     name,
        //     plans,
        //     orders
        // } = mentor;

        // delete mentor.Appointment_requset;
        // delete mentor.Password;
        // delete mentor.Rating;
        // delete mentor.availability;
        // delete mentor.countryCode;
        // delete mentor.education;
        // delete mentor.experience;
        // delete mentor.meeting;
        // delete mentor.notification;
        // delete mentor.reviews;
        // delete mentor.skills;

        if (idx == 0) {
          console.log(temp);
        }
        setRows((prev) => [...prev, { ...temp }]);
      });
  };

  useEffect(() => {
    getMentors();
  }, []);
  return (
    <>
      {mentors ? (
        <>
          <div style={{ textAlign: "center", paddingTop: "60px" }}>
            <h1 style={{ color: "black" }}>MENTORS</h1>
            <div
              style={{
                height: "75%",
                width: "90%",
                position: "absolute",
                top: "50%",
                right: "50%",
                transform: "translate(50%,-40%)",
              }}
            >
              <DataGrid
                rows={rows ? rows : rowss}
                columns={rows ? columns : columnss}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 5 },
                  },
                }}
                pageSizeOptions={[5, 10]}
              />
            </div>
          </div>
        </>
      ) : (
        <div>
          <h1>loading...</h1>
        </div>
      )}
    </>
  );
}
