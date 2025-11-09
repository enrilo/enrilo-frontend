import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Button } from "@mui/material";
import { Link } from 'react-router-dom';
import { getStorage, ref, deleteObject} from 'firebase/storage';

export default function ViewSuperAdmin() {
    const params = useParams();
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewName, setPreviewName] = useState("");
    const [previewUrl, setPreviewUrl] = useState("");
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [formData, setFormData] = useState({
        photo_url: "",
        full_name: "",
        country_code: "",
        phone: "",
        company_email: "",
        password: '',
        email: "",
        position: "",
        street_1: "",
        street_2: "",
        city: "",
        state: "",
        country: "",
        zipcode: "",
        emergency_contact: { name: "", relation: "", country_code: "", phone: "" },
        documents: [{ name: "", url: "", number: "", uploaded_at: "" }],
    });

    useEffect(() =>{
        const fetchSuperAdmin = async () => {
            try {
                // setLoading(true);
                const persistedRoot = JSON.parse(localStorage.getItem("persist:root"));
                // Parse the nested user slice
                const userState = JSON.parse(persistedRoot.user);
                // Extract token
                const token = userState.currentUser?.data?.accessToken;
                console.log("Token from localStorage:", token);
                const res = await fetch(`http://localhost:3000/api/super-admins/${params.id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    credentials: "include",
                });
                const data = await res.json();
                // console.log(`data:${JSON.stringify(data.data.superAdmin)}`);
                
                if(data.success === false){
                    // setLoading(false);
                    console.log("data.success === false");
                    return;
                }
                setFormData(data.data.superAdmin);
                // setLoading(false);
                // setError(false);
            } catch (error) {
                console.log(`error.message: ${error.message}`);
                // setLoading(false);
                // setError(true);
            }
        };

        fetchSuperAdmin();
    }, [params.id]);

    const confirmDelete = () => {
        setShowConfirmDelete(true);
    };

    const handleDeleteConfirmed = async () => {
        // setLoading(true);
        const persistedRoot = JSON.parse(localStorage.getItem("persist:root"));
        // Parse the nested user slice
        const userState = JSON.parse(persistedRoot.user);
        // Extract token
        const token = userState.currentUser?.data?.accessToken;

        const res = await fetch(`http://localhost:3000/api/super-admins/${params.id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            credentials: "include",
        });
        const data = await res.json();
        // console.log(`data:${JSON.stringify(data.data.superAdmin)}`);
        
        if(data.success === false){
            // setLoading(false);
            console.log("data.success === false");
            return;
        }

        if(data.data.superAdmin.photo_url.includes('firebase')) {
            const storage = getStorage();
            const desertRef = ref(storage, data.data.superAdmin.photo_url);
            deleteObject(desertRef).then(() => {
                console.log("Profile Pic Removed Successfully")
            }).catch((error) => {
            console.log("Failed To Remove Image");
                console.log(error)
            });
        }
        for(var i=0; i < data.data.superAdmin.documents.length;i++) {
            const storage = getStorage();
            if(data.data.superAdmin.documents[i].url.includes('firebase')){
                var docURL = data.data.superAdmin.documents[i].url;
                const desertRef = ref(storage, docURL);
                deleteObject(desertRef).then(() => {
                    console.log(`Document with URL ${docURL} Removed Successfully`)
                }).catch((error) => {
                console.log("Failed To Remove Image");
                    console.log(error)
                });
            }
            
        }
        try {
            const res = await fetch(`http://localhost:3000/api/super-admins/${params.id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                credentials: "include",
            });
            const data = await res.json();
            if (data.success === false) {
                console.log(data.message);
                return;
            }
            setShowConfirmDelete(false);
            setShowSuccess(true);
            setTimeout(() => {
                window.location.reload(true);
                // navigate("/all-todos");
            }, 1500);
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <main className="flex-1 overflow-y-auto p-6">
            <div className="p-4 sm:p-6">
                <div className="bg-white rounded-2xl shadow p-6 gap-5 max-w-6xl mx-auto items-center">
                    <div className="flex flex-col items-center border-dashed border-2 border-gray-300 rounded-lg p-8 mb-8 cursor-pointer hover:bg-gray-50 transition">
                        <div className="flex flex-col items-center">
                            <img src={formData.photo_url} alt="Profile" className="w-auto h-64 object-cover rounded-lg mb-2" />
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
                            <span className="font-semibold">Phone Number:</span> <br /> {formData.country_code} {formData.phone}
                        </div>
                        <div className='text-xl'>
                            <span className="font-semibold">Company Email ID:</span> <br /> {formData.company_email}
                        </div>
                        {/* <div className='text-xl'>
                            Personal Email ID: {formData.email}
                        </div> */}
                        {formData.email && (
                            <div className='text-xl'>
                                <span className="font-semibold">Personal Email ID:</span> <br /> {formData.email}
                            </div>
                        )}

                        {/* <div className='text-xl'>
                            Home Address: {formData.street_1}, {formData.street_2}, {formData.city}, {formData.state}, {formData.country} - {formData.zipcode}
                        </div> */}
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
                    
                    {/* DOCUMENTS INFO */}
                    {/* <div className='text-2xl font-semibold underline mb-2'>
                        Documents:
                    </div>
                    {formData.documents && formData.documents.length > 0 && (
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
                    )} */}
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

                  

                    <div className="mt-6 flex flex-row justify-evenly">
                        <Link to={`/edit-super-admin/${formData._id}`} className='flex flex-row justify-between'>
                            <button type="submit" className="bg-[#1E293B] text-white px-8 py-2 rounded-md hover:bg-[#334155] transition cursor-pointer">
                                Edit Profile
                            </button>
                        </Link>

                        <button onClick={() => confirmDelete() } type="submit" className="bg-red-700 hover:bg-red-600 text-white px-8 py-2 rounded-md transition cursor-pointer">
                            Delete Profile
                        </button>
                    </div>
                </div>
            </div>

            {showConfirmDelete && (

                <div className="fixed inset-0 bg-[#334155] bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white text-[#334155] rounded-lg p-6 w-80 shadow-xl text-center">
                        <p className="text-center font-medium mb-5">Are you sure you want to delete this super admin?</p>
                        <div className="flex justify-center gap-4">
                        <button className="bg-[#334155] text-white border-2 px-4 py-2 rounded-md w-24 hover:bg-[#1D4ED8] transition cursor-pointer" onClick={handleDeleteConfirmed} >
                            Yes
                        </button>
                        <button className="bg-gray-300 border-2 px-4 py-2 rounded-md w-24 hover:bg-gray-400 transition cursor-pointer" onClick={() => setShowConfirmDelete(false)} >
                            No
                        </button>
                        </div>
                    </div>
                </div>
                
            )}
            {previewOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-[#334155] bg-opacity-50 z-50">
                    <div className="bg-white rounded-2xl shadow-lg p-4 max-w-3xl w-full">
                        <div className="flex justify-between items-center mb-2">
                            <div className='text-xl font-semibold p-1'>
                                {previewName}
                            </div>
                            <button className="bg-[#1E293B] text-white px-8 py-2 rounded-md hover:bg-[#334155] transition cursor-pointer" onClick={() => setPreviewOpen(false)} >
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

            {showSuccess && (
                <div className="fixed inset-0 bg-white bg-opacity-50 flex justify-center items-center">
                    <div className="flex flex-row bg-[rgb(7,57,106)] text-white p-3 rounded-lg shadow-lg">
                        <p>Super Admin has been deleted!</p>
                        <button className="ml-2 font-bold hover:cursor-pointer text-white" onClick={() => {
                            setShowSuccess(false);
                            window.location.reload(true);
                            navigate("/all-super-admin");
                        }} >✖</button>
                    </div>
                </div>
            )}
        </main>
    )
}
