import { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';

export default function ViewAPayment() {
  const { loading } = useSelector((state) => state.user);
  const params = useParams();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
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
      {/* <div className="p-4 sm:p-6">
        <div className="bg-white rounded-2xl shadow p-6 gap-5 max-w-6xl mx-auto items-center">
          <div className="flex flex-col items-center space-y-4 max-w-6xl mx-auto text-lg mb-10">
            <div className="flex flex-row items-center justify-between gap-4">
              <label className="w-[200px] text-left text-gray-700 font-semibold">Consultancy Name:</label>
              <label className="w-[210px] text-left text-gray-700">{formData.consultancy_name}</label>
            </div>

            <div className="flex flex-row items-center justify-center gap-4">
              <label className="w-[200px] text-left text-gray-700 font-semibold">Rate:</label>
              <label className="w-[210px] text-left text-gray-700">{formData.rate}</label>
            </div>

            <div className="flex flex-row items-center justify-center gap-4">
              <label className="w-[200px] text-left text-gray-700 font-semibold">Duration (Months):</label>
              <label className="w-[210px] text-left text-gray-700">{formData.duration_in_months}</label>
            </div>

            <div className="flex flex-row items-center justify-center gap-4">
              <label className="w-[200px] text-left text-gray-700 font-semibold">From Date:</label>
              <label className="w-[210px] text-left text-gray-700">{formData.from_date && new Date(formData.from_date).toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' })}</label>
            </div>

            <div className="flex flex-row items-center justify-center gap-4">
              <label className="w-[200px] text-left text-gray-700 font-semibold">To Date:</label>
              <label className="w-[210px] text-left text-gray-700">{formData.from_date && new Date(formData.to_date).toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' })}</label>
            </div>

            <div className="flex flex-row items-center justify-center gap-4">
              <label className="w-[200px] text-left text-gray-700 font-semibold">Subtotal:</label>
              <label className="w-[210px] text-left text-gray-700">{formData.subtotal}</label>
            </div>

            <div className="flex flex-row items-center justify-center gap-4">
              <label className="w-[200px] text-left text-gray-700 font-semibold">Is Discount Available?</label>
              <label className="w-[210px] text-left text-gray-700">{formData.isDiscountAvailable ? 'Discount is available.' : 'Discount is not available'}</label>
            </div>

            <div className="flex flex-row items-center justify-center gap-4">
              <label className="w-[200px] text-left text-gray-700 font-semibold">Discount Amount:</label>
              <label className="w-[210px] text-left text-gray-700">{formData.discount_amount}</label>
            </div>

            <div className="flex flex-row items-center justify-center gap-4">
              <label className="w-[200px] text-left text-gray-700 font-semibold">Net Total:</label>
              <label className="w-[210px] text-left text-gray-700">{formData.net_total}</label>
            </div>

            <div className="flex flex-row items-center justify-center gap-4">
              <label className="w-[200px] text-left text-gray-700 font-semibold">GST @0%:</label>
              <label className="w-[210px] text-left text-gray-700">{formData.gst_amount}</label>
            </div>

            <div className="flex flex-row items-center justify-center gap-4">
              <label className="w-[200px] text-left text-gray-700 font-semibold">Grand Total:</label>
              <label className="w-[210px] text-left text-gray-700">{formData.grand_total}</label>
            </div>

            <div className="flex flex-row items-center justify-center gap-4">
              <label className="w-[200px] text-left text-gray-700 font-semibold">Payment Status:</label>
              <label className="w-[210px] text-left text-gray-700">{formData.payment_status}</label>
            </div>

            <div className="flex flex-row items-center justify-center gap-4">
              <label className="w-[200px] text-left text-gray-700 font-semibold">Payment Received:</label>
              <label className="w-[210px] text-left text-gray-700">{formData.payment_received}</label>
            </div>

            <div className="flex flex-row items-center justify-center gap-4">
              <label className="w-[200px] text-left text-gray-700 font-semibold">Pending Payment:</label>
              <label className="w-[210px] text-left text-gray-700">{formData.pending_payment}</label>
            </div>
          </div>

          {
            allowWriteAccess && role === 'admin' && (
              <div className="mt-6 flex flex-row justify-evenly">
                <Link to={`/edit-consultancy/${formData._id}`} className='flex flex-row justify-between'>
                    <button type="submit" className="bg-[#1E293B] hover:bg-[#334155] text-yellow-300 font-semibold px-8 py-2 rounded-md transition cursor-pointer">
                      Edit Payment Detail
                    </button>
                </Link>

                <button onClick={() => confirmDelete(formData._id) } type="submit" className="bg-red-700 hover:bg-red-600 text-white font-semibold px-8 py-2 rounded-md transition cursor-pointer">
                  Delete Payment Detail
                </button>
              </div>
            )
          }
        </div>
      </div> */}
      <div className="p-6 max-w-3xl mx-auto font-sans text-gray-800">
        {/* Bill Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">{formData.consultancy_name}</h1>
          <p className="text-lg font-semibold">Consultancy Payment Details</p>
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
            {/* <tr>
              <td class="text-right align-middle font-semibold" colspan="2">
                <p className="font-semibold text-lg">
                  Payment Status:{" "}
                  <span className={`font-bold ${ formData.payment_status === "full" ? "text-green-600" : (formData.payment_status === "pending" ?"text-red-600":"text-orange-400") }`} >
                    {formData.payment_status === "full" ? "Paid In Full" : (formData.payment_status === "pending" ? "Payment Pending" : "Partial Payment Complete")}
                  </span>
                </p>
              </td>
            </tr> */}
          </tbody>
        </table>
        <div className="text-center align-middle font-semibold">
          <span>Note:{" "}</span>All Amounts Specified Are In Indian Rupees (INR)
        </div>

        {/* Actions */}
        {allowWriteAccess && role === "admin" && (
          <div className="mt-8 flex flex-wrap justify-center gap-6">
            <Link to={`/edit-consultancy/${formData._id}`}>
              <button className="bg-[#1E293B] hover:bg-[#334155] text-yellow-300 font-semibold px-6 py-2 rounded-md transition cursor-pointer">
                Edit Payment Detail
              </button>
            </Link>

            <button onClick={() => confirmDelete(formData._id)} className="bg-red-700 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-md transition cursor-pointer">
              Delete Payment Detail
            </button>
          </div>
        )}
      </div>


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
