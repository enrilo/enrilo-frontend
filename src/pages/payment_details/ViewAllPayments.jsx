// import { useState, useEffect, useRef } from "react";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import { Link } from "react-router-dom";
// import { styled } from "@mui/system";
// import TablePagination from "@mui/material/TablePagination";
// import { Button } from "@mui/material";
// import FirstPageRoundedIcon from "@mui/icons-material/FirstPageRounded";
// import LastPageRoundedIcon from "@mui/icons-material/LastPageRounded";
// import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
// import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

// export default function ViewAllPayments() {
//   // const { loading } = useSelector((state) => state.user);
//   // const [formData, setFormData] = useState({
//   //   consultancy_id: "",
//   //   consultancy_name: "",
//   //   rate: 0,
//   //   duration_in_months: 0,
//   //   subtotal: 0,
//   //   is_discount_available: false,
//   //   discount_amount: 0,
//   //   net_total: 0,
//   //   gst_amount: 0,
//   //   grand_total: 0,
//   //   payment_status: "pending",
//   //   payment_received: 0,
//   //   pending_payment: 0,
//   //   from_date: null,
//   //   to_date: null,
//   // });
//   const receiptRef = useRef(); 
//   const [formData, setFormData] = useState([]);
//   const [singlePaymentData, setSinglePaymentData] = useState({});
//   const [generateReceiptOpen, setGenerateReceiptOpen] = useState(false);
//   const [generateReceiptName, setGenerateReceiptName] = useState("");
//   const [generateRecieptID, setGenerateRecieptID] = useState("");
//   const [currentUserID, setCurrentUserID] = useState("");
//   const [deleteId, setDeleteId] = useState("");
//   const [pageLoading, setPageLoading] = useState(false);
//   const [allowWriteAccess, setAllowWriteAccess] = useState(false);
//   const [showConfirmDelete, setShowConfirmDelete] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [showDeleting, setShowDeleting] = useState(false);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const persistedRoot = JSON.parse(localStorage.getItem("persist:root"));
//   const userState = JSON.parse(persistedRoot.user);
//   const token = userState.currentUser?.data?.accessToken;
//   const loggedInUserID = userState.currentUser?.data?.id;
//   const role = userState.currentUser?.data?.role;

//   useEffect(() => {
//     const fetchAllPayments = async () => {
//       try {
//         setPageLoading(true);
//         setCurrentUserID(userState.currentUser?.data?.id);

//         const res = await fetch(`http://localhost:3000/api/payment-detail/`, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         const data = await res.json();
//         if (!data.success) {
//           setFormData([]);
//           setPageLoading(false);
//           return;
//         }
        
//         setFormData(data.data.paymentDetails);

//         // Fetch write access
//         const accessRes = await fetch(
//           `http://localhost:3000/api/access-tokens/access-token-by-super-admin-id/${loggedInUserID}`,
//           { method: "GET", headers: { "Content-Type": "application/json" } }
//         );
//         const accessData = await accessRes.json();
//         if (accessData.success) setAllowWriteAccess(accessData.data.accessToken.allow_write_access);

//         setPageLoading(false);
//       } catch (error) {
//         console.log(`Error:${error}`)
//         setPageLoading(false);
//       }
//     };
//     fetchAllPayments();
//   }, []);

//   useEffect(() => {
//     const fetchAPayment = async () => {
//       try {
//         const res = await fetch(`http://localhost:3000/api/payment-detail/${generateRecieptID}`, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         const data = await res.json();
//         if (!data.success) {
//           setSinglePaymentData([]);
//           setPageLoading(false);
//           return;
//         }
//         console.log(`data.data.payment_details:${data.data.payment_details}`);
        
//         setSinglePaymentData(data.data.payment_details);
//       } catch (error) {
//         console.log(`Error:${error}`)
//         // setPageLoading(false);
//       }
//     };
//     fetchAPayment();
//   }, [generateRecieptID]);

//   const paginatedData = rowsPerPage > 0 ? formData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : formData;

//   const handleChangePage = (event, newPage) => setPage(newPage);

//   const handleChangeRowsPerPage = (event) => { setRowsPerPage(parseInt(event.target.value, 10)); setPage(0); };

//   const CustomTablePagination = styled(TablePagination)` & .MuiTablePagination-toolbar { display: flex; justify-content: space-between; align-items: center; font-size: 14px; background-color: #f9fafb; flex-wrap: wrap; } & .MuiTablePagination-selectLabel, & .MuiTablePagination-input, & .MuiTablePagination-displayedRows { font-size: 14px; }`;

//   const confirmDelete = (id) => {
//     setDeleteId(id);
//     setShowConfirmDelete(true);
//   };

//   const handleDeleteConfirmed = async () => {  
//     try {
//       // Fetch consultancy details for deleting files
//       setShowDeleting(true);
      
//       const deleteRes = await fetch(`http://localhost:3000/api/payment-detail/${deleteId}`, {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         credentials: "include",
//       });
//       const deleteData = await deleteRes.json();
//       if (!deleteData.success) return;
      
//       setShowDeleting(false);
//       setShowConfirmDelete(false);
//       setShowSuccess(true);
//     } catch (error) {
//       setShowDeleting(false);
//       console.log(error.message);
//       setShowSuccess(false);
//     }
//   };
  
//   return (
//     <main className="flex-1 overflow-y-auto p-6">
//       <div className="p-4 sm:p-6">
//         <div className="bg-white rounded-2xl shadow p-4 sm:p-6 max-w-7xl mx-auto">
//           {/* 🔹 TABLE */}
//           <div className="overflow-x-auto rounded-lg">
//             {allowWriteAccess && role === "admin" && (
//               <div className="flex justify-end mb-5">
//                 <Link to={`/add-new-payment`} className="flex flex-row justify-center">
//                   <button className="bg-[#1E293B] hover:bg-[#334155] text-yellow-300 cursor-pointer px-2 sm:px-3 py-1 sm:py-1.5 rounded text-sm sm:text-[17px] font-semibold transition">
//                     Add New Payment
//                   </button>
//                 </Link>
//               </div>
//             )}
//             <table className="min-w-full text-sm md:text-[17px] text-left border-collapse rounded-lg">
//               <thead className="bg-gray-100 text-gray-700 uppercase rounded-lg">
//                 <tr>
//                   <th className="px-3 py-2 md:px-4 md:py-3 text-center w-8 md:w-12">#</th>
//                   <th className="px-3 py-2 md:px-4 md:py-3 text-center w-40 md:w-56">Consultancy Name</th>
//                   <th className="px-3 py-2 md:px-4 md:py-3 text-center w-22 md:w-20">Plan Duration</th>
//                   <th className="px-3 py-2 md:px-4 md:py-3 text-center w-32 md:w-40">Payment Status</th>
//                   <th className="px-3 py-2 md:px-4 md:py-3 text-center w-22 md:w-20">Total Payment</th>
//                   <th className="px-3 py-2 md:px-4 md:py-3 text-center w-22 md:w-20">Payment Received</th>
//                   <th className="px-3 py-2 md:px-4 md:py-3 text-center w-22 md:w-20">Pending Payment</th>
//                   <th className="px-3 py-2 md:px-4 md:py-3 text-center w-36 md:w-70">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {paginatedData.map((payment, index) => (
//                   <tr key={payment._id} className="border-b hover:bg-gray-50 transition text-gray-800">
//                     <td className="px-3 py-2 md:px-4 md:py-3 text-center font-medium w-8 md:w-12">
//                       {page * rowsPerPage + index + 1}
//                     </td>
//                     <td className="px-3 py-2 md:px-4 md:py-3 text-center w-40 md:w-56">{payment.consultancy_name}</td>
//                     <td className="px-3 py-2 md:px-4 md:py-3 text-center w-22 md:w-20">{payment.duration_in_months}</td>
//                     <td className="px-3 py-2 md:px-4 md:py-3 text-center w-32 md:w-40">{payment.payment_status === "full" ? "Paid In Full" : (payment.payment_status == "partial" ? "Payment Pending" : "Partial Payment")}</td>
//                     <td className="px-3 py-2 md:px-4 md:py-3 text-center w-44 md:w-40">{payment.grand_total}</td>
//                     <td className="px-3 py-2 md:px-4 md:py-3 text-center w-22 md:w-20">{payment.payment_received}</td>
//                     <td className="px-3 py-2 md:px-4 md:py-3 text-center w-22 md:w-20">{payment.pending_payment}</td>
//                     <td className="px-3 py-2 md:px-4 md:py-3 text-center w-22 md:w-20">
//                       <div className="flex justify-center gap-1 sm:gap-4 flex-wrap">
//                           <Button variant="outlined" onClick={() => { setGenerateReceiptName(`Payment Details of ${payment.consultancy_name}`); setGenerateReceiptOpen(true); setGenerateRecieptID(payment._id)}} >
//                           Generate Receipt
//                           </Button>
//                         <Link to={`/view-a-payment/${payment._id}`}>
//                           <button className="bg-slate-500 hover:bg-slate-600 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded text-sm sm:text-[17px] font-semibold transition cursor-pointer">View</button>
//                         </Link>
//                         {allowWriteAccess && role === "admin" && (
//                           <>
//                             <Link to={`/edit-a-payment/${payment._id}`}>
//                               <button className="bg-[#1E293B] hover:bg-[#334155] text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded text-sm sm:text-[17px] font-semibold transition cursor-pointer">Edit</button>
//                             </Link>
//                             <button onClick={() => confirmDelete(payment._id)} className="bg-red-700 hover:bg-red-600 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded text-sm sm:text-[17px] font-semibold transition cursor-pointer">
//                               Delete
//                             </button>
//                           </>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>

//               {/* Pagination Footer */}
//               <tfoot>
//                 <tr>
//                   <td colSpan={8}>
//                     <div className="flex items-center justify-between mt-4 px-3 py-2 bg-gray-50 text-sm md:text-base">
//                       <div className="flex items-center gap-2">
//                         <span>Rows per page:</span>
//                         <select className="border rounded px-2 py-1" value={rowsPerPage} onChange={(e) => { const value = parseInt(e.target.value, 10); setRowsPerPage(value); setPage(0); }}>
//                           {[5, 10, 25, -1].map((num) => (
//                             <option key={num} value={num}>
//                               {num === -1 ? "All" : num}
//                             </option>
//                           ))}
//                         </select>
//                       </div>

