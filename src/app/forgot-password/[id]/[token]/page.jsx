'use client'
import axios from "axios";
import { Eye, EyeClosed, Loader } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Bounce, toast, ToastContainer } from "react-toastify";

const ForgetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [newPass, setNewPass] = useState(true);
  const [confirmPass, setConfirmPass] = useState(true);
  const { id, token } = useParams();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(false);
    setLoading(true);
    console.log(data);
    if (data.newpassword === data.confirmpassword) {
      console.log("correct password");
      try {
        const response = await axios.post(
          `/api/reset-forgotpassword/${id}/${token}`,
          { newPassword: data.newpassword }
        );

        if (response.status === 200) {
          setLoading(false);
          toast.success("Saved password", {
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
          console.log(response);
        }
        console.log(response);
      } catch (error) {
        setLoading(false);
        const message = JSON.parse(error?.request?.responseText)?.error;
        console.log(message);
        toast.error(message, {
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
    } else {
      setLoading(false);
      toast.error("confirm password doesn't match", {
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
  return (
    <div className="bg-gray-200 h-screen">
      <div className="pt-20">
        <div className="bg-white w-11/12 md:w-[40%] mx-auto space-y-4 rounded-sm px-6 pt-10 pb-5">
          <h3 className="text-4xl text-center">Reset Password</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4">
              {/* new password */}
              <div className="relative space-y-2">
                <label
                  htmlFor="confirm password"
                  className="text-xl capitalize"
                >
                  New password
                </label>
                <input
                  {...register("newpassword", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  type={newPass ? "password" : "text"}
                  placeholder="New Password"
                  className="border-slate-400 rounded-md focus:outline-none border p-3 w-full"
                />
                <button
                  type="button"
                  className="absolute top-10 right-2"
                  onClick={() => setNewPass(!newPass)}
                >
                  {newPass ? <EyeClosed /> : <Eye />}
                </button>
                {errors.newpassword && (
                  <p className="text-red-500">{errors.newpassword.message}</p>
                )}
              </div>
              {/* confirme password */}
              <div className="relative space-y-2">
                <label
                  htmlFor="confirm password"
                  className="text-xl capitalize"
                >
                  confirm password
                </label>
                <input
                  {...register("confirmpassword", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  type={confirmPass ? "password" : "text"}
                  placeholder="Confirm Password"
                  className="border-slate-400 rounded-md focus:outline-none border p-3 w-full"
                />
                <button
                  type="button"
                  className="absolute top-10 right-2"
                  onClick={() => setConfirmPass(!confirmPass)}
                >
                  {confirmPass ? <EyeClosed /> : <Eye />}
                </button>
                {errors.confirmpassword && (
                  <p className="text-red-500">
                    {errors.confirmpassword.message}
                  </p>
                )}
              </div>
            </div>
            <button
              disabled={loading}
              type="submit"
              className={`${
                loading && "bg-[#8e2f5d]"
              } bg-primary flex items-center justify-center gap-2 text-white font-semibold text-lg rounded-full w-full py-3 hover:bg-[#75244b]`}
            >
              Save Password
              {loading && <Loader className="animate-spin" />}
            </button>
          </form>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={4000}
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

export default ForgetPassword;
