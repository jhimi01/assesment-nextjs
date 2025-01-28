"use client";
import { useState } from "react";
import { Edit } from "lucide-react";
import useLoggedInUser from "../../hooks/useLoggedInUser";
import EditProfileModal from "../../components/EditProfileModal";
import { format } from "date-fns";
import ImageUpload from "../../components/ImageUpload";

const Profile = () => {
  const { user, loading, error, refetch } = useLoggedInUser();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditClick = () => {
    setIsModalOpen(true);
  };

  const handleImageChange = (newImageUrl) => {
    refetch();
    console.log("Image URL received from child:", newImageUrl);
  };

  const handleSave = (updatedData) => {
    refetch();
    console.log("Saved data:", updatedData);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  console.log("gender", user?.userData?.gender);

  return (
    <div className="bg-gray-200">
      <div className="wrapper">
        <div className="mt-10 p-4">
          <div className="flex gap-4">
            {/* 1st section */}
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
                  {user.userData?.firstName} {user.userData?.lastName}
                </h1>
                <p>{user.userData?.title}</p>
                <p className="text-xs">{user.userData?.address}</p>
              </div>
              <hr />
              <p className="text-sm font-semibold text-slate-700">
                {user.userData?.email}
              </p>
            </div>

            <div className="w-[80%] p-4 bg-white mx-auto">
              {/* Table to display user data */}
              <table className="min-w-full table-auto">
                <thead>
                  <tr>
                    <th className="text-left p-2"></th>
                    <th className="text-left p-2"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 font-semibold">Mobile Number:</td>
                    <td className="p-2">{user.userData?.mobileNumber}</td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-2 font-semibold">Date of Birth:</td>
                    <td className="p-2">
                      {user.userData?.dateOfBirth
                        ? format(
                            new Date(user.userData.dateOfBirth),
                            "dd/MM/yyyy"
                          )
                        : "Date of birth not provided"}
                    </td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-2 font-semibold">Gender:</td>
                    <td className="p-2">{user.userData?.gender}</td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-2 font-semibold">NID:</td>
                    <td className="p-2">{user.userData?.nid}</td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-2 font-semibold">Created Account:</td>
                    <td className="p-2">
                      {user.userData?.createdAt
                        ? format(
                            new Date(user.userData?.createdAt),
                            "dd/MM/yyyy"
                          )
                        : "Date of birth not provided"}
                    </td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-2 font-semibold">Name:</td>
                    <td className="p-2">
                      {user.userData?.firstName} {user.userData?.lastName}
                    </td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-2 font-semibold">Country:</td>
                    <td className="p-2">{user.userData?.country}</td>
                  </tr>
                </tbody>
              </table>

              <div className="text-sm text-blue-800 underline cursor-pointer my-4">
                Reset Password
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

      {/* Modal */}
      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userData={user.userData}
        onSave={handleSave}
      />
    </div>
  );
};

export default Profile;