//                       <div style={{ flex: 1 }} />

//                       <div className="flex items-center gap-2">
//                         <span>
//                           {rowsPerPage === -1 ? `1–${formData.length} of ${formData.length}` : `${Math.min(page * rowsPerPage + 1, formData.length)}–${Math.min( (page + 1) * rowsPerPage, formData.length )} of ${formData.length}`}
//                         </span>
//                         <button onClick={() => setPage(0)} disabled={page === 0 || rowsPerPage === -1} className="px-2 py-1 border rounded disabled:opacity-40">
//                           <FirstPageRoundedIcon fontSize="small" />
//                         </button>
//                         <button onClick={() => setPage((p) => Math.max(p - 1, 0))} disabled={page === 0 || rowsPerPage === -1} className="px-2 py-1 border rounded disabled:opacity-40">
//                           <ChevronLeftRoundedIcon fontSize="small" />
//                         </button>
//                         <button onClick={() => setPage((p) => Math.min(p + 1, Math.ceil(formData.length / rowsPerPage) - 1))} disabled={page >= Math.ceil(formData.length / rowsPerPage) - 1 || rowsPerPage === -1} className="px-2 py-1 border rounded disabled:opacity-40">
//                           <ChevronRightRoundedIcon fontSize="small" />
//                         </button>
//                         <button onClick={() => setPage(Math.ceil(formData.length / rowsPerPage) - 1)} disabled={page >= Math.ceil(formData.length / rowsPerPage) - 1 || rowsPerPage === -1} className="px-2 py-1 border rounded disabled:opacity-40">
//                           <LastPageRoundedIcon fontSize="small" />
//                         </button>
//                       </div>
//                     </div>
//                   </td>
//                 </tr>
//               </tfoot>
//             </table>
//           </div>

//           {/* GENERATE RECEIPT MODAL */}
//           {generateReceiptOpen && (
//             <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md z-50">
//                 <div className="bg-white rounded-2xl shadow-lg p-4 max-w-3xl w-full">
//                     <div className="flex justify-between items-center mb-2">
//                       <div className='text-xl font-semibold p-1'>
//                           {generateReceiptName}
//                       </div>
//                       <button className="bg-[#1E293B] text-white px-8 py-2 rounded-md hover:bg-[#334155] transition cursor-pointer" onClick={() => setGenerateReceiptOpen(false)} >
//                           Close
//                       </button>
//                     </div>
//                     <div className="flex flex-col justify-between items-center mb-2">
//                       {/* Bill Header */}
//                       <div className="text-center">
//                         <h1 className="text-3xl font-bold">{singlePaymentData.consultancy_name}</h1>
//                         <p className="text-lg font-semibold">Consultancy Payment Details</p>
//                         <div className="flex justify-center gap-8 text-gray-700 text-lg font-semibold mb-8">
//                           <p>
//                             From:{" "}
//                             {new Date(singlePaymentData.from_date).toLocaleDateString("en-US", { day: "2-digit", month: "long", year: "numeric" })}
//                           </p>
//                           <p>
//                             To:{" "}
//                             {new Date(singlePaymentData.to_date).toLocaleDateString("en-US", { day: "2-digit", month: "long", year: "numeric" })}
//                           </p>
//                         </div>
//                       </div>
//                       {/* Payment Status */}
//                       <div className="mb-5 text-center">
//                         <p className="font-semibold text-lg">
//                           Payment Status:{" "}
//                           <span className={`font-bold ${ singlePaymentData.payment_status === "full" ? "text-green-600" : (singlePaymentData.payment_status === "pending" ?"text-red-600":"text-orange-400") }`} >
//                             {singlePaymentData.payment_status === "full" ? "Paid In Full" : (singlePaymentData.payment_status === "pending" ? "Payment Pending" : "Partial Payment Complete")}
//                           </span>
//                         </p>
//                       </div>

