// import { useState } from "react";
// import { TextField, Button } from "@mui/material";
// import Select from "react-select";
// import bcryptjs from "bcryptjs";
// import heic2any from "heic2any";
// import { countryCodes } from "./components/CountryCodeList";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { selectStyles, asteriskColorStyle, slotPropsStyle, selectDocumentBtnStyle } from "./styles/selectStyles";
// import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
// import { storage } from "../firebase.js";

// export default function AddNewSuperAdmin() {
//   const { loading } = useSelector((state) => state.user);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const hashedPassword = bcryptjs.hashSync("SuperSecureAdmin123!", 10);

//   const [previewOpen, setPreviewOpen] = useState(false);
//   const [previewUrl, setPreviewUrl] = useState("");
//   const [uploadingIndex, setUploadingIndex] = useState(null);
//   const [uploadingProgress, setUploadingProgress] = useState(0);
//   const [uploadingProfile, setUploadingProfile] = useState(false);
//   const [selectedCode, setSelectedCode] = useState(null);
//   const [selectedEmergencyCode, setSelectedEmergencyCode] = useState(null);
//   const [confirmOpen, setConfirmOpen] = useState(false);
//   const [confirmMessage, setConfirmMessage] = useState("");
//   const [confirmAction, setConfirmAction] = useState(null);
//   const [modalMessage, setModalMessage] = useState("");
//   const [messageOpen, setMessageOpen] = useState(false);
//   const [failedToSaveMessage, setFailedToSaveMessage] = useState("");
//   const [failedToSaveMsgOpen, setFailedToSaveMsgOpen] = useState(false);

//   const [saveSuccessfulMessage, setSaveSuccessfulMessage] = useState("");
//   const [saveSuccessfulMsgOpen, setSaveSuccessfulMsgOpen] = useState(false);

//   const emergencyCountryCodeOptions = countryCodes.map((country) => ({
//     value: country.code,
//     label: `${country.code} - ${country.name}`,
//   }));

//   const options = countryCodes.map((c) => ({ value: c.code, label: `${c.code} - ${c.name}` }));

//   const [formData, setFormData] = useState({
//     photo_url: "",
//     full_name: "",
//     country_code: "",
//     phone: "",
//     company_email: "",
//     password: hashedPassword,
//     email: "",
//     position: "",
//     street_1: "",
//     street_2: "",
//     city: "",
//     state: "",
//     country: "",
//     zipcode: "",
//     emergency_contact: { name: "", relation: "", country_code: "", phone: "" },
//     documents: [{ name: "", url: "", number: "", uploaded_at: Date.now() }],
//   });

//   // --- UPLOAD FILE LOGIC ---
//   const uploadFile = async (file, pathPrefix) => {
//     let uploadFile = file;
//     if (file.type === "image/heic") {
//       const blob = await heic2any({ blob: file, toType: "image/jpeg" });
//       uploadFile = new File([blob], file.name.replace(/\.heic$/i, ".jpeg"), {
//         type: "image/jpeg",
//       });
//     }
//     const filePath = `${pathPrefix}/${Date.now()}_${uploadFile.name}`;
//     const fileRef = ref(storage, filePath);

//     const uploadTask = uploadBytesResumable(fileRef, uploadFile);
//     return new Promise((resolve, reject) => {
//       uploadTask.on(
//         "state_changed",
//         (snapshot) => {
//           const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
//           setUploadingProgress(progress);
//         },
//         (error) => reject(error),
//         async () => {
//           const url = await getDownloadURL(uploadTask.snapshot.ref);
//           resolve({ url, filePath });
//         }
//       );
//     });
//   };

//   // --- PROFILE PIC UPLOAD ---
//   const handleProfileUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/heic", "application/pdf"];
//     if (!validTypes.includes(file.type)) {
//       setModalMessage("Invalid file type.");
//       setMessageOpen(true);
//       return;
//     }

//     try {
//       setUploadingProfile(true);
//       if (formData.photo_url && formData.photo_url != "https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2264922221.jpg") {
//         const oldRef = ref(storage, formData.photo_url);
//         await deleteObject(oldRef).catch(() => {});
//       }
//       const { url, filePath } = await uploadFile(file, "profile_pictures");
//       setFormData((p) => ({ ...p, photo_url: url }));
//     } catch (err) {
//       console.error(err);
//       setModalMessage("Profile upload failed.");
//       setMessageOpen(true);
//     } finally {
//       setUploadingProfile(false);
//     }
//   };

//   const handleDeleteProfileConfirm = () => {
//     setConfirmMessage("Delete current profile picture?");
//     setConfirmAction(() => handleDeleteProfile);
//     setConfirmOpen(true);
//   };

//   const handleDeleteProfile = async () => {
//     if (!formData.photo_url) return;
//     try {
//       const fileRef = ref(storage, formData.photo_url);
//       await deleteObject(fileRef);
//       setFormData((p) => ({ ...p, photo_url: "https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2264922221.jpg" }));
//     } catch {
//       setModalMessage("Failed to delete profile picture.");
//       setMessageOpen(true);
//     }
//   };

//   // --- DOCUMENT UPLOAD ---
//   const handleFileChange = async (e, index) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/heic", "application/pdf"];
//     if (!validTypes.includes(file.type)) {
//       setModalMessage("Please upload a JPG, JPEG, PNG, HEIC, or PDF.");
//       setMessageOpen(true);
//       return;
//     }

//     setUploadingIndex(index);
//     try {
//       const oldPath = formData.documents[index]?.firebasePath;
//       if (oldPath) {
//         const oldRef = ref(storage, oldPath);
//         await deleteObject(oldRef).catch(() => {});
//       }

//       const { url, filePath } = await uploadFile(file, "documents");
//       setFormData((p) => {
//         const docs = [...p.documents];
//         docs[index] = { ...docs[index], url, firebasePath: filePath, uploaded_at: Date.now() };
//         return { ...p, documents: docs };
//       });
//       setModalMessage("File uploaded successfully!");
//       setMessageOpen(true);
//     } catch (err) {
//       console.error(err);
//       setModalMessage("File upload failed.");
//       setMessageOpen(true);
//     } finally {
//       setUploadingIndex(null);
//       setUploadingProgress(0);
//     }
//   };

//   const handleDeleteFile = async (index) => {
//     const path = formData.documents[index]?.firebasePath;
//     if (!path) return;

