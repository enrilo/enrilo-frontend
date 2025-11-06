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
    <main className="flex-1 overflow-y-auto p-6">
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
    </main>
  );
}