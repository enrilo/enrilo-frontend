import { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@mui/material";
import { Link } from 'react-router-dom';
import { getStorage, ref, deleteObject} from 'firebase/storage';

export default function ViewConsultancy() {
  const navigate = useNavigate();
  const params = useParams();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewName, setPreviewName] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [allowWriteAccess, setAllowWriteAccess] = useState(false);
  const [showDeleting, setShowDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [formData, setFormData] = useState({
    photo_url: "",
    name:"",
    company_website:"",
    gst_number: "",
    linkedin_url: "",
    facebook_url: "",
    instagram_url: "",
    is_single_branch: true,
    office_details: [{
      office_city: "",
      office_address: "",
      office_type: "Head Office",
      country_code: "",
      phone_number: "",
    }],
  });
  const officeDetails = Array.isArray(formData.office_details) ? formData.office_details : [formData.office_details];

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const totalPages = Math.ceil(officeDetails.length / rowsPerPage);

  const paginatedData = officeDetails.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const persistedRoot = JSON.parse(localStorage.getItem("persist:root"));
  // Parse the nested user slice
  const userState = JSON.parse(persistedRoot.user);
  // Extract token
  const token = userState.currentUser?.data?.accessToken;
  const role = userState.currentUser?.data?.role;
  const loggedInUserID = userState.currentUser?.data?.id;

  useEffect(() =>{
    const fetchAConsultancy = async () => {
      try {
        setPageLoading(true);

        const consultancyResData = await fetch(`http://localhost:3000/api/consultancies/${params.id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            credentials: "include",
        });
        const consultancyData = await consultancyResData.json();
        
        if(consultancyData.success === false){
            setPageLoading(false);
            return;
        }
        
        setFormData(consultancyData.data.consultancy);

        // FETCHING THE LOGGED IN CONSULTANCY DATA FOR FETCHING WRITE ACCESS PERMISSIONS
        const accessTokenResData = await fetch(`http://localhost:3000/api/access-tokens/access-token-by-super-admin-id/${loggedInUserID}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        const accessTokenData = await accessTokenResData.json();
        
        if(accessTokenData.success === false){
            setPageLoading(false);
            return;
        }
        
        setAllowWriteAccess(accessTokenData.data.accessToken.allow_write_access);

        setPageLoading(false);
      } catch (error) {
        console.log(`error.message: ${error.message}`);
        setPageLoading(false);
      }
    };

    fetchAConsultancy();
  }, []);

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowConfirmDelete(true);
  };

  const handleDeleteConfirmed = async () => {  
    try {
      // Fetch consultancy details for deleting files
      setShowDeleting(true);
      const res = await fetch(`http://localhost:3000/api/consultancies/${deleteId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      const data = await res.json();
      if (!data.success) return;
      
      if (data.data.consultancy.photo_url.includes("firebase")) {
        const storage = getStorage();
        const desertRef = ref(storage, data.data.consultancy.photo_url);
        deleteObject(desertRef).catch(console.log);
      }

      const deleteRes = await fetch(`http://localhost:3000/api/consultancies/${deleteId}`, {
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

  return (
    <main className="flex-1 overflow-y-auto p-6">
      <div className="p-4 sm:p-6">
          <div className="bg-white rounded-2xl shadow p-6 gap-5 max-w-6xl mx-auto items-center">
              <div className="flex flex-col items-center border-dashed border-2 border-gray-300 rounded-lg p-8 mb-8 hover:bg-gray-50 transition">
                  <div className="flex flex-col items-center">
                      <img src={formData.photo_url || "https://img.icons8.com/ios7/1200/company.jpg"} alt="Profile" className="w-auto h-64 object-cover rounded-lg mb-2" />
                  </div>
              </div>

              {/* PERSONAL INFO */}
              <div className='text-2xl font-semibold underline mb-2'>
                  Personal Details:
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                  <div className='text-xl'>
                      <span className="font-semibold">Consultancy Name:</span> <br /> {formData.name}
                  </div>
                  <div className='text-xl'>
                      <span className="font-semibold">GST Number:</span> <br /> {formData.gst_number || "N/A"}
                  </div>
                  <div className='text-xl'>
                      <span className="font-semibold">Company's Website:</span> <br /> {formData.company_website || "N/A"}
                  </div>
                  <div className='text-xl'>
                      <span className="font-semibold">LinkedIn URL:</span> <br /> {formData.linkedin_url || "N/A"}
                  </div>
                  <div className='text-xl'>
                      <span className="font-semibold">Facebook URL:</span> <br /> {formData.facebook_url || "N/A"}
                  </div>
                  <div className='text-xl'>
                      <span className="font-semibold">Instagram:</span> <br /> <span className="capitalize">{formData.instagram_url || "N/A"}</span>
                  </div>
                  <div className='text-xl'>
                      <span className="font-semibold">Office Type:</span> <br /> <span className="capitalize">{officeDetails.length > 1 ? 'Multiple Branches/Offices':'Single Office'}</span>
                  </div>
                  {/* {formData.email && (
                      <div className='text-xl'>
                          <span className="font-semibold">Personal Email ID:</span> <br /> {formData.email}
                      </div>
                  )}
                  {(formData.street_1 || formData.street_2 || formData.city || formData.state || formData.country || formData.zipcode) && (
                      <div className='text-xl'>
                          <span className="font-semibold">Home Address:</span> <br /> {[ formData.street_1, formData.street_2, formData.city, formData.state, formData.country ].filter(Boolean).join(', ')} - {formData.zipcode}
                      </div>
                  )} */}
              </div>
              
              {/* Office Address INFO */}
              {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {formData.office_details.map((office, index) => (
                  <div key={office._id || index} className="p-5 border rounded-lg shadow-sm">
                    <div className="text-lg font-semibold mb-2">
                      {office.office_type}
                    </div>

                    <p><strong>City:</strong> {office.office_city}</p>
                    <p><strong>Address:</strong> {office.office_address}</p>
                    <p><strong>Phone:</strong> {office.country_code} {office.phone_number}</p>
                  </div>
                ))}
              </div> */}
             {officeDetails.length > 0 && (
                <>
                  <div className="text-2xl font-semibold underline mb-4">
                    Office Details
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="border px-4 py-2 text-left">#</th>
                          <th className="border px-4 py-2 text-left">Office City</th>
                          <th className="border px-4 py-2 text-left">Address</th>
                          <th className="border px-4 py-2 text-left">Office Type</th>
                          <th className="border px-4 py-2 text-left">Phone Number</th>
                        </tr>
                      </thead>

                      <tbody>
                        {paginatedData.map((office, index) => (
                          <tr key={office._id || index} className="hover:bg-gray-50">
                            <td className="border px-4 py-2 text-left">
                              {(currentPage - 1) * rowsPerPage + index + 1}
                            </td>
                            <td className="border px-4 py-2 text-left">{office.office_city}</td>
                            <td className="border px-4 py-2 text-left">{office.office_address}</td>
                            <td className="border px-4 py-2 text-left">{office.office_type}</td>
                            <td className="border px-4 py-2 text-left">
                              {office.country_code} {office.phone_number}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination Controls */}
                  <div className="flex justify-end items-center gap-2 mt-4">
                    <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-3 py-1 border rounded disabled:opacity-50">
                      Prev
                    </button>

                    {[...Array(totalPages)].map((_, i) => (
                      <button key={i} onClick={() => setCurrentPage(i + 1)} className={`px-3 py-1 border rounded ${currentPage === i + 1 ? "bg-[#1E293B] text-white" : ""}`}>
                        {i + 1}
                      </button>
                    ))}

                    <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-1 border rounded disabled:opacity-50" >
                      Next
                    </button>
                  </div>
                </>
              )}

              {
                allowWriteAccess && role === 'admin' && (
                  <div className="mt-6 flex flex-row justify-evenly">
                    <Link to={`/edit-consultancy/${formData._id}`} className='flex flex-row justify-between'>
                        <button type="submit" className="bg-[#1E293B] hover:bg-[#334155] text-yellow-300 font-semibold px-8 py-2 rounded-md transition cursor-pointer">
                          Edit Consultancy
                        </button>
                    </Link>

                    <button onClick={() => confirmDelete(formData._id) } type="submit" className="bg-red-700 hover:bg-red-600 text-white font-semibold px-8 py-2 rounded-md transition cursor-pointer">
                      Delete Consultancy
                    </button>
                  </div>
                )
              }
          </div>
      </div>

      {/* DELETE CONFIRM MODAL */}
      {showConfirmDelete && (
        <div className="fixed inset-0 backdrop-blur-md flex justify-center items-center z-50">
          <div className="bg-white text-[#334155] rounded-lg p-6 w-80 shadow-xl text-center">
            <p className="text-center font-medium text-xl mb-5">Are you sure you want to delete this consultancy?</p>
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
                <p className="text-[#334155]">Please hold on! The consultancy is being deleted.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="fixed inset-0 backdrop-blur-md flex justify-center items-center z-50">
          <div className="bg-white text-[#334155] rounded-lg p-6 w-80 shadow-xl text-center">
            <p className="text-center font-medium text-xl mb-5">Congratulations, the consultancy details have been deleted successfully!</p>
            <div className="flex justify-center gap-4">
              <button className="bg-[#1E293B] hover:bg-[#334155] text-yellow-300 border-2 px-4 py-2 rounded-md w-24 transition cursor-pointer" onClick={() => { setShowSuccess(false); navigate("/all-consultancies"); }}>
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
  )
}
