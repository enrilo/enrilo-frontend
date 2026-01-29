// import { useState, useEffect, useMemo } from "react";
// import { TextField } from "@mui/material";
// import Select from "react-select";
// import { useSelector } from "react-redux";
// import { useNavigate, useParams } from "react-router-dom";
// import { selectStyles } from "../styles/selectStyles.js";
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import dayjs from 'dayjs';

// export default function EditPayment() {
//   const { loading } = useSelector((state) => state.user);
//   const navigate = useNavigate();
//   const params = useParams();
//   const [formData, setFormData] = useState({
//     consultancy_id: "",
//     consultancy_name: "",
//     rate: 0,
//     duration_in_months: 0,
//     subtotal: 0,
//     is_discount_available: false,
//     discount_amount: 0,
//     net_total: 0,
//     gst_amount: 0,
//     grand_total: 0,
//     payment_status: "pending",
//     payment_received: 0,
//     pending_payment: 0,
//     from_date: null,
//     to_date: null,
//   });
//   const [allConsultancies, setAllConsultancies] = useState([]);
//   const [pageLoading, setPageLoading] = useState(false);
//   const [allowWriteAccess, setAllowWriteAccess] = useState(false);
//   const [selectedConsultancy, setSelectedConsultancy] = useState(null);
//   const [selectedPaymentOptionStatus, setSelectedPaymentOptionStatus] = useState(null);
//   const [confirmOpen, setConfirmOpen] = useState(false);
//   const [confirmMessage, setConfirmMessage] = useState("");
//   const [modalMessage, setModalMessage] = useState("");
//   const [messageOpen, setMessageOpen] = useState(false);
//   const [failedToSaveMessage, setFailedToSaveMessage] = useState("");
//   const [failedToSaveMsgOpen, setFailedToSaveMsgOpen] = useState(false);
//   const [saveSuccessfulMessage, setSaveSuccessfulMessage] = useState("");
//   const [saveSuccessfulMsgOpen, setSaveSuccessfulMsgOpen] = useState(false);
//   const persistedRoot = JSON.parse(localStorage.getItem("persist:root"));
//   const userState = JSON.parse(persistedRoot.user);
//   const token = userState.currentUser?.data?.accessToken;
//   const loggedInUserID = userState.currentUser?.data?.id;

//   const paymentStatusOptions = [
//     { value: 'pending', label: "Full Payment Pending" },
//     { value: 'partial', label: "Partial Payment Pending" },
//     { value: 'full', label: "Full Payment Complete" }
//   ];

//   useEffect(() => {
//     const fetchAllConsultancies = async () => {
//       try {
//         setPageLoading(true);
//         const accessTokenRes = await fetch(`http://localhost:3000/api/access-tokens/access-token-by-super-admin-id/${loggedInUserID}`, {
//           method: "GET",
//           headers: { "Content-Type": "application/json" },
//         });
//         const accessTokenData = await accessTokenRes.json();
//         if(accessTokenData.success === false){
//           setPageLoading(false);
//           return;
//         }
//         setAllowWriteAccess(accessTokenData.data.accessToken.allow_write_access);

//         const res = await fetch(`http://localhost:3000/api/consultancies/`, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         const data = await res.json();
//         if (!data.success) {
//           setAllConsultancies([]);
//           setPageLoading(false);
//           return;
//         }

//         const filteredConsultancies = data.data.consultancies.map((c) => ({
//           id: c._id,
//           name: c.name,
//         }));

//         setAllConsultancies(filteredConsultancies);
//         setPageLoading(false);
//       } catch (error) {
//         console.log("Error fetching consultancies:", error);
//         setPageLoading(false);
//       }
//     };

//     fetchAllConsultancies();

//     const fetchAPayment = async () => {
//       try {
//         setPageLoading(true);

//         const res = await fetch(`http://localhost:3000/api/payment-detail/${params.id}`, {
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

//         const paymentDetails = {
//           ...data.data.payment_details,
//           from_date: data.data.payment_details.from_date ? dayjs(data.data.payment_details.from_date) : null,
//           to_date: data.data.payment_details.to_date ? dayjs(data.data.payment_details.to_date) : null,
//         };

//         setFormData(paymentDetails);

//         // Set selected options for Select components
//         setSelectedConsultancy({
//           value: paymentDetails.consultancy_id,
//           label: paymentDetails.consultancy_name,
//         });

//         setSelectedPaymentOptionStatus(paymentStatusOptions.find(opt => opt.value === paymentDetails.payment_status));

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