//                       {/* Bill Table */}
//                       <table className="w-full text-left border-collapse text-lg mb-5">
//                         <tbody>
//                           <tr className="border-b border-gray-300">
//                             <td className="py-3 font-semibold">Rate</td>
//                             <td className="py-3 text-right">{singlePaymentData.rate}</td>
//                           </tr>
//                           <tr className="border-b border-gray-300">
//                             <td className="py-3 font-semibold">Duration (Months)</td>
//                             <td className="py-3 text-right">{singlePaymentData.duration_in_months}</td>
//                           </tr>
//                           <tr className="border-b border-gray-300">
//                             <td className="py-3 font-semibold">Subtotal</td>
//                             <td className="py-3 text-right">{singlePaymentData.subtotal}</td>
//                           </tr>
//                           <tr className="border-b border-gray-300">
//                             <td className="py-3 font-semibold">Discount</td>
//                             <td className="py-3 text-right">{singlePaymentData.discount_amount}</td>
//                           </tr>
//                           <tr className="border-b border-gray-300">
//                             <td className="py-3 font-semibold">Net Total</td>
//                             <td className="py-3 text-right">{singlePaymentData.net_total}</td>
//                           </tr>
//                           <tr className="border-b border-gray-300">
//                             <td className="py-3 font-semibold">GST @0%</td>
//                             <td className="py-3 text-right">{singlePaymentData.gst_amount}</td>
//                           </tr>
//                           <tr className="border-b border-gray-300">
//                             <td className="py-3 font-semibold">Grand Total</td>
//                             <td className="py-3 text-right">{singlePaymentData.grand_total}</td>
//                           </tr>
//                           <tr className="border-b border-gray-300">
//                             <td className="py-3 font-semibold">Payment Received</td>
//                             <td className="py-3 text-right">{singlePaymentData.payment_received}</td>
//                           </tr>
//                           <tr>
//                             <td className="py-3 font-semibold">Payment Pending</td>
//                             <td className='py-3 text-right'>
//                               {singlePaymentData.pending_payment}
//                             </td>
//                           </tr>
//                           {/* <tr>
//                             <td class="text-right align-middle font-semibold" colspan="2">
//                               <p className="font-semibold text-lg">
//                                 Payment Status:{" "}
//                                 <span className={`font-bold ${ formData.payment_status === "full" ? "text-green-600" : (formData.payment_status === "pending" ?"text-red-600":"text-orange-400") }`} >
//                                   {formData.payment_status === "full" ? "Paid In Full" : (formData.payment_status === "pending" ? "Payment Pending" : "Partial Payment Complete")}
//                                 </span>
//                               </p>
//                             </td>
//                           </tr> */}
//                         </tbody>
//                       </table>
//                       <div className="text-center align-middle font-semibold">
//                         <span>Note:{" "}</span>All Amounts Specified Are In Indian Rupees (INR)
//                       </div>
//                     </div>
//                 </div>
//             </div>
//           )}

