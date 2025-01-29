"use client";
import { useState } from "react";
import { Edit } from "lucide-react";
import { format } from "date-fns";
import { Bounce, toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { useCookie } from "@/hooks/useCookie";
import ResetPasswordModal from "@/components/ResetPasswordModal";
import ImageUpload from "@/components/ImageUpload";
import EditProfileModal from "@/components/EditProfileModal";
import useLoggedInUser from "@/hooks/useLoggedInUser";

const ProfilePage = () => {
  const { user, loading, error, refetch } = useLoggedInUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] =
    useState(false);
  const { getCookie, setCookie } = useCookie({ key: "Token", days: 7 });
  const token = getCookie();

  const handleEditClick = () => setIsModalOpen(true);
  const handleResetPasswordClick = () => setIsResetPasswordModalOpen(true);

  const handleImageChange = (newImageUrl) => {
    refetch();
    console.log("Image URL received from child:", newImageUrl);
  };

  const handleSave = (updatedData) => {
    refetch();
    // console.log("Saved data:", updatedData);
  };

  const handleResetPasswordSave = async ({ oldPassword, newPassword }) => {
    if (!token) {
      alert("No token found. Please login again.");
      return;
    }

    try {
      const response = await axios.post(
        "https://qatarbackend.solar-ict.com/api/auth/change-password",
        {
          email: user?.userData?.email,
          oldPassword,
          newPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Password reset successfully!", {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          transition: Bounce,
        });
        const { token: newToken } = response.data;
        setCookie(newToken);
        setIsResetPasswordModalOpen(false);
      } else {
        alert(response.data.error || "Unknown error occurred.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert(
        "An error occurred while resetting the password. Please try again."
      );
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="bg-gray-200">
      <div className="wrapper">
        <div className="mt-10 p-4">
          <div className="flex gap-4">
            {/* Left Section */}
            <div className="w-[30%] space-y-3 p-4 bg-white mx-auto text-center">
              <div className="group mx-auto relative w-40">
                <img
                  src={
                    user?.userData?.img ||
                    (user?.userData?.gender !== "female"
                      ? "https://static.vecteezy.com/system/resources/previews/032/176/197/non_2x/business-avatar-profile-black-icon-man-of-user-symbol-in-trendy-flat-style-isolated-on-male-profile-people-diverse-face-for-social-network-or-web-vector.jpg"
                      : "https://icons.iconarchive.com/icons/icons8/ios7/512/Users-User-Female-2-icon.png")
                  }
                  className="w-40 h-40 object-cover mx-auto rounded-full group-hover:border-blue-400 group-hover:scale-105 transition group-hover:border-4"
                  alt="user pic"
                />
                <div className="absolute bottom-5 right-2 cursor-pointer bg-white group-hover:block hidden">
                  <ImageUpload onChange={handleImageChange} />
                </div>
              </div>
              <div className="text-slate-800">
                <h1 className="text-xl font-semibold capitalize">
                  {user.userData?.firstName} {user?.userData?.lastName}
                </h1>

                <p>{user.userData?.title}</p>
                <p className="text-xs">{user.userData?.address}</p>
              </div>
              <hr />
              <p className="text-sm font-semibold text-slate-700">
                {user.userData?.email}
              </p>
            </div>

            {/* Right Section */}
            <div className="w-[80%] p-4 bg-white mx-auto">
              <table className="min-w-full table-auto">
                <tbody>
                  {[
                    [
                      "Name:",
                      `${user.userData?.firstName} ${
                        user.userData?.lastName === null
                          ? ""
                          : user.userData?.lastName
                      }`,
                    ],
                    ["Mobile Number:", user.userData?.mobileNumber],
                    [
                      "Date of Birth:",
                      format(
                        new Date(user.userData?.dateOfBirth),
                        "MMMM dd, yyyy"
                      ),
                    ],
                    ["Gender:", user.userData?.gender],
                    ["NID:", user.userData?.nid],
                    [
                      "Created Account:",
                      format(
                        new Date(user.userData?.createdAt),
                        "MMMM dd, yyyy"
                      ),
                    ],
                    ["Country:", user.userData?.country],
                  ].map(([label, value]) => (
                    <tr key={label} className="border-b">
                      <td className="p-2 font-semibold">{label}</td>
                      <td className="p-2 capitalize">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div
                className="text-sm text-blue-800 underline cursor-pointer my-4"
                onClick={handleResetPasswordClick}
              >
                Change Password
              </div>
              <div className="mt-4">
                <button
                  onClick={handleEditClick}
                  className="bg-primary flex text-white px-4 gap-2 text-lg items-center py-2"
                >
                  Edit <Edit />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />

      {/* Modals */}
      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userData={user.userData}
        onSave={handleSave}
      />
      <ResetPasswordModal
        isOpen={isResetPasswordModalOpen}
        onClose={() => setIsResetPasswordModalOpen(false)}
        onSave={handleResetPasswordSave}
      />
    </div>
  );
};

export default ProfilePage;
