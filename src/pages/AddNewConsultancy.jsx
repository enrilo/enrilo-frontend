// import { useState } from "react";
// export default function AddNewConsultancy() {
//   const [selectedOfficeType, setSelectedOfficeType] = useState('Head Office');

//   return (
//     <div className="p-4">
//       <div className="bg-white rounded-2xl shadow p-6 max-w-5xl mx-auto">
//         <button className="bg-[#FACC15] text-gray-900 font-semibold px-5 py-2 rounded-md mb-6 hover:bg-[#EAB308] transition">
//           Add New Consultancy
//         </button>

//         {/* Logo Upload Area */}
//         <div className="flex flex-col items-center border-dashed border-2 border-gray-300 rounded-lg p-8 mb-8">
//           <div className="text-gray-400 text-3xl mb-2">🖼️</div>
//           <p className="text-sm text-gray-600">Click Here To Add Logo</p>
//         </div>

//         {/* Form Inputs */}
//         <form className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <input type="text" placeholder="Consultancy Name" className="input" id="consultancy_name"/>
//           <input type="text" placeholder="GST Number" className="input" id="gst_number" />
//           <input type="text" placeholder="Website" className="input" id="website" />

//           <input type="text" placeholder="LinkedIn" className="input" id="linkedin_url" />
//           <input type="text" placeholder="Facebook" className="input" id="facebook_url" />
//           <input type="text" placeholder="Instagram" className="input" id="instagram_url"/>
          
//           <p className="text-sm text-gray-600">Offices</p>

//           <div className="flex flex-row justify-evenly">
//             <input type="radio" id="single_branch" />
//             <p className="text-sm text-gray-600">Single Branch</p>
//           </div>

//           <div className="flex flex-row justify-evenly">
//             <input type="radio" id="multiple+branches"/>
//             <p className="text-sm text-gray-600">Multiple Branches</p>
//           </div>
          
//           <input type="text" placeholder="Office City" className="input" id="office_city" />
          
//           <input type="text" placeholder="Office Address" className="input" id="office_type"/>
          
//           <select value={selectedOfficeType} id="office_type" className="input">
//             <option value="Head Office">Head Office</option>
//             <option value="Branch">Branch</option>
//             <option value="Franchise">Franchise</option>
//           </select>
//         </form>

//         <div className="mt-8 flex justify-center">
//           <button className="bg-[#1E293B] text-white px-8 py-2 rounded-md hover:bg-[#334155] transition">
//             Save Details
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useCallback } from 'react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