//     fetchAPayment();
//   }, []);

//   useEffect(() => {
//     const { from_date, duration_in_months } = formData;
//     if (from_date && duration_in_months > 0) {
//       const calculatedToDate = dayjs(from_date).add(duration_in_months, "month");
//       setFormData((prev) => ({
//         ...prev,
//         to_date: calculatedToDate,
//       }));
//     } else {
//       setFormData((prev) => ({
//         ...prev,
//         to_date: null,
//       }));
//     }
//   }, [formData.from_date, formData.duration_in_months]);

//   useEffect(() => {
//     const rate = Number(formData.rate) || 0;
//     const duration = Number(formData.duration_in_months) || 0;
//     const discount = Number(formData.discount_amount) || 0;
//     const paymentReceived = Number(formData.payment_received) || 0;
//     const gstRate = 0;

//     const subtotal = rate * duration;
//     const net_total = subtotal - discount;
//     const grand_total = net_total + net_total * gstRate;
//     let pending_payment = grand_total - paymentReceived;
//     if(pending_payment < 0) pending_payment = 0;

//     setFormData((prev) => ({
//       ...prev,
//       subtotal,
//       net_total,
//       grand_total,
//       pending_payment,
//     }));
//   }, [formData.rate, formData.duration_in_months, formData.discount_amount, formData.payment_received]);

//   useEffect(() => {
//     const grandTotal = Number(formData.grand_total) || 0;
//     if (formData.payment_status === "pending") {
//       setFormData((prev) => ({
//         ...prev,
//         payment_received: 0,
//         pending_payment: grandTotal,
//       }));
//     } else if (formData.payment_status === "full") {
//       setFormData((prev) => ({
//         ...prev,
//         payment_received: grandTotal,
//         pending_payment: 0,
//       }));
//     }
//   }, [formData.payment_status, formData.grand_total]);

//   const consultancyOptions = useMemo(
//     () =>
//       allConsultancies.map((c) => ({
//         value: c.id,
//         label: c.name,
//       })),
//     [allConsultancies]
//   );

//   const handleChange = (e) => {
//     const { id, value } = e.target;
//     setFormData((p) => ({ ...p, [id]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setPageLoading(true); 
//     try {
//       const payload = { ...formData };
//       const res = await fetch(`http://localhost:3000/api/payment-detail/${formData._id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         body: JSON.stringify(payload),
//         credentials: "include",
//       });
//       const data = await res.json();
//       if (!data.success) {
//         setFailedToSaveMessage(`Failed to update payment details: ${data.message}`);
//         setFailedToSaveMsgOpen(true);
//         setPageLoading(false); 
//         return;
//       }
//       setSaveSuccessfulMessage("Payment details updated successfully! You will now be redirected to All Payments Page.");
//       setSaveSuccessfulMsgOpen(true);
//     } catch (err) {
//       console.error(err);
//       setFailedToSaveMessage(`Failed to update payment details: ${err.message}`);
//       setFailedToSaveMsgOpen(true);
//     } finally {
//       setPageLoading(false); 
//     }
//   };

//   return (
//     <main className="flex-1 overflow-y-auto p-6">
//       <div className="p-4">
//         <div className="bg-white rounded-2xl shadow p-6 max-w-6xl mx-auto">
//           <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4 max-w-6xl mx-auto">

//             <div className="flex flex-row items-center justify-between gap-4">
//               <label className="w-[200px] text-left font-xl text-gray-700">Select Consultancy Name:</label>
//               <div className="w-[210px]">
//                 <Select isSearchable required isDisabled={!allowWriteAccess} options={consultancyOptions} placeholder="Select Consultancy" styles={selectStyles} menuPortalTarget={document.body} value={selectedConsultancy}
//                   onChange={(selectedOption) => {                    
//                     setSelectedConsultancy(selectedOption);                    
//                     setFormData((prev) => ({
//                       ...prev,
//                       consultancy_id: selectedOption?.value || "",
//                       consultancy_name: selectedOption?.label || "",
//                     }));
//                   }}
//                 />
//               </div>
//             </div>

//             <div className="flex flex-row items-center justify-center gap-4">
//               <label className="w-[200px] text-left font-xl text-gray-700">Rate Applicable:</label>
//               <TextField id="rate" value={formData.rate} variant="outlined" className="w-[210px]" disabled={!allowWriteAccess} required onChange={handleChange} />
//             </div>

