import React from 'react'

export default function AddMasterAdmin() {
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
