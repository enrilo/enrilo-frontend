import { TextField } from "@mui/material";
import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Link, useNavigate} from 'react-router-dom';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';

export default function SuperAdminLogin() {
  const [formData, setFormData] = useState({});
  const [showPassword, setShowPassword] = useState(false); // <-- New state for checkbox
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
        return;
      }

      dispatch(signInSuccess(data));
      alert("Congratulations, you have signed in successfully. You will now be redirected to home page.");
      navigate("/dashboard");
    } catch (error) {
      dispatch(signInFailure(error.message));
      console.log(`error.message: ${error.message}`);
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
            <input type="checkbox" id="showPassword" checked={showPassword} onChange={() => setShowPassword(!showPassword)} />

            <label htmlFor="showPassword" className="text-gray-700">
              Show Password
            </label>
          </div>

          {/* Submit Button */}
          <div className="mt-6 flex justify-center">
            <button type="submit" className="w-full sm:w-auto bg-[#1E293B] text-white px-8 py-2 rounded-md hover:bg-[#334155] transition">
              Login
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}