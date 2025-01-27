'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const VerifyOtp = () => {
  const location = useLocation();
  const router = useRouter();
  const { email } = location.state;  // Retrieve email passed from SignUp form
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const handleOtpSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:5000/email/sendEmail", { email, otp });
      if (response.data.success) {
        alert("OTP verified successfully!");
        router.push("/login");  // Redirect to login after successful verification
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch (e) {
      console.error("Error verifying OTP:", e);
      setError("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="bg-gray-100">
      <div className="wrapper">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-primary my-8">
          Enter OTP to Verify Your Account
        </h1>
        <div className="bg-white my-10 p-6 shadow rounded-sm">
          <div>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="border-slate-400 focus:outline-none border p-2 w-full"
            />
            {error && <p className="text-red-500">{error}</p>}
          </div>
          <div className="mt-6">
            <button onClick={handleOtpSubmit} className="bg-primary text-white px-6 py-2 rounded-sm shadow hover:bg-[#722246]">
              Verify OTP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