//     try {
//       const refToDelete = ref(storage, path);
//       await deleteObject(refToDelete);
//       setFormData((p) => {
//         const docs = [...p.documents];
//         docs[index].url = "";
//         docs[index].firebasePath = "";
//         return { ...p, documents: docs };
//       });
//     } catch {
//       setModalMessage("Failed to delete file.");
//       setMessageOpen(true);
//     }
//   };

//   const handleDeleteFileConfirm = (index) => {
//     setConfirmMessage("Are you sure you want to delete this file?");
//     setConfirmAction(() => () => handleDeleteFile(index));
//     setConfirmOpen(true);
//   };

//   const handleChange = (e) => {
//     const { id, value } = e.target;
//     if (id.startsWith("emergency_")) {
//       const key = id.replace("emergency_", "");
//       setFormData((p) => ({
//         ...p,
//         emergency_contact: { ...p.emergency_contact, [key]: value },
//       }));
//     } else if (id.startsWith("documents_")) {
//       const [_, index, field] = id.split("_");
//       const i = parseInt(index, 10);
//       setFormData((p) => {
//         const docs = [...p.documents];
//         docs[i][field] = value;
//         return { ...p, documents: docs };
//       });
//     } else setFormData((p) => ({ ...p, [id]: value }));
//   };

//   const addDocument = () =>
//     setFormData((p) => ({
//       ...p,
//       documents: [
//         ...p.documents,
//         { name: "", url: "", number: "", uploaded_at: Date.now() },
//       ],
//   }));

//   const removeDocument = async (index) => {
//     const filePath = formData.documents[index]?.firebasePath;
//     if (filePath) {
//       setConfirmMessage("Are you sure you want to delete this file?");
//       setConfirmAction(() => async () => {
//         try {
//           const refToDelete = ref(storage, filePath);
//           await deleteObject(refToDelete);
//         } catch {
//           setModalMessage("Failed to delete file.");
//           setMessageOpen(true);
//         }
//         setFormData((p) => ({ ...p, documents: p.documents.filter((_, i) => i !== index) }));
//       });
//       setConfirmOpen(true);
//     } else {
//       setFormData((p) => ({ ...p, documents: p.documents.filter((_, i) => i !== index) }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const persistedRoot = JSON.parse(localStorage.getItem("persist:root"));
//       // Parse the nested user slice
//       const userState = JSON.parse(persistedRoot.user);
//       // Extract token
//       const token = userState.currentUser?.data?.accessToken;
//       console.log("Token from localStorage:", token);

//       const res = await fetch("http://localhost:3000/api/super-admins/", {
//         method: "POST",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         body: JSON.stringify(formData),
//         credentials: "include",
//       });
//       const data = await res.json();
//       // console.log(`${JSON.stringify(data)}}`);
//       if (data.success == false) {
//         setFailedToSaveMsgOpen(true);
//         setFailedToSaveMessage(`Failed to add super admin because ${data.message.toLowerCase()}`);
//         // return;
//       } 
//       setSaveSuccessfulMessage("Super admin added successfully! You will now be redirected to All Super Admin Page.");
//       setSaveSuccessfulMsgOpen(true);
//     } catch (err) {
//       console.error(err);
//       console.log(`err.message: ${err.message}`);
//       setFailedToSaveMsgOpen(true);
//       setFailedToSaveMessage(`Failed to add super admin because ${data.message.toLowerCase()}`);
//       setMessageOpen(true);
//     }
//   };

//   return (
//     <main className="flex-1 overflow-y-auto p-6">
//       <div className="p-4">
//         <div className="bg-white rounded-2xl shadow p-6 max-w-6xl mx-auto">
//           {/* Profile Upload */}
//           <div className="flex flex-col items-center border-dashed border-2 border-gray-300 rounded-lg p-8 mb-8 cursor-pointer hover:bg-gray-50 transition">
//             {(!formData.photo_url || formData.photo_url == "https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2264922221.jpg") ? (
//               <>
//                 <div className="text-gray-400 text-3xl mb-2">🖼️</div>
//                 <label className="text-blue-600 font-medium cursor-pointer hover:underline">
//                   {uploadingProfile ? "Uploading..." : "Click Here To Add Profile Picture"}
//                   <input type="file" accept=".jpg,.jpeg,.png,.heic" hidden onChange={handleProfileUpload} disabled={uploadingProfile} />
//                 </label>
//               </>
//             ) : (
//               <div className="flex flex-col items-center">
//                 <img src={formData.photo_url} alt="Profile" className="w-auto h-40 object-cover rounded-lg mb-2" />
//                 <div className="flex gap-4">
//                   <label className="text-blue-600 cursor-pointer hover:underline">
//                     Replace
//                     <input type="file" accept=".jpg,.jpeg,.png,.heic" hidden onChange={handleProfileUpload} disabled={uploadingProfile} />
//                   </label>
//                   <button type="button" className="text-red-600 cursor-pointer hover:underline" onClick={handleDeleteProfileConfirm}>
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* FORM */}
//           <form className="grid grid-cols-1 md:grid-cols-3 gap-4" onSubmit={handleSubmit}>
//             <TextField id="full_name" label="Admin Full Name" value={formData.full_name} onChange={handleChange} variant="outlined" fullWidth required sx={asteriskColorStyle} />

//             {/* Phone */}
//             <div className="w-full flex gap-3">
//               <div className="min-w-[140px]">
//                 <Select options={options} value={selectedCode} placeholder="Country Code" isSearchable menuPortalTarget={document.body} required styles={selectStyles}
//                   onChange={(sel) => {
//                     setSelectedCode(sel);
//                     setFormData((p) => ({ ...p, country_code: sel?.value || "" }));
//                   }}
//                 />
//               </div>
//               <TextField id="phone" label="Phone" type="number" value={formData.phone} onChange={handleChange} variant="outlined" fullWidth required sx={asteriskColorStyle} slotProps={slotPropsStyle} />
//             </div>

//             {/* Rest of the fields */}
//             <TextField id="company_email" value={formData.company_email} onChange={handleChange} label="Company Email" variant="outlined" fullWidth required sx={{"& .MuiFormLabel-asterisk": { color: "red" },}}/>
//             <TextField id="email" value={formData.email} onChange={handleChange} label="Personal Email" variant="outlined" fullWidth />
//             <TextField id="position" value={formData.position} onChange={handleChange} label="Position" variant="outlined" required fullWidth />