//             <div className="flex flex-row items-center justify-center gap-4">
//               <label className="w-[200px] text-left font-xl text-gray-700">Duration (Months):</label>
//               <TextField id="duration_in_months" type="number" value={formData.duration_in_months ?? ""} variant="outlined" className="w-[210px]" disabled={!allowWriteAccess}
//                 onChange={(e) => {
//                   setFormData((prev) => ({
//                     ...prev,
//                     duration_in_months: e.target.value === "" ? null : Number(e.target.value),
//                   }))
//                 }}
//               />
//             </div>

//             <div className="flex flex-row items-center justify-center gap-4">
//               <label className="w-[200px] text-left font-xl text-gray-700">From Date:</label>
//               <div className="w-[210px]">
//                 <DatePicker value={formData.from_date} onChange={(newValue) => setFormData(prev => ({ ...prev, from_date: newValue }))} />
//               </div>
//             </div>

//             <div className="flex flex-row items-center justify-center gap-4">
//               <label className="w-[200px] text-left font-xl text-gray-700">To Date:</label>
//               <div className="w-[210px]">
//                 <DatePicker value={formData.to_date} disabled />
//               </div>
//             </div>

//             <div className="flex flex-row items-center justify-center gap-4">
//               <label className="w-[200px] text-left font-xl text-gray-700">Subtotal:</label>
//               <TextField value={formData.subtotal} className="w-[210px] cursor-not-allowed" disabled />
//             </div>

//             <div className="flex flex-row items-center justify-center gap-4">
//               <label className="w-[200px] text-left font-xl text-gray-700">Is Discount Available?</label>
//               <div className="flex gap-6 w-[210px]">
//                 <label className="flex items-center gap-2">
//                   <input type="radio" checked={formData.is_discount_available} onChange={() => setFormData(prev => ({ ...prev, is_discount_available: true }))} className="accent-[#1E293B] cursor-pointer" />
//                   Yes
//                 </label>
//                 <label className="flex items-center gap-2">
//                   <input type="radio" checked={!formData.is_discount_available} onChange={() => setFormData(prev => ({ ...prev, is_discount_available: false }))} className="accent-[#1E293B] cursor-pointer" />
//                   No
//                 </label>
//               </div>
//             </div>

//             <div className="flex flex-row items-center justify-center gap-4">
//               <label className="w-[200px] text-left font-xl text-gray-700">Discount Amount:</label>
//               <TextField id="discount_amount" value={formData.discount_amount} onChange={handleChange} variant="outlined" disabled={!allowWriteAccess || !formData.is_discount_available} className={`w-[210px] ${!allowWriteAccess || !formData.is_discount_available ? 'cursor-not-allowed' : 'cursor-auto'}`} />
//             </div>

//             <div className="flex flex-row items-center justify-center gap-4">
//               <label className="w-[200px] text-left font-xl text-gray-700">Net Total:</label>
//               <TextField value={formData.net_total} disabled className="w-[210px] cursor-not-allowed" />
//             </div>

//             <div className="flex flex-row items-center justify-center gap-4">
//               <label className="w-[200px] text-left font-xl text-gray-700">GST @0%:</label>
//               <TextField value={formData.gst_amount} disabled className="w-[210px] cursor-not-allowed" />
//             </div>

//             <div className="flex flex-row items-center justify-center gap-4">
//               <label className="w-[200px] text-left font-xl text-gray-700">Grand Total:</label>
//               <TextField value={formData.grand_total} disabled className="w-[210px] cursor-not-allowed" />
//             </div>

//             <div className="flex flex-row items-center justify-center gap-4">
//               <label className="w-[200px] text-left font-xl text-gray-700">Payment Status:</label>
//               <div className="w-[210px]">
//                 <Select isSearchable required options={paymentStatusOptions} value={selectedPaymentOptionStatus} isDisabled={!allowWriteAccess} styles={selectStyles} menuPortalTarget={document.body}
//                   onChange={(sel) => {
//                     setSelectedPaymentOptionStatus(sel);
//                     setFormData((p) => ({ ...p, payment_status: sel?.value || "pending" }));
//                   }}
//                 />
//               </div>
//             </div>

