import { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import heic2any from "heic2any";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { asteriskColorStyle } from "../styles/selectStyles.js";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "../../firebase.js";

export default function CompanyProfile() {
   const { loading } = useSelector((state) => state.user);
    const params = useParams();
    const [uploadingProgress, setUploadingProgress] = useState(0);
    const [uploadingProfile, setUploadingProfile] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState("");
    const [confirmAction, setConfirmAction] = useState(null);
    const [modalMessage, setModalMessage] = useState("");
    const [messageOpen, setMessageOpen] = useState(false);
    const [failedToSaveMessage, setFailedToSaveMessage] = useState("");
    const [failedToSaveMsgOpen, setFailedToSaveMsgOpen] = useState(false);
    const [saveSuccessfulMessage, setSaveSuccessfulMessage] = useState("");
    const [saveSuccessfulMsgOpen, setSaveSuccessfulMsgOpen] = useState(false);
    const [companyID, setCompanyID] = useState('');
    const [allowWriteAccess, setAllowWriteAccess] = useState(false);
    const [pageLoading, setPageLoading] = useState(false);
    const [deletedProfile, setDeletedProfile] = useState(false);
    const [newProfileFile, setNewProfileFile] = useState(null);
    const persistedRoot = JSON.parse(localStorage.getItem("persist:root"));
    const userState = JSON.parse(persistedRoot.user);
    const token = userState.currentUser?.data?.accessToken;
    const currentUserRole = userState.currentUser?.data?.role;    
    const superAdminID = params.id;
    const loggedInUserID = userState.currentUser?.data?.id;

    const [formData, setFormData] = useState({
        logo_url: "",
        name: "",
        address: "",
        website: "",
        gst_number: "",
        linkedin: "",
        twitter: "",
        facebook: "",
        instagram: "",
    });

    const [accessTokenFormData, setAccessTokenFormData] = useState({
        token:"",
        allow_write_access:false,
        expires_at:Date.now,
        is_revoked:false,
        is_expired:false,
    });

    // USE EFFECT TO FETCH DATA
    useEffect(() => {
        const fetchSuperAdmin = async () => {
            const companyData = await fetch(`http://localhost:3000/api/our-company/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                credentials: "include",
            });

            const superAdminJsonData = await companyData.json();
            console.log(`superAdminJsonData:${JSON.stringify(superAdminJsonData.data.company)}`)
            setCompanyID(superAdminJsonData.data.company._id);

            setFormData(superAdminJsonData.data.company);

            if (superAdminJsonData.success === false) {
                return;
            }

            // FETCH ACCESS TOKEN DATA
            const accessTokenResData = await fetch(`http://localhost:3000/api/access-tokens/access-token-by-super-admin-id/${loggedInUserID}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            const accessTokenData = await accessTokenResData.json();
            console.log(`accessTokenData:${JSON.stringify(accessTokenData.data.accessToken)}`);
            setAllowWriteAccess(accessTokenData.data.accessToken.allow_write_access);
            if(accessTokenData.success === false){
                return;
            }
            
            setAccessTokenFormData(accessTokenData.data.accessToken);
        };

        fetchSuperAdmin();
    }, []);

    // UPLOAD PROFILE PIC LOGIC (ADD/UPDATE/DELETE)
    const handleProfileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/heic"];
        if (!validTypes.includes(file.type)) {
            setModalMessage("Invalid file type. Please select JPG, JPEG, PNG, or HEIC.");
            setMessageOpen(true);
            return;
        }

        let processedFile = file;
        if (file.type === "image/heic") {
            const blob = await heic2any({ blob: file, toType: "image/jpeg" });
            processedFile = new File([blob], file.name.replace(/\.heic$/i, ".jpeg"), {
                type: "image/jpeg",
            });
        }

        setFormData((prev) => ({ ...prev, logo_url: URL.createObjectURL(processedFile) }));
        setNewProfileFile(processedFile);
        if (deletedProfile) setDeletedProfile(false);
    };

    const handleDeleteProfileConfirm = () => {
        setConfirmMessage("Delete current profile picture?");
        setConfirmAction(() => handleDeleteProfile);
        setConfirmOpen(true);
    };

    const handleDeleteProfile = () => {
        setDeletedProfile(true);
        setNewProfileFile(null);
        setFormData((prev) => ({
            ...prev,
            logo_url: "https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2264922221.jpg",
            photo_firebase_path: "",
        }));
    };

    // HANDLE CHANGE LOGIC FOR WHEN TEXTFIELDS CHANGE THEIR VALUES
    const handleChange = (e) => {
        const { id, value } = e.target;
        if (id.startsWith("emergency_")) {
            const key = id.replace("emergency_", "");
            setFormData((p) => ({
                ...p,
                emergency_contact: { ...p.emergency_contact, [key]: value },
            }));
        } else if (id.startsWith("documents_")) {
            const [_, index, field] = id.split("_");
            const i = parseInt(index, 10);
            setFormData((p) => {
                const docs = Array.isArray(p.documents) ? [...p.documents] : [];
                while (docs.length <= i) docs.push({ name: "", url: "", number: "", uploaded_at: Date.now() });
                docs[i][field] = value;
                return { ...p, documents: docs };
            });
            // If user types into a cleared row, mark it as not cleared
            const idx = parseInt(index, 10);
            if (tempClearedRows[idx]) {
                setTempClearedRows((prev) => {
                    const copy = { ...prev };
                    delete copy[idx];
                    return copy;
                });
            }
        } else if (["account_holder_name","account_number","ifsc_code","bank_name","branch_name","branch_address"].includes(id)) {
            setFormData((p) => ({
                ...p,
                bank_details: { ...p.bank_details, [id]: value },
            }));
        } else if (id.includes("allow_write_access")) {
            setFormData((p) => ({ ...p, allow_write_access: value }));
            setAccessTokenFormData((q) => ({ ...q, allow_write_access: value }));
        } else {
            setFormData((p) => ({ ...p, [id]: value }));
            setAccessTokenFormData((p) => ({ ...p, [id]: value }));
        };
    };

    const uploadFile = async (file, pathPrefix) => {
        let uploadFile = file;
        if (file.type === "image/heic") {
            const blob = await heic2any({ blob: file, toType: "image/jpeg" });
            uploadFile = new File([blob], file.name.replace(/\.heic$/i, ".jpeg"), {
                type: "image/jpeg",
            });
        }
        const filePath = `${pathPrefix}/${Date.now()}_${uploadFile.name}`;
        const fileRef = ref(storage, filePath);

        const uploadTask = uploadBytesResumable(fileRef, uploadFile);
        return new Promise((resolve, reject) => {
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    setUploadingProgress(progress);
                },
                (error) => reject(error),
                async () => {
                    const url = await getDownloadURL(uploadTask.snapshot.ref);
                    resolve({ url, filePath });
                }
            );
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setPageLoading(true);
        try {
            let updatedFormData = { ...formData };

            if (deletedProfile && formData.photo_firebase_path) {
                try {
                    const oldRef = ref(storage, formData.photo_firebase_path);
                    await deleteObject(oldRef);
                    updatedFormData.logo_url = "https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2264922221.jpg";
                    updatedFormData.photo_firebase_path = "";
                } catch (err) {
                    console.error(err);
                    setModalMessage("Failed to delete previous profile picture.");
                    setMessageOpen(true);
                    setPageLoading(false);
                    return;
                }
            }
            if (newProfileFile) {
                try {
                    const { url, filePath } = await uploadFile(newProfileFile, "profile_pictures");
                    updatedFormData.logo_url = url;
                    updatedFormData.photo_firebase_path = filePath;
                } catch (err) {
                    console.error(err);
                    setModalMessage("Failed to upload new profile picture.");
                    setMessageOpen(true);
                    setPageLoading(false);
                    return;
                }
            }

            const res = await fetch(`http://localhost:3000/api/our-company/${companyID}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedFormData),
                credentials: "include",
            });
            const data = await res.json();

            if (data.success === false) {
                setFailedToSaveMsgOpen(true);
                setFailedToSaveMessage(`Failed to update company profile because ${data.message.toLowerCase()}`);
            } else {
                setSaveSuccessfulMessage("Company profile updated successfully!");
                setSaveSuccessfulMsgOpen(true);
                setNewProfileFile(null);
                setDeletedProfile(false);
            }
        } catch (err) {
            console.error(err);
            setFailedToSaveMsgOpen(true);
            setFailedToSaveMessage(`Failed to update company profile due to an unexpected error.`);
            setMessageOpen(true);
        } finally {
            setPageLoading(false);
        }
    };

    return (
        <main className="flex-1 overflow-y-auto p-6">
            <div className="p-4 sm:p-6">
                <div className="bg-white rounded-2xl shadow p-4 sm:p-6 max-w-7xl mx-auto">
                    <div className={`flex flex-col items-center border-dashed border-2 border-gray-300 rounded-lg p-8 mb-8 hover:bg-gray-50 transition ${(!allowWriteAccess || currentUserRole == 'user') ? "cursor-not-allowed" : "cursor-pointer"}`}>
                        {!formData.logo_url || formData.logo_url === 'https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2264922221.jpg' ? (
                            <>
                                <div className={`text-gray-400 text-3xl mb-2 ${(!allowWriteAccess || currentUserRole == 'user') ? "cursor-not-allowed" : ""}`}>🖼️</div>
                                <label className={`text-blue-600 font-medium hover:underline ${(!allowWriteAccess || currentUserRole == 'user') ? "cursor-not-allowed" : "cursor-pointer"}`}>
                                    {uploadingProfile ? "Uploading..." : "Click Here To Add Profile Picture"}
                                    <input type="file" accept=".jpg,.jpeg,.png,.heic" hidden onChange={handleProfileUpload} disabled={uploadingProfile || (!allowWriteAccess || currentUserRole == 'user')} className=" disabled:cursor-not-allowed" />
                                </label>
                            </>
                        ) : (
                            <div className="flex flex-col items-center">
                                <img src={formData.logo_url || "https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2264922221.jpg"} alt="Profile Photo" className="w-auto h-40 object-cover rounded-lg mb-2" disabled={!allowWriteAccess || currentUserRole == 'user'} />
                                {
                                    currentUserRole === 'admin' && (
                                        <div className="flex gap-4">
                                            <label className={`text-blue-600 ${(!allowWriteAccess || currentUserRole == 'user') ? "cursor-not-allowed" : "cursor-pointer hover:underline"}`}>
                                                Replace
                                                <input type="file" accept=".jpg,.jpeg,.png,.heic" hidden onChange={handleProfileUpload} disabled={uploadingProfile || !allowWriteAccess} />
                                            </label>
                                            <button type="button" className={`text-red-600 ${(!allowWriteAccess || currentUserRole == 'user') ? "cursor-not-allowed" : "cursor-pointer hover:underline"}`} onClick={handleDeleteProfileConfirm} disabled={!allowWriteAccess || currentUserRole == 'user'}>
                                                Delete
                                            </button>
                                        </div>
                                    )
                                }
                            </div>
                        )}
                    </div>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                            <TextField id="name" label="Company Name" value={formData.name} onChange={handleChange} variant="outlined" fullWidth required sx={asteriskColorStyle} disabled={!allowWriteAccess || currentUserRole == 'user'} />
                            <TextField id="address" value={formData.address} onChange={handleChange} label="Address" variant="outlined" fullWidth required sx={{"& .MuiFormLabel-asterisk": { color: "red" }}} disabled={!allowWriteAccess || currentUserRole == 'user'} />
                            <TextField id="website" value={formData.website} onChange={handleChange} label="Website" variant="outlined" fullWidth required sx={{"& .MuiFormLabel-asterisk": { color: "red" }}} disabled={!allowWriteAccess || currentUserRole == 'user'} />
                            <TextField id="gst_number" value={formData.gst_number} onChange={handleChange} label="GST Number" variant="outlined" fullWidth disabled={!allowWriteAccess || currentUserRole == 'user'} />
                            <TextField id="linkedin" value={formData.linkedin} onChange={handleChange} label="LinkedIn URL" variant="outlined" fullWidth disabled={!allowWriteAccess || currentUserRole == 'user'} />
                            <TextField id="twitter" value={formData.twitter} onChange={handleChange} label="X (Twitter) URL" variant="outlined" fullWidth disabled={!allowWriteAccess || currentUserRole == 'user'} />
                            <TextField id="facebook" value={formData.facebook} onChange={handleChange} label="Facebook URL" variant="outlined" fullWidth disabled={!allowWriteAccess || currentUserRole == 'user'} />
                            <TextField id="instagram" value={formData.instagram} onChange={handleChange} label="Instagram URL" variant="outlined" fullWidth disabled={!allowWriteAccess || currentUserRole == 'user'} />
                        </div>

                        {
                            currentUserRole === 'admin' && (
                                <div className="col-span-3 mt-6 flex justify-center">
                                    <button type="submit" disabled={loading} className="bg-[#1E293B] hover:bg-[#334155] text-yellow-300 font-semibold px-8 py-2 rounded-md transition cursor-pointer">
                                        {loading ? "Updating..." : 'Update Company Profile'}
                                    </button>
                                </div>
                            ) 
                        }
                    </form>

                    {/* Modals (Preview, Confirm, Message, Failed, Success) */}
                    {confirmOpen && (
                        <div className="fixed inset-0 backdrop-blur-md flex justify-center items-center z-50">
                            <div className="bg-white text-[#334155] rounded-lg p-6 w-80 shadow-xl text-center">
                                <p className="text-center font-medium text-xl mb-5">{confirmMessage}</p>
                                <div className="flex justify-center gap-4">
                                    <button className="bg-[#1E293B] hover:bg-[#334155] text-yellow-300 font-semibold px-4 py-2 rounded-md w-24 transition cursor-pointer" onClick={() => { if (confirmAction) confirmAction(); setConfirmOpen(false); }} >
                                        Yes
                                    </button>
                                    <button className="bg-gray-300 px-4 py-2 rounded-md w-24 hover:bg-gray-400 transition cursor-pointer" onClick={() => setConfirmOpen(false)} >
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
                                <button className="bg-[#1E293B] hover:bg-[#334155] text-yellow-300 font-semibold px-4 py-2 rounded-md w-24 transition cursor-pointer" onClick={() => setMessageOpen(false)} >
                                    OK
                                </button>
                            </div>
                        </div>
                    )}

                    {failedToSaveMsgOpen && (
                        <div className="fixed inset-0 backdrop-blur-md flex justify-center items-center z-50">
                            <div className="bg-white text-[#334155] rounded-lg p-6 w-80 shadow-xl text-center">
                                <p className="mb-4 text-xl">{failedToSaveMessage}</p>
                                <button className="bg-[#1E293B] hover:bg-[#334155] text-yellow-300 font-semibold px-4 py-2 rounded-md w-24 transition cursor-pointer" onClick={() => setFailedToSaveMsgOpen(false)} >
                                    OK
                                </button>
                            </div>
                        </div>
                    )}

                    {saveSuccessfulMsgOpen && (
                        <div className="fixed inset-0 backdrop-blur-md flex justify-center items-center z-50">
                            <div className="bg-white text-[#334155] rounded-lg p-6 w-80 shadow-xl text-center">
                                <p className="mb-4 text-xl">{saveSuccessfulMessage}</p>
                                <button className="bg-[#1E293B] hover:bg-[#334155] text-yellow-300 font-semibold px-4 py-2 rounded-md w-24 transition cursor-pointer" onClick={() => setSaveSuccessfulMsgOpen(false)} >
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
    )
}