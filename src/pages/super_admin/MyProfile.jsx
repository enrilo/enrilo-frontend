import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { useSelector } from "react-redux";
import { TextField, Button } from "@mui/material";
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

export default function MyProfile() {
    const { loading } = useSelector((state) => state.user);
    const params = useParams();
    const navigate = useNavigate();
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewName, setPreviewName] = useState("");
    const [previewUrl, setPreviewUrl] = useState("");
    const [pageLoading, setPageLoading] = useState(false);
    const [allowWriteAccess, setAllowWriteAccess] = useState(false);
    const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [failedToSaveMessage, setFailedToSaveMessage] = useState("");
    const [failedToSaveMsgOpen, setFailedToSaveMsgOpen] = useState(false);
    const [saveSuccessfulMessage, setSaveSuccessfulMessage] = useState("");
    const [saveSuccessfulMsgOpen, setSaveSuccessfulMsgOpen] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");

    const [updatePwdForm, setUpdatePwdForm] = useState({
        oldPassword:'',
        newPassword:''
    });

    const newPassword = updatePwdForm.newPassword;

    const isAtLeast8Characters = newPassword.length >= 8;
    const hasCapitalLetter = /[A-Z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
    const passwordsMatch = newPassword !== "" && newPassword === confirmPassword;

    const isPasswordValid = isAtLeast8Characters && hasCapitalLetter && hasNumber && hasSpecialCharacter && passwordsMatch;

    const [formData, setFormData] = useState({
        photo_url: "",
        full_name: "",
        country_code: "",
        phone: "",
        company_email: "",
        password: '',
        email: "",
        position: "",
        role:"",
        allow_write_access:"",
        street_1: "",
        street_2: "",
        city: "",
        state: "",
        country: "",
        zipcode: "",
        bank_details: { account_number: "", account_holder_name: "", bank_name: "", branch_name:"", branch_address: "", ifsc_code:"" },
        emergency_contact: { name: "", relation: "", country_code: "", phone: "" },
        documents: [{ name: "", url: "", number: "", uploaded_at: "" }],
    });

    const persistedRoot = JSON.parse(localStorage.getItem("persist:root"));
    // Parse the nested user slice
    const userState = JSON.parse(persistedRoot.user);
    // Extract token
    const token = userState.currentUser?.data?.accessToken;
    const loggedInUserID = userState.currentUser?.data?.id;
    // const allowWriteAccess = userState.currentUser?.data?.allow_write_access;

    useEffect(() =>{
        const fetchSuperAdmin = async () => {
            try {
                setPageLoading(true);
                const superAdminID = userState.currentUser.data.id;
                const res = await fetch(`http://localhost:3000/api/super-admins/${superAdminID}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    credentials: "include",
                });
                const data = await res.json();
                
                if(data.success === false){
                    setPageLoading(true);
                    return;
                }
                setFormData(data.data.superAdmin);
                // FETCHING WRITE ACCESS PERMISSIONS
                setAllowWriteAccess(data.data.superAdmin.allow_write_access);
                setPageLoading(false);
            } catch (error) {
                console.log(`error.message: ${error.message}`);
                setPageLoading(false);
            }
        };

        fetchSuperAdmin();
    }, [params.id]);

    // const handleChange = (e) => {
    //     const { id, value } = e.target;
    //     setUpdatePwdForm((p) => ({ ...p, [id]: value }));
    // };

    const handleChange = (e) => {
        const { id, value } = e.target;

        if (id === "confirmPassword") {
            setConfirmPassword(value);
        } else {
            setUpdatePwdForm((prev) => ({ ...prev, [id]: value }));
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setPageLoading(true);
        setFailedToSaveMsgOpen(false);
        if (!isPasswordValid) {
            setFailedToSaveMessage("Password must be at least 8 characters long, include a capital letter, a number, a special character, and both passwords must match.");
            setFailedToSaveMsgOpen(true);
            return;
        }

        try {
            const res = await fetch(`http://localhost:3000/api/super-admins/change-password/${loggedInUserID}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(updatePwdForm),
                credentials: "include",
            });

            const data = await res.json();
            if (!data.success) {
                setFailedToSaveMessage(`Failed to update super admin because ${data.message.toLowerCase()}`);
                setFailedToSaveMsgOpen(true);
                setPageLoading(false);
                return;
            }

            if(failedToSaveMsgOpen){
                setFailedToSaveMsgOpen(false);
            }
            setShowResetPasswordModal(false);
            setUpdatePwdForm({
                oldPassword: '',
                newPassword: ''
            });
            setShowPassword(false);
            setConfirmPassword('');
            setTimeout(() => {
                setSaveSuccessfulMsgOpen(true);
                setSaveSuccessfulMessage("Super admin updated successfully!");
            }, 300);
        } catch (err) {
            console.error(err);
            setFailedToSaveMessage(`Failed to update super admin: ${err.message}`);
            setFailedToSaveMsgOpen(true);
        } 
        finally {
            setPageLoading(false);
        }
    };

    return (
        <main className="flex-1 overflow-y-auto p-6">
            <div className="p-4 sm:p-6">
                <div className="bg-white rounded-2xl shadow p-6 gap-5 max-w-6xl mx-auto items-center">
                    <div className="flex flex-col items-center border-dashed border-2 border-gray-300 rounded-lg p-8 mb-8 hover:bg-gray-50 transition">
                        <div className="flex flex-col items-center">
                            <img src={formData.photo_url || "https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2264922221.jpg"} alt="Profile" className="w-auto h-64 object-cover rounded-lg mb-2" />
                        </div>
                    </div>

                    {/* PERSONAL INFO */}
                    <div className='text-2xl font-semibold underline mb-2'>
                        Personal Details:
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                        <div className='text-xl'>
                            <span className="font-semibold">Full Name:</span> <br /> {formData.full_name}
                        </div>
                        <div className='text-xl'>
                            <span className="font-semibold">Position:</span> <br /> {formData.position}
                        </div>
                        <div className='text-xl'>
                            <span className="font-semibold">Role:</span> <br /> <span className="capitalize">{formData.role}</span>
                        </div>
                        <div className='text-xl'>
                            <span className="font-semibold">Phone Number:</span> <br /> {formData.country_code} {formData.phone}
                        </div>
                        <div className='text-xl'>
                            <span className="font-semibold">Company Email ID:</span> <br /> {formData.company_email}
                        </div>
                        {formData.email && (
                            <div className='text-xl'>
                                <span className="font-semibold">Personal Email ID:</span> <br /> {formData.email}
                            </div>
                        )}
                        {(formData.street_1 || formData.street_2 || formData.city || formData.state || formData.country || formData.zipcode) && (
                            <div className='text-xl'>
                                <span className="font-semibold">Home Address:</span> <br /> {[ formData.street_1, formData.street_2, formData.city, formData.state, formData.country ].filter(Boolean).join(', ')} - {formData.zipcode}
                            </div>
                        )}
                        <div className='text-xl'>
                            <span className="font-semibold">Write Access:</span> <br /> <span className="capitalize">{formData.allow_write_access == false ? 'Write Access Not Allowed':'Write Access Allowed'}</span>
                        </div>
                    </div>

                    {/* EMERGENCY CONTACT INFO */}
                    <div className='text-2xl font-semibold underline mb-2'>
                        Emergency Contact:
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3  gap-5 mb-8">
                        <div className='text-xl'>
                            <span className="font-semibold">Name:</span> <br /> {formData.emergency_contact.name}
                        </div>
                        <div className='text-xl'>
                            <span className="font-semibold">Phone Number:</span> <br /> {formData.emergency_contact.country_code} {formData.emergency_contact.phone}
                        </div>
                        <div className='text-xl'>
                            <span className="font-semibold">Relation with Super Admin:</span> <br /> {formData.emergency_contact.relation}
                        </div>
                    </div>
                    
                    {/* BANK ACCOUNT INFO */}
                    {
                        (!formData.bank_details) && (
                            <>
                                <div className='text-2xl font-semibold underline mb-2'>
                                Bank Details:
                                </div>
                                <div className={`grid grid-cols-1 md:grid-cols-3 gap-5 ${formData.documents && formData.documents.some(doc => doc.name || doc.number) ? "mb-8" : "mb-15"}`}>
                                    <div className='text-xl'>
                                        <span className="font-semibold">Account Holder Name:</span> <br /> {formData.bank_details.account_holder_name}
                                    </div>
                                    <div className='text-xl'>
                                        <span className="font-semibold">Account Number:</span> <br /> {formData.bank_details.account_number}
                                    </div>
                                    <div className='text-xl'>
                                        <span className="font-semibold">Bank Name:</span> <br /> {formData.bank_details.bank_name}
                                    </div>
                                    <div className='text-xl'>
                                        <span className="font-semibold">Branch Name:</span> <br /> {formData.bank_details.branch_name}
                                    </div>
                                    <div className='text-xl'>
                                        <span className="font-semibold">Branch Address:</span> <br /> {formData.bank_details.branch_address}
                                    </div>
                                    <div className='text-xl'>
                                        <span className="font-semibold">IFSC Code:</span> <br /> {formData.bank_details.ifsc_code}
                                    </div>
                                </div>
                            </>
                        )
                    }
                    {formData.documents && formData.documents.some(doc => doc.name || doc.number) && (
                        <>
                            <div className='text-2xl font-semibold underline mb-2'>
                            Documents:
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                            {formData.documents.map((doc, index) => {
                                // Skip empty documents
                                if (!doc.name && !doc.number) return null;

                                return (
                                    <div key={index} className="text-xl flex items-center justify-between p-2 border rounded">
                                        <div>
                                        {doc.name && (
                                            <div>
                                                <span className="font-semibold">Name:</span> {doc.name}
                                            </div>
                                        )}
                                        {doc.number && (
                                            <div>
                                                <span className="font-semibold">Number:</span> {doc.number}
                                            </div>
                                        )}
                                        </div>
                                        {doc.url && (
                                        <Button variant="outlined" onClick={() => { setPreviewName(doc.name); setPreviewUrl(doc.url); setPreviewOpen(true); }} >
                                            VIEW
                                        </Button>
                                        )}
                                    </div>
                                );
                            })}
                            </div>
                        </>
                    )}

                    <div className="mt-6 flex flex-row justify-center">
                        <button type="button" onClick={() => setShowResetPasswordModal(true)} className="bg-slate-500 hover:bg-slate-600 text-white font-semibold px-8 py-2 rounded-md transition cursor-pointer">
                            Click Here To Update Password
                        </button>
                    </div>

                    {
                        (allowWriteAccess == true) && (
                            <div className="mt-6 flex flex-row justify-center">
                                <Link to={`/edit-super-admin/${formData._id}`} className='flex flex-row justify-between'>
                                    <button className="bg-[#1E293B] hover:bg-[#334155] text-yellow-300 font-semibold px-8 py-2 rounded-md transition cursor-pointer">
                                        Edit Profile
                                    </button>
                                </Link>
                            </div>
                        )
                    }
                </div>
            </div>

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
                            {/* Loading All Super Admin Details... */}
                            <div className="flex flex-col">
                                <p className="text-xl font-semibold mb-2">Loading...</p>
                                <p className="text-[#334155]">Please wait while we load the details of all superadmin.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {previewOpen && (
                <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md z-50">
                    <div className="bg-white rounded-2xl shadow-lg p-4 max-w-5xl max-h-2xl w-full">
                        <div className="flex justify-between items-center mb-2">
                            <div className='text-xl font-semibold p-1'>
                                {previewName}
                            </div>
                            <button className="bg-[#1E293B] hover:bg-[#334155] text-yellow-300 font-semibold px-8 py-2 rounded-md transition cursor-pointer" onClick={() => setPreviewOpen(false)} >
                                Close
                            </button>
                        </div>
                        {previewUrl.includes(".pdf") ? (
                            <iframe src={previewUrl} className="w-full h-[500px] rounded" title="Document Preview" ></iframe>
                        ) : (
                            <img src={previewUrl} alt="Document Preview" className="w-full max-h-[500px] object-contain rounded" />
                        )}
                    </div>
                </div>
            )}


            {saveSuccessfulMsgOpen && (
                <div className="fixed inset-0 backdrop-blur-md flex justify-center items-center z-50">
                    <div className="bg-white text-[#334155] rounded-lg p-6 w-80 shadow-xl text-center">
                        <p className="mb-4 text-xl">{(saveSuccessfulMessage === "Super admin updated successfully!") && "Password Updated Successfully!"}</p>
                        <button className="bg-[#1E293B] hover:bg-[#334155] text-yellow-300 font-semibold px-4 py-2 rounded-md w-24 transition cursor-pointer"  onClick={() => setSaveSuccessfulMsgOpen(false)}>
                        OK
                        </button>
                    </div>
                </div>
            )}


            {showResetPasswordModal && (
                <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md z-48">
                    <div className="bg-white rounded-2xl shadow-lg p-4 max-w-3xl w-full">
                        <div className="flex justify-between items-center mb-2">
                            <div className="text-xl font-semibold p-1">
                            Update Your Password
                            </div>
                            <button className="bg-[#1E293B] hover:bg-[#334155] text-yellow-300 font-semibold px-8 py-2 rounded-md transition cursor-pointer" 
                                onClick={() => {
                                    setShowResetPasswordModal(false);
                                    setUpdatePwdForm({
                                        oldPassword: '',
                                        newPassword: ''
                                    });
                                    setConfirmPassword('');
                                    setShowPassword(false);
                                }}>
                            Close
                            </button>
                        </div>

                        <form autoComplete="off" onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 mt-10 max-w-xl mx-auto place-items-center">
                            <TextField id="oldPassword" type={showPassword ? "text" : "password"} value={updatePwdForm.oldPassword} onChange={handleChange} label="Enter Your Current Password" fullWidth />
                            <TextField id="newPassword" type={showPassword ? "text" : "password"}  value={updatePwdForm.newPassword} onChange={handleChange} label="Enter New Password" fullWidth />
                            <TextField id="confirmPassword" type={showPassword ? "text" : "password"} value={confirmPassword} onChange={handleChange} label="Confirm New Password" fullWidth />

                            {/* PASSWORD RULES */}
                            <ul className="w-full text-sm space-y-1">
                                <li className={isAtLeast8Characters ? "text-green-600" : "text-red-600"}>
                                    {isAtLeast8Characters ? "✔" : "✖"} At least 8 characters
                                </li>
                                <li className={hasCapitalLetter ? "text-green-600" : "text-red-600"}>
                                    {hasCapitalLetter ? "✔" : "✖"} At least 1 capital letter
                                </li>
                                <li className={hasNumber ? "text-green-600" : "text-red-600"}>
                                    {hasNumber ? "✔" : "✖"} At least 1 number
                                </li>
                                <li className={hasSpecialCharacter ? "text-green-600" : "text-red-600"}>
                                    {hasSpecialCharacter ? "✔" : "✖"} At least 1 special character
                                </li>
                                <li className={passwordsMatch ? "text-green-600" : "text-red-600"}>
                                    {passwordsMatch ? "✔" : "✖"} Passwords match
                                </li>
                            </ul>

                            {failedToSaveMsgOpen && (
                                <span className="text-red-600 font-semibold">
                                    {failedToSaveMessage?.replace(/super admin/i, "your password")}
                                </span>
                            )}

                            <div className="flex items-center gap-2">
                                <input type="checkbox" checked={showPassword} onChange={() => setShowPassword(!showPassword)} />
                                <label className="text-gray-700">Show Password</label>
                            </div>

                            {/* <button type="submit" disabled={!isPasswordValid || loading} className={`bg-[#1E293B] hover:bg-[#334155] text-yellow-300 font-semibold px-8 py-2 rounded-md transition ${(!isPasswordValid || loading) && "cursor-not-allowed text-white bg-slate-500 hover:bg-slate-600"} `}> */}
                            <button type="submit" disabled={!isPasswordValid || loading} className={`font-semibold px-8 py-2 rounded-md transition ${ !isPasswordValid || loading ? "bg-slate-500 hover:bg-slate-600 text-white cursor-not-allowed" : "bg-[#334155] hover:bg-[#1E293B] text-yellow-300 cursor-pointer" }`}>
                                {loading ? "Updating..." : "Update Password"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </main>
    )
}