//           {/* DELETE CONFIRM MODAL */}
//           {showConfirmDelete && (
//             <div className="fixed inset-0 backdrop-blur-md flex justify-center items-center z-50">
//               <div className="bg-white text-[#334155] rounded-lg p-6 w-80 shadow-xl text-center">
//                 <p className="text-center font-medium text-xl mb-5">Are you sure you want to delete this payment detail?</p>
//                 <div className="flex justify-center gap-4">
//                   <button className="bg-[#1E293B] hover:bg-[#334155] text-yellow-300 border-2 px-4 py-2 rounded-md w-24 transition cursor-pointer" onClick={handleDeleteConfirmed}>
//                     Yes
//                   </button>
//                   <button className="bg-gray-300 border-2 px-4 py-2 rounded-md w-24 hover:bg-gray-400 transition cursor-pointer" onClick={() => setShowConfirmDelete(false)}>
//                     No
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* SUCCESS MODAL */}
//           {showSuccess && (
//             <div className="fixed inset-0 backdrop-blur-md flex justify-center items-center z-50">
//               <div className="bg-white text-[#334155] rounded-lg p-6 w-80 shadow-xl text-center">
//                 <p className="text-center font-medium text-xl mb-5">Payment detail has been deleted!</p>
//                 <div className="flex justify-center gap-4">
//                   <button className="bg-[#1E293B] hover:bg-[#334155] text-yellow-300 border-2 px-4 py-2 rounded-md w-24 transition cursor-pointer" onClick={() => { setShowSuccess(false); window.location.reload(true); }}>
//                     OK
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {showDeleting && (
//             <div className="fixed inset-0 backdrop-blur-md flex justify-center items-center z-50">
//               <div className="bg-white text-[#334155] rounded-lg p-6 w-80 shadow-xl text-center">
//                 <div className="text-xl font-semibold flex justify-center items-center gap-3">
//                   <div className="w-20 h-20">
//                     <svg className="w-full h-full animate-spin text-yellow-400" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
//                       <text x="50" y="68" textAnchor="middle" fontFamily="Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" fontSize="100" fontWeight="700" fill="currentColor">
//                         e
//                       </text>
//                     </svg>
//                   </div>
//                   <div className="flex flex-col">
//                     <p className="text-xl font-semibold mb-2">Deleting...</p>
//                     <p className="text-[#334155]">Please hold on! The payment detail is being deleted.</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* LOADING MODAL */}
//           {pageLoading && (
//             <div className="fixed inset-0 backdrop-blur-md flex justify-center items-center z-50">
//               <div className="bg-white text-[#334155] rounded-lg p-6 w-80 shadow-xl text-center">
//                 <div className="text-xl font-semibold flex justify-center items-center gap-3">
//                   <div className="w-20 h-20">
//                     <svg className="w-full h-full animate-spin text-yellow-400" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
//                       <text x="50" y="68" textAnchor="middle" fontFamily="Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" fontSize="100" fontWeight="700" fill="currentColor">
//                         e
//                       </text>
//                     </svg>
//                   </div>
//                   <div className="flex flex-col">
//                     <p className="text-xl font-semibold mb-2">Loading...</p>
//                     <p className="text-[#334155]">Please wait while we load the all payment details.</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </main>
//   );
// }

import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { styled } from "@mui/system";
import TablePagination from "@mui/material/TablePagination";
import FirstPageRoundedIcon from "@mui/icons-material/FirstPageRounded";
import LastPageRoundedIcon from "@mui/icons-material/LastPageRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import enriloLogo from "../../assets/images/regular-background/enrilo-without-tagline-1920x1080.png";

export default function ViewAllPayments() {
  const [formData, setFormData] = useState([]);
  const [singlePaymentData, setSinglePaymentData] = useState({});
  const [generateReceiptOpen, setGenerateReceiptOpen] = useState(false);
  const [generateRecieptID, setGenerateRecieptID] = useState("");
  const [currentUserID, setCurrentUserID] = useState("");
  const [deleteId, setDeleteId] = useState("");
  const [pageLoading, setPageLoading] = useState(false);
  const [allowWriteAccess, setAllowWriteAccess] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeleting, setShowDeleting] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const persistedRoot = JSON.parse(localStorage.getItem("persist:root"));
  const userState = JSON.parse(persistedRoot.user);
  const token = userState.currentUser?.data?.accessToken;
  const loggedInUserID = userState.currentUser?.data?.id;
  const role = userState.currentUser?.data?.role;
  const receiptRef = useRef();
  const baseBtn = "px-2 sm:px-3 py-1 sm:py-1.5 rounded text-sm sm:text-[17px] font-semibold transition cursor-pointer";

  useEffect(() => {
    const fetchAllPayments = async () => {
      try {
        setPageLoading(true);
        setCurrentUserID(userState.currentUser?.data?.id);

        const res = await fetch(`http://localhost:3000/api/payment-detail/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!data.success) {
          setFormData([]);
          setPageLoading(false);
          return;
        }

        setFormData(data.data.paymentDetails);

        // Fetch write access
        const accessRes = await fetch(
          `http://localhost:3000/api/access-tokens/access-token-by-super-admin-id/${loggedInUserID}`,
          { method: "GET", headers: { "Content-Type": "application/json" } }
        );
        const accessData = await accessRes.json();
        if (accessData.success)
          setAllowWriteAccess(accessData.data.accessToken.allow_write_access);

        setPageLoading(false);
      } catch (error) {
        console.log(`Error:${error}`);
        setPageLoading(false);
      }
    };
    fetchAllPayments();
  }, []);

  useEffect(() => {
    const fetchAPayment = async () => {
      try {
        if (!generateRecieptID) return;

        const res = await fetch(
          `http://localhost:3000/api/payment-detail/${generateRecieptID}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        if (!data.success) {
          setSinglePaymentData([]);
          setPageLoading(false);
          return;
        }

        setSinglePaymentData(data.data.payment_details);
      } catch (error) {
        console.log(`Error:${error}`);
      }
    };
    fetchAPayment();
  }, [generateRecieptID]);

  const paginatedData = rowsPerPage > 0 ? formData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : formData;

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const CustomTablePagination = styled(TablePagination)`& .MuiTablePagination-toolbar { display: flex; justify-content: space-between; align-items: center; font-size: 14px; background-color: #f9fafb; flex-wrap: wrap; } & .MuiTablePagination-selectLabel, & .MuiTablePagination-input, & .MuiTablePagination-displayedRows { font-size: 14px; }`;

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowConfirmDelete(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      setShowDeleting(true);

      const deleteRes = await fetch(
        `http://localhost:3000/api/payment-detail/${deleteId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );
      const deleteData = await deleteRes.json();
      if (!deleteData.success) return;

      setShowDeleting(false);
      setShowConfirmDelete(false);
      setShowSuccess(true);
    } catch (error) {
      setShowDeleting(false);
      console.log(error.message);
      setShowSuccess(false);
    }
  };

  return (
    <main className="flex-1 overflow-y-auto p-6">
      <div className="p-4 sm:p-6">
        <div className="bg-white rounded-2xl shadow p-4 sm:p-6 max-w-7xl mx-auto">
          {/* 🔹 TABLE */}
          <div className="overflow-x-auto rounded-lg">
            {allowWriteAccess && (
              <div className="flex justify-end mb-5">
                <Link to={`/add-new-payment`} className="flex flex-row justify-center">
                  <button className="bg-[#1E293B] hover:bg-[#334155] text-yellow-300 cursor-pointer px-2 sm:px-3 py-1 sm:py-1.5 rounded text-sm sm:text-[17px] font-semibold transition">
                    Add New Payment
                  </button>
                </Link>
              </div>
            )}

            {
              paginatedData.length > 0 ?  (
                <table className="min-w-full text-sm md:text-[17px] text-left border-collapse rounded-lg">
                  <thead className="bg-gray-100 text-gray-700 uppercase rounded-lg">
                    <tr>
                      <th className="px-3 py-2 md:px-4 md:py-3 text-center w-8 md:w-12">#</th>
                      <th className="px-3 py-2 md:px-4 md:py-3 text-center w-40 md:w-56">Consultancy Name</th>
                      <th className="px-3 py-2 md:px-4 md:py-3 text-center w-22 md:w-20">Plan Duration</th>
                      <th className="px-3 py-2 md:px-4 md:py-3 text-center w-32 md:w-40">Payment Status</th>
                      <th className="px-3 py-2 md:px-4 md:py-3 text-center w-22 md:w-20">Total Payment</th>
                      <th className="px-3 py-2 md:px-4 md:py-3 text-center w-22 md:w-20">Payment Received</th>
                      <th className="px-3 py-2 md:px-4 md:py-3 text-center w-22 md:w-20">Pending Payment</th>
                      <th className="px-3 py-2 md:px-4 md:py-3 text-center w-36 md:w-70">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.map((payment, index) => (
                      <tr key={payment._id} className="border-b hover:bg-gray-50 transition text-gray-800">
                        <td className="px-3 py-2 md:px-4 md:py-3 text-center font-medium w-8 md:w-12">
                          {page * rowsPerPage + index + 1}
                        </td>
                        <td className="px-3 py-2 md:px-4 md:py-3 text-center w-40 md:w-56">{payment.consultancy_name}</td>
                        <td className="px-3 py-2 md:px-4 md:py-3 text-center w-22 md:w-20">{payment.duration_in_months}</td>
                        <td className="px-3 py-2 md:px-4 md:py-3 text-center w-32 md:w-40">{payment.payment_status === "full" ? "Paid In Full" : (payment.payment_status == "partial" ? "Payment Pending" : "Partial Payment")}</td>
                        <td className="px-3 py-2 md:px-4 md:py-3 text-center w-44 md:w-40">{payment.grand_total}</td>
                        <td className="px-3 py-2 md:px-4 md:py-3 text-center w-22 md:w-20">{payment.payment_received}</td>
                        <td className="px-3 py-2 md:px-4 md:py-3 text-center w-22 md:w-20">{payment.pending_payment}</td>
                        {/* <td className="px-3 py-2 md:px-4 md:py-3 text-center w-22 md:w-20">
                          <div className="flex justify-center gap-1 sm:gap-4 flex-wrap">
                            <button type="button" className="bg-[#1E293B] hover:bg-[#334155] text-yellow-300 cursor-pointer px-2 sm:px-3 py-1 sm:py-1.5 rounded text-sm sm:text-[17px] font-semibold transition" onClick={() => { setGenerateReceiptOpen(true); setGenerateRecieptID(payment._id); }}>
                              View Receipt
                            </button>
                            <Link to={`/view-a-payment/${payment._id}`}>
                              <button className="bg-slate-500 hover:bg-slate-600 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded text-sm sm:text-[17px] font-semibold transition cursor-pointer">View</button>
                            </Link>
                            {allowWriteAccess && (
                              <>
                                <Link to={`/edit-a-payment/${payment._id}`}>
                                  <button className="bg-[#1E293B] hover:bg-[#334155] text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded text-sm sm:text-[17px] font-semibold transition cursor-pointer">Edit</button>
                                </Link>
                                <button onClick={() => confirmDelete(payment._id)} className="bg-red-700 hover:bg-red-600 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded text-sm sm:text-[17px] font-semibold transition cursor-pointer">
                                  Delete
                                </button>
                              </>
                            )}
                          </div>
                        </td> */}
                        <td className="px-3 py-2 md:px-4 md:py-3 text-center w-22 md:w-20">
                          <div className="flex flex-col items-center gap-2">
                            <button type="button" className={`${baseBtn} bg-[#1E293B] hover:bg-[#334155] text-yellow-300 font-semibold`} onClick={() => { setGenerateReceiptOpen(true); setGenerateRecieptID(payment._id); }}>
                              View Receipt
                            </button>
                            
                            <div className="flex justify-center gap-1 sm:gap-4 flex-wrap">
                              <Link to={`/view-a-payment/${payment._id}`} className={`${baseBtn} bg-slate-500 hover:bg-slate-600 text-white text-center`}>
                                View
                              </Link>
                              {allowWriteAccess && (
                                <>
                                  <Link to={`/edit-a-payment/${payment._id}`} className={`${baseBtn} bg-[#1E293B] hover:bg-[#334155] text-white text-center`}>
                                    Edit
                                  </Link>
                                  <button onClick={() => confirmDelete(payment._id)} className={`${baseBtn} bg-red-700 hover:bg-red-600 text-white`} >
                                    Delete
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>

                  {/* Pagination Footer */}
                  <tfoot>
                    <tr>
                      <td colSpan={8}>
                        <div className="flex items-center justify-between mt-4 px-3 py-2 bg-gray-50 text-sm md:text-base">
                          <div className="flex items-center gap-2">
                            <span>Rows per page:</span>
                            <select className="border rounded px-2 py-1" value={rowsPerPage} onChange={(e) => { const value = parseInt(e.target.value, 10); setRowsPerPage(value); setPage(0); }}>
                              {[5, 10, 25, -1].map((num) => (
                                <option key={num} value={num}>
                                  {num === -1 ? "All" : num}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div style={{ flex: 1 }} />

                          <div className="flex items-center gap-2">
                            <span>
                              {rowsPerPage === -1 ? `1–${formData.length} of ${formData.length}` : `${Math.min(page * rowsPerPage + 1, formData.length)}–${Math.min( (page + 1) * rowsPerPage, formData.length )} of ${formData.length}`}
                            </span>
                            <button onClick={() => setPage(0)} disabled={page === 0 || rowsPerPage === -1} className="px-2 py-1 border rounded disabled:opacity-40">
                              <FirstPageRoundedIcon fontSize="small" />
                            </button>
                            <button onClick={() => setPage((p) => Math.max(p - 1, 0))} disabled={page === 0 || rowsPerPage === -1} className="px-2 py-1 border rounded disabled:opacity-40">
                              <ChevronLeftRoundedIcon fontSize="small" />
                            </button>
                            <button onClick={() => setPage((p) => Math.min(p + 1, Math.ceil(formData.length / rowsPerPage) - 1))} disabled={page >= Math.ceil(formData.length / rowsPerPage) - 1 || rowsPerPage === -1} className="px-2 py-1 border rounded disabled:opacity-40">
                              <ChevronRightRoundedIcon fontSize="small" />
                            </button>
                            <button onClick={() => setPage(Math.ceil(formData.length / rowsPerPage) - 1)} disabled={page >= Math.ceil(formData.length / rowsPerPage) - 1 || rowsPerPage === -1} className="px-2 py-1 border rounded disabled:opacity-40">
                              <LastPageRoundedIcon fontSize="small" />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              ) : (
                <div className="min-w-full text-lg md:text-2xl text-center font-regular">
                  No payments have been made to Enrilo yet.
                  <br /><br />
                  Click on the above button to add a new payment detail.
                </div>
              )
            }
          </div>


          {/* GENERATE RECEIPT MODAL */}
          {generateReceiptOpen && (
            <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md z-50">
              <div className="bg-white rounded-2xl shadow-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto printable">
                {/* Header Actions */}
                <div className="flex justify-between mb-4 no-print">
                  <button className="bg-[#1E293B] hover:bg-[#334155] text-yellow-300 px-8 py-2 rounded-md transition cursor-pointer" onClick={() => window.print()}>
                    Generate Receipt
                  </button>
                  <button className="bg-slate-500 hover:bg-slate-600 text-white px-8 py-2 rounded-md transition cursor-pointer" onClick={() => setGenerateReceiptOpen(false)}>
                    Close
                  </button>
                </div>
                <div className="flex justify-between mb-4 no-print">
                  <p>
                    <span className="font-semibold underline">NOTE:</span> TO SAVE THIS RECEIPT, CLICK ON "<span className="underline">PRINT</span>" AND THEN SELECT OPTION TO "<span className="underline">SAVE AS PDF</span>"
                  </p>
                </div>

                <div ref={receiptRef} className="w-full" style={{ backgroundColor: "#fff" }}>
                  {/* Company Header */}
                  <div className="text-center border-b pb-4 mb-6">
                    <h1 className="text-3xl font-bold tracking-wide">
                      {singlePaymentData.consultancy_name}
                    </h1>
                    <p className="text-lg font-semibold mt-1">TAX INVOICE / PAYMENT RECEIPT</p>
                    <p className="text-sm text-gray-600 mt-1">
                      All amounts are in Indian Rupees (₹ INR)
                    </p>
                  </div>

                  {/* Invoice Meta */}
                  {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-6 justify-between"> */}
                  <div className="grid grid-cols-2 gap-4 text-sm mb-6 justify-between">
                    <div>
                      <p>
                        <span className="font-semibold">Receipt No:</span>{" "}
                        {singlePaymentData.receipt_number || "—"}
                      </p>
                      <p>
                        <span className="font-semibold">Invoice Date:</span>{" "}
                        {new Date(singlePaymentData.createdAt).toLocaleDateString("en-US", { day: "2-digit", month: "long", year: "numeric" })}
                      </p>
                    </div>
                    {/* <div className="md:text-right"> */}
                    <div className="text-right">
                      <p>
                        <span className="font-semibold">Billing Period:</span>
                      </p>
                      <p>
                        {singlePaymentData.from_date &&
                          new Date(singlePaymentData.from_date).toLocaleDateString("en-US", { day: "2-digit", month: "long", year: "numeric" })
                        }{" "}
                        - {" "}
                        {singlePaymentData.to_date &&
                          new Date(singlePaymentData.to_date).toLocaleDateString("en-US", { day: "2-digit", month: "long", year: "numeric" })
                        }
                      </p>
                    </div>
                  </div>
                  {/* Payment Status */}
                  <div className="mb-6 text-center">
                    <p className="font-semibold text-lg">
                      Payment Status:{" "}
                      <span
                        className={`font-bold ${ singlePaymentData.payment_status === "full" ? "text-green-600" : singlePaymentData.payment_status === "pending" ? "text-red-600" : "text-orange-500" }`}>
                        {singlePaymentData.payment_status === "full" ? "PAID" : singlePaymentData.payment_status === "pending" ? "PAYMENT PENDING" : "PARTIALLY PAID"}
                      </span>
                    </p>
                  </div>
                  {/* Amount Table */}
                  <table className="w-full text-sm border border-gray-300 mb-6">
                    <tbody>
                      <tr className="border-b">
                        <td className="py-3 px-4 font-semibold">Rate</td>
                        <td className="py-3 px-4 text-right">₹ {singlePaymentData.rate}.00</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4 font-semibold">Duration</td>
                        <td className="py-3 px-4 text-right">
                          {singlePaymentData.duration_in_months} Months
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4 font-semibold">Subtotal</td>
                        <td className="py-3 px-4 text-right">
                          ₹ {singlePaymentData.subtotal}
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4 font-semibold">Discount</td>
                        <td className="py-3 px-4 text-right">
                          ₹ {singlePaymentData.discount_amount}
                        </td>
                      </tr>
                      <tr className="border-b bg-gray-50">
                        <td className="py-3 px-4 font-semibold">Net Total</td>
                        <td className="py-3 px-4 text-right font-semibold">
                          ₹ {singlePaymentData.net_total}
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4 font-semibold">GST (0%)</td>
                        <td className="py-3 px-4 text-right">
                          ₹ {singlePaymentData.gst_amount}
                        </td>
                      </tr>
                      <tr className="border-b bg-gray-100 text-lg">
                        <td className="py-3 px-4 font-bold">Grand Total</td>
                        <td className="py-3 px-4 text-right font-bold">
                          ₹ {singlePaymentData.grand_total}
                        </td>
                      </tr>
                      {singlePaymentData.payment_status !== "full" && (
                        <>
                          <tr className="border-b">
                            <td className="py-3 px-4 font-semibold">Payment Received</td>
                            <td className="py-3 px-4 text-right text-green-600">
                              ₹ {singlePaymentData.payment_received}
                            </td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4 font-semibold">Balance Payable</td>
                            <td className="py-3 px-4 text-right text-red-600 font-semibold">
                              ₹ {singlePaymentData.pending_payment}
                            </td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>

                  {/* Declaration */}
                  <div className="text-sm text-gray-700 mb-8">
                    <p>
                      <span className="font-semibold">Declaration:</span> This is a
                      computer-generated receipt and does not require a physical signature.
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="flex justify-between items-end mt-10">
                    <div className="text-sm">
                      <img src={enriloLogo} alt="Enrilo" className="w-[180px] mb-2"/>
                      <p className="font-semibold">Thank you for your business.</p>
                    </div>
                    <div className="text-sm text-right">
                      <p className="font-semibold">For {singlePaymentData.consultancy_name}</p>
                      <p className="mt-6">Authorised Signatory</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DELETE CONFIRM MODAL */}
          {showConfirmDelete && (
            <div className="fixed inset-0 backdrop-blur-md flex justify-center items-center z-50">
              <div className="bg-white text-[#334155] rounded-lg p-6 w-80 shadow-xl text-center">
                <p className="text-center font-medium text-xl mb-5">Are you sure you want to delete this payment detail?</p>
                <div className="flex justify-center gap-4">
                  <button className="bg-[#1E293B] hover:bg-[#334155] text-yellow-300 border-2 px-4 py-2 rounded-md w-24 transition cursor-pointer" onClick={handleDeleteConfirmed}>
                    Yes
                  </button>
                  <button className="bg-gray-300 border-2 px-4 py-2 rounded-md w-24 hover:bg-gray-400 transition cursor-pointer" onClick={() => setShowConfirmDelete(false)}>
                    No
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SUCCESS MODAL */}
          {showSuccess && (
            <div className="fixed inset-0 backdrop-blur-md flex justify-center items-center z-50">
              <div className="bg-white text-[#334155] rounded-lg p-6 w-80 shadow-xl text-center">
                <p className="text-center font-medium text-xl mb-5">Payment detail has been deleted!</p>
                <div className="flex justify-center gap-4">
                  <button className="bg-[#1E293B] hover:bg-[#334155] text-yellow-300 border-2 px-4 py-2 rounded-md w-24 transition cursor-pointer" onClick={() => { setShowSuccess(false); window.location.reload(true); }}>
                    OK
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* DELETING MODAL */}
          {showDeleting && (
            <div className="fixed inset-0 backdrop-blur-md flex justify-center items-center z-50">
              <div className="bg-white text-[#334155] rounded-lg p-6 w-80 shadow-xl text-center">
                <div className="text-xl font-semibold flex justify-center items-center gap-3">
                  <div className="w-20 h-20">
                    <svg className="w-full h-full animate-spin text-yellow-400" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
                      <text x="50" y="68" textAnchor="middle" fontFamily="Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" fontSize="100" fontWeight="700" fill="currentColor">
                        e
                      </text>
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-xl font-semibold mb-2">Deleting...</p>
                    <p className="text-[#334155]">Please hold on! The payment detail is being deleted.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* LOADING MODAL */}
          {pageLoading && (
            <div className="fixed inset-0 backdrop-blur-md flex justify-center items-center z-50">
              <div className="bg-white text-[#334155] rounded-lg p-6 w-80 shadow-xl text-center">
                <div className="text-xl font-semibold flex justify-center items-center gap-3">
                  <div className="w-20 h-20">
                    <svg className="w-full h-full animate-spin text-yellow-400" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
                      <text x="50" y="68" textAnchor="middle" fontFamily="Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" fontSize="100" fontWeight="700" fill="currentColor">
                        e
                      </text>
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-xl font-semibold mb-2">Loading...</p>
                    <p className="text-[#334155]">Please wait while we load the all payment details.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
