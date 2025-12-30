import { TextField } from "@mui/material";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { signInStart, signInSuccess, signInFailure } from "../../redux/user/userSlice";

export default function SuperAdminLogin() {
  const [formData, setFormData] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [messageOpen, setMessageOpen] = useState(false);

  // ✅ SAFE Redux access
  const { loading, error, currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard", { replace: true });
    }
  }, [currentUser, navigate]);

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

      const res = await fetch(
        "http://localhost:3000/api/super-admins/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
          credentials: "include",
        }
      );

      const data = await res.json();

      if (data.success === false) {
        dispatch(signInFailure(data.message));
        setModalMessage(data.message);
        setMessageOpen(true);
        return;
      }

      dispatch(signInSuccess(data));
    } catch (error) {
      dispatch(signInFailure(error.message));
      setModalMessage(error.message);
      setMessageOpen(true);
    }
  };

  return (
    <main className="flex flex-1 justify-center items-center bg-gray-50 p-6">
      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl">
        <h1 className="text-gray-900 font-semibold text-2xl sm:text-3xl text-center mb-6">
          Super Admin Login
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <TextField label="Email ID" id="company_email" variant="outlined" onChange={handleChange} fullWidth />

          <TextField label="Password" id="password" variant="outlined" type={showPassword ? "text" : "password"} onChange={handleChange} fullWidth />

          <div className="flex items-center gap-2">
            <input type="checkbox" id="showPassword" checked={showPassword} onChange={() => setShowPassword(!showPassword)} className="cursor-pointer" />
            <label htmlFor="showPassword" className="text-gray-700">
              Show Password
            </label>
          </div>

          <div className="mt-6 flex justify-center">
            <button type="submit" disabled={loading} className="w-full cursor-pointer sm:w-auto bg-[#1E293B] hover:bg-[#334155] text-yellow-300 font-semibold px-8 py-2 rounded-md transition disabled:opacity-60">
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
      </div>

      {messageOpen && (
        <div className="fixed inset-0 backdrop-blur-md flex justify-center items-center z-50">
          <div className="bg-white text-[#334155] rounded-lg p-6 max-w-lg w-full shadow-xl text-center">
            <p className="mb-6 text-xl font-medium">{modalMessage}</p>
            <button className="bg-[#1E293B] hover:bg-[#334155] text-yellow-300 font-semibold px-5 py-3 rounded-md w-28 transition cursor-pointer text-base"
              onClick={() => {
                setMessageOpen(false);
                if (modalMessage.includes("successfully")) {
                  navigate("/dashboard", { replace: true });
                }
              }}>
              OK
            </button>
          </div>
        </div>
      )}
    </main>
  );
}