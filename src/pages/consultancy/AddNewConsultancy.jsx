import { useState, useCallback, useEffect } from 'react';
import { TextField, InputAdornment } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Select from "react-select";
import { selectStyles, asteriskColorStyle } from "../styles/selectStyles.js";
import { countryCodes } from "../components/CountryCodeList.js";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase.js";
import { useNavigate } from "react-router-dom";

export default function AddNewConsultancy() {
  const navigate = useNavigate();
  const [isSubdomainAvailable, setIsSubdomainAvailable] = useState(null);
  const [checkingSubdomain, setCheckingSubdomain] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [isSingleBranch, setIsSingleBranch] = useState(true);
  const [branchType, setBranchType] = useState("single");
  const [allowWriteAccess, setAllowWriteAccess] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [messageOpen, setMessageOpen] = useState(false);
  const [failedToSaveMessage, setFailedToSaveMessage] = useState("");
  const [failedToSaveMsgOpen, setFailedToSaveMsgOpen] = useState(false);
  const [saveSuccessfulMessage, setSaveSuccessfulMessage] = useState("");
  const [saveSuccessfulMsgOpen, setSaveSuccessfulMsgOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [profilePreviewUrl, setProfilePreviewUrl] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");
  const [localProfileFile, setLocalProfileFile] = useState(null);
  const [formData, setFormData] = useState({
    photo_url: "https://img.icons8.com/ios7/1200/company.jpg",
    name: "",
    company_website:"",
    gst_number: "",
    linkedin_url: "",
    facebook_url: "",
    instagram_url: "",
    is_single_branch: true,
    subdomain: "",
    office_details: [
      {
        office_name: "",
        office_city: "",
        office_address: "",
        office_type: "Head Office",
        country_code: "",
        phone_number: "",
      },
    ],
  });

  const countryCodeOptions = countryCodes.map((c) => ({ value: c.code, label: `${c.code} - ${c.name}` }));
  const persistedRoot = JSON.parse(localStorage.getItem("persist:root"));
  const userState = JSON.parse(persistedRoot.user);
  const token = userState.currentUser?.data?.accessToken;
  const loggedInUserID = userState.currentUser?.data?.id;

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
      } catch (error) {
        console.log(`error.message: ${error.message}`);
        setPageLoading(false);
      }
    };
    fetchSuperAdminAccessToken();
  }, []);

  useEffect(() => {
    if (!formData.subdomain || formData.subdomain.trim() === "") {
      setIsSubdomainAvailable(null);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        setCheckingSubdomain(true);

        const res = await fetch(
        `http://localhost:3000/api/consultancies/check-subdomain/${formData.subdomain}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        setIsSubdomainAvailable(data.message);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(err);
          setIsSubdomainAvailable("Subdomain is not available");
        }
      } finally {
        setCheckingSubdomain(false);
      }
    }, 500);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [formData.subdomain]);

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

  const handleDeleteProfile = () => {
    setLocalProfileFile(null);
    setProfilePreviewUrl('');
    setFormData((p) => ({
      ...p,
      photo_url: "https://img.icons8.com/ios7/1200/company.jpg",
    }));
  };

  const handleDeleteProfileConfirm = () => {
    setConfirmMessage("Delete the company's current logo?");
    setConfirmAction(() => handleDeleteProfile);
    setConfirmOpen(true);
  };

  useEffect(() => {
    const generatePreview = async () => {
      if (!localProfileFile) {
        setProfilePreviewUrl(formData.photo_url);
        return;
      }
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
    return () => {
      if (profilePreviewUrl && profilePreviewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(profilePreviewUrl);
      }
    };
  }, [localProfileFile, formData.photo_url]);

  const handleOfficeChange = useCallback((index, field, value) => {    
    setFormData((prev) => {
      const updated = [...prev.office_details];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, office_details: updated };
    });
  }, []);

  const handleAddOffice = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      office_details: [
        ...prev.office_details,
        {
          office_city: "",
          office_name: "",
          office_address: "",
          office_type: "Branch",
          country_code: "",
          phone_number: "",
        },
      ],
    }));
  }, []);

  const handleRemoveOffice = useCallback((index) => {
    setFormData((prev) => ({
      ...prev,
      office_details: prev.office_details.filter((_, i) => i !== index),
    }));
  }, []);

  const handleBranchTypeChange = useCallback((type) => {
    setBranchType(type);
    setFormData((prev) => ({
      ...prev,
      is_single_branch: type === "single",
      office_details: type === "single" ? [{
          office_city: "",
          office_name: "",
          office_address: "",
          office_type: "Head Office",
          country_code: "",
          phone_number: "",
        } ] : prev.office_details.map((office, idx) => ({
        ...office,
        office_type: idx === 0 ? "Head Office" : office.office_type || "Branch"
      })),
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPageLoading(true);

    for (const office of formData.office_details) {
      if (!office.office_name || !office.office_city || !office.office_address || !office.office_type || !office.country_code) {
        setFailedToSaveMessage("Please fill all required office details");
        setFailedToSaveMsgOpen(true);
        setPageLoading(false);
        return;
      }
    }

    try{
      let profile_url = formData.photo_url;
      if (localProfileFile) {
        const { url } = await uploadFile(localProfileFile, "profile_pictures");
        profile_url = url;
      }

      const payload = {
        ...formData,
        photo_url: profile_url,
      };
      // const payload = {
      //   photo_url: profile_url,
      //   name: formData.name,
      //   company_website: formData.company_website,
      //   gst_number: formData.gst_number,
      //   linkedin_url: formData.linkedin_url,
      //   facebook_url: formData.facebook_url,
      //   instagram_url: formData.instagram_url,
      //   is_single_branch: formData.is_single_branch,
      //   subdomain: formData.subdomain,

      //   office_details: formData.office_details.map((office) => ({
      //     office_city: office.office_city,
      //     office_name: office.office_name,
      //     office_address: office.office_address,
      //     office_type: office.office_type === "Head Office" ? "Head Office" : (office.office_type === "Branch" ? "Branch" : "Franchise"),
      //     country_code: office.country_code,
      //     phone_number: Number(office.phone_number),
      //   })),
      // };

      const res = await fetch("http://localhost:3000/api/consultancies/", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      const data = await res.json();
      if (!data.success) {
        setFailedToSaveMessage(`Failed to add consultancy: ${data.message.toLowerCase()}`);
        setFailedToSaveMsgOpen(true);
        setPageLoading(false);
        return;
      }

      setSaveSuccessfulMessage("Consultancy added successfully! You will now be redirected.");
      setSaveSuccessfulMsgOpen(true);
    } catch (err) {
      console.error(err);
      setFailedToSaveMessage(`Failed to add consultancy: ${err.message}`);
      setFailedToSaveMsgOpen(true);
    } finally {
      setPageLoading(false);
    }
  };

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
      uploadTask.on( "state_changed", (snapshot) => {},
        (error) => reject(error),
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({ url, filePath });
        }
      );
    });
  };

  return (
    <main className="flex-1 overflow-y-auto p-6">
      <div className="p-4">
        <div className="bg-white rounded-2xl shadow p-6 max-w-6xl mx-auto">
          {/* Logo upload */}
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

          {/* Form */}
          <form className="grid grid-cols-1 md:grid-cols-3 gap-4" onSubmit={handleSubmit}>
            <TextField label="Consultancy Name" variant="outlined" required disabled={!allowWriteAccess} sx={{...asteriskColorStyle}} onChange={(e) => setFormData((p) => ({...p, name: e.target.value}))} />
            <div className='flex flex-col'>
              <TextField label="Subdomain" variant="outlined" 
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    subdomain: e.target.value,
                  }))
                }
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        https://
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        .enrilo.com
                      </InputAdornment>
                    ),
                  },
                }}
              />
              {isSubdomainAvailable !== null && !checkingSubdomain && (
                <ul className="mt-1">
                  <li className={isSubdomainAvailable === "Subdomain is available 🚀" ? "text-green-600" : "text-red-600"}>
                    {isSubdomainAvailable === "Subdomain is available 🚀" ? "Subdomain is available" : "Subdomain is not available"}
                  </li>
                </ul>
              )}

              {checkingSubdomain && (
                <p className="mt-1 text-sm text-gray-500">
                  Checking availability...
                </p>
              )}
            </div>

            <TextField label="Company Website" variant="outlined" onChange={(e) => setFormData((p) => ({...p, company_website: e.target.value}))} />
            <TextField label="GST Number" variant="outlined" onChange={(e) => setFormData((p) => ({...p, gst_number: e.target.value}))} />
            <TextField label="LinkedIn" variant="outlined" onChange={(e) => setFormData((p) => ({...p, linkedin_url: e.target.value}))} />
            <TextField label="Facebook" variant="outlined" onChange={(e) => setFormData((p) => ({...p, facebook_url: e.target.value}))} />
            <TextField label="Instagram" variant="outlined" onChange={(e) => setFormData((p) => ({...p, instagram_url: e.target.value}))} />

            {/* Office Selection */}
            <div className="col-span-3 mt-6">
              <p className="text-gray-600 mb-2">Offices</p>
              <div className="flex gap-8 mb-4">
                <label className="flex items-center gap-2">
                  <input type="radio" name="branch_type" checked={isSingleBranch} onChange={() => {handleBranchTypeChange("single"); setIsSingleBranch(true)}} className="accent-[#1E293B] cursor-pointer" />
                  <span className="text-gray-700">Single Branch</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="branch_type" checked={!isSingleBranch} onChange={() => {handleBranchTypeChange("multiple"); setIsSingleBranch(false)}} className="accent-[#1E293B] cursor-pointer" />
                  <span className="text-gray-700">Multiple Branches</span>
                </label>
              </div>

              {formData.office_details.map((office, index) => (
               <div className='mb-8'>
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center mb-3">
                  <TextField label="Office Name" value={office.office_name} onChange={(e) => handleOfficeChange(index, "office_name", e.target.value)} variant="outlined" disabled={!allowWriteAccess} required sx={{...asteriskColorStyle}} />
                  <TextField label="Office City" value={office.office_city} onChange={(e) => handleOfficeChange(index, "office_city", e.target.value)} variant="outlined" disabled={!allowWriteAccess} required sx={{...asteriskColorStyle}} />
                  <TextField label="Office Address" value={office.office_address} onChange={(e) => handleOfficeChange(index, "office_address", e.target.value)} variant="outlined" disabled={!allowWriteAccess} required sx={{...asteriskColorStyle}} />
                  
                  {/* Fixed Office Type Dropdown */}
                  <TextField label="Office Type" select value={office.office_type || ""} onChange={(e) => handleOfficeChange(index, "office_type", e.target.value)} variant="outlined" disabled={!allowWriteAccess} required sx={{ ...asteriskColorStyle }} >
                    {index === 0 && <MenuItem value="Head Office">Head Office</MenuItem>}
                    {index !== 0 && <MenuItem value="Branch">Branch</MenuItem>}
                    {index !== 0 && <MenuItem value="Franchise">Franchise</MenuItem>}
                  </TextField>

                  {/* <div className="w-full flex gap-3">
                    <div className="min-w-[140px]">
                      <Select isDisabled={!allowWriteAccess} options={countryCodeOptions} value={countryCodeOptions.find(c => c.value === office.country_code) || null} placeholder="Country Code" isSearchable menuPortalTarget={document.body} menuPosition="fixed" styles={selectStyles} onChange={(sel) => handleOfficeChange(index, "country_code", sel?.value || "")} required sx={{...asteriskColorStyle}} />
                    </div>
                  </div> */}
                  <Select isDisabled={!allowWriteAccess} options={countryCodeOptions} value={countryCodeOptions.find(c => c.value === office.country_code) || null} placeholder="Country Code" isSearchable menuPortalTarget={document.body} menuPosition="fixed" styles={selectStyles} onChange={(sel) => handleOfficeChange(index, "country_code", sel?.value || "")} required sx={{...asteriskColorStyle}} />
                  <TextField label="Phone Number" value={office.phone_number} onChange={(e) => handleOfficeChange(index, "phone_number", e.target.value)} variant="outlined" required sx={{...asteriskColorStyle}} />
                </div>
                {branchType === "multiple" && (
                  <button type="button" onClick={() => handleRemoveOffice(index)} className="text-red-600 hover:text-red-800 text-sm font-semibold cursor-pointer" >
                    ❌ Remove
                  </button>
                )}
               </div>
              ))}

              {branchType === "multiple" && (
                <div className="mt-2">
                  <button type="button" onClick={handleAddOffice} className="bg-[#475569] text-yellow-300 font-semibold px-8 py-2 rounded-md hover:bg-[#334155] cursor-pointer transition" >
                    + Add Another Office
                  </button>
                </div>
              )}
            </div>

            <div className="col-span-3 mt-8 flex justify-center">
              <button type="submit" className="bg-[#1E293B] hover:bg-[#334155] text-yellow-300 font-semibold px-8 py-2 rounded-md transition cursor-pointer" >
                Add Consultancy
              </button>
            </div>
          </form>

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
                <button className="bg-[#1E293B] hover:bg-[#334155] text-yellow-300 font-semibold px-4 py-2 rounded-md w-24 transition cursor-pointer" onClick={() => { setSaveSuccessfulMsgOpen(false); navigate("/all-consultancies");}} >
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