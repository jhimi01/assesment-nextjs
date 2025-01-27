'use client'
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeClosed, Loader } from "lucide-react";
import LoginGoogle from "../../components/LoginGoogle";
import { Bounce, toast, ToastContainer } from "react-toastify";

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(true);

  const router = useRouter();

  const onSubmit = async (data) => {
    setLoading(true);
    const newUser = {
      email: data.email,
      password: data.password,
      nid: data.nid,
      address: data.address,
      mobileNumber: data.mobileNumber,
      gender: data.gender,
      title: data.title,
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: data.dateOfBirth,
      country: data.country,
    };
    if (data.password !== data.retypePassword) {
      setLoading(false);
      alert("Provide correct password");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/signup",
        newUser
      );
      console.log("this is a response data", response.data);
      if (response.status === 200) {
        setLoading(false);
        toast.success("OTP sent to your email", {
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
      setEmail(data.email);

      console.log("this is a data", response);
    } catch (error) {
      setLoading(false);
      toast.error("An error User email already exists", error.message, {
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
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleVerifyOTP = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/verify-otp",
        { email, otp }
      );
      console.log("otttttttttp", response);
      if (response.status === 200) {
        setLoading(false);
        toast.success("User verified successfully", {
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
        router.push("/login");
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      alert("Invalid or expired OTP");
    }
  };

  return (
    <div className="bg-gray-100">
      <div className="wrapper">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-primary my-8">
          It only takes a minute to register for your account
        </h1>
        <div className="bg-white my-10 p-6 shadow rounded-sm">
          {!showOTP ? (
            <form className="" onSubmit={handleSubmit(onSubmit)}>
              {/* First Section */}
              <div className="lg:flex">
                <div>
                  <h2 className="text-lg font-medium text-primary">
                    {" Let's create your credentials"}
                  </h2>
                </div>
                <div className="md:w-[70%] ml-auto">
                  <h1 className="text-primary text-lg">
                    Create an account using
                  </h1>
                  <div className="my-3 w-36">
                    <LoginGoogle />
                  </div>
                  <h1 className="text-primary text-lg mb-3">
                    or join by filling up the form below
                  </h1>
                  <div className="space-y-2">
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
                        className="border-slate-400 focus:outline-none border p-2 w-full"
                      />
                      {errors.email && (
                        <p className="text-red-500">{errors.email.message}</p>
                      )}
                    </div>

                    <div className="flex w-full gap-5">
                      <div className="w-full">
                        <div className="relative">
                          <input
                            {...register("password", {
                              required: "Password is required",
                              minLength: {
                                value: 6,
                                message:
                                  "Password must be at least 6 characters",
                              },
                            })}
                            type={showPass ? "password" : "text"}
                            placeholder="Password"
                            className="border-slate-400 focus:outline-none border p-2 w-full"
                          />
                          <button
                            type="button"
                            className="absolute top-2 right-2"
                            onClick={() => setShowPass(!showPass)}
                          >
                            {showPass ? <EyeClosed /> : <Eye />}
                          </button>
                        </div>
                        {errors.password && (
                          <p className="text-red-500">
                            {errors.password.message}
                          </p>
                        )}
                      </div>
                      <div className="w-full">
                        <input
                          {...register("retypePassword", {
                            required: "Please confirm your password",
                          })}
                          type="password"
                          placeholder="Re-type password"
                          className="border-slate-400 focus:outline-none border p-2 w-full"
                        />
                        {errors.retypePassword && (
                          <p className="text-red-500">
                            {errors.retypePassword.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-5">
                      <div className="w-full">
                        <input
                          {...register("address", {})}
                          placeholder="Your address"
                          type="text"
                          className="border-slate-400 focus:outline-none border p-2 w-full"
                        />
                        {errors.address && (
                          <p className="text-red-500">
                            {errors.address.message}
                          </p>
                        )}
                      </div>
                      <div className="w-full">
                        <input
                          {...register("mobileNumber", {})}
                          placeholder="Mobile Number"
                          type="number"
                          className="border-slate-400 focus:outline-none border p-2 w-full"
                        />
                        {errors.mobileNumber && (
                          <p className="text-red-500">
                            {errors.mobileNumber.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <hr className="my-5 border border-slate-300" />

              {/* Second Section */}
              <div className="lg:flex">
                <div>
                  <h2 className="text-lg lg:mb-0 mb-3 font-medium text-primary">
                    Your personal details
                  </h2>
                </div>
                <div className="md:w-[70%] ml-auto">
                  <div className="space-y-2">
                    <select
                      {...register("title")}
                      className="border-slate-400 focus:outline-none border p-2 w-full"
                    >
                      <option value="">Select...</option>
                      <option value="Fontend Developer">
                        Fontend Developer
                      </option>
                      <option value="Backend Developer">
                        Backend Developer
                      </option>
                      <option value="Mernstack Developer">
                        Mernstack Developer
                      </option>
                      <option value="Pernstack Developer">
                        Pernstack Developer
                      </option>
                      <option value="Software Developer">
                        Software Developer
                      </option>
                      <option value="Web Developer">Web Developer</option>
                    </select>
                    {errors.title && (
                      <p className="text-red-500">{errors.title.message}</p>
                    )}

                    <div className="flex gap-5">
                      <div className="w-full">
                        <input
                          {...register("firstName", {
                            required: "First name is required",
                          })}
                          placeholder="First Name"
                          className="border-slate-400 focus:outline-none border p-2 w-full"
                        />
                        {errors.firstName && (
                          <p className="text-red-500">
                            {errors.firstName.message}
                          </p>
                        )}
                      </div>
                      <div className="w-full">
                        <input
                          {...register("lastName", {})}
                          placeholder="Last Name"
                          className="border-slate-400 focus:outline-none border p-2 w-full"
                        />
                        {errors.lastName && (
                          <p className="text-red-500">
                            {errors.lastName.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-5">
                      <div className="w-full">
                        <input
                          {...register("dateOfBirth", {
                            required: "Date of birth is required",
                          })}
                          type="date"
                          className="border-slate-400 focus:outline-none border p-2 w-full"
                        />
                        {errors.dateOfBirth && (
                          <p className="text-red-500">
                            {errors.dateOfBirth.message}
                          </p>
                        )}
                      </div>
                      <div className="w-1/2">
                        <label className="text-sm font-medium mb-2">
                          Gender (optional)
                        </label>
                        <div className="flex items-center gap-4">
                          <label className="flex items-center gap-2">
                            <input
                              {...register("gender")}
                              type="radio"
                              value="male"
                              className="border-slate-400 focus:ring focus:ring-slate-300"
                            />
                            Male
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              {...register("gender")}
                              type="radio"
                              value="female"
                              className="border-slate-400 focus:ring focus:ring-slate-300"
                            />
                            Female
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="w-full">
                      <input
                        {...register("nid", {})}
                        placeholder="Your NID"
                        type="number"
                        className="border-slate-400 focus:outline-none border p-2 w-full"
                      />
                      {errors.nid && (
                        <p className="text-red-500">{errors.nid.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <hr className="my-5 border border-slate-300" />

              {/* Third Section */}
              <div className="lg:flex">
                <div>
                  <h2 className="text-lg lg:mb-0 mb-3 text-primary font-medium">
                    Where do you live?
                  </h2>
                </div>
                <div className="md:w-[70%] ml-auto">
                  <div className="space-y-2">
                    <input
                      {...register("country", {})}
                      placeholder="Country/region of residence"
                      className="border-slate-400 focus:outline-none border p-2 w-full"
                    />
                    {errors.country && (
                      <p className="text-red-500">{errors.country.message}</p>
                    )}
                  </div>
                  <div className="mt-6">
                    <button
                      disabled={loading}
                      className="bg-primary flex items-center justify-center gap-2 text-white px-6 py-2 rounded-sm shadow hover:bg-[#722246]"
                    >
                      {loading && <Loader className="animate-spin" />}
                      Create an account
                    </button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <form
              onSubmit={handleVerifyOTP}
              className="flex items-center justify-center gap-4"
            >
              <div className="w-full">
                <h2 className="text-xl text-primary">Enter OTP</h2>
                <input
                  type="text"
                  className="border-slate-400 focus:outline-none border p-3 w-full mb-5"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
              <div className="w-full">
                <button
                  disabled={loading}
                  type="submit"
                  className={`px-5 w-full py-3 ${
                    loading && "bg-[#8e2f5d]"
                  }  bg-primary rounded-sm flex items-center gap-2 text-white`}
                >
                  Verify OTP {loading && <Loader className="animate-spin" />}
                </button>
              </div>
            </form>
          )}

          <div className="text-primary text-lg mt-5 text-center cursor-pointer">
            <Link href="/login">
              Already have an account? <span className="underline">Login</span>
            </Link>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </div>
  );
};

export default SignUp;