export default function AddNewConsultancy() {
  const defaultOffice = {
    city: "",
    address: "",
    type: "Head Office",
    countryCode: "",
    phoneNumber: "",
  };

  const [branchType, setBranchType] = useState("single");
  const [offices, setOffices] = useState([defaultOffice]);

  const handleOfficeChange = useCallback((index, field, value) => {
    setOffices((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  }, []);

  const handleAddOffice = useCallback(() => {
    setOffices((prev) => [
      ...prev,
      { ...defaultOffice, type: "Branch" },
    ]);
  }, []);

  const handleRemoveOffice = useCallback((index) => {
    setOffices((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleBranchTypeChange = useCallback((type) => {
    setBranchType(type);
    if (type === "single") setOffices([defaultOffice]);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = offices.reduce((acc, office, i) => {
      const num = i + 1;
      acc[`office_city_${num}`] = office.city;
      acc[`office_address_${num}`] = office.address;
      acc[`office_type_${num}`] = office.type;
      acc[`office_country_code_${num}`] = office.countryCode;
      acc[`office_phone_number_${num}`] = office.phoneNumber;
      return acc;
    }, {});

    console.log("Database Payload:", payload);
    // TODO: Send `payload` to backend
  };

  return (
    <div className="p-4">
      <div className="bg-white rounded-2xl shadow p-6 max-w-6xl mx-auto">
        {/* Logo Upload */}
        <div className="flex flex-col items-center border-dashed border-2 border-gray-300 rounded-lg p-8 mb-8">
          <div className="text-gray-400 text-3xl mb-2">🖼️</div>
          <p className="text-gray-600">Click Here To Add Logo</p>
        </div>

        {/* Form */}
        <form className="grid grid-cols-1 md:grid-cols-3 gap-4" onSubmit={handleSubmit}>
          <TextField label="Consultancy Name" variant="outlined" />
          <TextField label="GST Number" variant="outlined" />
          <TextField label="Website" variant="outlined" />
          <TextField label="LinkedIn" variant="outlined" />
          <TextField label="Facebook" variant="outlined" />
          <TextField label="Instagram" variant="outlined" />

          {/* Office Selection */}
          <div className="col-span-3 mt-6">
            <p className="text-gray-600 mb-2">Offices</p>
            <div className="flex gap-8 mb-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="branch_type"
                  checked={branchType === "single"}
                  onChange={() => handleBranchTypeChange("single")}
                  className="accent-[#1E293B]"
                />
                <span className="text-gray-700">Single Branch</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="branch_type"
                  checked={branchType === "multiple"}
                  onChange={() => handleBranchTypeChange("multiple")}
                  className="accent-[#1E293B]"
                />
                <span className="text-gray-700">Multiple Branches</span>
              </label>
            </div>

            {/* Office Rows */}
            {offices.map((office, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center mb-3"
              >
                <TextField
                  label="Office City"
                  value={office.city}
                  onChange={(e) => handleOfficeChange(index, "city", e.target.value)}
                  variant="outlined"
                />
                <TextField
                  label="Office Address"
                  value={office.address}
                  onChange={(e) => handleOfficeChange(index, "address", e.target.value)}
                  variant="outlined"
                />
                <TextField
                  label="Office Type"
                  select
                  value={office.type}
                  onChange={(e) => handleOfficeChange(index, "type", e.target.value)}
                  variant="outlined"
                >
                  <MenuItem value="Head Office">Head Office</MenuItem>
                  <MenuItem value="Branch">Branch</MenuItem>
                  <MenuItem value="Franchise">Franchise</MenuItem>
                </TextField>
                <TextField
                  label="Country Code (e.g. +1)"
                  value={office.countryCode}
                  onChange={(e) => handleOfficeChange(index, "countryCode", e.target.value)}
                  variant="outlined"
                />
                <TextField
                  label="Phone Number"
                  value={office.phoneNumber}
                  onChange={(e) => handleOfficeChange(index, "phoneNumber", e.target.value)}
                  variant="outlined"
                />
                {branchType === "multiple" && (
                  <button
                    type="button"
                    onClick={() => handleRemoveOffice(index)}
                    className="text-red-600 hover:text-red-800 text-sm font-semibold"
                  >
                    ❌ Remove
                  </button>
                )}
              </div>
            ))}

            {branchType === "multiple" && (
              <div className="mt-2">
                <button
                  type="button"
                  onClick={handleAddOffice}
                  className="bg-[#1E293B] text-white px-4 py-2 rounded-md hover:bg-[#334155] transition"
                >
                  + Add Another Office
                </button>
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="col-span-3 mt-8 flex justify-center">
            <button
              type="submit"
              className="bg-[#1E293B] text-white px-8 py-2 rounded-md hover:bg-[#334155] transition"
            >
              Save Details
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}



// import React, { useState } from 'react';
// import TextField from '@mui/material/TextField';

// export default function AddNewConsultancy() {
//   const [branchType, setBranchType] = useState("single"); // "single" or "multiple"
//   const [offices, setOffices] = useState([
//     {
//       city: "",
//       address: "",
//       type: "Head Office",
//       countryCode: "",
//       phoneNumber: "",
//     },
//   ]);

//   const handleOfficeChange = (index, field, value) => {
//     const updated = [...offices];
//     updated[index][field] = value;
//     setOffices(updated);
//   };

//   const handleAddOffice = () => {
//     setOffices([
//       ...offices,
//       {
//         city: "",
//         address: "",
//         type: "Branch",
//         countryCode: "",
//         phoneNumber: "",
//       },
//     ]);
//   };

//   const handleRemoveOffice = (index) => {
//     setOffices(offices.filter((_, i) => i !== index));
//   };

//   const handleBranchTypeChange = (type) => {
//     setBranchType(type);
//     if (type === "single") {
//       setOffices([
//         {
//           city: "",
//           address: "",
//           type: "Head Office",
//           countryCode: "",
//           phoneNumber: "",
//         },
//       ]);
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const payload = {};
//     offices.forEach((office, index) => {
//       const num = index + 1;
//       payload[`office_city_${num}`] = office.city;
//       payload[`office_address_${num}`] = office.address;
//       payload[`office_type_${num}`] = office.type;
//       payload[`office_country_code_${num}`] = office.countryCode;
//       payload[`office_phone_number_${num}`] = office.phoneNumber;
//     });
//     console.log("Database Payload:", payload);
//     // TODO: send `payload` to backend or database
//   };

//   return (
//     <div className="p-4">
//       <div className="bg-white rounded-2xl shadow p-6 max-w-6xl mx-auto">
//         <button className="bg-[#FACC15] text-gray-900 font-semibold px-5 py-2 rounded-md mb-6 hover:bg-[#EAB308] transition">
//           Add New Consultancy
//         </button>

//         {/* Logo Upload */}
//         <div className="flex flex-col items-center border-dashed border-2 border-gray-300 rounded-lg p-8 mb-8">
//           <div className="text-gray-400 text-3xl mb-2">🖼️</div>
//           <p className="text-sm text-gray-600">Click Here To Add Logo</p>
//         </div>

//         {/* Form */}
//         <form className="grid grid-cols-1 md:grid-cols-3 gap-4" onSubmit={handleSubmit}>
//           <TextField label="Consultancy Name" className="input" id="consultancy_name" variant="outlined" />
//           <TextField label="GST Number" className="input" id="consultancy_name" variant="outlined" />
//           <TextField label="Website" className="input" id="website" variant="outlined" />
//           <TextField label="LinkedIn" className="input" id="linkedin_url" variant="outlined" />
//           <TextField label="Facebook" className="input" id="facebook_url" variant="outlined" />
//           <TextField label="Instagram" className="input" id="instagram_url" variant="outlined" />

//           {/* Office Selection */}
//           <div className="col-span-3 mt-6">
//             <p className="text-sm text-gray-600 mb-2">Offices</p>
//             <div className="flex gap-8 mb-4">
//               <label className="flex items-center gap-2">
//                 <input type="radio" name="branch_type" checked={branchType === "single"} onChange={() => handleBranchTypeChange("single")} className="accent-[#1E293B]" />
//                 <span className="text-sm text-gray-700">Single Branch</span>
//               </label>
//               <label className="flex items-center gap-2">
//                 <input type="radio" name="branch_type" checked={branchType === "multiple"} onChange={() => handleBranchTypeChange("multiple")} className="accent-[#1E293B]" />
//                 <span className="text-sm text-gray-700">Multiple Branches</span>
//               </label>
//             </div>

//             {/* Office Details (no decoration) */}
//             {offices.map((office, index) => (
//               <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center mb-3">
//                 {/* <input type="text" placeholder="Office City" className="input" value={office.city} onChange={(e) => handleOfficeChange(index, "city", e.target.value)} /> */}
//                 <TextField label="Office City" className="input" value={office.city} onChange={(e) => handleOfficeChange(index, "city", e.target.value)} variant="outlined" />
//                 {/* <input type="text" placeholder="Office Address" className="input" value={office.address} onChange={(e) => handleOfficeChange(index, "address", e.target.value)} /> */}
//                 <TextField label="Office Address" className="input" value={office.address} onChange={(e) => handleOfficeChange(index, "address", e.target.value)} variant="outlined" />
//                 {/* <select className="input" value={office.type} onChange={(e) => handleOfficeChange(index, "type", e.target.value)} >
//                   <option value="Head Office">Head Office</option>
//                   <option value="Branch">Branch</option>
//                   <option value="Franchise">Franchise</option>
//                 </select> */}
//                 <FloatingSelect id={`office_type_${index + 1}`} label="Office Type" value={office.type} onChange={(v) => handleOfficeChange(index, "type", v)} options={[ { value: "Head Office", label: "Head Office" }, { value: "Branch", label: "Branch" }, { value: "Franchise", label: "Franchise" }, ]} />
                  
//                 <TextField label="Country Code (e.g. +1)" className="input" value={office.countryCode} onChange={(e) => handleOfficeChange(index, "countryCode", e.target.value)} variant="outlined" />
//                 {/* <input type="text" placeholder="Country Code (e.g. +1)" className="input" value={office.countryCode} onChange={(e) => handleOfficeChange(index, "countryCode", e.target.value)} /> */}
//                 <TextField label="Phone Number" className="input" value={office.phoneNumber} onChange={(e) => handleOfficeChange(index, "phoneNumber", e.target.value)} variant="outlined" />
//                 {/* <input type="text" placeholder="Phone Number" className="input" value={office.phoneNumber} onChange={(e) => handleOfficeChange(index, "phoneNumber", e.target.value)} /> */}

//                 {branchType === "multiple" && (
//                   <button type="button" onClick={() => handleRemoveOffice(index)} className="text-red-600 hover:text-red-800 text-sm font-semibold" >
//                     ❌ Remove
//                   </button>
//                 )}
//               </div>
//             ))}

//             {/* Add Office Button */}
//             {branchType === "multiple" && (
//               <div className="mt-2">
//                 <button type="button" onClick={handleAddOffice} className="bg-[#1E293B] text-white px-4 py-2 rounded-md hover:bg-[#334155] transition" >
//                   + Add Another Office
//                 </button>
//               </div>
//             )}
//           </div>
//         </form>

//         {/* Save Button */}
//         <div className="mt-8 flex justify-center">
//           <button type="submit" onClick={handleSubmit} className="bg-[#1E293B] text-white px-8 py-2 rounded-md hover:bg-[#334155] transition" >
//             Save Details
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }