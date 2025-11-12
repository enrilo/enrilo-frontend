import { useState, useEffect } from "react";
import { TextField, Button } from "@mui/material";
import Select from "react-select";
import bcryptjs from "bcryptjs";
import heic2any from "heic2any";
import { countryCodes } from "./components/CountryCodeList";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { selectStyles, asteriskColorStyle, slotPropsStyle, selectAndPreviewDocStyle } from "./styles/selectStyles";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "../firebase.js";

export default function MyProfile() {const { loading } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const params = useParams();
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewUrl, setPreviewUrl] = useState("");
    const [uploadingIndex, setUploadingIndex] = useState(null);
    const [uploadingProgress, setUploadingProgress] = useState(0);
    const [uploadingProfile, setUploadingProfile] = useState(false);
    const [selectedCode, setSelectedCode] = useState(null);
    const [selectedEmergencyCode, setSelectedEmergencyCode] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState("");
    const [confirmAction, setConfirmAction] = useState(null);
    const [modalMessage, setModalMessage] = useState("");
    const [messageOpen, setMessageOpen] = useState(false);
    const [failedToSaveMessage, setFailedToSaveMessage] = useState("");
    const [failedToSaveMsgOpen, setFailedToSaveMsgOpen] = useState(false);
    const [saveSuccessfulMessage, setSaveSuccessfulMessage] = useState("");
    const [saveSuccessfulMsgOpen, setSaveSuccessfulMsgOpen] = useState(false);
    const [previewProfileUrl, setPreviewProfileUrl] = useState("");
    const [deletedProfile, setDeletedProfile] = useState(false);
    const [newProfileFile, setNewProfileFile] = useState(null);


    const [formData, setFormData] = useState({
        photo_url: "",
        photo_firebase_path: "",
        full_name: "",
        country_code: "",
        phone: "",
        company_email: "",
        password: "",
        email: "",
        position: "",
        street_1: "",
        street_2: "",
        city: "",
        state: "",
        country: "",
        zipcode: "",
        emergency_contact: { name: "", relation: "", country_code: "", phone: "" },
        documents: [{ name: "", url: "", number: "", uploaded_at: Date.now() }],
    });

    useEffect(() => {
        const fetchSuperAdmin = async () => {
            // 1️⃣ Get persisted root string from localStorage
            const persistRoot = localStorage.getItem('persist:root');
            // 2️⃣ Parse it once to get the nested stringified user
            const rootObj = JSON.parse(persistRoot);
            // 3️⃣ Parse the 'user' field to get the actual user object
            const userObj = JSON.parse(rootObj.user);
            // 4️⃣ Access your desired data
            const accessToken = userObj.currentUser.data.accessToken;
            const superAdmin = userObj.currentUser.data.superAdmin;
            const superAdminID = superAdmin.id;

            const res = await fetch(`http://localhost:3000/api/super-admins/${superAdminID}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                credentials: "include",
            });

            const data = await res.json();
            if (data.success === false) return;

            const fetchedAdmin = data.data.superAdmin;
            setFormData(prev => ({ ...prev, ...fetchedAdmin }));

            const codeOption = options.find(opt => opt.value === fetchedAdmin.country_code);
            setSelectedCode(codeOption || null);

            const emergencyCodeOption = emergencyCountryCodeOptions.find(
                opt => opt.value === fetchedAdmin.emergency_contact?.country_code
            );
            setSelectedEmergencyCode(emergencyCodeOption || null);
        };

        fetchSuperAdmin();
    }, []);

    const emergencyCountryCodeOptions = countryCodes.map((country) => ({
        value: country.code,
        label: `${country.code} - ${country.name}`,
    }));

    const options = countryCodes.map((c) => ({ value: c.code, label: `${c.code} - ${c.name}` }));

    // --- UPLOAD FILE LOGIC ---
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

    const handleProfileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/heic"];
        if (!validTypes.includes(file.type)) {
            setModalMessage("Invalid file type. Please select JPG, JPEG, PNG, or HEIC.");
            setMessageOpen(true);
            return;
        }

        // Convert HEIC to JPEG if needed
        let processedFile = file;
        if (file.type === "image/heic") {
            const blob = await heic2any({ blob: file, toType: "image/jpeg" });
            processedFile = new File([blob], file.name.replace(/\.heic$/i, ".jpeg"), {
                type: "image/jpeg",
            });
        }

        // Update preview immediately
        setFormData((prev) => ({ ...prev, photo_url: URL.createObjectURL(processedFile) }));

        // Store new file to upload on submit
        setNewProfileFile(processedFile);

        // Cancel any previous delete
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
            photo_url: "",
            photo_firebase_path: "",
        }));
    };

    const handleFileChange = async (e, index) => {
        const file = e.target.files[0];
        if (!file) return;
        const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/heic", "application/pdf"];
        if (!validTypes.includes(file.type)) {
            setModalMessage("Please upload a JPG, JPEG, PNG, HEIC, or PDF.");
            setMessageOpen(true);
            return;
        }

        setUploadingIndex(index);
        try {
            const oldPath = formData.documents[index]?.url;
            if (oldPath) {
                const oldRef = ref(storage, oldPath);
                await deleteObject(oldRef).catch(() => {});
            }

            const { url, filePath } = await uploadFile(file, "documents");
            setFormData((p) => {
                const docs = [...p.documents];
                docs[index] = { ...docs[index], url, uploaded_at: Date.now() };
                return { ...p, documents: docs };
            });
            setModalMessage("File uploaded successfully!");
            setMessageOpen(true);
        } catch (err) {
            console.error(err);
            setModalMessage("File upload failed.");
            setMessageOpen(true);
        } finally {
            setUploadingIndex(null);
            setUploadingProgress(0);
        }
    };

    const handleDeleteFile = async (index) => {
        const path = formData.documents[index]?.url;
        if (!path) return;

        try {
            const refToDelete = ref(storage, path);
            await deleteObject(refToDelete);
            setFormData((p) => {
                const docs = [...p.documents];
                docs[index].url = "";
                return { ...p, documents: docs };
            });
        } catch {
            setModalMessage("Failed to delete file.");
            setMessageOpen(true);
        }
    };

    const handleDeleteFileConfirm = (index) => {
        setConfirmMessage("Are you sure you want to delete this file?");
        setConfirmAction(() => () => handleDeleteFile(index));
        setConfirmOpen(true);
    };

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
                const docs = [...p.documents];
                docs[i][field] = value;
                return { ...p, documents: docs };
            });
        } else setFormData((p) => ({ ...p, [id]: value }));
    };

    const addDocument = () => setFormData((p) => ({ ...p, documents: [ ...p.documents, { name: "", url: "", number: "", uploaded_at: Date.now() }, ], }));

    const removeDocument = async (index) => {
        const filePath = formData.documents[index]?.url;
        if (filePath) {
            setConfirmMessage("Are you sure you want to delete this file?");
            setConfirmAction(() => async () => {
                try {
                    const refToDelete = ref(storage, filePath);
                    await deleteObject(refToDelete);
                } catch {
                    setModalMessage("Failed to delete file.");
                    setMessageOpen(true);
                }
                setFormData((p) => ({ ...p, documents: p.documents.filter((_, i) => i !== index) }));
            });
            setConfirmOpen(true);
        } else {
            setFormData((p) => ({ ...p, documents: p.documents.filter((_, i) => i !== index) }));
        }
    };

     const handleSubmit = async (e) => {
        e.preventDefault();

        const invalidDocs = formData.documents.filter(
            (doc) => !doc.url && (doc.name.trim() !== "" || doc.number.trim() !== "")
        );

        if (invalidDocs.length > 0) {
            setModalMessage("Some documents have no uploaded file. Please either upload a new file or clear the document name and number.");
            setMessageOpen(true);
            return;
        }

        try {
            let updatedFormData = { ...formData };

            // --- Handle profile deletion if marked ---
            if (deletedProfile && formData.photo_firebase_path) {
                try {
                    const oldRef = ref(storage, formData.photo_firebase_path);
                    await deleteObject(oldRef);
                    updatedFormData.photo_url = "https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2264922221.jpg";
                    updatedFormData.photo_firebase_path = "";
                } catch (err) {
                    console.error(err);
                    setModalMessage("Failed to delete previous profile picture.");
                    setMessageOpen(true);
                    return;
                }
            }

            // --- Handle new profile picture upload ---
            if (newProfileFile) {
                try {
                    const { url, filePath } = await uploadFile(newProfileFile, "profile_pictures");
                    updatedFormData.photo_url = url;
                    updatedFormData.photo_firebase_path = filePath;
                } catch (err) {
                    console.error(err);
                    setModalMessage("Failed to upload new profile picture.");
                    setMessageOpen(true);
                    return;
                }
            }

            // 1️⃣ Get persisted root string from localStorage
            const persistRoot = localStorage.getItem('persist:root');
            // 2️⃣ Parse it once to get the nested stringified user
            const rootObj = JSON.parse(persistRoot);
            // 3️⃣ Parse the 'user' field to get the actual user object
            const userObj = JSON.parse(rootObj.user);
            // 4️⃣ Access your desired data
            const accessToken = userObj.currentUser.data.accessToken;
            const superAdmin = userObj.currentUser.data.superAdmin;
            const superAdminID = superAdmin.id;

            // --- Submit form data ---
            const res = await fetch(`http://localhost:3000/api/super-admins/${superAdminID}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
                body: JSON.stringify(updatedFormData),
                credentials: "include",
            });

            const data = await res.json();
            if (data.success === false) {
                setFailedToSaveMsgOpen(true);
                setFailedToSaveMessage(`Failed to update your profile because ${data.message.toLowerCase()}`);
            } else {
                setSaveSuccessfulMessage("Profile updated successfully!");
                setSaveSuccessfulMsgOpen(true);

                // Reset temp flags
                setNewProfileFile(null);
                setDeletedProfile(false);
            }
        } catch (err) {
            console.error(err);
            setFailedToSaveMsgOpen(true);
            setFailedToSaveMessage(`Failed to update your profile due to an unexpected error.`);
            setMessageOpen(true);
        }
    };

    return (
         <main className="flex-1 overflow-y-auto p-6">
            <div className="p-4">
                <div className="bg-white rounded-2xl shadow p-6 max-w-6xl mx-auto">

                    {/* Profile Upload */}
                    <div className="flex flex-col items-center border-dashed border-2 border-gray-300 rounded-lg p-8 mb-8 cursor-pointer hover:bg-gray-50 transition">
                        {!formData.photo_url || formData.photo_url === 'https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2264922221.jpg' ? (
                            <>
                                <div className="text-gray-400 text-3xl mb-2">🖼️</div>
                                <label className="text-blue-600 font-medium cursor-pointer hover:underline">
                                    {uploadingProfile ? "Uploading..." : "Click Here To Add Profile Picture"}
                                    <input type="file" accept=".jpg,.jpeg,.png,.heic" hidden onChange={handleProfileUpload} disabled={uploadingProfile} />
                                </label>
                            </>
                        ) : (
                            <div className="flex flex-col items-center">
                                <img src={formData.photo_url || "https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2264922221.jpg"} alt="Profile Photo" className="w-auto h-40 object-cover rounded-lg mb-2" />

                                <div className="flex gap-4">
                                    <label className="text-blue-600 cursor-pointer hover:underline">
                                        Replace
                                        <input type="file" accept=".jpg,.jpeg,.png,.heic" hidden onChange={handleProfileUpload} disabled={uploadingProfile} />
                                    </label>
                                    <button type="button" className="text-red-600 cursor-pointer hover:underline" onClick={handleDeleteProfileConfirm}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* FORM */}
                    <form className="grid grid-cols-1 md:grid-cols-3 gap-4" onSubmit={handleSubmit}>
                        <TextField id="full_name" label="Admin Full Name" value={formData.full_name} onChange={handleChange} variant="outlined" fullWidth required sx={asteriskColorStyle} />

                        {/* Phone */}
                        <div className="w-full flex gap-3">
                            <div className="min-w-[140px]">
                                <Select id="country_code" options={options} value={selectedCode} placeholder="Country Code" isSearchable menuPortalTarget={document.body} required styles={selectStyles}
                                    onChange={(sel) => {
                                        setSelectedCode(sel);
                                        setFormData((p) => ({ ...p, country_code: sel?.value || "" }));
                                    }}
                                />
                            </div>
                            <TextField id="phone" label="Phone" type="number" value={formData.phone} onChange={handleChange} variant="outlined" fullWidth required sx={asteriskColorStyle} slotProps={slotPropsStyle} />
                        </div>

                        {/* Rest of the fields */}
                        <TextField id="company_email" value={formData.company_email} onChange={handleChange} label="Company Email" variant="outlined" fullWidth required sx={{"& .MuiFormLabel-asterisk": { color: "red" }}}/>
                        <TextField id="email" value={formData.email} onChange={handleChange} label="Personal Email" variant="outlined" fullWidth />
                        <TextField id="position" value={formData.position} onChange={handleChange} label="Position" variant="outlined" required fullWidth />

                        {/* Address */}
                        <TextField id="street_1" value={formData.street_1} onChange={handleChange} label="Street 1" variant="outlined" fullWidth />
                        <TextField id="street_2" value={formData.street_2} onChange={handleChange} label="Street 2" variant="outlined" fullWidth />
                        <TextField id="city" value={formData.city} onChange={handleChange} label="City" variant="outlined" fullWidth />
                        <TextField id="state" value={formData.state} onChange={handleChange} label="State" variant="outlined" fullWidth />
                        <TextField id="country" value={formData.country} onChange={handleChange} label="Country" variant="outlined" fullWidth />
                        <TextField id="zipcode" value={formData.zipcode} onChange={handleChange} label="Zipcode" variant="outlined" fullWidth />

                        {/* Emergency Contact */}
                        <TextField id="emergency_name" label="Emergency Contact Name" variant="outlined" fullWidth value={formData.emergency_contact.name} onChange={handleChange} required sx={asteriskColorStyle} />
                        <div className="w-full flex flex-row gap-3">
                            <div className="min-w-[140px]">
                                <Select id="emergency_country_code" options={emergencyCountryCodeOptions} value={selectedEmergencyCode} placeholder="Country Code" isSearchable menuPortalTarget={document.body} styles={selectStyles} required
                                    onChange={(selected) => {
                                        setSelectedEmergencyCode(selected);
                                        setFormData((prev) => ({ ...prev, emergency_contact: { ...prev.emergency_contact, country_code: selected?.value || "" } }));
                                    }}
                                />
                            </div>
                            <TextField id="emergency_phone" type="number" label="Emergency Contact Phone" variant="outlined" fullWidth value={formData.emergency_contact.phone} onChange={handleChange} required sx={asteriskColorStyle} slotProps={slotPropsStyle} />
                        </div>
                        <TextField id="emergency_relation" label="Emergency Contact Relation" variant="outlined" fullWidth value={formData.emergency_contact.relation} onChange={handleChange} required sx={asteriskColorStyle} />

                        {/* Documents Section */}
                        {formData.documents.map((doc, i) => (
                            <div key={i} className="col-span-3 border rounded-md p-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <TextField id={`documents_${i}_name`} label="Document Type" value={doc.name} onChange={handleChange} fullWidth />
                                    <TextField id={`documents_${i}_number`} label="Document Number" value={doc.number} onChange={handleChange} fullWidth />

                                    <div className="flex flex-col gap-2">
                                        <Button variant="outlined" component="label" disabled={uploadingIndex === i} sx={selectAndPreviewDocStyle}>
                                        {uploadingIndex === i ? `Uploading ${uploadingProgress}%` : doc.url ? "Update Document (image or pdf only)" : "Select Document (image or pdf only)"}
                                            <input hidden type="file" accept=".jpg,.jpeg,.png,.heic,.pdf" onChange={(e) => handleFileChange(e, i)} />
                                        </Button>

                                        {doc.url && (
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="flex flex-row justify-between w-full">
                                                    <Button variant="outlined" onClick={() => { setPreviewUrl(doc.url); setPreviewOpen(true); }} sx={selectAndPreviewDocStyle}>PREVIEW</Button>
                                                    <Button color="error" variant="outlined" onClick={() => handleDeleteFileConfirm(i)}>Delete</Button> 
                                                </div>
                                            </div>
                                        )}
                                        <div className="mt-2 flex justify-end">
                                            {formData.documents.length > 1 && (
                                                <button type="button" className="text-red-600 hover:underline cursor-pointer" onClick={() => removeDocument(i)}>Remove</button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <button type="button" className="col-span-3 mb-4 text-blue-600 hover:underline cursor-pointer" onClick={addDocument}>
                            + Add Another Document
                        </button>

                        {/* Submit */}
                        <div className="col-span-3 mt-6 flex justify-center">
                            <button type="submit" disabled={loading} className="bg-[#1E293B] text-white px-8 py-2 rounded-md hover:bg-[#334155] transition cursor-pointer">
                                {loading ? "Updating..." : "Update Profile"}
                            </button>
                        </div>
                    </form>

                    {/* Modals (Preview, Confirm, Message, Failed, Success) */}
                    {previewOpen && ( 
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50"> 
                            <div className="bg-white rounded-2xl shadow-lg p-4 max-w-3xl w-full">
                                <div className="flex justify-end mb-2"> 
                                    <button className="bg-[#1E293B] text-white px-8 py-2 rounded-md hover:bg-[#334155] transition cursor-pointer" onClick={() => setPreviewOpen(false)}> 
                                        Close 
                                    </button>
                                </div> 
                                {previewUrl.includes(".pdf") ? ( 
                                    <iframe src={previewUrl} className="w-full h-[500px] rounded" title="Document Preview"></iframe> 
                                ) : ( 
                                    <img src={previewUrl} alt="Document Preview" className="w-full max-h-[500px] object-contain rounded" /> 
                                )}
                            </div>
                        </div>
                    )}
                    {confirmOpen && (
                        <div className="fixed inset-0 bg-[#334155] bg-opacity-50 flex justify-center items-center z-50">
                            <div className="bg-white text-[#334155] rounded-lg p-6 w-80 shadow-xl text-center">
                                <p className="text-center font-medium mb-5">{confirmMessage}</p>
                                <div className="flex justify-center gap-4">
                                    <button className="bg-[#334155] text-white border-2 px-4 py-2 rounded-md w-24 hover:bg-[#1D4ED8] transition cursor-pointer" onClick={() => { if (confirmAction) confirmAction(); setConfirmOpen(false); }} >
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
                        <div className="fixed inset-0 bg-[#334155] bg-opacity-50 flex justify-center items-center z-50">
                            <div className="bg-white text-[#334155] rounded-lg p-6 w-80 shadow-xl text-center">
                                <p className="mb-4">{modalMessage}</p>
                                <button className="bg-[#1E293B] text-white border-2 px-4 py-2 rounded-md w-24 hover:bg-[#1D4ED8] transition cursor-pointer" onClick={() => setMessageOpen(false)} >
                                    OK
                                </button>
                            </div>
                        </div>
                    )}

                    {failedToSaveMsgOpen && (
                        <div className="fixed inset-0 bg-[#334155] bg-opacity-50 flex justify-center items-center z-50">
                            <div className="bg-white text-[#334155] rounded-lg p-6 w-80 shadow-xl text-center">
                                <p className="mb-4">{failedToSaveMessage}</p>
                                <button className="bg-[#1E293B] text-white border-2 px-4 py-2 rounded-md w-24 hover:bg-[#1D4ED8] transition cursor-pointer" onClick={() => setFailedToSaveMsgOpen(false)} >
                                    OK
                                </button>
                            </div>
                        </div>
                    )}

                    {saveSuccessfulMsgOpen && (
                        <div className="fixed inset-0 bg-[#334155] bg-opacity-50 flex justify-center items-center z-50">
                            <div className="bg-white text-[#334155] rounded-lg p-6 w-80 shadow-xl text-center">
                                <p className="mb-4">{saveSuccessfulMessage}</p>
                                <button className="bg-[#1E293B] text-white border-2 px-4 py-2 rounded-md w-24 hover:bg-[#1D4ED8] transition cursor-pointer" onClick={() => { setSaveSuccessfulMsgOpen(false);}} >
                                    OK
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    )
}