//             {/* Address */}
//             <TextField id="street_1" value={formData.street_1} onChange={handleChange} label="Street 1" variant="outlined" fullWidth />
//             <TextField id="street_2" value={formData.street_2} onChange={handleChange} label="Street 2" variant="outlined" fullWidth />
//             <TextField id="city" value={formData.city} onChange={handleChange} label="City" variant="outlined" fullWidth />
//             <TextField id="state" value={formData.state} onChange={handleChange} label="State" variant="outlined" fullWidth />
//             <TextField id="country" value={formData.country} onChange={handleChange} label="Country" variant="outlined" fullWidth />
//             <TextField id="zipcode" value={formData.zipcode} onChange={handleChange} label="Zipcode" variant="outlined" fullWidth />

//             {/* Emergency Contact */}
//             <TextField id="emergency_name" label="Emergency Contact Name" variant="outlined" fullWidth value={formData.emergency_contact.name} onChange={handleChange} required sx={asteriskColorStyle} />
//             <div className="w-full flex flex-row gap-3">
//               <div className="min-w-[140px]">
//                 <Select id="emergency_country_code" options={emergencyCountryCodeOptions} value={selectedEmergencyCode} placeholder="Country Code" isSearchable menuPortalTarget={document.body} styles={selectStyles} required
//                   onChange={(selected) => {
//                     setSelectedEmergencyCode(selected);
//                     setFormData((prev) => ({ ...prev, emergency_contact: { ...prev.emergency_contact, country_code: selected?.value || "" } }));
//                   }}
//                 />
//               </div>
//               <TextField id="emergency_phone" type="number" label="Emergency Contact Phone" variant="outlined" fullWidth value={formData.emergency_contact.phone} onChange={handleChange} required sx={asteriskColorStyle} slotProps={slotPropsStyle} />
//             </div>
//             <TextField id="emergency_relation" label="Emergency Contact Relation" variant="outlined" fullWidth value={formData.emergency_contact.relation} onChange={handleChange} required sx={asteriskColorStyle} />

//             {/* Documents */}
//             {formData.documents.map((doc, i) => (
//               <div key={i} className="col-span-3 border rounded-md p-4">
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//                   <TextField id={`documents_${i}_name`} label="Document Type" value={doc.name} onChange={handleChange} fullWidth />
//                   <TextField id={`documents_${i}_number`} label="Document Number" value={doc.number} onChange={handleChange} fullWidth />

//                   <div className="flex flex-col gap-2">
//                     <Button variant="outlined" component="label" disabled={uploadingIndex === i} sx={{
//                           textTransform: "none",
//                           borderColor: "#2563EB",
//                           color: "#2563EB",
//                           height: '56px',
//                           "&:hover": { borderColor: "#1D4ED8", background: "#EFF6FF" },
//                       }} >
//                       {uploadingIndex === i ? `Uploading ${uploadingProgress}%` : "Select Document (image or pdf only)"}
//                       <input hidden type="file" accept=".jpg,.jpeg,.png,.heic,.pdf" onChange={(e) => handleFileChange(e, i)} />
//                     </Button>

//                     {doc.url && (
//                       <div className="flex flex-col items-center gap-3">
//                         <TextField label="Uploaded File URL" value={doc.url} fullWidth slotProps={{ input: { readOnly: true } }} />
//                         <div className="flex flex-row justify-between w-full">
//                           <Button color="error" variant="outlined" onClick={() => handleDeleteFileConfirm(i)}>Delete</Button> 
//                           <Button variant="outlined" onClick={() => { setPreviewUrl(doc.url); setPreviewOpen(true); }} sx={selectDocumentBtnStyle}>PREVIEW</Button>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 <div className="mt-2 flex justify-end">
//                   {formData.documents.length > 1 && (
//                     <button type="button" className="text-red-600 hover:underline cursor-pointer" onClick={() => removeDocument(i)}>Remove</button>
//                   )}
//                 </div>
//               </div>
//             ))}

//             <button type="button" className="col-span-3 mb-4 text-blue-600 hover:underline cursor-pointer" onClick={addDocument}>
//               + Add Another Document
//             </button>

//             <div className="col-span-3 mt-6 flex justify-center">
//               <button type="submit" disabled={loading} className="bg-[#1E293B] text-white px-8 py-2 rounded-md hover:bg-[#334155] transition cursor-pointer">
//                 {loading ? "Saving..." : "Save Details"}
//               </button>
//             </div>
//           </form>

//           {previewOpen && ( 
//             <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50"> 
//               <div className="bg-white rounded-2xl shadow-lg p-4 max-w-3xl w-full">
//                 <div className="flex justify-end mb-2"> 
//                   <button className="bg-[#1E293B] text-white px-8 py-2 rounded-md hover:bg-[#334155] transition cursor-pointer" onClick={() => setPreviewOpen(false)}> 
//                     Close 
//                   </button>
//                 </div> 
//                 {previewUrl.includes(".pdf") ? ( 
//                   <iframe src={previewUrl} className="w-full h-[500px] rounded" title="Document Preview"></iframe> 
//                 ) : ( 
//                   <img src={previewUrl} alt="Document Preview" className="w-full max-h-[500px] object-contain rounded" /> 
//                 )}
//               </div>
//             </div>
//           )}

//           {confirmOpen && (
//             <div className="fixed inset-0 backdrop-blur-md flex justify-center items-center z-50">
//               <div className="bg-white text-[#334155] rounded-lg p-6 w-80 shadow-xl text-center">
//                 <p className="text-center font-medium mb-5">{confirmMessage}</p>
//                 <div className="flex justify-center gap-4">
//                   <button className="bg-[#334155] text-white border-2 px-4 py-2 rounded-md w-24 hover:bg-[#1D4ED8] transition cursor-pointer"
//                     onClick={() => {
//                       if (confirmAction) confirmAction();
//                       setConfirmOpen(false);
//                     }} >
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
//                 <p className="mb-4">{modalMessage}</p>
//                 <button className="bg-[#1E293B] text-white border-2 px-4 py-2 rounded-md w-24 hover:bg-[#1D4ED8] transition cursor-pointer" onClick={() => setMessageOpen(false)} >
//                   OK
//                 </button>
//               </div>
//             </div>
//           )}

