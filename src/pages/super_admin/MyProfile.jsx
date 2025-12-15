import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { useSelector } from "react-redux";
import { Button } from "@mui/material";
import { Link } from 'react-router-dom';
import { getStorage, ref, deleteObject} from 'firebase/storage';

export default function MyProfile() {
    const { loading } = useSelector((state) => state.user);
    const params = useParams();
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewName, setPreviewName] = useState("");
    const [previewUrl, setPreviewUrl] = useState("");
    const [pageLoading, setPageLoading] = useState(false);
    const [allowWriteAccess, setAllowWriteAccess] = useState(false);
    const [formData, setFormData] = useState({
        photo_url: "",
        full_name: "",
        country_code: "",
        phone: "",
        company_email: "",
        password: '',
        email: "",
        position: "",
        role:"",
        allow_write_access:"",
        street_1: "",
        street_2: "",
        city: "",
        state: "",
        country: "",
        zipcode: "",
        bank_details: { account_number: "", account_holder_name: "", bank_name: "", branch_name:"", branch_address: "", ifsc_code:"" },
        emergency_contact: { name: "", relation: "", country_code: "", phone: "" },
        documents: [{ name: "", url: "", number: "", uploaded_at: "" }],
    });

    const persistedRoot = JSON.parse(localStorage.getItem("persist:root"));
    // Parse the nested user slice
    const userState = JSON.parse(persistedRoot.user);
    // Extract token
    const token = userState.currentUser?.data?.accessToken;
    // const allowWriteAccess = userState.currentUser?.data?.allow_write_access;

    useEffect(() =>{
        const fetchSuperAdmin = async () => {
            try {
                setPageLoading(true);
                const superAdminID = userState.currentUser.data.id;
                const res = await fetch(`http://localhost:3000/api/super-admins/${superAdminID}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    credentials: "include",
                });
                const data = await res.json();
                
                if(data.success === false){
                    setPageLoading(true);
                    return;
                }
                setFormData(data.data.superAdmin);
                // FETCHING WRITE ACCESS PERMISSIONS
                setAllowWriteAccess(data.data.superAdmin.allow_write_access);
                setPageLoading(false);
            } catch (error) {
                console.log(`error.message: ${error.message}`);
                setPageLoading(false);
            }
        };

        fetchSuperAdmin();
    }, [params.id]);

    return (
        <main className="flex-1 overflow-y-auto p-6">
            <div className="p-4 sm:p-6">
                <div className="bg-white rounded-2xl shadow p-6 gap-5 max-w-6xl mx-auto items-center">
                    <div className="flex flex-col items-center border-dashed border-2 border-gray-300 rounded-lg p-8 mb-8 hover:bg-gray-50 transition">
                        <div className="flex flex-col items-center">
                            <img src={formData.photo_url || "https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2264922221.jpg"} alt="Profile" className="w-auto h-64 object-cover rounded-lg mb-2" />
                        </div>
                    </div>

                    {/* PERSONAL INFO */}
                    <div className='text-2xl font-semibold underline mb-2'>
                        Personal Details:
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                        <div className='text-xl'>
                            <span className="font-semibold">Full Name:</span> <br /> {formData.full_name}
                        </div>
                        <div className='text-xl'>
                            <span className="font-semibold">Position:</span> <br /> {formData.position}
                        </div>
                        <div className='text-xl'>
                            <span className="font-semibold">Role:</span> <br /> <span className="capitalize">{formData.role}</span>
                        </div>
                        <div className='text-xl'>
                            <span className="font-semibold">Phone Number:</span> <br /> {formData.country_code} {formData.phone}
                        </div>
                        <div className='text-xl'>
                            <span className="font-semibold">Company Email ID:</span> <br /> {formData.company_email}
                        </div>
                        {formData.email && (
                            <div className='text-xl'>
                                <span className="font-semibold">Personal Email ID:</span> <br /> {formData.email}
                            </div>
                        )}
                        {(formData.street_1 || formData.street_2 || formData.city || formData.state || formData.country || formData.zipcode) && (
                            <div className='text-xl'>
                                <span className="font-semibold">Home Address:</span> <br /> {[
                                    formData.street_1,
                                    formData.street_2,
                                    formData.city,
                                    formData.state,
                                    formData.country,
                                ].filter(Boolean).join(', ')} - {formData.zipcode}
                            </div>
                        )}
                        <div className='text-xl'>
                            <span className="font-semibold">Write Access:</span> <br /> <span className="capitalize">{formData.allow_write_access == false ? 'Write Access Not Allowed':'Write Access Allowed'}</span>
                        </div>
                    </div>

                    {/* EMERGENCY CONTACT INFO */}
                    <div className='text-2xl font-semibold underline mb-2'>
                        Emergency Contact:
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3  gap-5 mb-8">
                        <div className='text-xl'>
                            <span className="font-semibold">Name:</span> <br /> {formData.emergency_contact.name}
                        </div>
                        <div className='text-xl'>
                            <span className="font-semibold">Phone Number:</span> <br /> {formData.emergency_contact.country_code} {formData.emergency_contact.phone}
                        </div>
                        <div className='text-xl'>
                            <span className="font-semibold">Relation with Super Admin:</span> <br /> {formData.emergency_contact.relation}
                        </div>
                    </div>
                    
                    {/* BANK ACCOUNT INFO */}
                    {
                        (!formData.bank_details) && (
                            <>
                                <div className='text-2xl font-semibold underline mb-2'>
                                Bank Details:
                                </div>
                                <div className={`grid grid-cols-1 md:grid-cols-3 gap-5 ${formData.documents && formData.documents.some(doc => doc.name || doc.number) ? "mb-8" : "mb-15"}`}>
                                    <div className='text-xl'>
                                        <span className="font-semibold">Account Holder Name:</span> <br /> {formData.bank_details.account_holder_name}
                                    </div>
                                    <div className='text-xl'>
                                        <span className="font-semibold">Account Number:</span> <br /> {formData.bank_details.account_number}
                                    </div>
                                    <div className='text-xl'>
                                        <span className="font-semibold">Bank Name:</span> <br /> {formData.bank_details.bank_name}
                                    </div>
                                    <div className='text-xl'>
                                        <span className="font-semibold">Branch Name:</span> <br /> {formData.bank_details.branch_name}
                                    </div>
                                    <div className='text-xl'>
                                        <span className="font-semibold">Branch Address:</span> <br /> {formData.bank_details.branch_address}
                                    </div>
                                    <div className='text-xl'>
                                        <span className="font-semibold">IFSC Code:</span> <br /> {formData.bank_details.ifsc_code}
                                    </div>
                                </div>
                            </>
                        )
                    }
                    {formData.documents && formData.documents.some(doc => doc.name || doc.number) && (
                        <>
                            <div className='text-2xl font-semibold underline mb-2'>
                            Documents:
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                            {formData.documents.map((doc, index) => {
                                // Skip empty documents
                                if (!doc.name && !doc.number) return null;

                                return (
                                <div key={index} className="text-xl flex items-center justify-between p-2 border rounded">
                                    <div>
                                    {doc.name && (
                                        <div>
                                        <span className="font-semibold">Name:</span> {doc.name}
                                        </div>
                                    )}
                                    {doc.number && (
                                        <div>
                                        <span className="font-semibold">Number:</span> {doc.number}
                                        </div>
                                    )}
                                    </div>
                                    {doc.url && (
                                    <Button variant="outlined" onClick={() => { setPreviewName(doc.name); setPreviewUrl(doc.url); setPreviewOpen(true); }} >
                                        VIEW
                                    </Button>
                                    )}
                                </div>
                                );
                            })}
                            </div>
                        </>
                    )}

                    {
                        (allowWriteAccess == true) && (
                            <div className="mt-6 flex flex-row justify-center">
                                <Link to={`/edit-super-admin/${formData._id}`} className='flex flex-row justify-between'>
                                    <button type="submit" className="bg-[#1E293B] hover:bg-[#334155] text-yellow-300 font-semibold px-8 py-2 rounded-md transition cursor-pointer">
                                        Edit Profile
                                    </button>
                                </Link>
                            </div>
                        )
                    }
                </div>
            </div>

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
                            {/* Loading All Super Admin Details... */}
                            <div className="flex flex-col">
                                <p className="text-xl font-semibold mb-2">Loading...</p>
                                <p className="text-[#334155]">Please wait while we load the details of all superadmin.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {previewOpen && (
                <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md z-50">
                    <div className="bg-white rounded-2xl shadow-lg p-4 max-w-5xl max-h-2xl w-full">
                        <div className="flex justify-between items-center mb-2">
                            <div className='text-xl font-semibold p-1'>
                                {previewName}
                            </div>
                            <button className="bg-[#1E293B] hover:bg-[#334155] text-yellow-300 font-semibold px-8 py-2 rounded-md transition cursor-pointer" onClick={() => setPreviewOpen(false)} >
                                Close
                            </button>
                        </div>
                        {previewUrl.includes(".pdf") ? (
                            <iframe src={previewUrl} className="w-full h-[500px] rounded" title="Document Preview" ></iframe>
                        ) : (
                            <img src={previewUrl} alt="Document Preview" className="w-full max-h-[500px] object-contain rounded" />
                        )}
                    </div>
                </div>
            )}
        </main>
    )
}
