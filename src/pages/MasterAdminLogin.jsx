import React from "react";
import { TextField } from "@mui/material";

export default function LoginPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl">
        {/* Title */}
        <h1 className="text-gray-900 font-semibold text-2xl sm:text-3xl text-center mb-6">
          Login
        </h1>

        {/* Form */}
        <form className="flex flex-col gap-4"> <TextField label="Email ID" variant="outlined" fullWidth />
          <TextField label="Password" variant="outlined" type="password" fullWidth />

          {/* Submit Button */}
          <div className="mt-6 flex justify-center">
            <button type="submit" className="w-full sm:w-auto bg-[#1E293B] text-white px-8 py-2 rounded-md hover:bg-[#334155] transition" >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};