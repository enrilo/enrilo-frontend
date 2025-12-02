import { TextField } from "@mui/material";
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { signInStart, signInSuccess, signInFailure } from '../../redux/user/userSlice';

export default function SuperAdminLogin() {
  const [formData, setFormData] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [modalMessage, setModalMessage] = useState("");  // For custom modal
  const [messageOpen, setMessageOpen] = useState(false); // Controls modal visibility
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(signInFailure(""));

    try {
      dispatch(signInStart());
      const res = await fetch("http://localhost:3000/api/super-admins/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        setModalMessage(data.message);
        setMessageOpen(true); // Show modal with error
        return;
      }

      dispatch(signInSuccess(data));
      setModalMessage("Congratulations, you have signed in successfully. You will now be redirected to home page.");
      setMessageOpen(true); // Show success modal

    } catch (error) {
      dispatch(signInFailure(error.message));
      setModalMessage(error.message);
      setMessageOpen(true); // Show error modal
    }
  };

  return (
    <main className="flex flex-1 justify-center items-center bg-gray-50 p-6">
      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl">
        {/* Title */}
        <h1 className="text-gray-900 font-semibold text-2xl sm:text-3xl text-center mb-6">
          Super Admin Login
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <TextField label="Email ID" id="company_email" variant="outlined" onChange={handleChange} fullWidth />
          <TextField label="Password" id="password" variant="outlined" type={showPassword ? "text" : "password"} onChange={handleChange} fullWidth />

          {/* Show Password Checkbox */}
          <div className="flex items-center gap-2">
            <input type="checkbox" id="showPassword" checked={showPassword} onChange={() => setShowPassword(!showPassword)} className="cursor-pointer" />
            <label htmlFor="showPassword" className="text-gray-700">
              Show Password
            </label>
          </div>

          {/* Submit Button */}
          <div className="mt-6 flex justify-center">
            <button type="submit" className="w-full cursor-pointer sm:w-auto bg-[#1E293B] hover:bg-[#334155] text-yellow-300 font-semibold px-8 py-2 rounded-md transition">
              Login
            </button>
          </div>
        </form>
      </div>

      {/* Custom Modal */}
      {messageOpen && (
        <div className="fixed inset-0 backdrop-blur-md flex justify-center items-center z-50">
          <div className="bg-white text-[#334155] rounded-lg p-6 max-w-lg w-full shadow-xl text-center">
            <p className="mb-6 text-xl font-medium">{modalMessage}</p>
            <button className="bg-[#1E293B] hover:bg-[#334155] text-yellow-300 font-semibold px-5 py-3 rounded-md w-28 transition cursor-pointer text-base" onClick={() => { setMessageOpen(false); if (modalMessage.includes("successfully")) { navigate("/dashboard"); } }}>
              OK
            </button>
          </div>
        </div>
      )}
    </main>
  );
}