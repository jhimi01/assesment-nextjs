"use client";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { Eye, EyeClosed, Loader } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";
import { useCookie } from "../../hooks/useCookie";
import useLoggedInUser from "../../hooks/useLoggedInUser";
import { Bounce, toast } from "react-toastify";
import LoginGoogle from "../../components/LoginGoogle";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { refetch } = useLoggedInUser();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(true);
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const { setCookie } = useCookie({ key: "Token", days: 7 });
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");

  const router = useRouter();

  function onChange(value) {
    setRecaptchaToken(value || "");
  }
  const onSubmit = async (data) => {
    setLoading(true);
    setShowOTP(false);
    setEmail(data.email);
    try {
      const response = await axios.post("/api/login", {
        email: data.email,
        password: data.password,
        recaptchaToken,
      });

      if (response.status === 200) {
        setLoading(false);
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        setShowOTP(true);
      }
      refetch();
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.error, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  };

  const handleVerifyOTP = async (otp) => {
    try {
      const response = await axios.post("/api/verify-otp-login", {
        email: email,
        otp,
      });

      console.log(response);

      if (response.status === 200) {
        const { token, userData } = response.data;
        console.log("this is userdata", userData);
        if (!token || token === null || token === undefined) {
          return;
        }
        setCookie(token);
        router.push("/");
        toast.success("🦄 Logged in successfully", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        refetch();
      }
      refetch();
    } catch (error) {
      console.log(error.response?.data?.error);
      toast.error(error.response?.data?.error, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
    refetch();
  };

  return (
    <div className="bg-gray-100 h-screen">
      <div className="pt-10">
        <div className="bg-white w-11/12 md:w-[40%] mx-auto space-y-4 rounded-sm px-6 pt-10 pb-5">
          <h3 className="text-3xl">Log in to your account</h3>
          {!showOTP ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value:
                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: "Invalid email address",
                    },
                  })}
                  placeholder="Email Address"
                  type="email"
                  className="border-slate-400 rounded-md focus:outline-none border p-3 w-full"
                />
                {errors.email && (
                  <p className="text-red-500">{errors.email.message}</p>
                )}
              </div>
              <div>
                <div className="relative">
                  <input
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                    type={showPass ? "password" : "text"}
                    placeholder="Password"
                    className="border-slate-400 rounded-md focus:outline-none border p-3 w-full"
                  />
                  <button
                    type="button"
                    className="absolute top-2 right-2"
                    onClick={() => setShowPass(!showPass)}
                  >
                    {showPass ? <EyeClosed /> : <Eye />}
                  </button>
                  {errors.password && (
                    <p className="text-red-500">{errors.password.message}</p>
                  )}
                </div>
              </div>
              <ReCAPTCHA
                sitekey="6LchN7gqAAAAAN1x37YAX0nhMkvuta3w_0ZiRElH"
                onChange={onChange}
              />
              <Link href="/send-email">
                <div>
                  <h4 className="text-xl underline text-primary cursor-pointer">
                    Forget Password
                  </h4>
                </div>
              </Link>
              <button
                disabled={loading}
                type="submit"
                className={`${
                  loading && "bg-[#8e2f5d]"
                } bg-primary flex items-center justify-center gap-2 text-white font-semibold text-lg rounded-full w-full py-3 hover:bg-[#75244b]`}
              >
                Log In
                {loading && <Loader className="animate-spin" />}
              </button>
            </form>
          ) : (
            <form
              onSubmit={handleSubmit(() => handleVerifyOTP(otp))}
              className="flex items-center justify-center gap-4"
            >
              <div className="w-full">
                <h2 className="text-xl text-primary">Enter OTP</h2>
                <input
                  {...register("otp", { required: "OTP is required" })}
                  type="text"
                  className="border-slate-400 focus:outline-none border p-3 w-full mb-5"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                {errors.otp && (
                  <p className="text-red-500">{errors.otp.message}</p>
                )}
              </div>
              <div className="w-full">
                <button
                  disabled={loading}
                  type="submit"
                  className={`px-5 w-full py-3 ${
                    loading && "bg-[#8e2f5d]"
                  }  bg-primary flex items-center gap-2 rounded-sm text-white`}
                >
                  Verify OTP
                  {loading && <Loader className="animate-spin" />}
                </button>
              </div>
            </form>
          )}

          <div className="flex items-center gap-2 justify-center">
            <div className="w-full h-[1px] bg-slate-700"></div>
            <p>or</p>
            <div className="w-full h-[1px] bg-slate-700"></div>
          </div>
          <LoginGoogle />
          <div className="text-primary text-lg mt-5 text-center cursor-pointer">
            <Link href="/signup">
              Are you new here? <span className="underline">Sign up</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
