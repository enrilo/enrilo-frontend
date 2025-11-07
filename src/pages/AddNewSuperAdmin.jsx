// import React, { useState, useCallback } from 'react';
// import TextField from '@mui/material/TextField';
// import MenuItem from '@mui/material/MenuItem';
// import { countryCodes } from './components/CountryCodeList';

// export default function AddNewSuperAdmin() {
//     const handleSubmit = (e) => {
//         console.log('Hi there');
//     };

//     const [searchTerm, setSearchTerm] = useState("");
//     const options = countryCodes.map((country) => ({
//         value: country.code,
//         label: `${country.code} - ${country.name}`,
//     }));
//     return (
//         <main className="flex-1 overflow-y-auto p-6">
//             <div className="p-4">
//                 <div className="bg-white rounded-2xl shadow p-6 max-w-6xl mx-auto">
//                     {/* Logo Upload */}
//                     <div className="flex flex-col items-center border-dashed border-2 border-gray-300 rounded-lg p-8 mb-8">
//                     <div className="text-gray-400 text-3xl mb-2">🖼️</div>
//                     <p className="text-gray-600">Click Here To Add Profile Picture</p>
//                     </div>

//                     {/* Form */}
//                     <form className="grid grid-cols-1 md:grid-cols-3 gap-4" onSubmit={handleSubmit}>
//                     <TextField label="Admin Full Name" id="full_name" variant="outlined" />
//                     <div className="w-full">
//                         <Select options={options} value={options.find((option) => option.value === value)} onChange={(selected) => onChange(selected.value)} placeholder="Country Code" isSearchablestyles={{ control: (base) => ({ ...base, borderColor: "#2563EB", boxShadow: "none", "&:hover": { borderColor: "#2563EB" }, }), }} />
//                     </div>
//                     <TextField label="Website" variant="outlined" />
//                     <TextField label="LinkedIn" variant="outlined" />
//                     <TextField label="Facebook" variant="outlined" />
//                     <TextField label="Instagram" variant="outlined" />

                    

//                     {/* Save Button */}
//                     <div className="col-span-3 mt-8 flex justify-center">
//                         <button type="submit" className="bg-[#1E293B] text-white px-8 py-2 rounded-md hover:bg-[#334155] transition">
//                         Save Details
//                         </button>
//                     </div>
//                     </form>
//                 </div>
//             </div>
//         </main>
//     )
// }

import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Select from 'react-select';
import bcryptjs from "bcryptjs";
import { countryCodes } from './components/CountryCodeList';
import {useDispatch, useSelector} from 'react-redux';
import {Link, useNavigate} from 'react-router-dom';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';
import { selectStyles, asteriskColorStyle, slotPropsStyle } from './styles/selectStyles';