//             <div className="flex flex-row items-center justify-center gap-4">
//               <label className="w-[200px] text-left font-xl text-gray-700">Payment Received:</label>
//               <TextField
//                 id="payment_received"
//                 value={formData.payment_received}
//                 variant="outlined"
//                 disabled={formData.payment_status !== "partial" || !allowWriteAccess}
//                 className={`w-[210px] ${formData.payment_status !== "partial" || !allowWriteAccess ? 'cursor-not-allowed' : 'cursor-auto'}`}
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="flex flex-row items-center justify-center gap-4">
//               <label className="w-[200px] text-left font-xl text-gray-700">Pending Payment:</label>
//               <TextField disabled value={formData.pending_payment} className="w-[210px] cursor-not-allowed" />
//             </div>

//             <div className="flex justify-center mt-6">
//               <button type="submit" disabled={loading || !allowWriteAccess}
//                 className={`bg-[#1E293B] text-yellow-300 font-semibold px-8 py-2 rounded-md transition ${allowWriteAccess ? "cursor-pointer hover:bg-[#334155]" : "cursor-not-allowed"}`} >
//                 {loading ? "Saving..." : "Save Details"}
//               </button>
//             </div>
//           </form>

//           {confirmOpen && (
//             <div className="fixed inset-0 backdrop-blur-md flex justify-center items-center z-50">
//               <div className="bg-white text-[#334155] rounded-lg p-6 w-80 shadow-xl text-center">
//                 <p className="text-center font-medium text-xl mb-5">{confirmMessage}</p>
//                 <div className="flex justify-center gap-4">
//                   <button className="bg-[#1E293B] hover:bg-[#334155] text-yellow-300 font-semibold  border-2 px-4 py-2 rounded-md w-24 transition cursor-pointer" onClick={() => setConfirmOpen(false)} >
//                     Yes
//                   </button>
//                   <button className="bg-gray-300 border-2 px-4 py-2 rounded-md w-24 hover:bg-gray-400 transition cursor-pointer" onClick={() => setConfirmOpen(false)} >
//                     No
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {messageOpen && (
//             <div className="fixed inset-0 backdrop-blur-md flex justify-center items-center z-50">
//               <div className="bg-white text-[#334155] rounded-lg p-6 w-80 shadow-xl text-center">
//                 <p className="mb-4 text-xl">{modalMessage}</p>
//                 <button className="bg-[#1E293B] hover:bg-[#334155] text-yellow-300 font-semibold border-2 px-4 py-2 rounded-md w-24 transition cursor-pointer" onClick={() => setMessageOpen(false)} >
//                   OK
//                 </button>
//               </div>
//             </div>
//           )}

//           {failedToSaveMsgOpen && (
//             <div className="fixed inset-0 backdrop-blur-md flex justify-center items-center z-50">
//               <div className="bg-white text-[#334155] rounded-lg p-6 w-80 shadow-xl text-center">
//                 <p className="mb-4 text-xl">{failedToSaveMessage}</p>
//                 <button className="bg-[#1E293B] hover:bg-[#334155] text-yellow-300 font-semibold border-2 px-4 py-2 rounded-md w-24 transition cursor-pointer" onClick={() => setFailedToSaveMsgOpen(false)} >
//                   OK
//                 </button>
//               </div>
//             </div>
//           )}

//           {saveSuccessfulMsgOpen && (
//             <div className="fixed inset-0 backdrop-blur-md flex justify-center items-center z-50">
//               <div className="bg-white text-[#334155] rounded-lg p-6 w-80 shadow-xl text-center">
//                 <p className="mb-4 text-xl">{saveSuccessfulMessage}</p>
//                 <button className="bg-[#1E293B] hover:bg-[#334155] text-yellow-300 font-semibold px-4 py-2 rounded-md w-24 transition cursor-pointer" onClick={() => { setSaveSuccessfulMsgOpen(false); navigate("/all-payments");}} >
//                   OK
//                 </button>
//               </div>
//             </div>
//           )}

//           {pageLoading && (
//             <div className="fixed inset-0 backdrop-blur-md flex justify-center items-center z-50">
//               <div className="bg-white text-[#334155] rounded-lg p-6 w-80 shadow-xl text-center">
//                 <div className="text-xl font-semibold flex justify-center items-center gap-3">
//                   <div className="w-20 h-20">
//                     <svg className="w-full h-full animate-spin text-yellow-400" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
//                         <text x="50" y="68" textAnchor="middle" fontFamily="Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" fontSize="100" fontWeight="700" fill="currentColor">
//                         e
//                         </text>
//                     </svg>
//                   </div>
//                   <div className="flex flex-col">
//                     <p className="text-xl font-semibold mb-2">Loading...</p>
//                     <p className="text-[#334155]">Please wait while we save your details.</p>
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


import { useState, useEffect, useMemo } from "react";
import { TextField } from "@mui/material";
import Select from "react-select";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { selectStyles } from "../styles/selectStyles.js";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

export default function EditPayment() {
  const { loading } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const params = useParams();
  const [formData, setFormData] = useState({
    consultancy_id: "",
    consultancy_name: "",
    rate: 0,
    duration_in_months: 0,
    subtotal: 0,
    is_discount_available: false,
    discount_amount: 0,
    net_total: 0,
    gst_amount: 0,
    grand_total: 0,
    payment_status: "pending",
    payment_received: 0,
    pending_payment: 0,
    from_date: null,
    to_date: null,
    billing_date: null,
  });
  const [allConsultancies, setAllConsultancies] = useState([]);
  const [pageLoading, setPageLoading] = useState(false);
  const [allowWriteAccess, setAllowWriteAccess] = useState(false);
  const [selectedConsultancy, setSelectedConsultancy] = useState(null);
  const [selectedPaymentOptionStatus, setSelectedPaymentOptionStatus] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [messageOpen, setMessageOpen] = useState(false);
  const [failedToSaveMessage, setFailedToSaveMessage] = useState("");
  const [failedToSaveMsgOpen, setFailedToSaveMsgOpen] = useState(false);
  const [saveSuccessfulMessage, setSaveSuccessfulMessage] = useState("");
  const [saveSuccessfulMsgOpen, setSaveSuccessfulMsgOpen] = useState(false);
  const persistedRoot = JSON.parse(localStorage.getItem("persist:root"));
  const userState = JSON.parse(persistedRoot.user);
  const token = userState.currentUser?.data?.accessToken;
  const loggedInUserID = userState.currentUser?.data?.id;

  const paymentStatusOptions = [
    { value: 'pending', label: "Full Payment Pending" },
    { value: 'partial', label: "Partial Payment Pending" },
    { value: 'full', label: "Full Payment Complete" }
  ];

  useEffect(() => {
    const fetchAllConsultancies = async () => {
      try {
        setPageLoading(true);
        const accessTokenRes = await fetch(`http://localhost:3000/api/access-tokens/access-token-by-super-admin-id/${loggedInUserID}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const accessTokenData = await accessTokenRes.json();
        if(accessTokenData.success === false){
          setPageLoading(false);
          return;
        }
        setAllowWriteAccess(accessTokenData.data.accessToken.allow_write_access);

        const res = await fetch(`http://localhost:3000/api/consultancies/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!data.success) {
          setAllConsultancies([]);
          setPageLoading(false);
          return;
        }

        const filteredConsultancies = data.data.consultancies.map((c) => ({
          id: c._id,
          name: c.name,
        }));

        setAllConsultancies(filteredConsultancies);
        setPageLoading(false);
      } catch (error) {
        console.log("Error fetching consultancies:", error);
        setPageLoading(false);
      }
    };

    fetchAllConsultancies();

    const fetchAPayment = async () => {
      try {
        setPageLoading(true);

        const res = await fetch(`http://localhost:3000/api/payment-detail/${params.id}`, {
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

        console.log(`data.data.paument_details:${data.data.payment_details.is_discount_available}`)

        // Parse from_date and to_date to Day.js objects
        const paymentDetails = {
          ...data.data.payment_details,
          from_date: data.data.payment_details.from_date ? dayjs(data.data.payment_details.from_date) : null,
          to_date: data.data.payment_details.to_date ? dayjs(data.data.payment_details.to_date) : null,
          billing_date: data.data.payment_details.billing_date ? dayjs(data.data.payment_details.billing_date) : null,
        };

        setFormData(paymentDetails);

        // Set selected options for Select components
        setSelectedConsultancy({
          value: paymentDetails.consultancy_id,
          label: paymentDetails.consultancy_name,
        });

        setSelectedPaymentOptionStatus(paymentStatusOptions.find(opt => opt.value === paymentDetails.payment_status));

        // Fetch write access
        const accessRes = await fetch(
          `http://localhost:3000/api/access-tokens/access-token-by-super-admin-id/${loggedInUserID}`,
          { method: "GET", headers: { "Content-Type": "application/json" } }
        );
        const accessData = await accessRes.json();
        if (accessData.success) setAllowWriteAccess(accessData.data.accessToken.allow_write_access);

        setPageLoading(false);
      } catch (error) {
        console.log(`Error:${error}`)
        setPageLoading(false);
      }
    };

    fetchAPayment();
  }, []);

  useEffect(() => {
    const { from_date, duration_in_months } = formData;
    if (from_date && duration_in_months > 0) {
      const calculatedToDate = dayjs(from_date).add(duration_in_months, "month");
      setFormData((prev) => ({
        ...prev,
        to_date: calculatedToDate,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        to_date: null,
      }));
    }
  }, [formData.from_date, formData.duration_in_months]);

  useEffect(() => {
    const rate = Number(formData.rate) || 0;
    const duration = Number(formData.duration_in_months) || 0;
    const discount = Number(formData.discount_amount) || 0;
    const paymentReceived = Number(formData.payment_received) || 0;
    const gstRate = 0;

    const subtotal = rate * duration;
    const net_total = subtotal - discount;
    const grand_total = net_total + net_total * gstRate;
    let pending_payment = grand_total - paymentReceived;
    if(pending_payment < 0) pending_payment = 0;

    setFormData((prev) => ({
      ...prev,
      subtotal,
      net_total,
      grand_total,
      pending_payment,
    }));
  }, [formData.rate, formData.duration_in_months, formData.discount_amount, formData.payment_received]);

  useEffect(() => {
    const grandTotal = Number(formData.grand_total) || 0;
    if (formData.payment_status === "pending") {
      setFormData((prev) => ({
        ...prev,
        payment_received: 0,
        pending_payment: grandTotal,
      }));
    } else if (formData.payment_status === "full") {
      setFormData((prev) => ({
        ...prev,
        payment_received: grandTotal,
        pending_payment: 0,
      }));
    }
  }, [formData.payment_status, formData.grand_total]);

  const consultancyOptions = useMemo(
    () =>
      allConsultancies.map((c) => ({
        value: c.id,
        label: c.name,
      })),
    [allConsultancies]
  );

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((p) => ({ ...p, [id]: value }));
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setPageLoading(true); 
  //   try {
  //     const payload = { ...formData };
  //     const res = await fetch(`http://localhost:3000/api/payment-detail/${formData._id}`, {
  //       method: "PUT",
  //       headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  //       body: JSON.stringify(payload),
  //       credentials: "include",
  //     });
  //     const data = await res.json();
  //     console.log(`data:${JSON.stringify(data)}`);
      
  //     if (!data.success) {
  //       setFailedToSaveMessage(`Failed to update payment details: ${data.message}`);
  //       setFailedToSaveMsgOpen(true);
  //       setPageLoading(false); 
  //       return;
  //     }
  //     setSaveSuccessfulMessage("Payment details updated successfully! You will now be redirected to All Payments Page.");
  //     setSaveSuccessfulMsgOpen(true);
  //   } catch (err) {
  //     console.error(err);
  //     setFailedToSaveMessage(`Failed to update payment details: ${err.message}`);
  //     setFailedToSaveMsgOpen(true);
  //   } finally {
  //     setPageLoading(false); 
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPageLoading(true); 
    try {
      const { _id, createdAt, updatedAt, __v, ...payload } = formData;
      const res = await fetch(`http://localhost:3000/api/payment-detail/${formData._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
        credentials: "include",
      });
      const data = await res.json();
      if (!data.success) {
        setFailedToSaveMessage(`Failed to update payment details: ${data.message}`);
        setFailedToSaveMsgOpen(true);
        setPageLoading(false); 
        return;
      }
      setSaveSuccessfulMessage("Payment details updated successfully! You will now be redirected to All Payments Page.");
      setSaveSuccessfulMsgOpen(true);
    } catch (err) {
      console.error(err);
      setFailedToSaveMessage(`Failed to update payment details: ${err.message}`);
      setFailedToSaveMsgOpen(true);
    } finally {
      setPageLoading(false); 
    }
  };


  return (
    <main className="flex-1 overflow-y-auto p-6">
      <div className="p-4">
        <div className="bg-white rounded-2xl shadow p-6 max-w-6xl mx-auto">
          <div className="text-center align-middle font-semibold mb-10">
            <span>Note:{" "}</span>All Amounts Specified Are In Indian Rupees (INR)
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4 max-w-6xl mx-auto">
            <div className="flex flex-row items-center justify-between gap-4">
              <label className="w-[200px] text-left font-xl text-gray-700">Select Consultancy Name:</label>
              <div className="w-[210px]">
                <Select isSearchable required isDisabled={!allowWriteAccess} options={consultancyOptions} placeholder="Select Consultancy" styles={selectStyles} menuPortalTarget={document.body} value={selectedConsultancy}
                  onChange={(selectedOption) => {                    
                    setSelectedConsultancy(selectedOption);                    
                    setFormData((prev) => ({
                      ...prev,
                      consultancy_id: selectedOption?.value || "",
                      consultancy_name: selectedOption?.label || "",
                    }));
                  }}
                />
              </div>
            </div>

            <div className="flex flex-row items-center justify-center gap-4">
              <label className="w-[200px] text-left font-xl text-gray-700">Billing Date:</label>
              <div className="w-[210px]">
                <DatePicker value={formData.billing_date} onChange={(newValue) => setFormData((prev) => ({ ...prev, billing_date: newValue })) } />
              </div>
            </div>

            <div className="flex flex-row items-center justify-center gap-4">
              <label className="w-[200px] text-left font-xl text-gray-700">Rate Applicable:</label>
              <TextField id="rate" value={formData.rate} variant="outlined" className="w-[210px]" disabled={!allowWriteAccess} required onChange={handleChange} />
            </div>

            <div className="flex flex-row items-center justify-center gap-4">
              <label className="w-[200px] text-left font-xl text-gray-700">Duration (Months):</label>
              <TextField id="duration_in_months" type="number" value={formData.duration_in_months ?? ""} variant="outlined" className="w-[210px]" disabled={!allowWriteAccess}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    duration_in_months: e.target.value === "" ? null : Number(e.target.value),
                  }))
                }}
              />
            </div>

            <div className="flex flex-row items-center justify-center gap-4">
              <label className="w-[200px] text-left font-xl text-gray-700">From Date:</label>
              <div className="w-[210px]">
                <DatePicker value={formData.from_date} onChange={(newValue) => setFormData((prev) => ({ ...prev, from_date: newValue })) } />
              </div>
            </div>

            <div className="flex flex-row items-center justify-center gap-4">
              <label className="w-[200px] text-left font-xl text-gray-700">To Date:</label>
              <div className="w-[210px]">
                <DatePicker value={formData.to_date} className="cursor-not-allowed" disabled />
              </div>
            </div>

            <div className="flex flex-row items-center justify-center gap-4">
              <label className="w-[200px] text-left font-xl text-gray-700">Subtotal:</label>
              <TextField value={formData.subtotal} className="w-[210px] cursor-not-allowed" disabled />
            </div>

            <div className="flex flex-row items-center justify-center gap-4">
              <label className="w-[200px] text-left font-xl text-gray-700">Is Discount Available?</label>
              <div className="flex gap-6 w-[210px]">
                <label className="flex items-center gap-2">
                  <input type="radio" checked={formData.is_discount_available} onChange={() => setFormData(prev => ({ ...prev, is_discount_available: true }))} className="accent-[#1E293B] cursor-pointer" />
                  Yes
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" checked={!formData.is_discount_available} onChange={() => setFormData(prev => ({ ...prev, is_discount_available: false }))} className="accent-[#1E293B] cursor-pointer" />
                  No
                </label>
              </div>
            </div>

            <div className="flex flex-row items-center justify-center gap-4">
              <label className="w-[200px] text-left font-xl text-gray-700">Discount Amount:</label>
              <TextField id="discount_amount" value={formData.discount_amount} onChange={handleChange} variant="outlined" disabled={!allowWriteAccess || !formData.is_discount_available} className={`w-[210px] ${!allowWriteAccess || !formData.is_discount_available ? 'cursor-not-allowed' : 'cursor-auto'}`} />
            </div>

            <div className="flex flex-row items-center justify-center gap-4">
              <label className="w-[200px] text-left font-xl text-gray-700">Net Total:</label>
              <TextField value={formData.net_total} disabled className="w-[210px] cursor-not-allowed" />
            </div>

            <div className="flex flex-row items-center justify-center gap-4">
              <label className="w-[200px] text-left font-xl text-gray-700">GST @0%:</label>
              <TextField value={formData.gst_amount} disabled className="w-[210px] cursor-not-allowed" />
            </div>

            <div className="flex flex-row items-center justify-center gap-4">
              <label className="w-[200px] text-left font-xl text-gray-700">Grand Total:</label>
              <TextField value={formData.grand_total} disabled className="w-[210px] cursor-not-allowed" />
            </div>

            <div className="flex flex-row items-center justify-center gap-4">
              <label className="w-[200px] text-left font-xl text-gray-700">Payment Status:</label>
              <div className="w-[210px]">
                <Select isSearchable required options={paymentStatusOptions} value={selectedPaymentOptionStatus} isDisabled={!allowWriteAccess} styles={selectStyles} menuPortalTarget={document.body} onChange={(sel) => { setSelectedPaymentOptionStatus(sel); setFormData((p) => ({ ...p, payment_status: sel?.value || "pending" })); }} />
              </div>
            </div>

            <div className="flex flex-row items-center justify-center gap-4">
              <label className="w-[200px] text-left font-xl text-gray-700">Payment Received:</label>
              <TextField id="payment_received" value={formData.payment_received} variant="outlined" disabled={formData.payment_status !== "partial" || !allowWriteAccess} className={`w-[210px] ${formData.payment_status !== "partial" || !allowWriteAccess ? 'cursor-not-allowed' : 'cursor-auto'}`} onChange={handleChange} />
            </div>

            <div className="flex flex-row items-center justify-center gap-4">
              <label className="w-[200px] text-left font-xl text-gray-700">Pending Payment:</label>
              <TextField disabled value={formData.pending_payment} className="w-[210px] cursor-not-allowed" />
            </div>

            <div className="flex justify-center mt-6">
              <button type="submit" disabled={loading || !allowWriteAccess}
                className={`bg-[#1E293B] text-yellow-300 font-semibold px-8 py-2 rounded-md transition ${allowWriteAccess ? "cursor-pointer hover:bg-[#334155]" : "cursor-not-allowed"}`} >
                {loading ? "Updating..." : "Update Payment"}
              </button>
            </div>
          </form>

          {confirmOpen && (
            <div className="fixed inset-0 backdrop-blur-md flex justify-center items-center z-50">
              <div className="bg-white text-[#334155] rounded-lg p-6 w-80 shadow-xl text-center">
                <p className="text-center font-medium text-xl mb-5">{confirmMessage}</p>
                <div className="flex justify-center gap-4">
                  <button className="bg-[#1E293B] hover:bg-[#334155] text-yellow-300 font-semibold  border-2 px-4 py-2 rounded-md w-24 transition cursor-pointer" onClick={() => setConfirmOpen(false)} >
                    Yes
                  </button>
                  <button className="bg-gray-300 border-2 px-4 py-2 rounded-md w-24 hover:bg-gray-400 transition cursor-pointer" onClick={() => setConfirmOpen(false)} >
                    No
                  </button>
                </div>
              </div>
            </div>
          )}

          {messageOpen && (
            <div className="fixed inset-0 backdrop-blur-md flex justify-center items-center z-50">
              <div className="bg-white text-[#334155] rounded-lg p-6 w-80 shadow-xl text-center">
                <p className="mb-4 text-xl">{modalMessage}</p>
                <button className="bg-[#1E293B] hover:bg-[#334155] text-yellow-300 font-semibold border-2 px-4 py-2 rounded-md w-24 transition cursor-pointer" onClick={() => setMessageOpen(false)} >
                  OK
                </button>
              </div>
            </div>
          )}

          {failedToSaveMsgOpen && (
            <div className="fixed inset-0 backdrop-blur-md flex justify-center items-center z-50">
              <div className="bg-white text-[#334155] rounded-lg p-6 w-80 shadow-xl text-center">
                <p className="mb-4 text-xl">{failedToSaveMessage}</p>
                <button className="bg-[#1E293B] hover:bg-[#334155] text-yellow-300 font-semibold border-2 px-4 py-2 rounded-md w-24 transition cursor-pointer" onClick={() => setFailedToSaveMsgOpen(false)} >
                  OK
                </button>
              </div>
            </div>
          )}

          {saveSuccessfulMsgOpen && (
            <div className="fixed inset-0 backdrop-blur-md flex justify-center items-center z-50">
              <div className="bg-white text-[#334155] rounded-lg p-6 w-80 shadow-xl text-center">
                <p className="mb-4 text-xl">{saveSuccessfulMessage}</p>
                <button className="bg-[#1E293B] hover:bg-[#334155] text-yellow-300 font-semibold px-4 py-2 rounded-md w-24 transition cursor-pointer" onClick={() => { setSaveSuccessfulMsgOpen(false); navigate("/all-payments");}} >
                  OK
                </button>
              </div>
            </div>
          )}

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
                    <p className="text-[#334155]">Please wait while we save your details.</p>
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