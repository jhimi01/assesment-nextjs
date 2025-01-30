"use client";
import { useCookie } from "@/hooks/useCookie";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Bounce, toast } from "react-toastify";

const LoginGoogle = () => {
  const router = useRouter();
  const { setCookie } = useCookie({ key: "Token", days: 7 });
  const login = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const res = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: `Bearer ${response.access_token}` },
          }
        );

        if (res.status === 200) {
          const userData = {
            email: res.data.email,
            firstName: res.data.name,
            img: res.data.picture,
            isVerified: res.data.email_verified,
          };

          // Post data to backend
          const response = await axios.post("/api/google-signup", userData);

          if (response.status === 200) {
            console.log(response);
            const res = await axios.post("/api/google-login", userData);
            if (res.status === 200) {
              toast.success("loggedIn successfully", {
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
              router.push("/profile");
              console.log(res.data.token);
              setCookie(res.data.token);
            }
          }
        }
      } catch (err) {
        console.log("Error during Google login:", err);
      }
    },
    onError: (err) => {
      console.log("Google login error:", err);
    },
  });

  return (
    <>
      <button
        className="hover:bg-gray-300 rounded-full bg-gray-200 w-full py-1 flex justify-center items-center"
        onClick={() => login()}
      >
        <img
          src="https://storage.googleapis.com/libraries-lib-production/images/GoogleLogo-canvas-404-300px.original.png"
          alt="google icon"
          className="h-14 w-14"
        />
      </button>
    </>
  );
};

export default LoginGoogle;