//           {failedToSaveMsgOpen && (
//             <div className="fixed inset-0 backdrop-blur-md flex justify-center items-center z-50">
//               <div className="bg-white text-[#334155] rounded-lg p-6 w-80 shadow-xl text-center">
//                 <p className="mb-4">{failedToSaveMessage}</p>
//                 <button className="bg-[#1E293B] text-white border-2 px-4 py-2 rounded-md w-24 hover:bg-[#1D4ED8] transition cursor-pointer" onClick={() => setFailedToSaveMsgOpen(false)} >
//                   OK
//                 </button>
//               </div>
//             </div>
//           )}

          
//           {saveSuccessfulMsgOpen && (
//             <div className="fixed inset-0 backdrop-blur-md flex justify-center items-center z-50">
//               <div className="bg-white text-[#334155] rounded-lg p-6 w-80 shadow-xl text-center">
//                 <p className="mb-4">{saveSuccessfulMessage}</p>
//                 <button className="bg-[#1E293B] text-white border-2 px-4 py-2 rounded-md w-24 hover:bg-[#1D4ED8] transition cursor-pointer" onClick={() => { setSaveSuccessfulMsgOpen(false); navigate("/dashboard");}} >
//                   OK
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </main>
//   );
// }

import { useState, useEffect } from "react";
import { TextField, Button } from "@mui/material";
import Select from "react-select";
import bcryptjs from "bcryptjs";
import heic2any from "heic2any";
import { countryCodes } from "../components/CountryCodeList.js";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectStyles, asteriskColorStyle, slotPropsStyle, selectDocumentBtnStyle, previewDocumentBtnStyle } from "../styles/selectStyles.js";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase.js";

