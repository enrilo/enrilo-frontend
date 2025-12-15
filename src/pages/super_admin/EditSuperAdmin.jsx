import { useState, useEffect } from "react";
import { TextField, Button } from "@mui/material";
import Select from "react-select";
import heic2any from "heic2any";
import { countryCodes } from "../components/CountryCodeList.js";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { selectStyles, asteriskColorStyle, slotPropsStyle, selectDocumentBtnStyle, previewDocumentBtnStyle } from "../styles/selectStyles.js";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "../../firebase.js";

export default function EditSuperAdmin() {
    const { loading } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const params = useParams();
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewUrl, setPreviewUrl] = useState("");
    const [uploadingIndex, setUploadingIndex] = useState(null);
    const [uploadingProgress, setUploadingProgress] = useState(0);
    const [uploadingProfile, setUploadingProfile] = useState(false);
    const [selectedCountryCode, setSelectedCountryCode] = useState(null);
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
    const [pageLoading, setPageLoading] = useState(false);
    const [isUserActive, setIsUserActive] = useState(null);
    const [selectedRole, setSelectedRole] = useState(null);
    const [selectedWriteAccess, setSelectedWriteAccess] = useState(null);
    const [currentUserID, setCurrentUserID] = useState('');
    const [id1, setId1] = useState(null); // first dropdown
    const [id2, setId2] = useState(null); // second dropdown
    const [tempClearedRows, setTempClearedRows] = useState({}); // { index: true }
    const [tempOriginalRows, setTempOriginalRows] = useState({}); // store original rows for potential restore
    const persistedRoot = JSON.parse(localStorage.getItem("persist:root"));
    const userState = JSON.parse(persistedRoot.user);
    const token = userState.currentUser?.data?.accessToken;
    const superAdminID = params.id;

    const [formData, setFormData] = useState({
        photo_url: "",
        photo_firebase_path: "",
        full_name: "",
        country_code: "",
        phone: "",
        company_email: "",
        email: "",
        position: "",
        role:"",
        allow_write_access:false,
        street_1: "",
        street_2: "",
        city: "",
        state: "",
        country: "",
        zipcode: "",
        bank_details: { account_number: "", account_holder_name: "", bank_name: "", branch_name:"", branch_address: "", ifsc_code:"" },
        emergency_contact: { name: "", relation: "", country_code: "", phone: "" },
        documents: [{ name: "", url: "", number: "", uploaded_at: Date.now() }],
        is_active:true
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
        setCurrentUserID(userState.currentUser?.data?.id);
        const fetchSuperAdmin = async () => {
            const superAdminData = await fetch(`http://localhost:3000/api/super-admins/${superAdminID}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                credentials: "include",
            });

            const superAdminJsonData = await superAdminData.json();
            if (superAdminJsonData.success === false) {
                return;
            }

            const fetchedAdmin = superAdminJsonData.data.superAdmin;
            setFormData(prev => ({ ...prev, ...fetchedAdmin }));

            const codeOption = countryCodeOptions.find(opt => opt.value === fetchedAdmin.country_code);
            setSelectedCountryCode(codeOption || null);

            const roleOption = roleOptions.find(opt => opt.value === fetchedAdmin.role);
            setSelectedRole(roleOption || null);

            const allowWriteAccessOption = allowWriteAccessOptions.find(opt => opt.value === fetchedAdmin.allow_write_access);
            setSelectedWriteAccess(allowWriteAccessOption || null);

            const userActiveStatus = isActiveUserDetailsOptions.find(opt => opt.value === fetchedAdmin.is_active);
            setIsUserActive(userActiveStatus || null);

            const emergencyCodeOption = emergencyCountryCodeOptions.find(opt => opt.value === fetchedAdmin.emergency_contact?.country_code);
            setSelectedEmergencyCode(emergencyCodeOption || null);

            if(formData._id !== currentUserID) {
                // FETCH ACCESS TOKEN DATA (IF THE ID DATA FETCHED DOES NOT MATCH ID OF CURRENTLY LOGGED IN USER)
                const accessTokenResData = await fetch(`http://localhost:3000/api/access-tokens/access-token-by-super-admin-id/${superAdminID}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });
                const accessTokenData = await accessTokenResData.json();
                
                if(accessTokenData.success === false){
                    return;
                }
                
                setAccessTokenFormData(accessTokenData.data.accessToken);
            }
        };

        fetchSuperAdmin();
    }, []);

    // EMERGENCY PHONE NUMBER COUNTRY CODE DROPDOWN OPTIONS
    const emergencyCountryCodeOptions = countryCodes.map((country) => ({value: country.code, label: `${country.code} - ${country.name}`, }));

    // USER'S PHONE NUMBER COUNTRY CODE DROPDOWN OPTIONS
    const countryCodeOptions = countryCodes.map((c) => ({ value: c.code, label: `${c.code} - ${c.name}` }));

    // IS USER ACTIVE DROPDOWN OPTIONS
    const isActiveUserDetails = [ { name: "Yes", code: true }, { name: "No", code: false }, ];

    const isActiveUserDetailsOptions = isActiveUserDetails.map((isActiveUser) => ({ value: isActiveUser.code, label: isActiveUser.name }));

    // USER'S ID SELECTION DROPDOWN OPTIONS
    const idOptions = [ 
        { value: "", label: "" },
        { value: "aadhar_card", label: "Aadhar Card" },
        { value: "pan_card", label: "Pan Card" }
    ];

    const filteredOptionsForId1 = idOptions.filter( (opt) => opt.value !== id2?.value );

    const filteredOptionsForId2 = idOptions.filter( (opt) => opt.value !== id1?.value );

    // USER'S ROLE OPTIONS
   const roleOptions = [ { value: "user", label: "User Role" }, { value: "admin", label: "Admin Role" } ];

    const allowWriteAccessOptions = [
        { value: false, label: "Write Access Not Allowed" },
        { value: true, label: "Write Access Allowed" }
    ];

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

        setFormData((prev) => ({ ...prev, photo_url: URL.createObjectURL(processedFile) }));
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
            photo_url: "https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2264922221.jpg",
            photo_firebase_path: "",
        }));
    };

    // UPLOAD FILE LOGIC (ADD/UPDATE/DELETE)
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
                const docs = Array.isArray(p.documents) ? [...p.documents] : [];
                while (docs.length <= index) docs.push({ name: "", url: "", number: "", uploaded_at: Date.now() });
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

    // ADD/REMOVE DOCUMENT ROW LOGIC
    const addDocument = () => setFormData((p) => ({ ...p, documents: [ ...(Array.isArray(p.documents) ? p.documents : []), { name: "", url: "", number: "", uploaded_at: Date.now() }, ], }));

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

    const clearRow = (index) => {
        // store original only if not already stored
        setTempOriginalRows((prev) => {
            if (prev[index]) return prev;
            return { ...prev, [index]: (Array.isArray(formData.documents) ? formData.documents[index] : { name: "", url: "", number: "", uploaded_at: Date.now() }) };
        });
        // mark row as cleared
        setFormData((prev) => {
            const docs = [...prev.documents];
            docs[index] = { ...docs[index], name: "", number: "", url: "" };
            return { ...prev, documents: docs };
        });
        setTempClearedRows((prev) => ({ ...prev, [index]: true }));
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
            //setting access token form data
            setAccessTokenFormData((q) => ({ ...q, allow_write_access: value }));
        } else {
            //setting entire form data
            setFormData((p) => ({ ...p, [id]: value }));
            //setting access token form data
            setAccessTokenFormData((p) => ({ ...p, [id]: value }));
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setPageLoading(true);
        try {
            let updatedFormData = { ...formData };
            updatedFormData.documents = Array.isArray(updatedFormData.documents) ? [...updatedFormData.documents] : [];
            const clearedIndexes = Object.keys(tempClearedRows).map((k) => parseInt(k, 10)).sort((a, b) => a - b);
            if (clearedIndexes.length > 0) {
                for (const idx of clearedIndexes) {
                    const doc = updatedFormData.documents[idx];
                    if (doc && doc.url) {
                        try {
                            const refToDelete = ref(storage, doc.url);
                            await deleteObject(refToDelete).catch(() => {});
                        } catch (err) {
                            console.warn("Failed to delete cleared document file:", err);
                        }
                    }
                }
                // filter out cleared rows from payload
                updatedFormData.documents = updatedFormData.documents.filter((_, i) => !tempClearedRows[i]);
            }

            const invalidDocs = updatedFormData.documents.filter(
                (doc) => !doc.url && ((doc.name && doc.name.trim() !== "") || (doc.number && doc.number.trim() !== ""))
            );

            if (invalidDocs.length > 0) {
                setModalMessage("Some documents have no uploaded file. Please either upload a new file or clear the document name and number.");
                setMessageOpen(true);
                setPageLoading(false);
                return;
            }

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
                    setPageLoading(false);
                    return;
                }
            }
            if (newProfileFile) {
                try {
                    const { url, filePath } = await uploadFile(newProfileFile, "profile_pictures");
                    updatedFormData.photo_url = url;
                    updatedFormData.photo_firebase_path = filePath;
                } catch (err) {
                    console.error(err);
                    setModalMessage("Failed to upload new profile picture.");
                    setMessageOpen(true);
                    setPageLoading(false);
                    return;
                }
            }

            const res = await fetch(`http://localhost:3000/api/super-admins/${superAdminID}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(updatedFormData),
                credentials: "include",
            });
            const data = await res.json();

            if (data.success === false) {
                setFailedToSaveMsgOpen(true);
                setFailedToSaveMessage(`Failed to update super admin because ${data.message.toLowerCase()}`);
            } else {
                if(formData._id !== currentUserID) {
                    // UPDATE ACCESS TOKEN DATA CODE START (IF THE ID DATA FETCHED DOES NOT MATCH ID OF CURRENTLY LOGGED IN USER)
                    const updateAccessTokenInfo = await fetch(`http://localhost:3000/api/access-tokens/access-token-by-super-admin-id/${superAdminID}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(accessTokenFormData),
                        credentials: "include",
                    });
                    const updateAccessTokenData = await updateAccessTokenInfo.json();
                    if (updateAccessTokenData.success === false) {
                        return;
                    }
                    // UPDATE ACCESS TOKEN DATA CODE END
                }
               

                setSaveSuccessfulMessage("Super admin updated successfully! You will now be redirected to All Super Admin Page.");
                setSaveSuccessfulMsgOpen(true);
                setNewProfileFile(null);
                setDeletedProfile(false);
                setTempClearedRows({});
                setTempOriginalRows({});
            }
        } catch (err) {
            console.error(err);
            setFailedToSaveMsgOpen(true);
            setFailedToSaveMessage(`Failed to update super admin due to an unexpected error.`);
            setMessageOpen(true);
        } finally {
            setPageLoading(false);
        }
    };

    return (
        <main className="flex-1 overflow-y-auto p-6">
            <div className="p-4">
                <div className="bg-white rounded-2xl shadow p-6 max-w-6xl mx-auto">
                    {formData._id !== currentUserID && (
                        <div className="flex flex-row items-center mb-10">
                            <div className='text-2xl font-semibold mr-5'>
                                Is This Super Admin Active?
                            </div>
                            <div className="max-w-[250px]">
                                <Select className="cursor-pointer" id="is_active" options={isActiveUserDetailsOptions} value={isUserActive} placeholder="Select Status" menuPortalTarget={document.body} styles={selectStyles} isSearchable required onChange={(sel) => { setIsUserActive(sel); setFormData((p) => ({ ...p, is_active: sel.value })); }} />
                            </div>
                        </div>
                    )}
                    <div className='text-2xl underline font-semibold mb-5'>
                        Personal Details:
                    </div>
                    {/* Profile Upload */}
                    <div className={`flex flex-col items-center border-dashed border-2 border-gray-300 rounded-lg p-8 mb-8 hover:bg-gray-50 transition ${!isUserActive?.value ? "cursor-not-allowed" : "cursor-pointer"}`}>
                        {!formData.photo_url || formData.photo_url === 'https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2264922221.jpg' ? (
                            <>
                                <div className={`text-gray-400 text-3xl mb-2 ${!isUserActive?.value ? "cursor-not-allowed" : ""}`}>🖼️</div>
                                <label className={`text-blue-600 font-medium hover:underline ${!isUserActive?.value ? "cursor-not-allowed" : "cursor-pointer"}`}>
                                    {uploadingProfile ? "Uploading..." : "Click Here To Add Profile Picture"}
                                    <input type="file" accept=".jpg,.jpeg,.png,.heic" hidden onChange={handleProfileUpload} disabled={uploadingProfile || !isUserActive?.value} className=" disabled:cursor-not-allowed" />
                                </label>
                            </>
                        ) : (
                            <div className="flex flex-col items-center">
                                <img src={formData.photo_url || "https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2264922221.jpg"} alt="Profile Photo" className="w-auto h-40 object-cover rounded-lg mb-2" disabled={!isUserActive?.value} />

                                <div className="flex gap-4">
                                    <label className={`text-blue-600 ${!isUserActive?.value ? "cursor-not-allowed" : "cursor-pointer hover:underline"}`}>
                                        Replace
                                        <input type="file" accept=".jpg,.jpeg,.png,.heic" hidden onChange={handleProfileUpload} disabled={uploadingProfile || !isUserActive?.value} />
                                    </label>
                                    <button type="button" className={`text-red-600 ${!isUserActive?.value ? "cursor-not-allowed" : "cursor-pointer hover:underline"}`} onClick={handleDeleteProfileConfirm} disabled={!isUserActive?.value}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* FORM */}
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                            <TextField id="full_name" label="Admin Full Name" value={formData.full_name} onChange={handleChange} variant="outlined" fullWidth required sx={asteriskColorStyle} disabled={!isUserActive?.value} />
                            {/* Phone */}
                            <div className="w-full flex gap-3">
                                <div className="min-w-[140px]">
                                    <Select id="country_code" options={countryCodeOptions} value={selectedCountryCode} isDisabled={!isUserActive?.value} placeholder="Country Code" isSearchable menuPortalTarget={document.body} required styles={selectStyles}
                                        onChange={(sel) => {
                                            setSelectedCountryCode(sel);
                                            setFormData((p) => ({ ...p, country_code: sel?.value || "" }));
                                        }}
                                    />
                                </div>
                                <TextField id="phone" label="Phone" type="number" value={formData.phone} onChange={handleChange} variant="outlined" fullWidth required sx={asteriskColorStyle} slotProps={slotPropsStyle} disabled={!isUserActive?.value} />
                            </div>

                            {/* Rest of the fields */}
                            <TextField id="company_email" value={formData.company_email} onChange={handleChange} label="Company Email" variant="outlined" fullWidth required sx={{"& .MuiFormLabel-asterisk": { color: "red" }}} disabled={!isUserActive?.value} />
                            <TextField id="email" value={formData.email} onChange={handleChange} label="Personal Email" variant="outlined" fullWidth disabled={!isUserActive?.value} />
                            <TextField id="position" value={formData.position} onChange={handleChange} label="Position" variant="outlined" required fullWidth disabled={!isUserActive?.value} />
                            {formData._id !== currentUserID && (
                                <>
                                    <Select id="role" options={roleOptions} value={selectedRole} placeholder="Role" isSearchable menuPortalTarget={document.body} required styles={selectStyles}
                                        onChange={(sel) => {
                                            setSelectedRole(sel);
                                            setFormData((p) => ({ ...p, role: sel?.value || "" }));
                                        }}
                                    />
                                    <Select id="allow_write_access" options={allowWriteAccessOptions} value={selectedWriteAccess} placeholder="Do You Want To Allow Write Access?" isSearchable menuPortalTarget={document.body} required styles={selectStyles}
                                        onChange={(sel) => {
                                            setSelectedWriteAccess(sel);
                                            setFormData((p) => ({ ...p, allow_write_access: sel?.value || false }));
                                            setAccessTokenFormData((q) => ({ ...q, allow_write_access: sel?.value || false }));
                                        }}
                                    />
                                </>
                            )}
                        </div>

                        <div className='text-2xl underline font-semibold mb-5'>
                            Home Address:
                        </div>
                        {/* Address */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                            <TextField id="street_1" value={formData.street_1} onChange={handleChange} disabled={!isUserActive?.value} label="Street 1" variant="outlined" fullWidth />
                            <TextField id="street_2" value={formData.street_2} onChange={handleChange} disabled={!isUserActive?.value} label="Street 2" variant="outlined" fullWidth />
                            <TextField id="city" value={formData.city} onChange={handleChange} disabled={!isUserActive?.value} label="City" variant="outlined" fullWidth />
                            <TextField id="state" value={formData.state} onChange={handleChange} disabled={!isUserActive?.value} label="State" variant="outlined" fullWidth />
                            <TextField id="country" value={formData.country} onChange={handleChange} disabled={!isUserActive?.value} label="Country" variant="outlined" fullWidth />
                            <TextField id="zipcode" value={formData.zipcode} onChange={handleChange} disabled={!isUserActive?.value} label="Zipcode" variant="outlined" fullWidth />
                        </div>

                        <div className='text-2xl underline font-semibold mb-5'>
                            Bank Details:
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                            <TextField id="account_holder_name" value={formData.bank_details.account_holder_name} onChange={handleChange} disabled={!isUserActive?.value} label="Account Holder Name" variant="outlined" fullWidth />
                            <TextField id="account_number" value={formData.bank_details.account_number} onChange={handleChange} disabled={!isUserActive?.value} label="Account Number" variant="outlined" fullWidth />
                            <TextField id="ifsc_code" value={formData.bank_details.ifsc_code} onChange={handleChange} disabled={!isUserActive?.value} label="IFSC Code" variant="outlined" fullWidth />
                            <TextField id="bank_name" value={formData.bank_details.bank_name} onChange={handleChange} disabled={!isUserActive?.value} label="Bank Name" variant="outlined" fullWidth />
                            <TextField id="branch_name" value={formData.bank_details.branch_name} onChange={handleChange} disabled={!isUserActive?.value} label="Branch Name" variant="outlined" fullWidth />
                            <TextField id="branch_address" value={formData.bank_details.branch_address} onChange={handleChange} disabled={!isUserActive?.value} label="Branch Address" variant="outlined" fullWidth />
                        </div>

                        <div className='text-2xl underline font-semibold mb-5'>
                            Emergency Contact Details:
                        </div>
                        {/* Emergency Contact */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                            <TextField id="emergency_name" label="Emergency Contact Name" variant="outlined" value={formData.emergency_contact.name} onChange={handleChange} disabled={!isUserActive?.value} sx={asteriskColorStyle} required fullWidth />
                            <div className="w-full flex flex-row gap-3">
                                <div className="min-w-[140px]">
                                    <Select id="emergency_country_code" options={emergencyCountryCodeOptions} value={selectedEmergencyCode} placeholder="Country Code" menuPortalTarget={document.body} styles={selectStyles} isDisabled={!isUserActive?.value} required isSearchable
                                        onChange={(selected) => {
                                            setSelectedEmergencyCode(selected);
                                            setFormData((prev) => ({ ...prev, emergency_contact: { ...prev.emergency_contact, country_code: selected?.value || "" } }));
                                        }}
                                    />
                                </div>
                                <TextField id="emergency_phone" type="number" label="Emergency Contact Phone" variant="outlined" value={formData.emergency_contact.phone} onChange={handleChange} disabled={!isUserActive?.value} sx={asteriskColorStyle} slotProps={slotPropsStyle} required fullWidth />
                            </div>
                            <TextField id="emergency_relation" label="Emergency Contact Relation" variant="outlined" value={formData.emergency_contact.relation} onChange={handleChange} sx={asteriskColorStyle} disabled={!isUserActive?.value} required fullWidth />
                        </div>
                        <div className='text-2xl underline font-semibold mb-5'>
                            Documents:
                        </div>
                        {
                            formData.documents.length === 0 && (
                                <div className='text-lg font-semibold mb-5'>
                                    {formData._id !== currentUserID ? "This Super Admin Has No Associated Documents" : "You Have No Associated Documents"}
                                </div>
                            )
                        }
                        {Array.isArray(formData.documents) && formData.documents.slice(0, 2).map((doc, i) => {
                            const displayName = doc?.name || "";
                            const displayNumber = doc?.number || "";
                            const displayUrl = doc?.url || "";

                            return (
                            <div key={i} className="col-span-3 border rounded-md p-4 mb-5">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
                                    <Select isSearchable id={`documents_${i}_name`} placeholder="Select Document Type" menuPortalTarget={document.body} styles={selectStyles} disabled={!isUserActive?.value}
                                        options={idOptions.filter((opt) => i === 0 ? opt.value !== formData.documents[1]?.name : opt.value !== formData.documents[0]?.name )}
                                        value={ displayName ? { value: displayName, label: idOptions.find((o) => o.value === displayName)?.label || displayName } : null }
                                        onChange={(sel) => handleChange({ target: {id: `documents_${i}_name`, value: sel?.value || "", } })}
                                    />
                                    <TextField id={`documents_${i}_number`} label="Document Number" value={displayNumber} onChange={handleChange} disabled={!isUserActive?.value} fullWidth />

                                    <div className="flex flex-col gap-2">
                                        <Button variant="outlined" component="label" disabled={uploadingIndex === i || !isUserActive?.value} sx={selectDocumentBtnStyle}>
                                            {uploadingIndex === i ? `Uploading ${uploadingProgress}%` : displayUrl ? "Update Document (image or pdf only)" : "Select Document (image or pdf only)"}
                                            <input hidden type="file" accept=".jpg,.jpeg,.png,.heic,.pdf" onChange={(e) => handleFileChange(e, i)} />
                                        </Button>

                                        {displayUrl && (
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="flex flex-row justify-between w-full">
                                                    <Button variant="outlined" onClick={() => { setPreviewUrl(displayUrl); setPreviewOpen(true); }} sx={previewDocumentBtnStyle} disabled={!isUserActive?.value}>PREVIEW</Button>
                                                    <Button color="error" variant="outlined" onClick={() => handleDeleteFileConfirm(i)} disabled={!isUserActive?.value}>Delete</Button> 
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-row justify-between">
                                    <button type="button" className="text-red-600 hover:underline cursor-pointer" onClick={() => clearRow(i)} disabled={!isUserActive?.value}>Clear Row</button>
                                    <div className="flex">
                                        {formData.documents.length > 1 && (
                                            <button type="button" className="text-red-600 hover:underline cursor-pointer" onClick={() => removeDocument(i)} disabled={!isUserActive?.value}>Remove Row</button>
                                        )}
                                    </div>
                                </div>
                            </div>
                            );
                        })}
                        {
                            isUserActive?.value && (
                                formData.documents.length < 2 && (
                                    formData.documents.length === 0 ? (
                                        <button type="button" className="col-span-3 mb-4 text-blue-600 cursor-pointer hover:underline" onClick={addDocument} disabled={!isUserActive?.value}>
                                            + Add New Document
                                        </button>
                                    ) : (
                                        <button type="button" className="col-span-3 mb-4 text-blue-600 cursor-pointer hover:underline" onClick={addDocument} disabled={!isUserActive?.value}>
                                            + Add Another Document
                                        </button>
                                    )
                                )
                            )
                        }

                        {/* Submit */}
                        <div className="col-span-3 mt-6 flex justify-center">
                            <button type="submit" disabled={loading} className="bg-[#1E293B] hover:bg-[#334155] text-yellow-300 font-semibold px-8 py-2 rounded-md transition cursor-pointer">
                                {loading ? "Updating..." : (formData._id !== currentUserID ? 'Update Super Admin' : 'Update My Profile')}
                            </button>
                        </div>
                    </form>

                    {/* Modals (Preview, Confirm, Message, Failed, Success) */}
                    {previewOpen && ( 
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50"> 
                            <div className="bg-white rounded-2xl shadow-lg p-4 max-w-5xl max-h-2xl w-full">
                                <div className="flex justify-end mb-2"> 
                                    <button className="bg-[#1E293B] hover:bg-[#334155] text-yellow-300 font-semibold px-8 py-2 rounded-md transition cursor-pointer" onClick={() => setPreviewOpen(false)}> 
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
                                <button className="bg-[#1E293B] hover:bg-[#334155] text-yellow-300 font-semibold px-4 py-2 rounded-md w-24 transition cursor-pointer" onClick={() => { setSaveSuccessfulMsgOpen(false); navigate("/all-super-admin");}} >
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