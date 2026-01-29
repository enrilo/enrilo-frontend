import { useState, useEffect, useRef } from "react";
import { useParams } from 'react-router-dom';
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import enriloLogo from "../../assets/images/regular-background/enrilo-without-tagline-1920x1080.png";

export default function ViewAPayment() {
  const params = useParams();
  const receiptRef = useRef();
  const { loading } = useSelector((state) => state.user);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [generateReceiptOpen, setGenerateReceiptOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [allowWriteAccess, setAllowWriteAccess] = useState(false);
  const [showDeleting, setShowDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [formData, setFormData] = useState({});
  const persistedRoot = JSON.parse(localStorage.getItem("persist:root"));
  // Parse the nested user slice
  const userState = JSON.parse(persistedRoot.user);
  // Extract token
  const token = userState.currentUser?.data?.accessToken;
  const role = userState.currentUser?.data?.role;
  const loggedInUserID = userState.currentUser?.data?.id;

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowConfirmDelete(true);
  };

  const handleDeleteConfirmed = async () => {  
    try {
      // Fetch consultancy details for deleting files
      setShowDeleting(true);
      
      const deleteRes = await fetch(`http://localhost:3000/api/payment-detail/${deleteId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
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

  useEffect(() => {
    const fetchAPayment = async () => {
      try {
        setPageLoading(true);
        // setCurrentUserID(userState.currentUser?.data?.id);

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
        
        setFormData(data.data.payment_details);

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

  return (
    <main className="flex-1 overflow-y-auto p-6">
      <div className="p-6 max-w-3xl mx-auto font-sans text-gray-800">
        {/* Bill Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">{formData.consultancy_name}</h1>
          <p className="text-lg font-semibold mb-5">Consultancy Payment Details</p>
          <p className="text-lg font-semibold">
            Billing Date:{" "}
            {new Date(formData.billing_date).toLocaleDateString("en-US", { day: "2-digit", month: "long", year: "numeric" })}
          </p>
          <div className="flex justify-center gap-8 text-gray-700 text-lg font-semibold mb-8">
            <p>
              From:{" "}
              {new Date(formData.from_date).toLocaleDateString("en-US", { day: "2-digit", month: "long", year: "numeric" })}
            </p>
            <p>
              To:{" "}
              {new Date(formData.to_date).toLocaleDateString("en-US", { day: "2-digit", month: "long", year: "numeric" })}
            </p>
          </div>
        </div>
        {/* Payment Status */}
        <div className="mb-5 text-center">
          <p className="font-semibold text-lg">
            Payment Status:{" "}
            <span className={`font-bold ${ formData.payment_status === "full" ? "text-green-600" : (formData.payment_status === "pending" ?"text-red-600":"text-orange-400") }`} >
              {formData.payment_status === "full" ? "Paid In Full" : (formData.payment_status === "pending" ? "Payment Pending" : "Partial Payment Complete")}
            </span>
          </p>
        </div>

        {/* Bill Table */}
        <table className="w-full text-left border-collapse text-lg mb-5">
          <tbody>
            <tr className="border-b border-gray-300">
              <td className="py-3 font-semibold">Rate</td>
              <td className="py-3 text-right">{formData.rate}</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="py-3 font-semibold">Duration (Months)</td>
              <td className="py-3 text-right">{formData.duration_in_months}</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="py-3 font-semibold">Subtotal</td>
              <td className="py-3 text-right">{formData.subtotal}</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="py-3 font-semibold">Discount</td>
              <td className="py-3 text-right">{formData.discount_amount}</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="py-3 font-semibold">Net Total</td>
              <td className="py-3 text-right">{formData.net_total}</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="py-3 font-semibold">GST @0%</td>
              <td className="py-3 text-right">{formData.gst_amount}</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="py-3 font-semibold">Grand Total</td>
              <td className="py-3 text-right">{formData.grand_total}</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="py-3 font-semibold">Payment Received</td>
              <td className="py-3 text-right">{formData.payment_received}</td>
            </tr>
            <tr>
              <td className="py-3 font-semibold">Payment Pending</td>
              <td className='py-3 text-right'>
                {formData.pending_payment}
              </td>
            </tr>
          </tbody>
        </table>
        <div className="text-center align-middle font-semibold mb-8">
          <span>Note:{" "}</span>All Amounts Specified Are In Indian Rupees (INR)
        </div>
        <div className="text-center align-middle font-semibold mb-5">
          <button type="button" className='bg-[#1E293B] hover:bg-[#334155] text-yellow-300 font-semibold px-6 py-2 rounded-md transition cursor-pointer' onClick={() => setGenerateReceiptOpen(true)}>
            View Receipt
          </button>
        </div>

        {/* Actions */}
        {allowWriteAccess && (
          <div className="flex flex-wrap justify-center gap-6">
            <Link to={`/edit-a-payment/${formData._id}`}>
              <button className="bg-slate-500 hover:bg-slate-600 text-white font-semibold px-6 py-2 rounded-md transition cursor-pointer">
                Edit Payment Detail
              </button>
            </Link>

            <button onClick={() => confirmDelete(formData._id)} className="bg-red-700 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-md transition cursor-pointer">
              Delete Payment Detail
            </button>
          </div>
        )}
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
                  {formData.consultancy_name}
                </h1>
                <p className="text-lg font-semibold mt-1">TAX INVOICE / PAYMENT RECEIPT</p>
                <p className="text-sm text-gray-600 mt-1">
                  All amounts are in Indian Rupees (₹ INR)
                </p>
              </div>

              {/* Invoice Meta */}
              <div className="grid grid-cols-2 gap-4 text-sm mb-6 justify-between">
                <div>
                  <p>
                    <span className="font-semibold">Receipt No:</span>{" "}
                    {formData.receipt_number || "—"}
                  </p>
                  <p>
                    <span className="font-semibold">Invoice Date:</span>{" "}
                    {new Date(formData.billing_date).toLocaleDateString("en-US", { day: "2-digit", month: "long", year: "numeric" })}
                  </p>
                </div>
                <div className="text-right">
                  <p>
                    <span className="font-semibold">Billing Period:</span>
                  </p>
                  <p>
                    {formData.from_date &&
                      new Date(formData.from_date).toLocaleDateString("en-US", { day: "2-digit", month: "long", year: "numeric" })
                    }{" "}
                    - {" "}
                    {formData.to_date &&
                      new Date(formData.to_date).toLocaleDateString("en-US", { day: "2-digit", month: "long", year: "numeric" })
                    }
                  </p>
                </div>
              </div>
              {/* Payment Status */}
              <div className="mb-6 text-center">
                <p className="font-semibold text-lg">
                  Payment Status:{" "}
                  <span
                    className={`font-bold ${ formData.payment_status === "full" ? "text-green-600" : formData.payment_status === "pending" ? "text-red-600" : "text-orange-500" }`}>
                    {formData.payment_status === "full" ? "PAID" : formData.payment_status === "pending" ? "PAYMENT PENDING" : "PARTIALLY PAID"}
                  </span>
                </p>
              </div>
              {/* Amount Table */}
              <table className="w-full text-sm border border-gray-300 mb-6">
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-semibold">Rate</td>
                    <td className="py-3 px-4 text-right">₹ {formData.rate}.00</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-semibold">Duration</td>
                    <td className="py-3 px-4 text-right">
                      {formData.duration_in_months} Months
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-semibold">Subtotal</td>
                    <td className="py-3 px-4 text-right">
                      ₹ {formData.subtotal}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-semibold">Discount</td>
                    <td className="py-3 px-4 text-right">
                      ₹ {formData.discount_amount}
                    </td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <td className="py-3 px-4 font-semibold">Net Total</td>
                    <td className="py-3 px-4 text-right font-semibold">
                      ₹ {formData.net_total}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-semibold">GST (0%)</td>
                    <td className="py-3 px-4 text-right">
                      ₹ {formData.gst_amount}
                    </td>
                  </tr>
                  <tr className="border-b bg-gray-100 text-lg">
                    <td className="py-3 px-4 font-bold">Grand Total</td>
                    <td className="py-3 px-4 text-right font-bold">
                      ₹ {formData.grand_total}
                    </td>
                  </tr>
                  {formData.payment_status !== "full" && (
                    <>
                      <tr className="border-b">
                        <td className="py-3 px-4 font-semibold">Payment Received</td>
                        <td className="py-3 px-4 text-right text-green-600">
                          ₹ {formData.payment_received}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-semibold">Balance Payable</td>
                        <td className="py-3 px-4 text-right text-red-600 font-semibold">
                          ₹ {formData.pending_payment}
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
                  <p className="font-semibold">For {formData.consultancy_name}</p>
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
            <p className="text-center font-semibold text-xl mb-5">Are you sure you want to delete this consultancy?</p>
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
                <p className="text-[#334155]">Please hold on! The payment information is being deleted.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="fixed inset-0 backdrop-blur-md flex justify-center items-center z-50">
          <div className="bg-white text-[#334155] rounded-lg p-6 w-80 shadow-xl text-center">
            <p className="text-xl font-semibold mb-2">Congratulations!</p>
            <p className="text-xl text-center mb-5">The payment information has been deleted successfully. You will now be redirectde to All Payments Page.</p>
            <div className="flex justify-center gap-4">
              <button className="bg-[#1E293B] hover:bg-[#334155] text-yellow-300 border-2 px-4 py-2 rounded-md w-24 transition cursor-pointer" onClick={() => { setShowSuccess(false); navigate("/all-payments"); }}>
                OK
              </button>
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
                <p className="text-[#334155]">Please wait while we load the details of the consultancy.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}