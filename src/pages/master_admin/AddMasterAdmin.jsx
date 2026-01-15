import { useState, useRef, useEffect, useMemo } from "react";
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

export default function AddMasterAdmin() {
  const { loading } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [pageLoading, setPageLoading] = useState(false);
  const [pageSaving, setPageSaving] = useState(false);
  const hashedPassword = bcryptjs.hashSync("MasterAdmin123!", 10);
  const [profilePreviewUrl, setProfilePreviewUrl] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploadingIndex, setUploadingIndex] = useState(null);
  const [uploadingProgress, setUploadingProgress] = useState(0);
  const [allowWriteAccess, setAllowWriteAccess] = useState(false);
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [selectedCode, setSelectedCode] = useState(null);
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

  const [allConsultancies, setAllConsultancies] = useState([]);
  const [selectedConsultancy, setSelectedConsultancy] = useState(null);
  const [idOfSelectedConsultancy, setIdOfSelectedConsultancy] = useState(null);

  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState([]);
  // FORM DATA
  const [formData, setFormData] = useState({
    photo_url: "",
    full_name: "",
    country_code: "",
    phone: "",
    company_email: "",
    password: hashedPassword,
    personal_email: "",
    position: "",
    company:"",
    admin_of_branch: [],
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

  // USER'S PHONE NUMBER COUNTRY CODE DROPDOWN OPTIONS
  const countryCodeOptions = countryCodes.map((c) => ({ value: c.code, label: `${c.code} - ${c.name}` }));

  const idOptions = [
    { value: "", label: "" },
    { value: "aadhar_card", label: "Aadhar Card" },
    { value: "pan_card", label: "Pan Card" }
  ];

  // LOCAL PREVIEW STATE
  const [localProfileFile, setLocalProfileFile] = useState(null);
  const [localDocuments, setLocalDocuments] = useState([
    { name: "", file: null, number: "", uploaded_at: Date.now() },
  ]);

  // PROFILE UPLOAD (LOCAL ONLY)
  // const handleProfileUpload = async (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;

  //   const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/heic"];
  //   if (!validTypes.includes(file.type)) {
  //     setModalMessage("Invalid file type.");
  //     setMessageOpen(true);
  //     return;
  //   }

  //   setLocalProfileFile(file);
  // };

  // const handleDeleteProfileConfirm = () => {
  //   setConfirmMessage("Delete current profile picture?");
  //   setConfirmAction(() => handleDeleteProfile);
  //   setConfirmOpen(true);
  // };

  // const handleDeleteProfile = () => {
  //   setLocalProfileFile(null);
  //   setProfilePreviewUrl('');
  //   setFormData((p) => ({
  //     ...p,
  //     photo_url:
  //       "https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2264922221.jpg",
  //   }));
  // };
  
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPageSaving(true); // show the overlay

    try {
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

      const res = await fetch("http://localhost:3000/api/master-admin/", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      const data = await res.json();
      if (!data.success) {
        setFailedToSaveMessage(`Failed to add super admin because ${data.message.toLowerCase()}`);
        setFailedToSaveMsgOpen(true);
        setPageSaving(false); // hide overlay
        return;
      }

      setSaveSuccessfulMessage("Master admin added successfully! You will now be redirected to All Master Admin Page.");
      setSaveSuccessfulMsgOpen(true);
    } catch (err) {
      console.error(err);
      setFailedToSaveMessage(`Failed to add master admin: ${err.message}`);
      setFailedToSaveMsgOpen(true);
    } finally {
      setPageSaving(false); // always hide overlay
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

  /* ================= COMPANY DROPDOWN ================= */
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
  }, []);
  
  const consultancyOptions = useMemo(
    () =>
      allConsultancies.map((c) => ({
        value: c.id,
        label: c.name,
      })),
    [allConsultancies]
  );

  /* ================= ADMIN OF BRANCH DROPDOWN ================= */
  useEffect(() => {
    console.log(`idOfSelectedConsultancy:${idOfSelectedConsultancy}`);

    const fetchAConsultancy = async () => {
      try {
        setPageLoading(true);

        const consultancyResData = await fetch(`http://localhost:3000/api/consultancies/${idOfSelectedConsultancy}`, {
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
        console.log(`consultancyData.data.consultancy.office_details:${JSON.stringify(consultancyData.data.consultancy.office_details)}`)
        setBranches(consultancyData.data.consultancy.office_details);
        setPageLoading(false);
      } catch (error) {
        console.log(`error.message: ${error.message}`);
        setPageLoading(false);
      }
      console.log(`branches:${JSON.stringify(branches)}`)
    };

    fetchAConsultancy();
  }, [idOfSelectedConsultancy]);

  // const branches = [
  //   { id: "ALL", label: "ALL" },
  //   { id: "B1", label: "Branch 1" },
  //   { id: "B2", label: "Branch 2" },
  //   { id: "B3", label: "Branch 3" },
  //   { id: "B4", label: "Branch 4" },
  //   { id: "B5", label: "Branch 5" },
  //   { id: "B6", label: "Branch 6" },
  // ];

  const branchesOptions  = useMemo(
    () =>
      branches.map((branch) => ({
        value: branch._id,
        label: branch.office_name,
      })),
    [branches]
  );
  const [open, setOpen] = useState(false);
  const [selectedMultiSelectOption, setSelectedMultiSelectOption] = useState([]);
  const branchRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (branchRef.current && !branchRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const branchSelectStyles = {
    ...selectStyles,
    "& .MuiFormLabel-asterisk": { color: "red" },
    valueContainer: (base) => ({
      ...base,
      maxHeight: "42px",
      overflowY: "auto",
      flexWrap: "nowrap",
    }),

    multiValue: (base) => ({
      ...base,
      maxWidth: "120px",
    }),

    multiValueLabel: (base) => ({
      ...base,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    }),
  };

  return (
    <main className="flex-1 overflow-y-auto p-6">
      <div className="p-4">
        <div className="bg-white rounded-2xl shadow p-6 max-w-6xl mx-auto">
          {/* PROFILE UPLOAD */}
          {/* <div className='text-2xl underline font-semibold mb-5'>
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

          </div> */}

          <form onSubmit={handleSubmit}>
            <div className='text-2xl underline font-semibold mb-5'>
              Personal Details:
            </div>
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
            </div>
            <div className='text-2xl underline font-semibold mb-5'>
              Office Details:
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
             <Select isSearchable required isDisabled={!allowWriteAccess} options={consultancyOptions} placeholder="Select Consultancy" styles={selectStyles} menuPortalTarget={document.body} value={selectedConsultancy}
                onChange={(selectedOption) => {                    
                  setSelectedConsultancy(selectedOption);
                  setFormData((prev) => ({
                    ...prev,
                    consultancy_id: selectedOption?.value || "",
                    consultancy_name: selectedOption?.label || "",
                  }));
                  setIdOfSelectedConsultancy(selectedOption?.value);
                  console.log(`selectedConsultancy:${JSON.stringify(selectedOption)}`);
                }}
              />
              <Select id='admin_of_branch' isMulti required placeholder="Admin of Which Branches?" menuPortalTarget={document.body} styles={branchSelectStyles} isDisabled={!allowWriteAccess} closeMenuOnSelect={false} hideSelectedOptions={false}
                // options={branches.map(b => ({ value: b._id, label: b.office_name }))}
                options={branchesOptions}
                // value={branches.filter(b => selectedMultiSelectOption.includes(b._id)).map(b => ({ value: b._id, label: b.office_name })) }
                value = {selectedBranch}
                onChange={(selected) => {
                  console.log(`selected:${JSON.stringify(selected)}`);
                  setSelectedBranch(selected);
                  setFormData((prev) => ({
                    ...prev,
                    admin_of_branch:[selectedBranch]
                  }));

                  // if (!allowWriteAccess) return;
                  // const values = selected ? selected.map(s => s.value) : [];
                  // // Handle ALL logic
                  // if (values.includes("ALL")) {
                  //   setSelectedMultiSelectOption(["ALL"]);
                  //   setFormData(p => ({
                  //     ...p,
                  //     is_admin_of_all: true,
                  //     admin_branches: [],
                  //   }));
                  // } else {
                  //   setSelectedMultiSelectOption(values);
                  //   setFormData(p => ({
                  //     ...p,
                  //     is_admin_of_all: false,
                  //     admin_branches: values,
                  //   }));
                  // }
                }}
              />
            </div>

            <div className='text-2xl underline font-semibold mb-5'>
              Documents:
            </div>
            {localDocuments.slice(0, 2).map((doc, i) => (
              <div key={i} className="col-span-3 border rounded-md p-4 mb-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Document Type Dropdown */}
                  <Select id={`documents_${i}_name`} placeholder="Select Document Type" menuPortalTarget={document.body} styles={selectStyles} isDisabled={!allowWriteAccess} isSearchable
                    options={idOptions.filter((opt) => i === 0 ? opt.value !== localDocuments[1]?.name : opt.value !== localDocuments[0]?.name )}
                    value={ doc.name ? { value: doc.name, label: idOptions.find((o) => o.value === doc.name)?.label || doc.name } : null }
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
                {loading ? "Adding..." : "Add Super Admin"}
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
                    <div className="flex flex-col">
                      <p className="text-xl font-semibold mb-2">Loading...</p>
                      <p className="text-[#334155]">Please wait while we load your details.</p>
                    </div>
                  </div>
              </div>
            </div>
          )}
          
          {pageSaving && (
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
                      <p className="text-xl font-semibold mb-2">Daving...</p>
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