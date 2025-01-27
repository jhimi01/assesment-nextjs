import axios from "axios";
import { Loader } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Bounce, toast, ToastContainer } from "react-toastify";

const SendEmail = () => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/sendemail-forgotpassword",
        data
      );

      if (response.status === 200) {
        setLoading(false);
        toast.success("🦄Sent email", {
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
        console.log(response)
      }
      console.log(response)
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
  };

  return (
    <div className=" bg-gray-200 h-screen">
      <div className="pt-20">
        <div className="bg-white w-11/12 md:w-[40%] mx-auto space-y-4 rounded-sm px-6 pt-10 pb-5">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <h3 className="text-2xl text-center">Reset Password</h3>
            <div className="space-y-6">
              {/* new password */}
              <div className="relative space-y-2">
                <label htmlFor="" className="text-xl capitalize">
                  email
                </label>
                <input
                  {...register("email", {
                    required: "Email is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  type="email"
                  placeholder="Send Email"
                  className="border-slate-400 rounded-md focus:outline-none border p-3 w-full"
                />
                {errors.password && (
                  <p className="text-red-500">{errors.password.message}</p>
                )}
              </div>
              <button
                disabled={loading}
                type="submit"
                className={`${
                  loading && "bg-[#8e2f5d]"
                } bg-primary flex items-center justify-center gap-2 text-white font-semibold text-lg rounded-full w-full py-3 hover:bg-[#75244b]`}
              >
                Send Email
                {loading && <Loader className="animate-spin" />}
              </button>
            </div>
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

export default SendEmail;