export default function AddNewSuperAdmin() {
  const { loading } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [pageLoading, setPageLoading] = useState(false);
  const hashedPassword = bcryptjs.hashSync("SuperSecureAdmin123!", 10);
  const [profilePreviewUrl, setProfilePreviewUrl] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploadingIndex, setUploadingIndex] = useState(null);
  const [uploadingProgress, setUploadingProgress] = useState(0);
  const [allowWriteAccess, setAllowWriteAccess] = useState(false);
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [selectedCode, setSelectedCode] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedWriteAccess, setSelectedWriteAccess] = useState(null);
  const [selectedEmergencyCode, setSelectedEmergencyCode] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);
  const [previewType, setPreviewType] = useState(null);
  const [modalMessage, setModalMessage] = useState("");
  const [messageOpen, setMessageOpen] = useState(false);
  const [failedToSaveMessage, setFailedToSaveMessage] = useState("");
  const [failedToSaveMsgOpen, setFailedToSaveMsgOpen] = useState(false);
  const [saveSuccessfulMessage, setSaveSuccessfulMessage] = useState("");
  const [saveSuccessfulMsgOpen, setSaveSuccessfulMsgOpen] = useState(false);
  const [documentFile, setDocumentFile] = useState(null);
  const [id1, setId1] = useState(null); // first dropdown
  const [id2, setId2] = useState(null); // second dropdown
  // FORM DATA
  const [formData, setFormData] = useState({
    photo_url: "",
    full_name: "",
    country_code: "",
    phone: "",
    company_email: "",
    password: hashedPassword,
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
    bank_details: {
      account_number: "",
      account_holder_name: "",
      bank_name: "",
      branch_name: "",
      branch_address: "",
      ifsc_code:"",
      uploaded_at: { type: Date, default: Date.now },
    },
    emergency_contact: { name: "", relation: "", country_code: "", phone: "" },
    documents: [],
  });

  const persistedRoot = JSON.parse(localStorage.getItem("persist:root"));
  // Parse the nested user slice
  const userState = JSON.parse(persistedRoot.user);
  // Extract token
  const token = userState.currentUser?.data?.accessToken;
  const loggedInUserID = userState.currentUser?.data?.id;

  // USING useEffect FOR FETCHING THE LOGGED IN SUPERADMIN DATA FOR FETCHING WRITE ACCESS PERMISSIONS
  useEffect(() =>{
    const fetchSuperAdminAccessToken = async () => {
      try {
        setPageLoading(true);

        const res = await fetch(`http://localhost:3000/api/access-tokens/access-token-by-super-admin-id/${loggedInUserID}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        
        if(data.success === false){
          setPageLoading(false);
          return;
        }
        
        setAllowWriteAccess(data.data.accessToken.allow_write_access);
        setPageLoading(false);
        // setError(false);
      } catch (error) {
        console.log(`error.message: ${error.message}`);
        setPageLoading(false);
        // setError(true);
      }
    };

    fetchSuperAdminAccessToken();
  }, []);

  // EMERGENCY PHONE NUMBER COUNTRY CODE DROPDOWN OPTIONS
  const emergencyCountryCodeOptions = countryCodes.map((country) => ({
    value: country.code,
    label: `${country.code} - ${country.name}`,
  }));

  // USER'S PHONE NUMBER COUNTRY CODE DROPDOWN OPTIONS
  const countryCodeOptions = countryCodes.map((c) => ({ value: c.code, label: `${c.code} - ${c.name}` }));

  const idOptions = [
    { value: "", label: "" },
    { value: "aadhar_card", label: "Aadhar Card" },
    { value: "pan_card", label: "Pan Card" }
  ];

  const roleOptions = [ { value: "user", label: "User Role" }, { value: "admin", label: "Admin Role" } ];

  const allowWriteAccessOptions = [
      { value: false, label: "Write Access Not Allowed" },
      { value: true, label: "Write Access Allowed" }
  ];

  const filteredOptionsForId1 = idOptions.filter(
    (opt) => opt.value !== id2?.value
  );

  const filteredOptionsForId2 = idOptions.filter(
    (opt) => opt.value !== id1?.value
  );

  // LOCAL PREVIEW STATE
  const [localProfileFile, setLocalProfileFile] = useState(null);
  const [localDocuments, setLocalDocuments] = useState([
    { name: "", file: null, number: "", uploaded_at: Date.now() },
  ]);

  // PROFILE UPLOAD (LOCAL ONLY)
  const handleProfileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/heic"];
    if (!validTypes.includes(file.type)) {
      setModalMessage("Invalid file type.");
      setMessageOpen(true);
      return;
    }

    setLocalProfileFile(file);
  };

  const handleDeleteProfileConfirm = () => {
    setConfirmMessage("Delete current profile picture?");
    setConfirmAction(() => handleDeleteProfile);
    setConfirmOpen(true);
  };

  const handleDeleteProfile = () => {
    setLocalProfileFile(null);
    setProfilePreviewUrl('');
    setFormData((p) => ({
      ...p,
      photo_url:
        "https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2264922221.jpg",
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

    let previewFile = file;
    if (file.type === "image/heic") {
      try {
        const blob = await heic2any({ blob: file, toType: "image/jpeg" });
        previewFile = new File([blob], file.name.replace(/\.heic$/i, ".jpeg"), {
          type: "image/jpeg",
        });
      } catch (err) {
        console.error("Failed to convert HEIC:", err);
      }
    }

    const docsCopy = [...localDocuments];
    docsCopy[index] = {
      ...docsCopy[index],
      file,
      url: URL.createObjectURL(previewFile), // <--- Local preview URL
      uploaded_at: Date.now(),
    };
    setLocalDocuments(docsCopy);
  };

  const handleDeleteFileConfirm = (index) => {
    setConfirmMessage("Are you sure you want to delete this file?");
    setConfirmAction(() => () => {
      const docsCopy = [...localDocuments];
      docsCopy[index] = {
        ...docsCopy[index],
        file: null,
        url: "",
        uploaded_at: Date.now(),
      };
      setLocalDocuments(docsCopy);
    });
    setConfirmOpen(true);
  };

  // ADD/REMOVE DOCUMENT ROW LOGIC
  const addDocument = () =>
    setLocalDocuments((prev) => [
      ...prev,
      { name: "", file: null, number: "", uploaded_at: Date.now() },
  ]);

  const removeDocument = (index) => {
    const docsCopy = [...localDocuments];
    docsCopy.splice(index, 1);
    setLocalDocuments(docsCopy);
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
      const docsCopy = [...localDocuments];
      docsCopy[i][field] = value;
      setLocalDocuments(docsCopy);
    } else if (["account_holder_name","account_number","ifsc_code","bank_name","branch_name","branch_address"].includes(id)) {
      setFormData((p) => ({
        ...p,
        bank_details: { ...p.bank_details, [id]: value },
      }));
    } else setFormData((p) => ({ ...p, [id]: value }));
  };

  // --- HANDLE SUBMIT (UPLOAD TO FIREBASE ONLY ON SUBMIT) ---
  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const persistedRoot = JSON.parse(localStorage.getItem("persist:root"));
  //     const userState = JSON.parse(persistedRoot.user);
  //     const token = userState.currentUser?.data?.accessToken;

  //     // --- UPLOAD PROFILE IMAGE ---
  //     let profile_url = formData.photo_url;
  //     if (localProfileFile) {
  //       const { url } = await uploadFile(localProfileFile, "profile_pictures");
  //       profile_url = url;
  //     }

  //     // --- UPLOAD DOCUMENTS ---
  //     const uploadedDocs = [];
  //     for (let doc of localDocuments) {
  //       if (doc.file) {
  //         const { url } = await uploadFile(doc.file, "documents");
  //         uploadedDocs.push({ ...doc, url });
  //       }
  //     }

  //     const payload = {
  //       ...formData,
  //       photo_url: profile_url,
  //       documents: uploadedDocs,
  //     };

  //     const res = await fetch("http://localhost:3000/api/super-admins/", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  //       body: JSON.stringify(payload),
  //       credentials: "include",
  //     });

  //     const data = await res.json();
  //     if (!data.success) {
  //       setFailedToSaveMessage(`Failed to add super admin because ${data.message.toLowerCase()}`);
  //       setFailedToSaveMsgOpen(true);
  //       return;
  //     }

  //     setSaveSuccessfulMessage(
  //       "Super admin added successfully! You will now be redirected to All Super Admin Page."
  //     );
  //     setSaveSuccessfulMsgOpen(true);
  //   } catch (err) {
  //     console.error(err);
  //     setFailedToSaveMessage(`Failed to add super admin: ${err.message}`);
  //     setFailedToSaveMsgOpen(true);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPageLoading(true); // show the overlay

    try {
      const persistedRoot = JSON.parse(localStorage.getItem("persist:root"));
      const userState = JSON.parse(persistedRoot.user);
      const token = userState.currentUser?.data?.accessToken;

      // --- UPLOAD PROFILE IMAGE ---
      let profile_url = formData.photo_url;
      if (localProfileFile) {
        const { url } = await uploadFile(localProfileFile, "profile_pictures");
        profile_url = url;
      }

      // --- UPLOAD DOCUMENTS ---
      const uploadedDocs = [];
      for (let doc of localDocuments) {
        if (doc.file) {
          const { url } = await uploadFile(doc.file, "documents");
          uploadedDocs.push({ ...doc, url });
        }
      }

      const payload = {
        ...formData,
        photo_url: profile_url,
        documents: uploadedDocs,
      };

      const res = await fetch("http://localhost:3000/api/super-admins/", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      const data = await res.json();
      if (!data.success) {
        setFailedToSaveMessage(`Failed to add super admin because ${data.message.toLowerCase()}`);
        setFailedToSaveMsgOpen(true);
        setPageLoading(false); // hide overlay
        return;
      }

      setSaveSuccessfulMessage("Super admin added successfully! You will now be redirected to All Super Admin Page.");
      setSaveSuccessfulMsgOpen(true);
    } catch (err) {
      console.error(err);
      setFailedToSaveMessage(`Failed to add super admin: ${err.message}`);
      setFailedToSaveMsgOpen(true);
    } finally {
      setPageLoading(false); // always hide overlay
    }
  };

  // --- UPLOAD TO FIREBASE HELPER ---
  const uploadFile = async (file, pathPrefix) => {
    let uploadFileObj = file;
    if (file.type === "image/heic") {
      const blob = await heic2any({ blob: file, toType: "image/jpeg" });
      uploadFileObj = new File([blob], file.name.replace(/\.heic$/i, ".jpeg"), {
        type: "image/jpeg",
      });
    }
    const filePath = `${pathPrefix}/${Date.now()}_${uploadFileObj.name}`;
    const fileRef = ref(storage, filePath);

    const uploadTask = uploadBytesResumable(fileRef, uploadFileObj);
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

  const handlePreview = async (file) => {
    if (!file) return;

    try {
      let fileForPreview = file;
      let mimeType = file.type || "";

      // Convert HEIC to JPEG for preview if needed
      if (file.type === "image/heic") {
        const blob = await heic2any({ blob: file, toType: "image/jpeg" });
        fileForPreview = new File(
          [blob],
          file.name.replace(/\.heic$/i, ".jpeg"),
          { type: "image/jpeg" }
        );
        mimeType = "image/jpeg";
      }

      // create blob URL for preview
      const url = URL.createObjectURL(fileForPreview);

      // revoke previous previewUrl if any
      if (previewUrl) {
        try { URL.revokeObjectURL(previewUrl); } catch (e) { /* ignore */ }
      }

      setPreviewUrl(url);
      setPreviewType(mimeType);
      setPreviewOpen(true);
    } catch (err) {
      console.error("Preview generation failed:", err);
      setModalMessage("Failed to generate preview.");
      setMessageOpen(true);
    }
  };

  const closePreview = () => {
    if (previewUrl && previewUrl.startsWith("blob:")) {
      try { URL.revokeObjectURL(previewUrl); } catch (e) { /* ignore */ }
    }
    setPreviewUrl("");
    setPreviewType("");
    setPreviewOpen(false);
  };

  useEffect(() => {
    const generatePreview = async () => {
      if (!localProfileFile) {
        setProfilePreviewUrl(formData.photo_url);
        return;
      }

      // Convert HEIC to JPEG if needed
      if (localProfileFile.type === "image/heic") {
        try {
          const blob = await heic2any({ blob: localProfileFile, toType: "image/jpeg" });
          const previewUrl = URL.createObjectURL(blob);
          setProfilePreviewUrl(previewUrl);
        } catch (err) {
          console.error("Failed to convert HEIC to JPEG:", err);
          setProfilePreviewUrl("");
        }
      } else {
        setProfilePreviewUrl(URL.createObjectURL(localProfileFile));
      }
    };

    generatePreview();

    // Cleanup URL object when component unmounts or file changes
    return () => {
      if (profilePreviewUrl && profilePreviewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(profilePreviewUrl);
      }
    };
  }, [localProfileFile, formData.photo_url]);
  
  // const clearRow = async (index) => {
  //   const filePath = formData.documents[index]?.url;
  //   if (filePath) {
  //     setConfirmMessage("Are you sure you want to delete this row?");
  //     setConfirmAction(() => () => {
  //     const docsCopy = [...localDocuments];
  //     docsCopy[index] = {
  //       ...docsCopy[index],
  //       file: null,
  //       url: "",
  //       uploaded_at: Date.now(),
  //     };
  //     setLocalDocuments(docsCopy);
  //   });
  //     // setConfirmAction(() => async () => {
  //     //   try {
  //     //       const refToDelete = ref(storage, filePath);
  //     //       await deleteObject(refToDelete);
  //     //   } catch {
  //     //       setModalMessage("Failed to delete file.");
  //     //       setMessageOpen(true);
  //     //   }
  //     //     setFormData((p) => ({ ...p, documents: p.documents.filter((_, i) => i !== index) }));
  //     // });
  //     setConfirmOpen(true);
  //   } else {
  //     setFormData((p) => ({ ...p, documents: p.documents.filter((_, i) => i !== index) }));
  //   }
  //   const docsCopy = [...localDocuments];

  //   docsCopy[index] = {
  //     name: "",
  //     file: null,
  //     url: "",
  //     number: "",
  //     uploaded_at: Date.now(),
  //   };
  //   setLocalDocuments(docsCopy);
  // };

  const clearRow = (index) => {
    // Reset the document row in localDocuments
    const docsCopy = [...localDocuments];
    docsCopy[index] = {
      name: "",
      file: null,
      url: "",
      number: "",
      uploaded_at: Date.now(),
    };
    setLocalDocuments(docsCopy);

    // Also reset the formData.documents array at the same index
    setFormData((prev) => {
      const docs = [...prev.documents];
      docs[index] = { ...docs[index], name: "", file: null, url: "", number: "" };
      return { ...prev, documents: docs };
    });
  };

  return (
    <main className="flex-1 overflow-y-auto p-6">
      <div className="p-4">
        <div className="bg-white rounded-2xl shadow p-6 max-w-6xl mx-auto">
          {/* PROFILE UPLOAD */}
          <div className='text-2xl underline font-semibold mb-5'>
            Personal Details:
          </div>
          <div className={`flex flex-col items-center border-dashed border-2 border-gray-300 rounded-lg p-8 mb-8 ${ allowWriteAccess ? "cursor-pointer hover:bg-gray-50" : "cursor-not-allowed" } transition`}>
            {profilePreviewUrl ? (
              <div className="flex flex-col items-center">
                <img src={profilePreviewUrl} disabled={!allowWriteAccess} alt="Profile" className={`w-auto h-40 object-cover rounded-lg mb-2 ${ allowWriteAccess ? "cursor-pointer" : "cursor-not-allowed" }`} />
                <div className="flex gap-4">
                  <label className={`text-blue-600 ${ allowWriteAccess ? "cursor-pointer hover:underline" : "cursor-not-allowed" }`}>
                    Replace
                    <input type="file" accept=".jpg,.jpeg,.png,.heic" hidden disabled={!allowWriteAccess} onChange={handleProfileUpload} />
                  </label>
                  <button type="button" className={`text-red-600 ${ allowWriteAccess ? "cursor-pointer hover:underline" : "cursor-not-allowed" }`} disabled={!allowWriteAccess} onClick={handleDeleteProfileConfirm}>
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className={`text-gray-400 text-3xl mb-2 ${ allowWriteAccess ? "cursor-pointer hover:underline" : "cursor-not-allowed" }`}>🖼️</div>
                <label className={`text-blue-600 font-medium ${ allowWriteAccess ? "cursor-pointer hover:underline" : "cursor-not-allowed" }`}>
                  Click Here To Add Profile Picture
                  <input type="file" accept=".jpg,.jpeg,.png,.heic" hidden onChange={handleProfileUpload} disabled={!allowWriteAccess} />
                </label>
              </>
            )}

          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              <TextField id="full_name" label="Admin Full Name" value={formData.full_name} onChange={handleChange} variant="outlined" fullWidth required disabled={!allowWriteAccess} sx={{...asteriskColorStyle}} />

              <div className="w-full flex gap-3">
                <div className="min-w-[140px]">
                  <Select isDisabled={!allowWriteAccess} options={countryCodeOptions} value={selectedCode} placeholder="Country Code" isSearchable menuPortalTarget={document.body} required styles={selectStyles}
                    onChange={(sel) => {
                      setSelectedCode(sel);
                      setFormData((p) => ({ ...p, country_code: sel?.value || "" }));
                    }}
                  />
                </div>
                <TextField id="phone" label="Phone" type="number" value={formData.phone} onChange={handleChange} variant="outlined" fullWidth required disabled={!allowWriteAccess} sx={asteriskColorStyle} slotProps={slotPropsStyle} />
              </div>

              <TextField id="company_email" value={formData.company_email} onChange={handleChange} label="Company Email" variant="outlined" fullWidth required disabled={!allowWriteAccess} sx={{ "& .MuiFormLabel-asterisk": { color: "red" } }} />
              <TextField id="email" value={formData.email} onChange={handleChange} label="Personal Email" variant="outlined" fullWidth disabled={!allowWriteAccess} />
              <TextField id="position" value={formData.position} onChange={handleChange} label="Position" variant="outlined" required fullWidth disabled={!allowWriteAccess} sx={{ "& .MuiFormLabel-asterisk": { color: "red" } }}  />
              <Select id="role" options={roleOptions} value={selectedRole} placeholder="Role" isSearchable menuPortalTarget={document.body} required isDisabled={!allowWriteAccess} styles={selectStyles}
                onChange={(sel) => {
                  setSelectedRole(sel);
                  setFormData((p) => ({ ...p, role: sel?.value || "" }));
                }}
              />
              <Select id="allow_write_access" options={allowWriteAccessOptions} value={selectedWriteAccess} placeholder="Do You Want To Allow Write Access?" isSearchable menuPortalTarget={document.body} required isDisabled={!allowWriteAccess} styles={selectStyles}
                onChange={(sel) => {
                  setSelectedWriteAccess(sel);
                  setFormData((p) => ({ ...p, allow_write_acccess: sel?.value || false }));
                }}
              />
            </div>

            <div className='text-2xl underline font-semibold mb-5'>
              Home Address:
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              <TextField id="street_1" value={formData.street_1} onChange={handleChange} label="Street 1" variant="outlined" fullWidth disabled={!allowWriteAccess} />
              <TextField id="street_2" value={formData.street_2} onChange={handleChange} label="Street 2" variant="outlined" fullWidth disabled={!allowWriteAccess} />
              <TextField id="city" value={formData.city} onChange={handleChange} label="City" variant="outlined" fullWidth disabled={!allowWriteAccess} />
              <TextField id="state" value={formData.state} onChange={handleChange} label="State" variant="outlined" fullWidth disabled={!allowWriteAccess} />
              <TextField id="country" value={formData.country} onChange={handleChange} label="Country" variant="outlined" fullWidth disabled={!allowWriteAccess} />
              <TextField id="zipcode" value={formData.zipcode} onChange={handleChange} label="Zipcode" variant="outlined" fullWidth disabled={!allowWriteAccess} />
            </div>

            <div className='text-2xl underline font-semibold mb-5'>
              Bank Details:
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              <TextField id="account_holder_name" value={formData.bank_details.account_holder_name} onChange={handleChange} label="Account Holder Name" variant="outlined" disabled={!allowWriteAccess} fullWidth />
              <TextField id="account_number" value={formData.bank_details.account_number} onChange={handleChange} label="Account Number" variant="outlined" disabled={!allowWriteAccess} fullWidth />
              <TextField id="ifsc_code" value={formData.bank_details.ifsc_code} onChange={handleChange} label="IFSC Code" variant="outlined" disabled={!allowWriteAccess} fullWidth />
              <TextField id="bank_name" value={formData.bank_details.bank_name} onChange={handleChange} label="Bank Name" variant="outlined" disabled={!allowWriteAccess} fullWidth />
              <TextField id="branch_name" value={formData.bank_details.branch_name} onChange={handleChange} label="Branch Name" variant="outlined" disabled={!allowWriteAccess} fullWidth />
              <TextField id="branch_address" value={formData.bank_details.branch_address} onChange={handleChange} label="Branch Address" variant="outlined" disabled={!allowWriteAccess} fullWidth />
            </div>

            <div className='text-2xl underline font-semibold mb-5'>
              Emergency Contact Details:
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              <TextField id="emergency_name" label="Emergency Contact Name" variant="outlined" fullWidth value={formData.emergency_contact.name} onChange={handleChange} required disabled={!allowWriteAccess} sx={asteriskColorStyle} />
              <div className="w-full flex flex-row gap-3">
                <div className="min-w-[140px]">
                  <Select id="emergency_country_code" options={emergencyCountryCodeOptions} value={selectedEmergencyCode} placeholder="Country Code" isSearchable menuPortalTarget={document.body} styles={selectStyles} isDisabled={!allowWriteAccess} required
                    onChange={(selected) => {
                      setSelectedEmergencyCode(selected);
                      setFormData((prev) => ({ ...prev, emergency_contact: { ...prev.emergency_contact, country_code: selected?.value || "" } }));
                    }}
                  />
                </div>
                <TextField id="emergency_phone" type="number" label="Emergency Contact Phone" variant="outlined" fullWidth value={formData.emergency_contact.phone} onChange={handleChange} required disabled={!allowWriteAccess} sx={asteriskColorStyle} slotProps={slotPropsStyle} />
              </div>
              <TextField id="emergency_relation" label="Emergency Contact Relation" variant="outlined" fullWidth value={formData.emergency_contact.relation} onChange={handleChange} required disabled={!allowWriteAccess} sx={asteriskColorStyle} />
            </div>

            <div className='text-2xl underline font-semibold mb-5'>
              Documents:
            </div>
            {/* {localDocuments.map((doc, i) => (
              <div key={i} className="col-span-3 border rounded-md p-4 mb-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <TextField id={`documents_${i}_name`} label="Document Type" value={doc.name} onChange={handleChange} fullWidth />
                  <TextField id={`documents_${i}_number`} label="Document Number" value={doc.number} onChange={handleChange} fullWidth />

                  <div className="flex flex-col gap-2">
                    <Button variant="outlined" component="label" disabled={uploadingIndex === i} sx={selectDocumentBtnStyle} >
                      {uploadingIndex === i ? `Uploading ${uploadingProgress}%` : doc.url ? "Update Document (image or pdf only)" : "Select Document (image or pdf only)"}
                      
                      <input hidden type="file" accept=".jpg,.jpeg,.png,.heic,.pdf" onChange={(e) => handleFileChange(e, i)} />
                    </Button>

                    {doc.file && (
                      <div>
                        <div className="flex flex-col items-center gap-3">
                          <div className="flex flex-row justify-between w-full">
                            <Button variant="outlined" sx={previewDocumentBtnStyle} onClick={() => handlePreview(doc.file)}>Preview</Button>
                            <Button color="error" variant="outlined" onClick={() => handleDeleteFileConfirm(i)}>Delete</Button> 
                          </div>
                        </div>
                      </div>
                    )}


                    <div className="mt-2 flex justify-end">
                      {localDocuments.length > 1 && (
                        <button type="button" className="text-red-600 hover:underline cursor-pointer" onClick={() => removeDocument(i)}>Remove</button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))} */}

            {localDocuments.slice(0, 2).map((doc, i) => (
              <div key={i} className="col-span-3 border rounded-md p-4 mb-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

                  {/* Document Type Dropdown */}
                  <Select id={`documents_${i}_name`} placeholder="Select Document Type" isSearchable menuPortalTarget={document.body} styles={selectStyles} isDisabled={!allowWriteAccess}
                    options={idOptions.filter((opt) =>
                      i === 0 ? opt.value !== localDocuments[1]?.name : opt.value !== localDocuments[0]?.name
                    )}
                    value={
                      doc.name ? { value: doc.name, label: idOptions.find((o) => o.value === doc.name)?.label || doc.name } : null
                    }
                    onChange={(sel) =>
                      handleChange({
                        target: {
                          id: `documents_${i}_name`,
                          value: sel?.value || "",
                        },
                      })
                    }
                  />

                  {/* Document Number */}
                  <TextField id={`documents_${i}_number`} label="Document Number" value={doc.number} onChange={handleChange} disabled={!allowWriteAccess} fullWidth />

                  {/* File Upload */}
                  <div className="flex flex-col gap-2">
                    <Button variant="outlined" component="label" disabled={uploadingIndex === i || !allowWriteAccess} sx={selectDocumentBtnStyle} >
                      {uploadingIndex === i ? `Uploading ${uploadingProgress}%` : doc.url ? "Update Document (image or pdf only)" : "Select Document (image or pdf only)"}
                      <input hidden type="file" accept=".jpg,.jpeg,.png,.heic,.pdf" onChange={(e) => handleFileChange(e, i)} />
                    </Button>

                    {doc.file && (
                      <div className="flex flex-col items-center gap-3 mt-2">
                        <div className="flex flex-row justify-between w-full">
                          <Button variant="outlined" sx={previewDocumentBtnStyle} disabled={!allowWriteAccess} onClick={() => handlePreview(doc.file)}>Preview</Button>
                          <Button color="error" variant="outlined" disabled={!allowWriteAccess} onClick={() => handleDeleteFileConfirm(i)}>Delete</Button>
                        </div>
                      </div>
                    )}

                    {/* Remove Button */}
                    <div className="mt-2 flex justify-end">
                      {localDocuments.length > 1 && (
                        <button type="button" className="text-red-600 hover:underline cursor-pointer" disabled={!allowWriteAccess} onClick={() => removeDocument(i)}>Remove</button>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-row">
                      <button type="button" className={`text-red-600 ${ allowWriteAccess ? "cursor-pointer hover:underline" : "cursor-not-allowed" }`} onClick={() => clearRow(i)}>Clear Row</button>
                  </div>
                </div>
              </div>
            ))}
            {localDocuments.length < 2 && (
              <button type="button" className={`col-span-3 mb-4 text-blue-600 ${ allowWriteAccess ? "cursor-pointer hover:underline" : "cursor-not-allowed" }`} disabled={!allowWriteAccess} onClick={addDocument}>
                + Add New Document
              </button>
            )}

            <div className="col-span-3 mt-6 flex justify-center">
              <button type="submit" disabled={loading || !allowWriteAccess} className={`bg-[#1E293B] text-yellow-300 font-semibold px-8 py-2 rounded-md transition ${ allowWriteAccess ? "cursor-pointer hover:bg-[#334155]" : "cursor-not-allowed" }`}>
                {loading ? "Saving..." : "Save Details"}
              </button>
            </div>
          </form>

          {/* Document Preview Section */}
          {previewOpen && previewUrl && (
            <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md z-50">
              <div className="bg-white rounded-2xl shadow-lg p-4 max-w-3xl w-full">
                <div className="flex justify-end mb-2">
                  <button className="bg-[#1E293B] hover:bg-[#334155] text-yellow-300 font-semibold px-4 py-2 rounded-md transition cursor-pointer" onClick={closePreview} >
                    Close
                  </button>
                </div>

                <div className="w-full">
                  {previewType === "application/pdf" ? (
                    <iframe src={previewUrl} className="w-full h-[70vh] rounded border border-gray-200" title="Document Preview" />
                  ) : (
                    <img src={previewUrl} alt="Document Preview" className="w-full max-h-[70vh] object-contain rounded border border-gray-200" />
                  )}
                </div>
              </div>
            </div>
          )}

          {confirmOpen && (
            <div className="fixed inset-0 backdrop-blur-md flex justify-center items-center z-50">
              <div className="bg-white text-[#334155] rounded-lg p-6 w-80 shadow-xl text-center">
                <p className="text-center font-medium text-xl mb-5">{confirmMessage}</p>
                <div className="flex justify-center gap-4">
                  <button className="bg-[#1E293B] hover:bg-[#334155] text-yellow-300 font-semibold  border-2 px-4 py-2 rounded-md w-24 transition cursor-pointer" onClick={() => { if (confirmAction) confirmAction(); setConfirmOpen(false); }} >
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
                <button className="bg-[#1E293B] hover:bg-[#334155] text-yellow-300 font-semibold px-4 py-2 rounded-md w-24 transition cursor-pointer" onClick={() => { setSaveSuccessfulMsgOpen(false); navigate("/all-super-admin");}} >
                  OK
                </button>
              </div>
            </div>
          )}

          {/* Page Loading Code */}
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
                    {/* Updating Your Super Admin Details... */}
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