export default function AddNewSuperAdmin() {
    const { loading, error } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const hashedPassword = bcryptjs.hashSync("SuperSecureAdmin123!", 10);
    const [formData, setFormData] = useState({
        full_name: "",
        country_code: "",
        phone: "",
        company_email: "",
        password: hashedPassword,
        email: "",
        position: "",
        street_1: "",
        street_2: "",
        city: "",
        state: "",
        country: "",
        zipcode: "",
        emergency_contact: {
            name: "",
            relation: "",
            country_code: "",
            phone: "",
        },
        documents: [
            { name: "", url: "", number: "", uploaded_at: Date.now },
        ],
    });

    const addDocument = () => {
        setFormData((prev) => ({
            ...prev,
            documents: [...prev.documents, { name: "", url: "", number: "" }],
        }));
    };

    const removeDocument = (index) => {
        setFormData((prev) => {
            const updatedDocs = prev.documents.filter((_, i) => i !== index);
            return { ...prev, documents: updatedDocs };
        });
    };

    const [selectedCode, setSelectedCode] = useState(null);
    const options = countryCodes.map((country) => ({ value: country.code, label: `${country.code} - ${country.name}`, }));

    const [selectedEmergencyCode, setSelectedEmergencyCode] = useState(null);
    const emergencyCountryCodeOptions = countryCodes.map((country) => ({ value: country.code, label: `${country.code} - ${country.name}`, }));

    const handleChange = (e) => {
        const { id, value } = e.target;

        if (id.startsWith("emergency_")) {
            const field = id.replace("emergency_", "");
            setFormData((prev) => ({
                ...prev,
                emergency_contact: { ...prev.emergency_contact, [field]: value },
            }));
        } else if (id.startsWith("documents_")) {
            const [_, index, field] = id.split("_"); // e.g., "documents_0_url"
            const docIndex = parseInt(index, 10);
            setFormData((prev) => {
                const updatedDocs = [...prev.documents];
                updatedDocs[docIndex][field] = value;
                return { ...prev, documents: updatedDocs };
            });
        } else {
            setFormData((prev) => ({ ...prev, [id]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

         dispatch(signInFailure(""));
        try {
            dispatch(signInStart());
            const token = localStorage.getItem("accessToken");
            const res = await fetch("http://localhost:3000/api/super-admins/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData),
                credentials: "include",
            });

            const data = await res.json();
            if (data.success === false) {
                dispatch(signInFailure(data.message));
                return;
            }

            dispatch(signInSuccess(data));
            alert("Congratulations, super admin added successfully. You will now be redirected to all super admin page.");
            // navigate("/dashboard");
        } catch (error) {            
            dispatch(signInFailure(error.message));
            console.log(`error.message: ${error.message}`);
        }
    };

    return (
        <main className="flex-1 overflow-y-auto p-6">
            <div className="p-4">
                <div className="bg-white rounded-2xl shadow p-6 max-w-6xl mx-auto">
                    {/* Profile Picture Upload */}
                    <div className="flex flex-col items-center border-dashed border-2 border-gray-300 rounded-lg p-8 mb-8 cursor-pointer hover:bg-gray-50 transition">
                        <div className="text-gray-400 text-3xl mb-2">🖼️</div>
                        <p className="text-gray-600">Click Here To Add Profile Picture</p>
                    </div>

                    {/* Form */}
                    <form className="grid grid-cols-1 md:grid-cols-3 gap-4" onSubmit={handleSubmit}>
                        <TextField id="full_name" value={formData.full_name} onChange={handleChange} label="Admin Full Name" variant="outlined" fullWidth required sx={asteriskColorStyle} />

                        <div className="w-full flex flex-row gap-3">
                            <div className="min-w-[140px]">
                                <Select id="country_code" options={options} value={selectedCode} placeholder="Country Code" isSearchable menuPortalTarget={document.body}  styles={selectStyles} required sx={asteriskColorStyle}
                                    onChange={(selected) => {
                                        setSelectedCode(selected);
                                        setFormData((prev) => ({
                                            ...prev,
                                            country_code: selected?.value || "",
                                        }));
                                    }}
                                />
                            </div>

                            <TextField id="phone" type='number' value={formData.phone} onChange={handleChange} label="Phone Number" variant="outlined" fullWidth required sx={asteriskColorStyle} slotProps={slotPropsStyle} />
                        </div>

                        <TextField id="company_email" value={formData.company_email} onChange={handleChange} label="Company Email ID"  variant="outlined" fullWidth required sx={asteriskColorStyle} />
                        <TextField id="email" value={formData.email} onChange={handleChange} label="Personal Email ID" variant="outlined" fullWidth />
                        <TextField id="position" value={formData.position} onChange={handleChange} label="Position" variant="outlined" fullWidth required sx={asteriskColorStyle} />
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
                                <Select id="emergency_country_code" options={emergencyCountryCodeOptions} value={selectedEmergencyCode} placeholder="Country Code" isSearchable menuPortalTarget={document.body} styles={selectStyles} required sx={asteriskColorStyle}
                                    onChange={(selected) => { setSelectedEmergencyCode(selected); setFormData((prev) => ({ ...prev, emergency_contact: { ...prev.emergency_contact, country_code: selected?.value || "", }, })); }}
                                />
                            </div>

                            <TextField id="emergency_phone" type='number' label="Emergency Contact Phone" variant="outlined" fullWidth value={formData.emergency_contact.phone} onChange={handleChange} required sx={asteriskColorStyle} slotProps={slotPropsStyle} />
                        </div>
                        <TextField id="emergency_relation" label="Emergency Contact Relation" variant="outlined" fullWidth value={formData.emergency_contact.relation} onChange={handleChange} required sx={asteriskColorStyle} />

                        {/* Documents Section */}
                        {formData.documents.map((doc, index) => (
                            <div key={index} className="col-span-3 border rounded-md p-4 mb-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <TextField id={`documents_${index}_name`} value={doc.name} onChange={handleChange} label="Document Type" variant="outlined" fullWidth />
                                    <TextField id={`documents_${index}_url`} value={doc.url} onChange={handleChange} label="Document URL" variant="outlined" fullWidth />
                                    <TextField id={`documents_${index}_number`} value={doc.number} onChange={handleChange} label="Document Number" variant="outlined" fullWidth />
                                </div>
                                <div className="mt-2 flex justify-end">
                                    {formData.documents.length > 1 && (
                                        <button type="button" className="text-red-500 hover:underline" onClick={() => removeDocument(index)} >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                        <button type="button" className="col-span-3 mb-4 text-blue-600 hover:underline" onClick={addDocument} >
                            + Add Another Document
                        </button>

                        {/* Save Button */}
                        <div className="col-span-3 mt-4 flex justify-center">
                            <button type="submit" className="bg-[#1E293B] text-white px-8 py-2 rounded-md hover:bg-[#334155] transition" >
                                Save Details
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}


// import { useState } from 'react';
// import TextField from '@mui/material/TextField';
// import Select from 'react-select';
// import { countryCodes } from './components/CountryCodeList';

// export default function AddNewSuperAdmin() {
//     const [formData, setFormData] = useState({
//         full_name: "",
//         country_code: "",
//         phone: "",
//         company_email: "",
//         password: "",
//         email: "",
//         position: "",
//         street_1: "",
//         street_2: "",
//         city: "",
//         state: "",
//         country: "",
//         zipcode: "",
//         emergency_contact: {
//             name: "",
//             relation: "",
//             country_code: "",
//             phone: "",
//         }
//     });

//     const handleChange = (e) => {
//         const { id, value } = e.target;

//         // Handle nested emergency_contact fields
//         if (id.startsWith("emergency_")) {
//         const field = id.replace("emergency_", "");
//             setFormData((prev) => ({
//                 ...prev,
//                 emergency_contact: { ...prev.emergency_contact, [field]: value },
//             }));
//         } else {
//             setFormData((prev) => ({ ...prev, [id]: value }));
//         }
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         console.log('Hi there');
//     };

//     const [selectedCode, setSelectedCode] = useState(null);

//     const options = countryCodes.map((country) => ({ value: country.code, label: `${country.code} - ${country.name}`, }));

//     const [selectedEmergencyCode, setSelectedEmergencyCode] = useState(null);

//     const emergencyCountryCodeOptions = countryCodes.map((country) => ({ value: country.code, label: `${country.code} - ${country.name}` }));

//     return (
//         <main className="flex-1 overflow-y-auto p-6">
//             <div className="p-4">
//                 <div className="bg-white rounded-2xl shadow p-6 max-w-6xl mx-auto">
//                     {/* Profile Picture Upload */}
//                     <div className="flex flex-col items-center border-dashed border-2 border-gray-300 rounded-lg p-8 mb-8 cursor-pointer hover:bg-gray-50 transition">
//                         <div className="text-gray-400 text-3xl mb-2">🖼️</div>
//                         <p className="text-gray-600">Click Here To Add Profile Picture</p>
//                     </div>

//                     {/* Form */}
//                     <form className="grid grid-cols-1 md:grid-cols-3 gap-4" onSubmit={handleSubmit}>
//                         <TextField id="full_name" value={formData.full_name} onChange={handleChange} label="Admin Full Name" variant="outlined" fullWidth />

//                         <div className="w-full flex flex-row gap-3">
//                             <div className="min-w-[140px]">
//                                 <Select id="country_code" options={options} value={selectedCode} placeholder="Country Code" isSearchable menuPortalTarget={document.body}
//                                 onChange={(selected) => { setSelectedCode(selected); setFormData((prev) => ({ ...prev, country_code: selected?.value || "", })); }}
//                                 styles={{ control: (base, state) => ({ ...base, minHeight: "56px", height: "56px", borderRadius: "4px", borderColor: state.isFocused ? "#2563EB" : "#E0E0E0", boxShadow: "none", "&:hover": { borderColor: "#2563EB" }, }), menuPortal: (base) => ({ ...base, zIndex: 9999 }), }} />
//                             </div>

//                             <TextField id='phone' value={formData.phone} onChange={handleChange} label="Phone Number" variant="outlined" fullWidth slotProps={{ input: { style: { height: '56px' }, }, }} />
//                         </div>
//                         <TextField id='email' value={formData.company_email} onChange={handleChange} label="Company Email ID" variant="outlined" fullWidth />
//                         <TextField id='position' value={formData.position} onChange={handleChange} label="Position" variant="outlined" fullWidth />
//                         <TextField id='street_1' value={formData.street_1} onChange={handleChange} label="Street 1" variant="outlined" fullWidth />
//                         <TextField id='street_2' value={formData.street_2} onChange={handleChange} label="Street 2" variant="outlined" fullWidth />
//                         <TextField id='city' value={formData.city} onChange={handleChange} label="City" variant="outlined" fullWidth />
//                         <TextField id='state' value={formData.state} onChange={handleChange} label="State" variant="outlined" fullWidth />
//                         <TextField id='country' value={formData.country} onChange={handleChange} label="Country" variant="outlined" fullWidth />
//                         <TextField id='zipcode' value={formData.zipcode} onChange={handleChange} label="Zipcode" variant="outlined" fullWidth />
//                         <TextField id="emergency_name" label="Emergency Contact Name" variant="outlined" fullWidth value={formData.emergency_contact.name} onChange={handleChange} />
//                         <div className="w-full flex flex-row gap-3">
//                         <div className="min-w-[140px]">
//                             <Select id="emergency_country_code" options={emergencyCountryCodeOptions} value={selectedEmergencyCode} placeholder="Country Code" Searchable menuPortalTarget={document.body}
//                             onChange={(selected) => { setSelectedEmergencyCode(selected); setFormData((prev) => ({ ...prev, emergency_contact: { ...prev.emergency_contact, country_code: selected?.value || "", },  })); }}
//                             styles={{ control: (base, state) => ({ ...base, minHeight: "56px", height: "56px", borderRadius: "4px", borderColor: state.isFocused ? "#2563EB" : "#E0E0E0", boxShadow: "none", "&:hover": { borderColor: "#2563EB" }, }), menuPortal: (base) => ({ ...base, zIndex: 9999 }), }} />
//                         </div>

//                         <TextField
//                             id="emergency_phone"
//                             label="Emergency Contact Phone"
//                             variant="outlined"
//                             fullWidth
//                             value={formData.emergency_contact.phone}
//                             onChange={handleChange}
//                             slotProps={{ input: { style: { height: "56px" } } }}
//                         />
//                         </div>
//                         <TextField label="Emergency Contact Relation" variant="outlined" fullWidth />

//                         {/* Save Button */}
//                         <div className="col-span-3 mt-8 flex justify-center">
//                         <button
//                             type="submit"
//                             className="bg-[#1E293B] text-white px-8 py-2 rounded-md hover:bg-[#334155] transition"
//                         >
//                             Save Details
//                         </button>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </main>
//     );
// }
